
/*******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_handle_filter_change(){
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_filter(){
  return { 
           word_id     : $("#aw_js_ppm_stm_filter_chn_id").attr("value"),
           entity_id   : $("#aw_js_ppm_stm_filter_mention_id").attr("value"),
           location_id : $("#aw_js_ppm_stm_filter_location_id").attr("value")
         }; 
}
/**********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_chn_filter_id(){
  return $("#aw_js_ppm_stm_filter_chn_id").attr("value");
}

