class settings{
  constructor(grid){
    this.grid = grid;
    this.gWidth = $('body').width();
    // this.gWidth = $('#' + this.grid.canvas).width();// trying window instead of
    //                                      // $('.canvas').width(); is better
    //                                      // the width is determined before this step
    this.gHeight = this.calc_gHeight();
    this.kWidth = this.calc_kWidth()-2; // the -2 is to accomodate for the border on each knote
    this.kHeight = this.calc_kHeight()-2; // the -2 is to accomodate for the border on each knote
    // make new css for the canvas padding-top and the knotes-width from the html file
    this.adjust_css();
  }
  calc_gHeight(){
    return this.gWidth*(this.grid.vNum)/(this.grid.hNum);
  }
  calc_kHeight(){
    return this.gHeight/(this.grid.vNum)
  }
  calc_kWidth(){
    return this.gWidth/(this.grid.hNum)
  }
  adjust_css(){
    $('[type="text/css"]').remove()
    $(`<style type='text/css'>
    #${this.grid.canvas}{ padding-top:${this.gHeight}px;}
    .knote{
      width:${this.kWidth}px;
      height:${this.kHeight}px
    }
    </style>`).appendTo("head");
  }
}
