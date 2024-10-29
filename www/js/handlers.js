$('#puzzle').on('pageshow',()=>{
  unglow_next();
  assign_page('puzzle');
  //show_puzzle(); // the show_puzzle is done here because the width of the settings is not calculated properly.
})

$('#puzzle').on('pagehide', function(){
  erase_puzzle();
  unglow_next();
})

$('#main').on('pageshow',function(){
  display_levels();
  assign_page('main');
})

$('#puzzles').on('pageshow',function(){assign_page('puzzles'); })

$('#options').on('pageshow',function(){assign_page('options'); })

$('#credits').on('pageshow',function(){ assign_page('credits'); })

$('#connection').on('pageshow',function(){ assign_page('connection');})

$(()=>{
  // check if the firebase is connected
  // and apply the user to connect to the internet obligatory
  if(!firebase){
    $.mobile.loading( 'show', {
    	text: 'CONNECT TO THE INTERNET',
    	textVisible: true,
    	theme: 'a',
    	html: ""
    });
    setTimeout(navigator.app.exitApp(), 3000);
   }
   else options = new game_options();
   setTimeout(showBanner, 5000);
  //snd = new gameSnd();
  //get_puzzles_from_database(); // this is the old way where i get all the data at the beggining of the game
})

$(window).resize(()=>{
  erase_puzzle();
  // // this thing needs to be done everytime the windows is resised
  // // the canvas should be emptied and then apped all of these elements
  //  //kWidth = $('.canvas').width()/3;
  //  //kHeight = $('.canvas').css('padding-top').match(/\d+/g).map(Number)[0]/4;
  if(playGrid){
    set = new settings(playGrid)
    playGrid.show();
  }
})
function assign_page(new_page){
  if(nav_arr.indexOf(new_page) >= 0)
    while(nav_arr.indexOf(new_page) !== nav_arr.length - 1 ) nav_arr.pop(); // make this page the last in the array
  else nav_arr.push(new_page);
}

function navigate_back(){
  if(nav_arr.length === 1 ) navigator.app.exitApp (); //if this is the first page the close the app
  else {
    nav_arr.pop(); //delete last element
    $.mobile.navigate('#' + nav_arr[nav_arr.length - 1]); // move to the last element
  }

  // var index = nav_arr.indexOf(c_page);
  // if(!index) navigator.app.exitApp ();
  // else if(c_page === 'puzzle') $.mobile.navigate('#' + c_size);
  // else if(c_page === 'connection') $.mobile.navigate('#' + p_page);
  // else $.mobile.navigate('#' + nav_arr[index - 1]);
}
