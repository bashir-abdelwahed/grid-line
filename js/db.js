// function get_puzzles_from_database(){
//   firebase.database().ref('puzzles/').once('value').then(snap=>{
//     puzzles = snap.val();
//   })
// }

// "cordova-plugin-crosswalk-webview": "^2.3.0",


function display_levels(){
  // this function is only applied on the main page,
  // and only when something in the database has changed
  // the event of changing somethign in the db triggers a function that
  // makes the boolean dbHasChanged to 'true'
  // and on pageshow of the main, this function is triggered
  if(!dbHasChanged) return false;
  else dbHasChanged = false;
  firebase.database().ref('levels/').once('value',(snap)=>{
      var notify = levels;
      levels = snap.val();
      show_levels(levels);
      // make sure the levels are displayed then go the next page
      notify.push(1); //to notify the load_navigate that the array is no longer empty
    })
}

function show_levels(levels){

  refresh_levels();
  levels.forEach((el)=>{
    var i, acc='';
    for(i=0;i<el.count;i++)
      acc+= `<a class='levels'
                href="#"
                onclick=pick_puzzle('${el.name}',${i+1})>
                <div data-level='${i+1}' >
                  <span> ${i+1} </span>
                </div>
              </a>`;

    $('#puzzles > [role=main]').append(`<a
                                          href='#${el.name}'
                                          class='a'
                                          onclick="select_c_size('${el.name}')">
                                          ${el.name}
                                        </a>`);

    $('body').append(`
      <div data-role='page' id='${el.name}' class='level-size'>
        <div data-role='header'>
          <a href='#puzzles'>Back</a>
          <h1>GRID SYSTEM</h1>
        </div>

        <div role='main' class='ui-content bg-elec' style='padding:0px'>
          <hr />
          <p>
            CHOOSE ANY PUZZLE
          </p>
          <hr />
          ${acc}
        </div>

      </div>
      `);
    listen_to_show(el.name);
  })
}


function refresh_levels(){
  // remove all html and adding the light bulb in the choosing size page
  $('#puzzles > [role=main]').html(`<img
                                        src='images/good.png'
                                        alt='light bulb'
                                        style='display: block;margin:0 auto;'
                                    />
                                  <hr />
                                    <p>
                                      CHOOSE PUZZLE SIZE
                                    </p>
                                    <hr />
                                        `);
  // removing all puzzles using pure javascript
  var temp = document.getElementsByClassName('level-size');
  for (var i = 0, len = temp.length; i < len; i++)
    temp[0].remove();
}
// add event listener to every choose size page
function listen_to_show(id){
  $('#'+id).on('pageshow',function(){
    assign_page(id);
  })
}

var data;

function push_to_database(){
  data = [];
  makeGrid.grid.knotes.forEach(el=>{

    var hLine = [];
    el.forEach(k=>{
      hLine.push([dic_pipes.index_of(k.pipe),k.power ? 1 : 0 ,k.home ? 1 : 0])
    })
    data.push(hLine);
  })

  function to_database(){
    try{
      var x = makeGrid.xNum,y = makeGrid.yNum;

      firebase.database().ref(`puzzles/${x}x${y}/0`).once('value').then(snap=>{
        var index = $('#make_index').val() || snap.val();
        index = parseInt(index);
        firebase.database().ref(`puzzles/${x}x${y}/${index}`).set(data);
        firebase.database().ref(`puzzles/${x}x${y}/0`).set(index + 1)
        firebase.database().ref(`levels/${x-5}/count`).set(index)
        alert(`done adding to ${index}`)
      })
    }
    catch(err){
      alert("firebase:" + err)
    }
  }
  to_database();
}

function index_database(x,y,cb){
  firebase.database().ref(`puzzles/${x}x${y}/0`).once('value').then(snap=>{
    var index = $('#make_index').val() || snap.val();

    if(!cb){
      $('#make_index').val(index);
    }
    else cb(index);
  })
}







//
//
//
// function writeUserData(userId, name, email, imageUrl) {
//   firebase.database().ref('levels/').set(
//     [
//       {name:'5x5',count:100},
//       {name:'6x6',count:100},
//       {name:'7x7',count:100},
//       {name:'8x8',count:100},
//       {name:'9x9',count:100}
//     ]
//   )
// }
//
//
//
//
//
//
//
// function writeUserDataa(userId, name, email, imageUrl) {
//   firebase.database().ref('puzzles/').set({
//     '5x5':[100,
//       [
//         [new knote(Npipe,0,0),new knote(Tpipe,1,0),new knote(Mpipe,0,0),new knote(PRpipe,0,1),new knote(Mpipe,0,0)],
//         [new knote(Epipe,0,0),new knote(Jpipe,0,1),new knote(Ipipe,0,0),new knote(PRpipe,0,1),new knote(Rpipe,0,0)],
//         [new knote(Ipipe,0,1),new knote(Npipe,0,0),new knote(Jpipe,0,0),new knote(PDpipe,0,1),new knote(Ipipe,0,0)],
//         [new knote(Epipe,0,0),new knote(Jpipe,0,0),new knote(PDpipe,1,0),new knote(Epipe,0,0),new knote(Jpipe,0,0)],
//         [new knote(PUpipe,0,1),new knote(PRpipe,0,1),new knote(Wpipe,0,0),new knote(Wpipe,0,0),new knote(PLpipe,0,1)]
//       ],2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100
//     ],
//     '6x6':[100,
//       1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100
//     ],
//     '7x7':[100,
//       1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100
//     ],
//     '8x8':[100,
//       1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100
//     ],
//     '9x9':[100,
//       1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100
//     ],
//   });
// }


//
// {
//   "rules": {
//     ".read": true,
//     ".write": "auth.uid === 'dJrGShfgfd2'"
//   }
// }











// let dbName = 'puzzles';
// const customerData = [
//   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
//   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
// ];
// var db;
// var request = window.indexedDB.open(dbName, 3);
// if (!window.indexedDB) {
//     window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
// }
//
// request.onerror = function(event) {
//   alert("Why didn't you allow my web app to use IndexedDB?!");
// };
// request.onsuccess = function(event) {
//   db = event.target.result;
// };
//
//
// request.onupgradeneeded = function(event) {
//   //The IDBDatabase interface
//   var db = event.target.result;
//
//   // Create an objectStore for this database
//   var objectStore = db.createObjectStore("customers", { keyPath: "id" });
//   objectStore.createIndex("name", "name", { unique: false });
//   objectStore.createIndex("email", "email", { unique: true });
//   objectStore.transaction.oncomplete = function(event) {
//     // Store values in the newly created objectStore.
//     var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
//     customerData.forEach(function(customer) {
//       customerObjectStore.add(customer);
//     });
//   };
//   var transaction = db.transaction(["customers"], "readwrite");
//   transaction.oncomplete = function(event) {
//     alert("All done!");
//   };
//
//   transaction.onerror = function(event) {
//     // Don't forget to handle errors!
//   };
//
//   var objectStore = transaction.objectStore("customers");
//   customerData.forEach(function(customer) {
//     var request = objectStore.add(customer);
//     request.onsuccess = function(event) {
//       // event.target.result === customer.ssn;
//     };
//   });
//
// };
//
// db.onerror = function(event){
//   alert('Database error:' + event.target.errorCode);
//   /* the error will bubble to the surface
//    and i catch it one time in the most upper layer
//   One of the common possible errors when opening a database is VER_ERR.
//   It indicates that the version of the database stored on the disk is greater than the version
//    that you are trying to open.
//    This is an error case that must always be handled by the error handler.
//    */
// }
