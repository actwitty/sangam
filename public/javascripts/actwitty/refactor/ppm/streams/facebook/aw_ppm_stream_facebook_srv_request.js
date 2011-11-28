
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_post_check(stream_info){
  if( stream_info.post.source_name == 'facebook' && stream_info.post.source_msg_id ){
    return true;
  }
  return false;
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_facebook_get_signed_in_auth_token(){
  var auth_token = $("#aw_js_ppm_fb_access_token").val();
  if(auth_token.length){
    return auth_token;
  }

  return '';
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_skip_processing(stream_info, fb_resp_data){
 
  if( (fb_resp_data.message && fb_resp_data.message.length) || ( fb_resp_data.link &&  fb_resp_data.link.length) ){
    return false;
  }else{
    var stream_main_box_id = aw_api_get_stream_id(stream_info);                       
    $("#" + stream_main_box_id).remove();
    aw_api_ppm_remove_stream_context(stream_main_box_id);
    return true;
  }


}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_link_is_video(url){
  if(url.match('http://(www.)?youtube|youtu\.be')){
    return true;
  }else if(url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/)){
    return true;
  }
  return false;
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_image_link(url){
  if (url.match(/(\.|\/)(gif|jpe?g|png)$/i)){
    return true;
  }
  return false;
}

/************************************************************/
/*
 *
 *
 */
function aw_get_params_by_name( url, name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_fb_link_with_fbid(fb_resp_data){
  return aw_get_params_by_name(fb_resp_data.link, 'fbid'); 
}

/************************************************************/
/*
 *
 *
 */
function aw_api_process_facebook_links_with_fbid(stream_info, fbid, fb_resp_data){
  var fbid_url = 'https://graph.facebook.com/' + fbid +"?access_token="+ aw_api_ppm_facebook_get_signed_in_auth_token() + "&callback=?";
  $.getJSON(fbid_url, function(fbid_resp_data){
    var fb_data_json = {};
    if(fbid_resp_data.message){
      fb_data_json['internal_message'] = fbid_resp_data.message;
    }
    if(fbid_resp_data.source){
      fb_data_json['internal_src'] = fbid_resp_data.source;
     if(aw_api_ppm_stm_facebook_check_link_is_video(fbid_resp_data.source)){
        fb_data_json['video'] = fbid_resp_data.source; 
      }else if(aw_api_ppm_stm_facebook_check_image_link(fbid_resp_data.source)){
         fb_data_json['image'] = fbid_resp_data.source; 
      }else{
        fb_data_json['unresolved'] = fbid_resp_data.source; 
      }
    }

     if(fb_resp_data.message){
      fb_data_json['message'] = fb_resp_data.message;
    } 
    fb_data_json['link'] = fb_resp_data.link;
    aw_api_facebook_render_post_data(stream_info, fb_data_json);
  });
}


/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_process_fb_data(stream_info, fb_resp_data){
  var fb_data_json = {};
  fb_data_json['link'] = '';
  if(fb_resp_data.link){
    fb_data_json['link'] = fb_resp_data.link;
    if(aw_api_ppm_stm_facebook_check_link_is_video(fb_resp_data.link)){
      fb_data_json['video'] = fb_resp_data.link; 
      fb_data_json['caption'] = fb_resp_data.caption; 
      if(fb_resp_data.message){
        fb_data_json['message'] = fb_resp_data.message;
      }
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }else if(aw_api_ppm_stm_facebook_check_image_link(fb_resp_data.link)){
      fb_data_json['image'] = fb_resp_data.link; 
      fb_data_json['caption'] = fb_resp_data.caption; 
      if(fb_resp_data.message){
        fb_data_json['message'] = fb_resp_data.message;
      }
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }else{
      var fbid = aw_api_ppm_stm_facebook_check_fb_link_with_fbid(fb_resp_data);
      if(fbid.length){
        aw_api_process_facebook_links_with_fbid(stream_info, fbid, fb_resp_data);
      }else{
        fb_data_json['unresolved'] = fb_resp_data.link; 
        fb_data_json['description'] = fb_resp_data.description; 
        fb_data_json['caption'] = fb_resp_data.caption; 
        if(fb_resp_data.message){
          fb_data_json['message'] = fb_resp_data.message;
        }
        aw_api_facebook_render_post_data(stream_info, fb_data_json);
      }
    }

  }else{
    if(fb_resp_data.message){
      fb_data_json['message'] = fb_resp_data.message;
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }
  }
  
  
  

}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_make_srv_get_request(stream_info){
   var fb_url = 'https://graph.facebook.com/' + stream_info.post.source_msg_id +"?access_token="+ aw_api_ppm_facebook_get_signed_in_auth_token() + "&callback=?";
    $.getJSON(fb_url, function(fb_resp_data){
       if( !aw_api_ppm_stm_facebook_check_skip_processing(stream_info, fb_resp_data) ){
          aw_api_ppm_stm_facebook_process_fb_data(stream_info, fb_resp_data);
       }
    });

}
