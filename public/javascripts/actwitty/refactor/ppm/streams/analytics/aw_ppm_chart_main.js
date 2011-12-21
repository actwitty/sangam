/*******************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_srv_make_summary_request(params){
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHART_GET_ANALYTICS_SUMMARY', params);
}
/*******************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_srv_make_full_request(params){
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHART_GET_ANALYTICS_FULL', params);
}

/*******************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chart_analytics_summary_cb(params){
  var cb_fn = params['aw_srv_protocol_cookie']['cb_fn'];
  cb_fn(params);
}


/*******************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chart_analytics_full_cb(params){
  var cb_fn = params['aw_srv_protocol_cookie']['cb_fn'];
  cb_fn(params);
}
