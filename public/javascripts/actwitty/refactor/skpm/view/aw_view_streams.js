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
    screen_name_html =  '<a class="aw_stream_content_name" href="' + entry.originator.url + '" target="_blank">' +
                          entry.originator.name +
                        '</a>' +
                        '<a class="aw_stream_content_screen_name" href="' + entry.originator.url + '" target="_blank">' +
                          entry.originator.screen_name +
                        '</a>';
  }else{
    screen_name_html = '<a class="aw_stream_content_name" href="' + entry.originator.url + '" target="_blank">' +
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


/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_mentions_html(entry){
  var html = "";
  if( entry.mention && entry.mention.length ){
    var internal_html = "";

    $.each( entry.mention, function(index, mention_data){
      internal_html = internal_html + '<a src="' + mention_data.description + '" target="_blank"  >' +
                                        mention_data.name + 
                                      '</a>';
    });

    html = '<div class="aw_stream_mentions_box" >' +
               '<span> Mentions </span>' +
                internal_html + 
           '</div>';
  }
  
  return html;
}


/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_actions_html(entry){
  var html = "";
  if( entry.action && entry.action.length ){
    var internal_html = "";

    $.each( entry.action, function(index, action_data){
      if( action_data.type == "link" ){
        internal_html = internal_html + '<div class="aw_single_action aw_js_action_link_click aw_single_action_link " action_url="' + action_data.url + '" action_name="' + action_data.name + '" >' +
                                            action_data.name + 
                                      '</div>';
       }else if( action_data.type == "static" ){

         internal_html = internal_html + '<div class="aw_single_action aw_single_action_static"  >' +
                                            action_data.name + 
                                         '</div>';

       }
    });


    html = '<div class="aw_actions_box" >' +
                internal_html + 
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
                          '<a href="' + attachment.url + '" target="_blank" >' +
                            attachment.title +    
                          '</a>' +
                       '</div>';
        }else{
           title_html = '<div class="aw_attachment_title_milder" >' +
                          '<a href="' + attachment.url + '" target="_blank">' +
                            attachment.url +    
                          '</a>' +
                       '</div>';
        }

        if( attachment.description){
          var image_html = "";
          if ( attachment.image_url ){
             image_html = '<div class="aw_attachment_image_box" >' +
                            '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:300px;" />' +
                          '</div>';
          }
          content_html = content_html + '<div class="aw_attachment_content" >' +
                          image_html + 
                          '<p class="aw_attachment_paragraph" >' +
                              attachment.description +
                          '</p>' +
                        '</div>';
        }else{
          var image_html = "";
          if ( attachment.image_url ){
             image_html = '<div class="aw_attachment_image_box" >' +
                            '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:300px;" />' +
                          '</div>';
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
                          '<a href="' + attachment.url + '" target="_blank" >' +
                            attachment.title +    
                          '</a>' +
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
function aw_view_stream_get_location_html(entry){
  if( entry.place && entry.place.name){
    
    var html = '<div class="aw_location_box" >' +
                  '<p>' +
                    '<img src="/images/actwitty/refactor/aw_sketch/stream_view/icons/location.png" height=25px />' +
                    entry.place.name +
                  '</p>' +
               '</div>';
    return html; 
  }
  return "";
}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_entry_html(entry){

  var html = '<div class="aw_stream_entry_container" >' +
                '<div class="aw_stream_originator_img" >' +
                  '<a href="' + entry.originator.url + '" target="_blank">' +
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
                  aw_view_stream_get_mentions_html(entry) +
                  aw_view_stream_get_location_html(entry) +
                  aw_view_stream_get_actions_html(entry) +
                  
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
  var aw_error_rendered = {};
  $.each(data, function(key, entry){
    if (  entry.service.pid && entry.service.pid == "aw_service_error" ){ 
      if( aw_error_rendered[entry.service.name] ){
        return;
      }else{
        aw_error_rendered[entry.service.name] = true;
      }
    }
    html= html + aw_view_stream_get_entry_html(entry);
  });
  
  $("#aw_js_stream_entries").html(html);
  $("#aw_js_stream_entries").scrollTop(0); 
  $("abbr.aw_js_timeago").timeago();
  $("#aw_js_stream_busy").hide();

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
/***********************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_close(show){
  if( show ){
    $("#aw_js_stream_close_control").show();
  }else{
    $("#aw_js_stream_close_control").hide();
  }
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_view_stream_apply_height(body_height){
  $("#aw_js_stream_entries").height(body_height - 105 );
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_view_show_stream_waiting(){
  $("#aw_js_stream_busy").show();
}
/************************************************************/
/*
 *
 *
 */
function aw_api_view_stream_apply_link_action(element){
  var url = element.attr('action_url');
  var name = element.attr('action_name');
   window.open(url, name,
                  'menubar=0,resizable=0,width=550,height=420,top=200,left=400');

}
