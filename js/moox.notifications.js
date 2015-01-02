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


    function notify(content, timeout) {
        create_notification(content, timeout);
    }

    function create_notification(content, timeout) {
        console.log("\ncontent: " + content +"\n"+"timeout: "+timeout+"\n"+"text height: "+get_text_height(content));
    }

    //get the text height of the content, make sure the styles on the temp div are equal to the notification div.
    function get_text_height(content)
    {
        //create new div
        var temp            = document.createElement("div");
        //style class name to match notification style, important for proper height value; see css file
        temp.className      = "moox_notify-area-height-calculation";
        //add the content
        temp.innerHTML      = content;

        //append div element to body, without adding height will always be 0
        document.body.appendChild(temp);

        //get the text height of the temporary div
        var th              = temp.offsetHeight;

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
