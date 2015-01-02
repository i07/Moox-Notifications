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

    //setup our variables
    var notifications = new Array();
    var notify_holder = new Array();
    var notify_pos = 0;

    //this timer will check for notifications
    setInterval(check_notify, 100);
    //this timer will check for notifications to remove
    setInterval(clean_notify, 100);

    //since all notifications are put in notify_holder array, from this array, it will check if there are any, if yes
    //displaying them
    function check_notify() {
        if (notify_holder.length > 0) {
            //we have to show notifications
            notify_holder.forEach(function (data, id) {

                if (!notify_holder[id].displayed) {
                    var content = data;
                    notify_holder[id].displayed = true;

                    notify_holder[id].removeAt = (Date.now()) + data.timeout;

                    content.style.top = notify_pos + "px";
                    notify_pos = notify_pos + content.heightval;

                    document.body.appendChild(content);

                    content.classList.remove('is-paused');
                }
            });
        }

    }

    //once the time has expired this function will remove the notification
    function clean_notify() {
        notify_holder.forEach(function (data, id) {
            if (data.removeAt < Date.now()) {
                notify_holder.splice(id, 1);
                document.body.removeChild(data);
                notify_pos = notify_pos - data.heightval;

                var children = document.body.children;

                for (var i = 0; i < children.length; i++) {
                    if (children[i].className == "moox_notify-area") {
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

    function notify(content, timeout) {
        if (timeout == undefined || timeout < 2000) timeout = 2000;

        add_notification(content, timeout);
    }

    function add_notification(content, timeout) {

        var textHeight = get_text_height(content);

        notifications = document.createElement("div");
        notifications.className = "moox_notify-area is-paused";
        notifications.heightval = textHeight;
        notifications.timeout = timeout;
        notifications.innerHTML = content;

        notify_holder.push(notifications);

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
