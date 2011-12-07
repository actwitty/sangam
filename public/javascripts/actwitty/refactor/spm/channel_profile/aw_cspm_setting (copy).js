
/*
 * jS file to take care of channel settings page related queries.
 *
 * awcspm_js_channel_settings_list_box : This is the main js related id for the left side of 
 *                                       channel settings page. 
 *                                       All channel lists(html) should be updated on this id
 *
 * /





/*************************************************************/
/*
 *
 *
 */
//function aw_get_user_channel_html(channel_info){
/*
function aw_get_channel_lists_settings_html(channel_info){
  var default_theme = aw_lib_get_default_channel_theme_for_category(channel_info.category_data); 
  var channel_theme = default_theme.thumb;
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = aw_lib_get_channel_box_id(channel_info);

  aw_api_ppm_add_channel_context(box_id, channel_info);

  var channel_info_html = "";
  // build the channel analytic summary info, which will be displayed when hovered over channel icon
  var channel_dyn_analytic_info_html = aw_ppm_channel_dyn_analytic_info_build(channel_info);

  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
     channel_info_html = '<div class="aw_ppm_dyn_users_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            // channel dynamic summary info append
                            '<div class="aw_ppm_dyn_users_chn_info_hover_box">'+
                                channel_dyn_analytic_info_html +     
                            '</div>'+
                            '<div class="aw_ppm_dyn_users_chn_label_own_page">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                          '</div>';
  }else{
     var subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/subscribe.png';
     var subscription_tooltip = 'Click to subscribe to this channel.';
     if ( channel_info.subscribed && channel_info.subscribed == true ){
        subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/unsubscribe.png';
        subscription_tooltip = 'You are already subscribed to this channel. Click to unsubscribe.';
     }
     channel_info_html =  '<div class="aw_ppm_dyn_users_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            '<div class="aw_ppm_dyn_users_chn_info_hover_box">' +
                                //TODO: Add the hover here
                            '</div>' +
                            '<div class="aw_ppm_dyn_users_own_chn_label_others_page">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_user_chn_subscription_action_box aw_js_ppm_subscribe_action" style="background:url(' + subscription_action_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center" >' +
                              '<span>' + subscription_tooltip +  '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_user_chn_user_info_box">' +
                                  '<img src="' + channel_info.user.photo +  '">' +
                                  '<span>' + channel_info.user.full_name +  '</span>' +
                            '</div>' +
                          '</div>';
  }

  return channel_info_html;
}

*/





/*
 *
 *
 *  Function to display the list of user summaries on the left side of the panel
 *
 *  General layout for this is
 *  .awcspm_profile_data_info_header
      .awcspm_profile_channel_labels
        %span Food
      .awcspm_profile_data_info
 *
 *
 */

function aw_get_channel_lists_settings_html(channel_info){
  var default_theme = aw_lib_get_default_channel_theme_for_category(channel_info.category_data); 
  var channel_theme = default_theme.thumb;
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = ;

  aw_api_ppm_add_channel_context(box_id, channel_info);

  var channel_info_html = "";
  var channel_info_html1 = "";


  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){

     channel_info_html = '<div class="awcspm_profile_data_info_header"  id="' + box_id + '" >' +
                            '<div class="awcspm_profile_channel_labels">'+
                            '<span>' + channel_info.word.name + '</span>' +
                         '</div>';

     channel_info_html1 = '<div class="aw_ppm_dyn_users_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            // channel dynamic summary info append
                            '<div class="aw_ppm_dyn_users_chn_info_hover_box">'+
                                channel_dyn_analytic_info_html +     
                            '</div>'+
                            '<div class="aw_ppm_dyn_users_chn_label_own_page">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                          '</div>';
  }

  return channel_info_html;
}














/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_cspm_chn_render_user_channels(params){
  //var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS');
  var data = aw_api_srv_get_data_for_request('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#awcspm_js_channel_settings_list_box').html('');
  }
  while ( data.length > 8 ){
    data.pop();
  }
  $.each(data, function(i, channel_info){
    if( i==0 && !channel_info.word){
      $('#awcspm_js_channel_settings_list_box').html("No channels created so far.");
      return;
    }
    //var html = aw_get_user_channel_html(channel_info);
    var html = aw_get_channel_lists_settings_html(channel_info);
    
   //aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_USER_CHANNELS', channel_info.time);
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST', channel_info.time);
    $('#awcspm_js_channel_settings_list_box').append(html);

  });
  
  /* UNDO : dont know if it is needed */
  //$("abbr.aw_js_chn_timeago").timeago();
  /* enable the more button */
  //$("#aw_js_ppm_user_chn_data_more").attr("disabled", false);
  //$('#aw_js_ppm_user_channel_data').find(".aw_js_ppm_loading_animation").hide();
  
}





/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_cspm_chn_setting_request_user_channels(on_init){
  /* disable the more button */
 

  alert("I am in channel settings instansiation");
  // UNDO:SAMARTH
  //$("#aw_js_ppm_user_chn_data_more").attr("disabled", true);
  //$('#aw_js_ppm_user_channel_data').find(".aw_js_ppm_loading_animation").show();
  
  
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  // UNDO:SAMARTH
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
    //aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_USER_CHANNELS', '');
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST', '');
  }

  
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        //updated_at: aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_CHN_GET_USER_CHANNELS'), 
                        updated_at: aw_api_ppm_cmn_more_cookie_get('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST'), 
                        page_type: 1,
                        cache_cookie:aw_lib_get_cache_cookie_id()
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  //aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS', params);
  aw_api_srv_make_a_get_request('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST', params);
}
/*************************************************************/


