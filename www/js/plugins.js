

    /* it is impossible to make different combinations of the pipes
    this is why it's necessary to do a -new- on each knote
    */






// used when initializing new puzzle and closing the puzzle page
function erase_puzzle(){
  $('#playCanvas').html('');
  $('#makeCanvas').html('');
}

// to get the user attention.
function glow_next(){
  $('#puzzle .next-level').addClass('press-me');
}
function unglow_next(){
  $('#puzzle .next-level').removeClass('press-me ui-btn-active');
}
// show the loading and navigate to some page
function load_navigate(to, wait_for){
  if(arguments.length === 1) wait_for = [1]; // assign this[wait_for] to document because it is impossible to be empty
  if(!connected || is_empty(wait_for) ){
    $.mobile.loading( 'show', {
    	text: 'LOADING',
    	textVisible: true,
    	theme: 'a',
    	html: ""
    });
    //console.log(wait_for);
  }

  var id = setInterval(function(){
    //console.log(wait_for);
    if(connected && !is_empty(wait_for)) {
      clearInterval(id); //clear the setInterval
      $.mobile.loading('hide'); // always hide the loading
      if(to === '#puzzle') show_inter(); // only active when going to play
      $.mobile.navigate(to);
    }
  },100);
  // check connection anyway after 10 seconds

  setTimeout(function(){
    clearInterval(id);
    check_connection();
  },10000);
}



function show_puzzle(){
  //while(!playGrid) setTimeout(function(){}, 100); // this procedure is temporary
  erase_puzzle();
  set = new settings(playGrid);
  playGrid.randomize();
  // this thing needs to be done everytime the windows is resised
  // the canvas should be emptied and then apped all of these elements
  // kWidth = $('.canvas').width()/3;
  // kHeight = $('.canvas').css('padding-top').match(/\d+/g).map(Number)[0]/4;
  playGrid.show();
  playGrid.frame();
}


function game_options(){
  snd = new gameSnd();
  this.isSnd = $('#isSnd').prop('checked');
  this.isNight = $('#isNight').prop('checked');
  this.toggle_snd = function(){
    this.isSnd = $('#isSnd').prop('checked');
    snd.tick(); // will only tick if checking to true
  }
  this.toggle_night = function(){
    this.isNight = $('#isNight').prop('checked');
    if(this.isNight) $('[role="main"]').addClass('dark');
    else $('[role="main"]').removeClass('dark');
  }
}

// this function is activated on the click of the level size selection
// it assigns the current size selected, and colors the successfully passed puzzles
function select_c_size(size){
  c_size = size;
  var passed_levels = JSON.parse(st.getItem(c_size));
  if(passed_levels) color_successful_levels(passed_levels);
}
function pick_puzzle(size,index, isShow){

  // assign new puzzle to local variables,
  // assign the original one
  // then show the puzzle: the cb();
  // this function is used on the click of the button that takes the user to #puzzle
  correctPuzzle = []; // making playGrid empty
  load_navigate('#puzzle', correctPuzzle);
  c_size = size;
  c_index = index;

  nxt_btn = show_next_previous(size,index);

    firebase.database().ref(`puzzles/${size}/${index}`).once('value').then(snap=>{
      var puzzle = snap.val(),
          notify = correctPuzzle;

      correctPuzzle = puzzle.clone();
      puzzle = instantiate_knotes(puzzle);
        // for( i = 0, len = puzzle.length; i < len; i++)
        //   for(j = 0, lenz = puzzle[0].length; j< lenz; j++){
        //     temp = puzzle[i][j];
        //     puzzle[i][j] = new knote(temp.pipe || temp[0],temp.power || temp[1],temp.home ||temp[2]); // this should be deleted and make only one way of storing data;
        //   }
        playGrid = new grid(puzzle);

        // the next case only occures when the user presses next button.
        if(isShow)  {unglow_next();}
        show_puzzle();
        // make sure the puzzle is displayed then go to that page
        notify.push(1);// to notify load_navigate that this array is now not empty
        //$.mobile.navigate('#puzzle');
    })

}
// attach prototype of knote to knote object coming from firebase
function instantiate_knotes(knotes){
  var temp;
  for(var i = 0, len = knotes.length; i < len; i++)
    for(var j = 0, lenz = knotes[0].length; j< lenz; j++){
      temp = knotes[i][j];
      knotes[i][j] = new knote(temp.pipe || temp[0],temp.power || temp[1],temp.home ||temp[2]); // this should be deleted and make only one way of storing data;
    }
  return knotes;
}
function show_next_previous(size,index){
  parseInt(index);
  var temp = $('#puzzle .next-level'),
      text,
      click,
      is_final;
  // console.log(temp);
  if(there_is_next_level(size, index)){
        text = `next: ${size} / ${index + 1}`;
        click = `pick_puzzle('${size}',${ index + 1 }, true)`;
        is_final = false;
  }
  else {
    text = 'FINAL!!';
    click = '';// to not accept next level
    is_final = true;
  }
  temp.html(text);
  temp.attr('onclick', click);
  $('#puzzle .back').attr('href', '#' + size);

  return {
    text,
    click,
    is_final
  };
}
  // check if there is a next level
