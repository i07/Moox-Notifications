/**
 * Javascript Notify 1.0
 * https://github.com/i07/Moox-Notifications
 *
 * A javascript implementation for showing non intrusive notifications
 *
 * Copyright 2015; Marc Donkers (marc@i07.eu)
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

( function ($) {

    //let's go strict on this one ;)
    'use strict';

    //we load up our style sheet first
    var styleref = document.createElement("link");
    styleref.setAttribute("rel", "stylesheet");
    styleref.setAttribute("type", "text/css");
    styleref.setAttribute("href", "css/moox.notifications.css");

    //add to the head tag of our document
    document.getElementsByTagName("head")[0].appendChild(styleref);

    //add the audio tag to our document
    var audio = document.createElement("audio"); audio.setAttribute("id", "notificationAudio");
    var src1 = document.createElement("source"); var src2 = document.createElement("source"); var src3 = document.createElement("source");
    src1.setAttribute("src",    "sounds/notify.ogg"); src1.setAttribute("type",   "audio/ogg");
    src2.setAttribute("src",    "sounds/notify.mp3"); src2.setAttribute("type",   "audio/mpeg");
    src3.setAttribute("src",    "sounds/notify.wav"); src3.setAttribute("type",   "audio/wav");
    audio.appendChild(src1); audio.appendChild(src2); audio.appendChild(src3);

    //setup our variables
    var notifications = new Array();
    var notify_holder = new Array();
    var notify_pos = 0;

    //this timer will check for notifications
    setInterval(check_notify, 100);
    //this timer will check for notifications to remove
    setInterval(clean_notify, 100);

    window.onload = function () {
        //add the audio tag to our body, to play audio use : document.getElementById('notificationAudio').play();
        document.body.appendChild(audio);
    }

    //main entry function
    function notify(content, timeout, audio, callback) {

        if (audio == undefined)
            audio = false;

        if (timeout == undefined || timeout < 2000)
            timeout = 2000;

        //add notification
        add_notification(content, timeout, callback);

        if (audio)
            document.getElementById('notificationAudio').play();

    }

    //create and add a notification div to our holder Array
    function add_notification(content, timeout, callback) {

        //get the text height
        var textHeight = get_text_height(content);

        //create a div
        notifications = document.createElement("div");
        //set the proper classes
        notifications.className = "moox_notify-area is-paused";
        //set our text height variable
        notifications.heightval = textHeight;
        //set our timeout value for this notification
        notifications.timeout = timeout;
        //set callback function
        notifications.callback = callback;
        //and fill up our div with the content
        notifications.innerHTML = content;

        //push it to our holder Array
        notify_holder.push(notifications);

    }

    //since all notifications are put in notify_holder array, from this array, it will check if there are any, if yes
    //displaying them
    function check_notify() {
        if (notify_holder.length > 0) {
            //we have to show notifications
            notify_holder.forEach(function (data, id) {

                //is this notification already shown?
                if (!notify_holder[id].displayed) {

                    var content = data;
                    //set this notification as displayed
                    notify_holder[id].displayed = true;
                    //set the time on which this notification can be removed
                    notify_holder[id].removeAt = (Date.now()) + data.timeout;
                    //a function to cancel a set callback
                    notify_holder[id].cancelCallback = function() { notify_holder[id].callback = null };
                    //set the top position of this notification
                    content.style.top = notify_pos + "px";
                    //increase our position for the next notification
                    notify_pos = notify_pos + content.heightval;
                    //actually adding the notification to the screen
                    document.body.appendChild(content);
                    //start the FadeIn animation, that it becomes visible

                    content.classList.remove('is-paused'); //not supported on IE9 or lower

                    //TODO: review the issue IE has, below line is to replace classList.remove on IE9 or lower
                    //content.className = content.className.replace(' is-paused','');

                }
            });
        }

        //check to see if any of the notifications have a countdown span in the content

        //get all document children
        //TODO: perhaps handle this different, since it is getting all elements on the page
        var children = document.body.children;

        //lets look at them one by one
        for (var i = 0; i < children.length; i++) {
            //check if this is a notification element
            if (children[i].className == "moox_notify-area") {

                var siblings = children[i].children;

                for ( var j=0; j<siblings.length; j++) {
                    if (siblings[j].id == "mn_countdown") {
                        siblings[j].innerHTML = Math.ceil((children[i].removeAt-Date.now())/1000);
                    }
                }
            }
        }
    }

    //once the time has expired this function will remove the notification
    function clean_notify() {
        //run through all the notifications
        notify_holder.forEach(function (data, id) {
            //if the requested removal time is smaller then now()
            if (data.removeAt < Date.now()) {

                //check to see if we have a callback function
                if ( data.callback != undefined && data.callback != "" ) {
                    //eval the callback
                    eval(data.callback);
                }
                //remove the entry from the array
                notify_holder.splice(id, 1);
                //remove the notification from the screen
                document.body.removeChild(data);
                //correct the position for the next notification
                notify_pos = notify_pos - data.heightval;

                //get all document children
                //TODO: perhaps handle this different, since it is getting all elements on the page
                var children = document.body.children;

                //lets look at them one by one
                for (var i = 0; i < children.length; i++) {
                    //check if this is a notification element
                    if (children[i].className == "moox_notify-area") {
                        //start to reposition the remaining notifications
                        var tmtop = children[i].style.top.replace("px", "");
                        var nwtop = parseInt(tmtop) - data.heightval;
                        if (nwtop < 0) nwtop = 0;
                        children[i].style.top = nwtop + "px";
                    }
                }

                return false;
            }
        });
    }

    //get the text height of the content, make sure the styles on the temp div are equal to the notification div.
    function get_text_height(content) {
        //create new div
        var temp = document.createElement("div");
        //style class name to match notification style, important for proper height value; see css file
        temp.className = "moox_notify-area-height-calculation";
        //add the content
        temp.innerHTML = content;

        //append div element to body, without adding height will always be 0
        document.body.appendChild(temp);

        //get the text height of the temporary div
        var th = temp.offsetHeight;

        //remove the temp div from the body
        document.body.removeChild(temp);

        //return the text height
        return th;
    }

    //handle the module function name for inspection and execution
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return notify;
        });
    } else {
        $.notify = notify;
    }

}(this) );
