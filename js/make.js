var xNum = 5, yNum = 5, ind;
var makeGrid,
    make_chosen_knote = {pipe:Fpipe,power:false,home:false};


function make_choose_size(knotes){
  xNum = $('#make_hNum').val();
  yNum = $('#make_vNum').val() || xNum;
  if(xNum>4 && xNum< 10){
    makeGrid = new make_grid(xNum, yNum, knotes);
    $('#makeCanvas').html('');
    makeGrid.show();
    makeGrid.frame();
    makeGrid.show_options();
    index_database(xNum,yNum)
  }
  else throw "don't play with me"
}

function repair(){
  ind = $('#make_index').val();
  if(ind < 1 || ind > 100 ) {alert('{1 too 100} only!!!'); return false;}
  xNum = $('#make_hNum').val();
  yNum = $('#make_vNum').val() || xNum;
  if(xNum < 4 || xNum > 10){alert('{5 too 9} only!!!'); return false;}
  size = `${xNum}x${xNum}`;
  firebase.database().ref(`puzzles/${size}/${ind}`).once('value').then(function(snap){
    var k = instantiate_knotes(snap.val());  
    make_choose_size(k);
    console.log(k)
  })
}

function make_choose_knote(pipe,power,home){
  var chosen = make_chosen_knote;
  if(power) {chosen.power = true; chosen.home = false; return;}
  if(home) {chosen.power = false; chosen.home = true;return;}
  chosen.pipe = pipe;
  chosen.power = false;
  chosen.home = false;
}


class make_grid{
  constructor(xNum ,yNum , knotes){
    this.xNum = xNum;
    this.yNum = yNum;
    if(!knotes) knotes = this.knotes(this.xNum,this.yNum);
    this.grid = new grid(knotes,true)
    set = new settings(this.grid)
  }
  knotes(x,y){
    var acc = [];
    for(var i=0;i<y;i++){
      acc[i] = [];
      for(var j=0;j<x;j++)
        acc[i][j] = new knote(Fpipe,0,0)
    }
    return acc
  }
  show(){
    this.grid.show();
  }
  frame(){
    this.grid.frame();
  }
  show_options(){
    function show_option_pipe(k){
      $('#optionsCanvas').append(`<div class='knote' style='min-width:66px;'
                                       onclick="make_choose_knote([${k.pipe}],${k.power},${k.home})">
                                    ${default_knote}
                                   </div>`);
    }
    function instantiate_and_show_option_pipe(pipe,power,home){
      var k = new knote(pipe,power,home);
      show_option_pipe(k)
      var last_knote = $('#optionsCanvas').children().last();
      k.show(last_knote);
    }
    $('#optionsCanvas').html('');
    dic_pipes.forEach((pipe)=>{
      instantiate_and_show_option_pipe(pipe,false,false);
    })

    instantiate_and_show_option_pipe(Fpipe,true,false);
    instantiate_and_show_option_pipe(Fpipe,false,true);

  }
}
  // onclick="makeGrid.chooseKnote(${pipe})"
