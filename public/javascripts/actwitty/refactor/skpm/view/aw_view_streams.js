var social_media_sources = {
                                twitter: "/images/actwitty/refactor/aw_sketch/stream_view/services/twitter.png",
                                facebook: "/images/actwitty/refactor/aw_sketch/stream_view/services/facebook.png"
                           };
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_display_name(entry){
  var screen_name_html = "";
  var name = "";
  if ( entry.originator.screen_name ){
    screen_name_html = '<a class="aw_stream_content_screen_name" href="' + entry.originator.url + '">' +
                          entry.originator.screen_name +
                        '</a>' +
                        '<a class="aw_stream_content_name" href="' + entry.originator.url + '">' +
                          entry.originator.name +
                        '</a>';
  }else{
    screen_name_html = '<a class="aw_stream_content_name" href="' + entry.originator.url + '">' +
                        entry.originator.name +
                      '</a>';
  }
  return screen_name_html;

}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_text_html(entry){
  var html = "";
  if( entry.text ){
    html = '<div class="aw_stream_text_box" >' +
              '<p>' +
                entry.text +
              '</p>' +
           '</div>';
  }

  return html;
}
/*********************************************************/
/*
 *
 *
 */
function aw_view_api_check_and_get_video_iframe_html( url, width, height){
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
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_attachments_html(entry){
  var html = "";
  if ( entry.attachment ){
    var attachment_arr = entry.attachment;
    $.each(entry.attachment, function(key, attachment){
      if( attachment.type == 'link') {
        var title_html = "";
        var content_html = "";
        var caption_html = "";
       
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title" >' +
                          '<a href="' + attachment.url + '" />' +
                          attachment.title +    
                       '</div>';
        }else{
           title_html = '<div class="aw_attachment_title" >' +
                          '<a href="' + attachment.url + '" />' +
                          'Attached Link' +    
                       '</div>';
        }

        if( attachment.description){
          var image_html = "";
          if ( attachment.image_url ){
             image_html = '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:125px;" />';
          }
          content_html = content_html + '<div class="aw_attachment_content" >' +
                          '<p class="aw_attachment_paragraph" >' +
                              image_html + 
                              attachment.description +
                          '</p>' +
                        '</div>';
        }else{
          var image_html = "";
          if ( attachment.image_url ){
             image_html = '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:250px;" />';
          }

          content_html = content_html + '<div class="aw_attachment_content" >' +
                          '<p class="aw_attachment_paragraph" >' +
                              image_html + 
                          '</p>' +
                        '</div>';
        }

        if( attachment.name ){
          caption_html = '<div class="aw_attachment_caption" >' +
                                attachment.name +
                             '</div>';
        }

        html = html + '<div class="aw_attachment_box">' +
                         title_html +
                         content_html + 
                         caption_html +
                      '</div>';
      }else if( attachment.type == 'embed'){

        var title_html = "";
        var embed_html = "";
        var description_html = "";

       
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title" >' +
                          '<a href="' + attachment.url + '" />' +
                          attachment.title +    
                       '</div>';
        }

        if( attachment.embed){
          embed_html = '<div class="aw_attachment_embed" >' + 
                          aw_view_api_check_and_get_video_iframe_html(attachment.embed,300,225) +
                       '</div>';
        }


        if( attachment.description){
           description_html = '<div class="aw_attachment_content" >' +
                                '<p class="aw_attachment_paragraph" >' +
                                    attachment.description +
                                '</p>' +
                              '</div>';
        }

        html = html + '<div class="aw_attachment_box">' +
                         title_html +
                         embed_html + 
                         description_html +
                      '</div>';

      }
    });
  }

  return html;
}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_entry_html(entry){
  var html = '<div class="aw_stream_entry_container" >' +
                '<div class="aw_stream_originator_img" >' +
                  '<a href="' + entry.originator.url + '">' +
                    '<img src="' +  entry.originator.image  + '" width=100% height=100% />' +
                  '</a>' +
                  '<span>'+ aw_view_stream_get_display_name(entry) + '</span>' +
                '</div>' +
                '<div class="aw_stream_src_img" >' +
                  '<img src="' + social_media_sources[entry.service.name] + '" width=16px height=16px />' +
                '</div>' +
                '<div class="aw_stream_time_orig" >' +
                    '<abbr class="aw_js_timeago" title="' + entry.timestamp + '"></abbr>' +
                '</div>' +
                '<div class="aw_stream_content" >' +
                  aw_view_stream_get_text_html(entry) +
                  aw_view_stream_get_attachments_html(entry) +
                  
                '</div>' +
             '</div>';
  return html;
}
/***********************************************************/
/*
 *
 *
 */
function aw_api_view_stream_render(data){
  var html = "";
  $.each(data, function(key, entry){
    html= html + aw_view_stream_get_entry_html(entry);
  });
  
  $("#aw_js_stream_entries").html(html);
  
  $("abbr.aw_js_timeago").timeago();
  /*$(".aw_stream_oembed").oembed(null, 
                                {
                                  allowedProviders: ["flickr", "youtube", "viddler", "blip", "hulu", "vimeo", "dailymotion", "scribd", "slideshare", "photobucket"],
                                  embedMethod: "replace",
                                  maxWidth: 240
                                });*/
}


/***********************************************************/
/*
 *
 *
 */
function aw_api_view_stream_header_render(data){
 var html = "Wall Feed";
 
 $("#aw_stream_container_header_label").html(data);


}



$(document).ready(function() {
 
  //$(".aw_stream_entries").jScrollPane();
  //$(".aw_stream_entries").tinyscrollbar();
  
});
