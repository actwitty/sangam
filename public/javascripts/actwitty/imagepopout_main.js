$(function() {

//var ID1 = $(".img_hover").attr("id");
alert("hello");

$('.ntabs').hover(
//$('.img_hover').hover(
   function(){
     var ID = $(this).children().attr("id");
     //var ID = $(this).attr("id");
     //alert($(this).children().attr("id"));
     alert(ID);
     var	xwidth = ($('#'+ID).width());
	   var	xheight = ($('#'+ID).height());
     //alert(xwidth);  
     //alert(xheight);
	   var left_margin = ( 150 - xwidth )/2;
	   var top_margin = ( 100 - xheight )/2;
  	
	$('#'+ID).hover(
		function() {

			$(this).stop().animate( {
				width   : xwidth * 2,
				height  : xheight * 2,
				marginLeft : left_margin,
				marginTop : top_margin
				}, 200
			); //END FUNCTION
			$(this).addClass('image-popout-shadow');
		}, //END HOVER IN
		function() {
			$(this).stop().animate( {
				width   : xwidth,
				height  : xheight,
				marginLeft : left_margin,
				marginTop : top_margin
				}, 200, function() {
			$(this).removeClass('image-popout-shadow');
		}); //END FUNCTION
			
		});

 });
	
});
