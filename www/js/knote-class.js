class knote{
  constructor(pipe,power,home){
    this.pipe = pipe.length ? pipe.slice(0) : dic_pipes[pipe].slice(0); /* array of 4 elements */
    if(power) this.state = true;
    else this.state = false;
    this.power = power; /* if true then it is a power generator, so it's one of the origins of the recursion*/
    this.home = home; /* if true it is a home, and it's the end point of the recursion */
    if(this.home) this.reach_power = 0;
  }
  rotate(){
    function arrayRotate(arr){
      //console.log(arr);
      var temp = arr[0],
          len = arr.length -1;
      for(var i=0;i<len ;i++)
        arr[i] = arr[i+1];
      arr[len] =temp;
      //console.log(arr);
      return arr;
    }
    arrayRotate(this.pipe);
  }
  show(place){
    var k = this;
    var state = k.state?'on':'';
    function decolor(){
      place.find(`*`).removeClass();
    }
    function element(data_corner){
      return place.find(`[data-corner='${data_corner}']`);
      //return $(`.knote[data-x='${x}'][data-y='${y}'] [data-corner='${data_corner}']`);
      // used to return a specified element in the specified knote it's used as a div
    }
    var display = function (direction, state){
      element(direction).addClass(`${direction}-pipe ${state}`);
    }
    decolor();
    display('center',state)
    // the third if is not necessary but it's ok;
    if(k.power) display('power','')
    else if(k.home) display('home','')
    else if(!k.power && !k.home) display('normal','') /* normal pipe this is a terki3a and i hate it but it's ok*/
    if(k.pipe[0]) display('upper',state)
    if(k.pipe[1]) display('right',state)
    if(k.pipe[2]) display('bottom',state)
    if(k.pipe[3]) display('left',state)
  }
}
