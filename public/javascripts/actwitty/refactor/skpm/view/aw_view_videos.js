/*********************************************************/
/*
 *
 *
 */
function aw_model_api_video_thumb_cb(ele, url, thumbnail, id, type){
  if(thumbnail.length == 0 ){
    ele.hide();
    return;
  }
  
  var video_url = "";
  ele.removeClass("aw_single_video_no_show");
  if(type == "youtube"){
    video_url = 'http://www.youtube.com/v/'+ id +'?wmode=transparent&rel=0&autoplay=1';
  }else if(type == "vimeo"){
    video_url = 'http://player.vimeo.com/video/' + id + '?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff';
  }else{
    ele.hide();
    return;
  }

   var img_html = '<a rel="aw_video_img_group" href="' + video_url + '" >' +
                    '<img src="' + thumbnail + '" />' +
                   '</a>';
  
  ele.html(img_html);

  $("a[rel=aw_video_img_group]").fancybox({
                  'type' : 'iframe',
                  'href' : $(this).href,
                  'overlayShow' : true,
                  'centerOnScroll' : true,
                  'speedIn' : 100,
                  'speedOut' : 50,
                  'width' : 640,
                  'height' : 480,
                });

}
/*******************************************************/
/*
 *
 *
 */
function aw_model_api_get_video_thumbnail(ele){
  var id;
  var url = ele.attr("video_url");
  var thumbnail="";
  if(url.match('http://(www.)?youtube|youtu\.be')) {
      id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
      thumbnail =  aw_model_api_get_youtube_thumbnail(id);
      aw_model_api_video_thumb_cb(ele, url, thumbnail, id, 'youtube');
  } else if (url.indexOf('vimeo.com') > -1) {
    if( url.match('http://(player.)?vimeo\.com')){
        id = url.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
    }else if (url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/)) {
        id = url.split('/')[1];
    } else if (url.match(/^vimeo.com\/channels\/[\d\w]+#[0-9]+/)) {
        id = url.split('#')[1];
    } else if (url.match(/vimeo.com\/groups\/[\d\w]+\/videos\/[0-9]+/)) {
        id = url.split('/')[4];
    } else {
        aw_model_api_video_thumb_cb(ele, url, thumbnail, '');
        return;
    }

    $.getJSON('http://www.vimeo.com/api/v2/video/' + id + '.json?callback=?', {format: "json"}, function(data) {
         thumbnail =  data[0].thumbnail_large;
         aw_model_api_video_thumb_cb(ele, url, thumbnail, id, 'vimeo');
    });
   
  }
    
}
/****************************************************/
/*
 *
 *
 */
function aw_model_api_get_youtube_thumbnail(id) {
    var thumbnail = "";
    if (id) {
      thumbnail = 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';
    }
    return thumbnail;
}


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
             // var video_html =aw_view_videos_get_video_iframe_html(attachment.embed, 230, 173);
              var video_html = "";
              if( show_count >= max_to_show){
                display_class = "aw_js_video_box_hide_on_less";
                show_more = true;
              }
                html = html + '<div class="aw_single_video_container_box aw_js_video_thumbnails aw_single_video_no_show ' + display_class + '" video_url="' + attachment.embed + '">' +
                                video_html +
                              '</div>';
                show_count++;
                
                       
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
    $("#aw_js_videos_nav").show();
  }

  $(".aw_js_video_thumbnails").each(function() {
                              aw_model_api_get_video_thumbnail($(this));
                           });

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
