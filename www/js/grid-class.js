class grid{
  constructor(knotes,isMake){
    /* this obj takes the horizontal number of knotes that exists and the vertical number ,
      hNum * vNum should be equal to the length of the knotes table
      knotes is an array of knote (pipes and homes and power stations)
      */
    this.hNum = knotes[0].length; /* there should be a check method to make sure all the grid is coherent in lengths */
    this.vNum = knotes.length;
    this.knotes = knotes;
    this.power_knotes = this.return_knotes('power');
    this.home_knotes = this.return_knotes('home');
    this.succeded = false; // only changes to true when succeded.
    if(!isMake) {
      this.onClick = 'playGrid.click'; //the usual rotating and showing functions....
      this.canvas = 'playCanvas'
    }
    else {
      this.onClick = 'makeGrid.grid.add_knote'; // adding a new knote to the grid.
      this.canvas = 'makeCanvas'
    }
  }
  randomize(){
    for(var i=0;i<this.hNum;i++)
      for(var j=0;j<this.vNum;j++)
        for(var k=0;k<Math.floor((Math.random() * 4) + 1);k++)
          this.knotes[j][i].rotate();
  }
  assign_jquery(){
    for(var i=0;i<this.hNum;i++)
      for(var j=0;j<this.vNum;j++)
        this.knotes[j][i].place = $(`[data-x='${i}'][data-y='${j}'].knote`)
  }
  assign_last(x,y){
    this.knotes[y][x].place = $('#'+this.canvas).last();
  }
  query(x,y){
    return this.knotes[y][x].place
  }
  // returns all the power stations coordinations in an array
  return_knotes(which){
    var knotes=[],counter=0;
    for(var i=0;i<this.hNum;i++)
      for(var j=0;j<this.vNum;j++)
        if(this.knotes[j][i][which]){
          knotes.push([j,i]);
        }
    return knotes;
  }

  // show the hole grid
  show(){
    //${grid.pipeName(this.knotes[y][x].pipe)}
    for(var x = 0; x < this.hNum; x++){
      for(var y = 0; y < this.vNum; y++){
        $('#' + this.canvas).append(`<div class="knote"
                              data-x=${x}
                              data-y=${y}
                              style="left:${1+(set.kWidth + 1)*x}px;
                              top:${(set.kHeight + 1)*y}px"
                              onclick=${this.onClick}(${x},${y})>
                              ${default_knote}
                               </div>`);
        /* the data-x/y are used of course to get the element
           positioning the knote using style
           ================== there must be a solution for not passing the playGrid in here ofcourse =========
           center contain all the forms necessary (homes,power,normal pipes)
           each one of them has a special class that is dynamically activated on the display function or color function
           same thing fo upper right bottom left
           the set.kHeight+1 is used to accomodate for the width of the borders
        */
      }
      this.assign_jquery();
      this.color_grid();
    }
  }
  /* this function takes care of all the coloring and discoloring of the item
     it takes in parameter the position of the knote */
  color(x,y){
    var k = this.knotes[y][x];
    k.show(k.place);
  }
  // on click rotate and check all the paths from the power stations to each knote
  click(x,y){
    if(this.succeded) return;

    snd.tick();

    this.rotate(x,y);
    this.frame();
    this.check();
  }
  frame(){
    this.turn_off_grid();
    this.power_knotes.forEach((coord)=>{
      this.power_flow(coord[1],coord[0]);
    })
    // color each element in every knote of each playGrid
    // considering if it's turned on or off
    this.color_grid();
  }
  turn_off_grid(){
    // turning off the hole grid
    for(var i=0;i<this.hNum;i++)
      for(var j=0;j<this.vNum;j++)
        this.knotes[j][i].state = false;
    // returning on the power stations
    var arr=this.power_knotes;
    arr.forEach((coord)=>{
      this.knotes[coord[0]][coord[1]].state = true;
    })
    // each frame count the amount of power reached to each home
    arr = this.home_knotes;
    arr.forEach((coord)=>{
      this.knotes[coord[0]][coord[1]].reach_power = 0;
    })
  }
  power_flow(x,y){
    var k = this.knotes[y][x];
    if(k.state){
      var p=k.pipe,
          lenX = this.hNum,
          lenY = this.vNum;
      if(p[0] && y>0) this.transfer_power_to(x,y-1,2)
      if(p[1] && x<lenX-1) this.transfer_power_to(x+1,y,3)
      if(p[2] && y<lenY-1) this.transfer_power_to(x,y+1,0)
      if(p[3] && x>0) this.transfer_power_to(x-1,y,1)
    }
  }
  transfer_power_to(x,y,port){
    var k = this.knotes[y][x];
    if(!k.state && k.pipe[port]){
      // this is to prevent overflow in the recursion...
      // for a home to be lighted up it should be connected through all of its pipes
      if(k.home){
        k.reach_power++;
        // count the reached power and compare with the sum of the pipe of the knote
        if(k.reach_power >= k.pipe.reduce((a, b) => a + b, 0))
        k.state = true;
      }
      else k.state = true;
      this.color(x,y);
      // only if the knote is not a home the power should continue flowing
      // homes are consumers
      if(!k.home) this.power_flow(x,y);
    }
  }
  rotate(x,y){
    this.knotes[y][x].rotate();
  }
  color_grid(){
    for(var i=0;i<this.hNum;i++)
      for(var j=0;j<this.vNum;j++)
        this.color(i,j);
  }
  add_knote(x,y){
    var place = this.knotes[y][x].place,
        chosen = make_chosen_knote;
    //this.knotes[y][x] = $.extend({},make_chosen_knote);
    this.knotes[y][x] = new knote(chosen.pipe,chosen.power,chosen.home)
    this.knotes[y][x].place = place;
    //this.knotes[y][x].prototype = knote.prototype;
    this.power_knotes = this.return_knotes('power');
    this.home_knotes = this.return_knotes('home');
    this.frame();
  }
  // this function should be async because there is another important function after it...
  check(){
    var are_homes_connected = true,
        ref = this;
    this.home_knotes.forEach(el=>{
      if(!ref.knotes[el[0]][el[1]].state) are_homes_connected = false;
    })
    if(!are_homes_connected) return false;
    // checks if all pipes are interconnected
    for(var x = 0; x<this.hNum; x++)
      for(var y=0; y<this.vNum; y++)
        for(var port = 0; port < 4; port++)
        {
          if(this.knotes[y][x].pipe[port])

            // tell if successfully connected all pipes
                 if(port === 3 && (x-1 < 0          || !this.knotes[y][x-1].pipe[1])) {console.log(x-1);return false;}
            else if(port === 2 && (y+1 >= this.vNum || !this.knotes[y+1][x].pipe[0])) {console.log(y+1);return false;}
            else if(port === 1 && (x+1 >= this.hNum || !this.knotes[y][x+1].pipe[3])) {console.log(x+1);return false;}
            else if(port === 0 && (y-1 < 0          || !this.knotes[y-1][x].pipe[2])) {console.log(y-1);return false;}

        }


    this.succeded = true;
    memo_success(); // update the local database
    glow_next(); // glow the next button
    snd.victory();

    // making the pop up

    var onclick;

    // if this is the final level then pop up a word FINAL!!
    // because a link <a> is giving an error loadign page for some unknown reason

    //nxt_btn.is_final ? button = "<p> FINAL!! </p>" : button = `<a href='puzzle' class='nxt' data-role='button'  onclick="${nxt_btn.click}"> ${nxt_btn.text} </a>`;
    // <img src='images/clap.gif' alt='CLAPS' style='width:100%;'/>

    nxt_btn.is_final ? onclick = "load_navigate('#puzzles')" : onclick = nxt_btn.click;
    $.mobile.loading( 'show', {
      textonly: true,
    	textVisible: true,
    	theme: 'a',
    	html: `

        <p>VERY GOOD!! </p>
        <a href='#puzzle' class='nxt' data-role='button'  onclick="${onclick}"> ${nxt_btn.text} </a>
      `
    });
    return true;
  }
}

function gameSnd(){
  this.t = new Audio('sounds/tick.wav');
  this.v = new Audio('sounds/victory.wav');
  this.c = 0;
  this.ticks=[];
  for(var i = 0; i<10;i++)
    this.ticks.push(this.t.cloneNode());

  this.tick = function(){
    if(!options.isSnd) return false;
    this.c = (this.c + 1)%10;
    this.ticks[this.c].play();
  }

  this.victory = function(){
    if(!options.isSnd) return false;
    this.v.play();
  }
}


// old way of checking the grid
/*
// this function should be async because there is another important function after it...
check(){

  // temporary method
  for(var i = 0;i<this.hNum;i++)
    for(var j=0;j<this.vNum;j++)
      if( !this.knotes[j][i].pipe.equals( dic_pipes[ correctPuzzle[j][i][0] ] ))return false; // i know that this is a very big sentence...
  //setTimeout(function(){alert('YOU HAVE SUCCEDED!!!!!!');},200);// i am not sure
  this.succeded = true;
  memo_success(); // update the local database
  glow_next(); // glow the next button
  snd.victory();
  return true;
}
*/
