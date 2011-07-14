

$(document).ready(function(){
//    alert("aw_Slider is ready");
    $('div.aw_slider').live('mousemove',function(e){
      var div = $(this);
      var ul = $(this).children('ul.aw_slider');
      var ulPadding = 15;
      var divWidth = div.width();
      //Find last image container
      var lastLi = ul.find('li:last-child');

      var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth() + ulPadding;
      var left = (e.pageX - div.offset().left) * (ulWidth-divWidth) / divWidth;
      div.scrollLeft(left);
    });

  }); /* ready ends here */


  

