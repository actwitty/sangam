
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_user_channels(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS');
  alert(JSON.stringify(data));
}


/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_subscribed_channels(params){
}

/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_all_channels(params){
}


/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_all_channels(params){
}

/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_all_locations(params){
}


/*
 *
 *
 */
function aw_api_ppm_chn_initialize(){
}



/*
 *
 *
 */
function aw_internal_ppm_chn_srv_requests_on_init(){
  /******************************************/
  var params = {};
  var req_cookie = {};
  var time_cookie = '';
  var existing_data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS');
  if( existing_data.length){
    time_cookie = existing_data[existing_data.length - 1].time;
  }
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        updated_at: time_cookie, 
                        page_type: 1,
                        cache_cookie:aw_lib_get_cache_cookie_id()
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS', params);
  /******************************************/
  params = {};
  srv_params = {};
  req_cookie = {};
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS', params);
  /******************************************/
  params = {};
  srv_params = {};
  req_cookie = {};
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_CHANNELS', params);
  /******************************************/
  params = {};
  srv_params = {};
  req_cookie = {};
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_MENTIONS', params);
  /******************************************/
  params = {};
  srv_params = {};
  req_cookie = {};
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_LOCATIONS', params);
  /******************************************/
}


function aw_api_lpm_initialize_ppm_chn_page(){
  aw_api_ppm_input_initialize_auto_suggest();
  aw_internal_ppm_chn_srv_requests_on_init();
}
