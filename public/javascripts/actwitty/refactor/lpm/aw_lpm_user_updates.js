
var g_aw_lpm_local_stored_latest_updates = {};

function aw_get_update_block_html(channel_info){

  var channel_theme = aw_lib_get_channel_theme_thumb(channel_info);
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = aw_lib_get_channel_box_id(channel_info);
  var channel_info_html = '<div class="aw_lpm_dyn_latest_update_chn_box" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            '<div class="aw_lpm_dyn_latest_update_chn_label">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                            '<div class="aw_lpm_dyn_latest_update_chn_user_info_box">' +
                                  '<img src="' + channel_info.user.photo +  '">' +
                                  '<span>' + channel_info.user.full_name +  '</span>' +
                            '</div>' +
                          '</div>';
  return channel_info_html;
}



function aw_api_srv_resp_lpm_render_latest_channels(params){
  g_aw_lpm_local_stored_latest_updates = aw_api_srv_get_data_for_request('AW_SRV_LPM_GET_LATEST_CHANNELS');
  var i=1;
  $.each(g_aw_lpm_local_stored_latest_updates, function(i, channel_info){
    i++;
    /* show maximum of 10 */
    if (i > 10)
      return;
    var html = aw_get_update_block_html(channel_info);
    $('#awlpm_js_user_updates').append(html);

  });
}

function aw_api_lpm_initialize_landing_page(){
  var params = {
                  'aw_srv_protocol_params' : {},
                  'aw_srv_protocol_cookie' : {}
               };
  aw_api_srv_make_a_get_request('AW_SRV_LPM_GET_LATEST_CHANNELS',  params);
}




