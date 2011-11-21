/*************************************************************/
/*
 *
 *
 */
var aw_local_ppm_stm_mention_enricher_registry = {};
/*************************************************************/
/*
 *
 *
 */
function aw_get_mention_enriched_streams(post_ids_arr){
  

  var params = {
                  'aw_srv_protocol_params' :  {
                                                  "post_ids" : post_ids_arr
                                              },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CMN_GET_MENTION_ENRICHED_STREAMS',  params);
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_mention_enriched_streams(params){
  var streams_list = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  $.each(streams_list, function(i,stream_info){
    var stream_main_box_id = aw_api_get_stream_id(stream_info);
    if( stream_info.post.enriched == true ){
        aw_api_ppm_stm_mention_enricher_unregister(stream_info);
        aw_api_ppm_stm_modify_context_text_for_key(stream_main_box_id, stream_info.post.text);
        aw_api_ppm_stm_mentions_invalidate_text(stream_info);
        aw_api_ppm_stm_mentions_revise_counters(stream_info);
    }
  });
  setTimeout(aw_api_ppm_stm_mention_enricher_timer_callback , 60000);
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mention_enricher_timer_callback(){
  var post_ids_arr = [];
  var i = 0;
  for(var key in aw_local_ppm_stm_mention_enricher_registry) {
    post_ids_arr[i] = key;
    i++;
  }

  if(post_ids_arr.length == 0){
    setTimeout(aw_api_ppm_stm_mention_enricher_timer_callback , 60000);
  }else{
    aw_get_mention_enriched_streams(post_ids_arr);
  }
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mention_enricher_register(stream_info){
  if(  stream_info.post.enriched == false ){
    aw_local_ppm_stm_mention_enricher_registry[stream_info.post.id] = {a:1};
  }
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mention_enricher_unregister(stream_info){
  delete aw_local_ppm_stm_mention_enricher_registry[stream_info.post.id];
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mention_enricher_init(){
  setTimeout(aw_api_ppm_stm_mention_enricher_timer_callback , 60000);
}


