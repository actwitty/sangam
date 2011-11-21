/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_resp_subscribe(params){
  aw_lib_console_log("debug","Subscribe response");
  
  var context_id = params['aw_srv_protocol_cookie'].context_id;
  var channel_info = aw_api_ppm_get_chn_contex_for_key(context_id);
  aw_api_ppm_remove_channel_context(context_id);
  channel_info['subscribed'] = true;
  aw_api_ppm_add_channel_context(context_id, channel_info);
  $("#" + context_id).remove();
   if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
     /* if its my page */
     var new_html = aw_get_subscribed_channel_html(channel_info);
     $('#aw_js_ppm_subscribed_chn_container').prepend(new_html);
   }else{
     var new_html = aw_get_user_channel_html(channel_info);
     $('#aw_js_ppm_user_chn_container').prepend(new_html);
   }
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_resp_unsubscribe(params){
  aw_lib_console_log("debug","Unsubscribe response"); 
  var context_id = params['aw_srv_protocol_cookie']['context_id'];
  var channel_info = aw_api_ppm_get_chn_contex_for_key(context_id);
  aw_api_ppm_remove_channel_context(context_id);
  channel_info['subscribed'] = false;
  aw_api_ppm_add_channel_context(context_id, channel_info);
  $("#" + context_id).remove();
  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
     /* if its my page */
     var new_html = aw_get_all_channel_html(channel_info);
     $('#aw_js_ppm_all_chn_container').prepend(new_html);
   }else{
     var new_html = aw_get_user_channel_html(channel_info);
     $('#aw_js_ppm_user_chn_container').prepend(new_html);
   }
}
/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){

  /* more click event handler start */
  $("#aw_js_ppm_user_chn_data_more").live('click', function(){
    aw_api_ppm_chn_request_user_channels(0);
    return false;
  });

  $("#aw_js_ppm_subscribed_chn_data_more").live('click', function(){
    aw_api_ppm_chn_request_subscribed_channels(0);
    return false;
  });

  $("#aw_js_ppm_subscriptions_data_more").live('click', function(){
  });

  $("#aw_js_ppm_mentions_data_more").live('click', function(){
    aw_api_ppm_chn_request_users_mentions(0);
    return false;
  });

  $("#aw_js_ppm_locations_data_more").live('click', function(){
    aw_api_ppm_chn_request_users_locations(0);
    return false;
  });

  $("#aw_js_ppm_all_chn_data_more").live('click', function(){
    aw_api_ppm_chn_request_all_channels(0);
    return false;
  });

  $(".aw_js_ppm_subscribe_action").live('click', function(){
    var channel_cntxt = aw_api_ppm_get_chn_context($(this));
    var params = {
                  'aw_srv_protocol_params' : {
                                                'summary_id': channel_cntxt.id
                                             },
                  'aw_srv_protocol_cookie' : {
                                               'context_id' :  aw_api_ppm_get_chn_context_id_for_ele($(this))
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_CMN_CREATE_POST', params); 

    if( channel_cntxt.subscribed && channel_cntxt.subscribed == true){
      /* Change subscribed to unsubscribed */
      aw_lib_console_log("debug","Unsubscribe requested"); 
      aw_api_srv_make_a_post_request('AW_SRV_PPM_CHN_UNSUBSCRIBE_CHANNEL', params); 
    }else{
      /* Change usubscribed to subscribed */
      aw_lib_console_log("debug","Subscribe requested"); 
      aw_api_srv_make_a_post_request('AW_SRV_PPM_CHN_SUBSCRIBE_CHANNEL', params); 
    }
     
    return false;

  });


  $(".aw_js_ppm_chn_mentions").live('click', function(){
    var mention_id = $(this).find(".aw_js_ppm_chn_mention_id").val();
    var mention_name = $(this).find(".aw_js_ppm_chn_mention_name").html();
    window.location.href = '/home/streams?id=' + aw_lib_get_page_owner_id() + '&m_id=' +  mention_id + "&m_name=" + mention_name;
  });

  $(".aw_js_ppm_chn_locations").live('click', function(){
    var location_id = $(this).find(".aw_js_ppm_chn_location_id").val();
    var location_name = $(this).find(".aw_js_ppm_chn_location_name").html();
    window.location.href = '/home/streams?id=' + aw_lib_get_page_owner_id() + '&l_id=' +  location_id + "&l_name=" + location_name;
  });

  $(".aw_js_ppm_chn_locations").live('click', function(){
    var location_id = $(this).find(".aw_js_ppm_chn_location_id").val();
    var location_name = $(this).find(".aw_js_ppm_chn_location_name").html();
    window.location.href = '/home/streams?id=' + aw_lib_get_page_owner_id() + '&l_id=' +  location_id + "&l_name=" + location_name;
  });

  $(".aw_js_ppm_channel_box_filter_setter").live('click', function(){
    var channel_info = aw_api_ppm_get_chn_contex_for_key($(this).attr('id'));
    var channel_name = channel_info.word.name;
    var channel_id = channel_info.word.id;
    var user_id = channel_info.user.id;
    window.location.href = '/home/streams?id=' + user_id + '&c_id=' +  channel_id + "&c_name=" + channel_name; 
    
  });
  /* more click event handler end */
  
});
