Moox-Notifications
==================

Show non-intrusive notifications ( like Growl on OSX ).

This will show gentle notifications in Growl like style, change the css ( or sass ) file to position and style the notification panel.

usage: 
include the js with <code>&lt;script&gt;</code> tag as usual.

function: <code>notify ( content , timeout , audio , callback );</code>
- content , will hold the text you want to show in the notification ( basic html allowed )
- timeout , number of milliseconds the notification should be visible.
- audio , a boolean; to have audio notification chime, ( default: false )
- callback , function (as string) that needs to execute once notification is removed

Currently basic functionality, and only 100% usable in webkit-based browsers. Check back later for cross browser support and more options like:

- sticky notifications
- ~~play audio upon showing notification~~
- ~~callback upon removing notifications~~
- style per notification
- etc. etc.

Example:<hr/>
![moox notifications example](https://cloud.githubusercontent.com/assets/6317005/5599985/760fb3f4-92d1-11e4-8cc7-9e3918c41357.gif)
