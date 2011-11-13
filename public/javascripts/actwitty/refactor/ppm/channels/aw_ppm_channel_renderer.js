/******************************************/
/*
 *
 *
 */
var aw_local_ppm_channel_context_manager={};
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_add_channel_context(key, channel_info){
    aw_local_ppm_channel_context_manager[key] = channel_info;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_remove_channel_context(key){
  delete aw_local_ppm_channel_context_manager[key];
}

/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_chn_context_id_for_ele(element){
  var key = element.closest(".aw_js_ppm_channel_box_backtracker").attr('id');
  return key;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_chn_context(element){
  var key = element.closest(".aw_js_ppm_channel_box_backtracker").attr('id');
  return aw_local_ppm_channel_context_manager[key];
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_chn_contex_for_key(key){
  return aw_local_ppm_channel_context_manager[key];
}

/******************************************/
/*
 *
 *
 */
function aw_internal_ppm_chn_srv_requests_on_init(){
  
  aw_api_ppm_chn_request_user_channels(1);
  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
    aw_api_ppm_chn_request_subscribed_channels(1);
    aw_api_ppm_chn_request_all_channels(1);
  }
  aw_api_ppm_chn_request_users_mentions(1);
  aw_api_ppm_chn_request_users_locations(1);
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_initialize_chn_page(){
  aw_api_ppm_input_initialize_auto_suggest();
  aw_internal_ppm_chn_srv_requests_on_init();
}
