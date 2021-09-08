/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 // Initialize Firebase
 var config = {
   apiKey: "AIzaSyClTDXlMq81OlwdojcWgcJ1CMcxnD_XxGA",
   authDomain: "grid-system-946f2.firebaseapp.com",
   databaseURL: "https://grid-system-946f2.firebaseio.com",
   projectId: "grid-system-946f2",
   storageBucket: "",
   messagingSenderId: "459169055817"
 };

 try{firebase.initializeApp(config);}
 catch(e){
   $.mobile.loading( 'show', {
     text: 'CONNECT TO THE INTERNET',
     textVisible: true,
     theme: 'a',
     html: ""
   });
   setTimeout(navigator.app.exitApp(), 3000);
 }
 var database = firebase.database();
 var connected;

 function check_connection(){
   if(!connected) $.mobile.navigate('#connection');
   return connected;
 }

 firebase.database().ref(".info/connected").on("value", function(snap) {
   connected = snap.val();
 });
 firebase.database().ref('/levels').on('value',function(snap){
   dbHasChanged = true; // problem: this makes the prog redraw the levels 1 time;
 })
 document.addEventListener("deviceready", onDeviceReady, false);
   function onDeviceReady() {
       document.addEventListener("backbutton", function (e) {
           e.preventDefault();
           navigate_back();
       }, false );
 }

 document.addEventListener('deviceready', function(e,d){
   $('a.exit').click(function() {
   navigator.app.exitApp();
   return true;
   });
   }, false);





 var puzzles=[],
     levels = [],
     correctPuzzle = [],
     set,
     c_size,
     c_index,playGrid,
     snd,
     options,
     dbHasChanged = true,
     nav_arr = [],
     nxt_btn
     ;

 let PUpipe = [1,0,0,0], /* upper sided pipe*/
     PRpipe = [0,1,0,0], /* right sided pipe */
     PDpipe = [0,0,1,0], /* down sided pipe */
     PLpipe = [0,0,0,1], /*left sided pipe */
     _pipe = [0,1,0,1], /* horizontal pipe */
     Ipipe = [1,0,1,0], /* vertical pipe */
     Lpipe = [1,1,0,0], /* L shaped pipe */
     Jpipe = [1,0,0,1], /* rotation of L shaped like j on the keyboard */
     Mpipe = [0,0,1,1], /* double rotation of L shaped */
     Npipe = [0,1,1,0], /* triple rotation of L shaped */
     Epipe = [1,1,1,0], /* |- shaped pipe */
     Wpipe = [1,1,0,1], /* _|_ shaped pipe */
     Rpipe = [1,0,1,1], /* -| shaped pipe */
     Tpipe = [0,1,1,1], /* T shaped pipe */
     Xpipe = [1,1,1,1], /* X shaped pipe  and this one doesn't have any rotation*/
     Fpipe = [0,0,0,0]  /* a fake pipe to trick the system */
     ;
 var dic_pipes=[
   PUpipe, PRpipe, PDpipe, PLpipe,
   _pipe, Ipipe,
   Lpipe, Jpipe, Mpipe, Npipe,
   Epipe, Wpipe, Rpipe, Tpipe,
   Xpipe, Fpipe
 ]
 const default_knote = `<div data-corner='center'>
                           <div data-corner='normal'></div>
                           <div data-corner='home'></div>
                           <div data-corner='power'></div>
                         </div>
                         <div data-corner='upper'></div>
                         <div data-corner='right'></div>
                         <div data-corner='bottom'></div>
                         <div data-corner='left'></div>
                                `;
var st = window.localStorage;












var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();



function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}














// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

if(Array.prototype.contains)
    console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .contains method to Array's prototype to call it on any array
Array.prototype.contains = function (thing) {
    // if the other array is a falsy value, return false
    if (!this)
        return false;

    //start by assuming the array doesn't contain the thing
    var result = false;
    for (var i = 0, l=this.length; i < l; i++)
      {
      //if anything in the array is the thing then change our mind from before

      if (this[i] instanceof Array)
        {if (this[i].equals(thing))
          result = true;}
        else
          if (this[i]===thing)
            result = true;


      }
     //return the decision we left in the variable, result
    return result;
}

// sub array index for finding the pipes index
Array.prototype.index_of = function (thing)
  {
    // if the other array is a falsy value, return -1
    if (!this)
        return -1;

    //start by assuming the array doesn't contain the thing
    var result = -1;
    for (var i = 0, l=this.length; i < l; i++)
      {
      //if anything in the array is the thing then change our mind from before
      if (this[i] instanceof Array)
        if (this[i].equals(thing))
          result = i;
        else
          if (this[i]===thing)
            result = i;


      }
     //return the decision we left in the variable, result
    return result;
}

if(Array.prototype.clone)
    console.warn("Overriding existing Array.prototype.clone. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .contains method to Array's prototype to call it on any array

Array.prototype.clone = function(){
               var _arr = ( arguments[0] == null ) ? [] : arguments[0] ;
               for( var _p = 0 ; _p < this.length ; _p++ )
               {
                        if ( this[_p] instanceof Array )
                        {
                                var _sub = [] ;
                                this[_p].clone( _sub ) ;
                                _arr.push( _sub.slice() );
                        }
                        else _arr.push( this[_p] );
               }

               return _arr ;
}


function is_empty(obj){
  if(obj && obj.length === 0) return true;
  if($.isEmptyObject(obj)) return true;
  if(!obj) return true;
  return false;
}
