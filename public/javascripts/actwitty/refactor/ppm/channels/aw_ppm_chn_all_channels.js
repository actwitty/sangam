/*************************************************************/
/*
 *
 *
 */
function aw_get_all_channel_html(channel_info){
  var default_theme = aw_lib_get_default_channel_theme_for_category(channel_info.category.name); 
  var channel_theme = default_theme.thumb;
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = aw_lib_get_channel_box_id(channel_info);
  aw_api_ppm_add_channel_context(box_id, channel_info);
  
  var subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/subscribe.png';
  var subscription_tooltip = 'Click to subscribe to this channel.';
  if ( channel_info.subscribed && channel_info.subscribed == true ){
    subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/unsubscribe.png';
    subscription_tooltip = 'You are already subscribed to this channel. Click to unsubscribe.';
  }

  var channel_info_html = '<div class="aw_ppm_dyn_all_chn_box aw_js_ppm_channel_box_backtracker" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            '<div class="aw_ppm_dyn_all_chn_info_hover_box">' +
                              //TODO: Add the hover here
                            '</div>' +
                            '<div class="aw_ppm_dyn_all_chn_label">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_all_chn_subscription_action_box aw_js_ppm_subscribe_action" style="background:url(' + subscription_action_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center" >' +
                               '<span>' + subscription_tooltip +  '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_all_chn_user_info_box">' +
                                  '<img src="' + channel_info.user.photo +  '">' +
                                  '<span>' + channel_info.user.full_name +  '</span>' +
                            '</div>' +
                          '</div>';
  return channel_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_all_channels(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_CHANNELS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_all_chn_container').html('');
  }
  while ( data.length > 8 ){
    data.pop();
  }
  $.each(data, function(i, channel_info){
    if( aw_lib_get_page_owner_id() != channel_info.user.id ) {
      if ( channel_info.subscribed && channel_info.subscribed == true ){
        /* skip */
      }else{
        var html = aw_get_all_channel_html(channel_info);
        $('#aw_js_ppm_all_chn_container').append(html);
      }

    }
  });
  /* enable the more button */
  $("#aw_js_ppm_all_chn_data_more").attr("disabled", false);
    $('#aw_js_ppm_all_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_all_channels(on_init){
  /* disable the more button */
  $("#aw_js_ppm_all_chn_data_more").attr("disabled", true);
  $('#aw_js_ppm_all_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init != 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
  }
  var time_cookie = '';
  var existing_data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_CHANNELS');
  if( existing_data.length){
    time_cookie = existing_data[existing_data.length - 1].time;
  }
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        updated_at: time_cookie, 
                        page_type: 3,
                        cache_cookie:aw_lib_get_cache_cookie_id()
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_CHANNELS', params);
}
/*************************************************************/