function there_is_next_level(size, index){

  for( var i = 0, len = levels.length; i<len; i++)
    if(levels[i].name == size && index < levels[i].count) return {size:size ,index: index};
  return false;
}


function memo_success(){
  if(!playGrid.succeded) return false;

  var get = JSON.parse(st.getItem(c_size));
  if(!get) get = [];
  get.push(c_index);
  get.sort();
  st.setItem(c_size,JSON.stringify(get));

  color_successful_levels(get);
}

function color_successful_levels(arr){
  //$(`#${c_size} div`).removeClass('on');
  arr.forEach(function(index){
    $(`#${c_size} [data-level='${index}']`).addClass('on');
  })
}























//puzzles[el].reduce((a, b) => a +`<button href="#puzzle" onclick=register_puzzle('${el}',${b})>` + b + '</button>', '')}








// uneccessary function robably going to be deleted
// static pipeName(pipe){
//   if(pipe == Ipipe) return "Ipipe";
//   else if(pipe == _pipe) return "_pipe";
//   else if(pipe == Lpipe) return "Lpipe";
//   else if(pipe == Jpipe) return "Jpipe";
//   else if(pipe == Mpipe) return "Mpipe";
//   else if(pipe == Npipe) return "Npipe";
//   else if(pipe == Epipe) return "Epipe";
//   else if(pipe == Wpipe) return "Wpipe";
//   else if(pipe == Rpipe) return "Rpipe";
//   else if(pipe == Tpipe) return "Tpipe";
//   else if(pipe == Xpipe) return "Xpipe";
// }



/*
color(x,y){
  var k = this.knotes[y][x];
  var state = k.state?'on':'';
  function decolor(x,y){
    k.place.find(`*`).removeClass();
  }
  function element(data_corner){
    return k.place.find(`[data-corner='${data_corner}']`);
    //return $(`.knote[data-x='${x}'][data-y='${y}'] [data-corner='${data_corner}']`);
    // used to return a specified element in the specified knote it's used as a div
  }
  var display = function (direction, state){
    element(direction).addClass(`${direction}-pipe ${state}`);
  }
  decolor(x,y);
  display('center',state)
  // the third if is not necessary but it's ok;
  if(k.power) display('power','')
  else if(k.home) display('home','')
  else if(!k.power && !k.home) display('normal','') /* normal pipe this is a terki3a and i hate it but it's ok
  if(k.pipe[0]) display('upper',state)
  if(k.pipe[1]) display('right',state)
  if(k.pipe[2]) display('bottom',state)
  if(k.pipe[3]) display('left',state)
}
*/
