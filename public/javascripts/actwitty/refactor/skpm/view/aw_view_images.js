/***************************************************************/
/*
 *
 *
 */
function aw_api_view_images_render(data){
  var html="";
  var count = 0;
  var max_images_to_show = 10;
  var show_more = false;
  var display_class = "aw_js_image_box_show_always";
  var html_col_1 = '<div class="aw_images_col" >';
  var html_col_2 = '<div class="aw_images_col" >';
  var html_col_3 = '<div class="aw_images_col" >';

  $.each(data, function(key, image_json){

    if( count > max_images_to_show){
      show_more = true;
      display_class = "aw_js_image_box_hide_on_less";
    }

    var img_html =  '<div class="aw_single_img_box ' + display_class + '"  >' +
                      '<a rel="aw_img_group" href="'+ image_json.url +'">' +
                        '<img src="' + image_json.url + '" width=160px class="aw_tiled_image" />' +
                      '</a>'+
                       '<img class="aw_images_service_img" src="/images/actwitty/refactor/aw_sketch/images/' +   image_json.service.name +  '.png" width=16px height=16px />' +
                    '</div>';
    if(count%3 == 0){
        html_col_1 = html_col_1 + img_html;
    }else if(count%3 == 1){
        html_col_2 = html_col_2 + img_html;
    }else{
        html_col_3 = html_col_3 + img_html;
    }
    count++; 
  });


  html_col_1 = html_col_1 + '</div>';
  html_col_2 = html_col_2 + '</div>';
  html_col_3 = html_col_3 + '</div>';
  html =  '<div class="aw_images_internal_container_box" >' +
              html_col_1 + 
              html_col_2 +
              html_col_3 +
          '</div>';

  if( show_more ){
    html = html +
           '<div class="aw_show_more_image_box aw_js_show_more_pictures"  state="show" >' +
              'Show more pictures' +
          '</div>';  
  }

  if( html.length ){
    $("#aw_js_images_box").html(html);
    
	
    $("a[rel=aw_img_group]").fancybox({
	  	'transitionIn'		: 'none',
		  'transitionOut'		: 'none',
  		'titlePosition' 	: 'over',
	  	'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
		      return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
	    }
    });
    $("#aw_js_images_main_container").show();
    $("#aw_js_images_busy").hide();
  }
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_images(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_image_box_hide_on_less").removeClass("aw_js_image_box_hide_on_less").addClass("aw_js_image_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_image_box_show_on_more").removeClass("aw_js_image_box_show_on_more").addClass("aw_js_image_box_hide_on_less");
    object.attr('state', "show");
    object.html( 'Show more pictures');
  }


}
