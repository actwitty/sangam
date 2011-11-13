/*************************************************************/
/*
 *
 *
 *
 */
function aw_get_mention_box_id(mention_info){
  return "aw_ppm_chn_mention_box_" + aw_lib_get_page_owner_id() + "_" + mention_info.id;
}

/*************************************************************/
/*
 *
 *
 */
function aw_get_user_mentions_html(mention_info){
  var box_id = aw_get_mention_box_id(mention_info);
  var mention_image = mention_info.image + "?maxWidth=80";
  var mention_info_html = '<div class="aw_ppm_dyn_chn_mentions_box" style="background:url(' + mention_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            '<input type="hidden" value="' + mention_info.id + '" />' +
                            '<div class="aw_ppm_dyn_chn_mention_label">' +
                                '<span>' + mention_info.name + '</span>' +
                            '</div>' +
                          '</div>';
  return mention_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_user_mentions(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_MENTIONS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_user_mention_container').html('');
    while ( data.length > 24 ){
      data.pop();
    }
  }
  $.each(data, function(i, mention_info){
    var html = aw_get_user_mentions_html(mention_info);
    $('#aw_js_ppm_user_mention_container').append(html);

  });
  /* enable the more button */
  $("#aw_js_ppm_mentions_data_more").attr("disabled", false);
  $('#aw_js_ppm_user_mentions_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_users_mentions(on_init){
  /* disable the more button */
  $("#aw_js_ppm_mentions_data_more").attr("disabled", true);
  $('#aw_js_ppm_user_mentions_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init != 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
  }
  var time_cookie = '';
  var existing_data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_MENTIONS');
  if( existing_data.length){
    time_cookie = existing_data[existing_data.length - 1].time;
  }

  var srv_params =   { 
                        user_id:   aw_lib_get_page_owner_id(), 
                        sort_order: 1,
                        cache_cookie: aw_lib_get_cache_cookie_id()
                      };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_MENTIONS', params);
}
/*************************************************************/
