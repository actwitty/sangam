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
  if ( entry.originator.screen_name && entry.originator.screen_name.length){
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
      internal_html = internal_html + '<li> <a src="' + mention_data.description + '" target="_blank"  >' +
                                        mention_data.name + 
                                      '</a> </li>';
    });

    html = '<ul class="aw_stream_mentions_box" >' +
               '<span> TAGS: </span>' +
                internal_html + 
           '</ul>';
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
        internal_html = internal_html + '<li class="aw_js_action_link_click aw_single_action_link " action_url="' + action_data.url + '" action_name="' + action_data.name + '" >' +
                                            action_data.name + 
                                      '</li>';
       }else if( action_data.type == "static" ){

         internal_html = internal_html + '<li class="aw_single_action aw_single_action_static"  >' +
                                            action_data.name + 
                                         '</li>';

       }
    });


    html = '<div class="aw_actions_box" >' +
                '<ul>' +
                  internal_html + 
                '</ul>' +
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
    var split_str = url.split(/v\/|v=|youtu\.be\//)[1];
    if( split_str ) {
      var youtube_id = split_str.split(/[?&]/)[0];
      output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
    }
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
        var image_html = "";
        if ( attachment.image_url ){
             image_html = '<div class="aw_attachment_image_box" >' +
                            '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:300px;" />' +
                          '</div>';
        } 
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title_box" >' +
                            '<a href="' + attachment.url + '" target="_blank" >' +
                              attachment.title +    
                            '</a>' +
                       '</div>';
        }

        if( attachment.description){
          
          if( attachment.provider ){
            caption_html =  '<span class="aw_attachment_caption" >' +
                                attachment.provider +
                             '</span>';
          }
          
          content_html = content_html + '<div class="aw_attachment_content_box" >' +
                                          '<p class="aw_attachment_paragraph" >' +
                                              caption_html +
                                              '  -  ' + attachment.description +
                                          '</p>' +
                                        '</div>';
        }

        

        html = html + image_html +
                      title_html +
                      content_html;
      }else if( attachment.type == 'embed'){
        var title_html = "";
        var embed_html = "";
        var content_html = "";

       
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title_box" >' +
                          '<a href="' + attachment.url + '" target="_blank" >' +
                            attachment.title +    
                          '</a>' +
                       '</div>';
        }

        if( attachment.embed){
          var embed_iframe = aw_view_api_check_and_get_video_iframe_html(attachment.embed,300,225);
          if(embed_iframe.length){
            embed_html = '<div class="aw_attachment_embed" >' + 
                          embed_iframe +
                       '</div>';
          }
        }


        if( attachment.description){
          if( attachment.provider ){
            caption_html =  '<span class="aw_attachment_caption" >' +
                                attachment.provider +
                             '</span>';
          }
          
          content_html = content_html + '<div class="aw_attachment_content_box" >' +
                                          '<p class="aw_attachment_paragraph" >' +
                                              caption_html +
                                               '  -  ' + attachment.description +
                                          '</p>' +
                                        '</div>';
        }

        html = html +    embed_html + 
                         title_html +
                         content_html;

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
  var attachment_html = aw_view_stream_get_attachments_html(entry);
  var text_html = "";
  var hover_html = "";
  if(!attachment_html.length){
    text_html = aw_view_stream_get_text_html(entry);
  }else{
   hover_html = aw_api_view_stream_generate_hover_info(entry);
  }
  var html = '<div class="aw_stream_entry_container" >' +

                '<div class="aw_stream_time_orig" >' +
                    '<abbr class="aw_js_timeago" title="' + entry.timestamp + '"></abbr>' +
                '</div>' +

                '<div class="aw_stream_content" >' +
                  attachment_html +
                  text_html +
                  aw_view_stream_get_mentions_html(entry) +
                  aw_view_stream_get_location_html(entry) +
                '</div>' +

                aw_view_stream_get_actions_html(entry) +


                '<div class="aw_originator_box aw_js_stream_hover_originator" >' +
                  '<a href="' + entry.originator.url + '" target="_blank">' +
                    '<img src="' +  entry.originator.image  + '" width=100% height=100% />' +
                  '</a>' +
                  aw_view_stream_get_display_name(entry) +
                  '<img class="aw_stream_src_img" src="' + social_media_sources[entry.service.name] + '" width=16px height=16px />' +
                  hover_html +                
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

