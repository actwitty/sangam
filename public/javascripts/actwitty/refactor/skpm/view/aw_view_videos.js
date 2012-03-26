/*********************************************************/
/*
 *
 *
 */
function aw_view_videos_get_video_iframe_html( url, width, height){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '';
	}
	return output;
}
/*********************************************************/
/*
 *
 *
 */
function aw_api_view_videos_render(data){
  var max_to_show = 6;
  var show_count = 0;
  var show_more = false;
  var display_class = "aw_js_video_box_show_always";
  var html='';
  $.each(data, function(key, entry){
    if( entry.attachment ){
      $.each(entry.attachment, function(key, attachment){
          if( attachment.type == 'embed'){
            if( attachment.embed){
              var video_html =aw_view_videos_get_video_iframe_html(attachment.embed, 230, 173);
              if( show_count >= max_to_show){
                display_class = "aw_js_video_box_hide_on_less";
                show_more = true;
              }
              if( video_html && video_html.length){
                html = html + '<div class="aw_single_video_container_box ' + display_class + '">' +
                                video_html +
                              '</div>';
                show_count++;
                
              }
                       
            }
          }
      });
    }
  });

  html =  '<div class="aw_all_videos_container_box">' +
              html + 
            '</div>';
  if( show_more){
    
    html = html + '<div class="aw_show_more_videos_box aw_js_show_more_videos"  state="show" >' +
                    'Show more videos' +
                  '</div>'; 
  }
  if( show_count ) {
    $("#aw_js_videos").html(html);
    $("#aw_js_videos_busy").hide();
    $("#aw_js_videos_main_container").show();
  }
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_videos(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_video_box_hide_on_less").removeClass("aw_js_video_box_hide_on_less").addClass("aw_js_video_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_video_box_show_on_more").removeClass("aw_js_video_box_show_on_more").addClass("aw_js_video_box_hide_on_less");
    object.attr('state', "show");
    object.html( 'Show more videos');
  }


}
