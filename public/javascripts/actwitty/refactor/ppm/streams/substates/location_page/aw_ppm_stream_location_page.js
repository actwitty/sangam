/**********************************************************/
/*
 *
 *
 */
/**********************************************************/
/*
 *
 *
 */
function aw_get_location_id_requested(){
  return $("#aw_js_ppm_location_page_id").val();
}

/**********************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_location_page_stream_list(params){
  var data = aw_awpi_serv_resp_data_for_get_request_in_params(params);
  

 $("#aw_js_ppm_location_page_name").html(data.name);
 //$(".aw_js_ppm_location_page_theme_thumb").css("background-image", "url(" + data.image + "?width=200)");
 $("#aw_js_ppm_stm_location_page_main_label").html("All streams at " + data.name );
  $.each(data.stream, function(i, stream_info){
    if(stream_info.post){
      if(aw_api_ppm_stm_facebook_post_check(stream_info)){
        aw_api_ppm_stm_facebook_make_srv_get_request(stream_info);
      }
      var html = aw_api_get_stream_main_html(stream_info);
      $('#aw_js_ppm_stm_location_page_list').append(html);
      aw_api_ppm_stm_attachments_enable_fancybox(stream_info);
      aw_api_ppm_add_stream_context(aw_api_get_stream_id(stream_info), stream_info);

      aw_initialize_actions_box_counters(stream_info);
    
      aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_LOCATION_PG_STREAM_LIST', stream_info.post.time);
      /* send to enricher looker */
      aw_api_ppm_stm_mention_enricher_register(stream_info);
    }
  });
  $("abbr.aw_js_timeago").timeago();
  /* tell enricher to keep working from now */
  aw_api_ppm_stm_mention_enricher_init();
  $('#aw_js_ppm_stm_stream_location_page_div').find(".aw_js_ppm_loading_animation").hide();
}

/**********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_single_location_get_stream(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }

  if( on_init ){
    aw_api_ppm_stream_context_reinit();
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_LOCATION_PG_STREAM_LIST', '');
    /* erase the timeline */
    $("#aw_js_ppm_stm_location_page_list").html('');
  }
  $('#aw_js_ppm_stm_stream_location_page_div').find(".aw_js_ppm_loading_animation").show();
  var params = {
                  'aw_srv_protocol_params' : {  
                                                id: aw_get_location_id_requested(),
                                                updated_at : aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_STM_LOCATION_PG_STREAM_LIST'),
                                                cache_cookie: aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_LOCATION_PG_STREAM_LIST',  params);
  return;
}
/**********************************************************/
/*
 *
 *
 */
function aw_api_ppm_initialize_single_location_page(){
  aw_ppm_stm_single_location_get_stream(1);
}
/**********************************************************/
/*
 *
 *
 */
$(document).ready(function(){
  $("#aw_js_ppm_stm_location_page_data_more").click(function(){
    aw_ppm_stm_single_location_get_stream(0);
  });
});