/***********************************************************/
/*
 *
 *
 */
function aw_api_view_stream_set_default_internal_header(){
  var header_text = "<span> Your wall feed from enabled services. </span>";
  if ( aw_js_global_visited_user_credentials.id != aw_js_global_logged_in_user_credentials.id )
  {
      header_text = '<span> ' + aw_js_global_visited_user_credentials.name + "'s all posts from enabled services. </span>";
    
  }
  $("#aw_js_stream_internal_header").html(header_text);
}
/************************************************************/
/*
 *
 *
 */
function aw_api_view_stream_generate_hover_info( entry ){
  var hover_html = "";
  if( entry.text && entry.text.length){
    var short_text = entry.text;
    if( short_text.length > 500 ){
      short_text = entry.text  
                        .trim()
                        .substring(0, 500)
                        .split(" ")
                        .slice(0, -1)
                        .join(" ") + "...";
    }
    hover_html = '<div class="aw_stream_info_hover aw_js_stream_info_box" >' +
                      '<span class="aw_stream_info_close_btn aw_stream_js_stream_info_close" >X</span>' +
                      '<div class="aw_stream_info_box_header" >' +
                        '<span>'  +
                          aw_view_stream_get_display_name( entry ) +
                        '</span>' +
                      '</div>' +
                      '<div class="aw_stream_info_hover_data" >' +
                        '<div class="aw_stream_info_hover_img" >' +
                         '<a href="' + entry.originator.url + '" target="_blank">' +
                            '<img src="' +  entry.originator.image  + '" width=100% height=100% />' +
                         '</a>' +
                        '</div>' +
                        '<div class="aw_stream_info_hover_text" >' +
                          entry.text + 
                        '</div>' +
                      '</div>' +
                   '</div>';
  }
  return hover_html;
}
/****************************************************************************/
/*
 *
 *
 */
var hvr_handle_timer = null;
var dlg_hvr_handle_timer = null;
function aw_api_view_handle_hover_show_overlay(ele){
  $(".aw_js_stream_info_box").hide();
  
  hover_ele = ele.find(".aw_js_stream_info_box");
  if(!hover_ele.length){
    return;
  }
  hover_ele.show();
  if( hvr_handle_timer != null) {
    clearTimeout(hvr_handle_timer);
  }
  if( dlg_hvr_handle_timer != null ){
    clearTimeout(dlg_hvr_handle_timer);
  }
  hvr_handle_timer = setTimeout(function(){
    hover_ele.hide();
  }, 1500);
}
function aw_api_view_handle_hover_handle_overlay_hover_in(ele){
  if( hvr_handle_timer != null) {
    clearTimeout(hvr_handle_timer);
  }
  if( dlg_hvr_handle_timer != null ){
    clearTimeout(dlg_hvr_handle_timer);
  }
}

function aw_api_view_handle_hover_handle_overlay_hover_out(ele){
  var hide_ele = ele;
  dlg_hvr_handle_timer = setTimeout(function(){
      hide_ele.hide();
  }, 1500);
}
/****************************************************************************/
/*
 *
 *
 */
function aw_api_view_handle_hover_close(ele){
  if( hvr_handle_timer != null) {
    clearTimeout(hvr_handle_timer);
  }
  if( dlg_hvr_handle_timer != null ){
    clearTimeout(dlg_hvr_handle_timer);
  }

  ele.closest( ".aw_js_stream_info_box" ).hide();
}
