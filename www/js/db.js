// "cordova-plugin-crosswalk-webview": "^2.3.0",
function display_levels(){
  // this function is only applied on the main page,
  // and only when something in the database has changed
  // the event of changing something in the db triggers a function that
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
        firebase.database().ref(`puzzles/${x}x${y}/${index}`).set(data)
        .then(() => {
            console.log(`Successfully added data to puzzles/${x}x${y}/${index}`);
            return firebase.database().ref(`puzzles/${x}x${y}/0`).set(index + 1);
        })
        .then(() => {
            console.log(`Successfully updated puzzles/${x}x${y}/0`);
            return firebase.database().ref(`levels/${x-5}/count`).set(index);
        })
        .then(() => {
            console.log(`Successfully updated levels/${x-5}/count`);
            alert(`done adding to ${index}`);
        })
        .catch((error) => {
            console.error("Error adding data: ", error);
            alert(`Failed to add data: ${error.message}`);
        });
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
