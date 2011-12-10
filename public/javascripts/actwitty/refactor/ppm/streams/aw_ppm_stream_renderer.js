
/*******************************************/
/*
 * This scope comes from channel page only
 *
 */
function aw_api_ppm_stm_get_page_scope(){
  /* 1 - personal, 2 - subscribed, 3 - all */
  var aw_scope = $("#aw_js_ppm_stm_scope").val();
  if ( aw_scope.length ){
      if( aw_scope == "s" ){
        return 2;
      }else if( aw_scope == "a" ){
        return 3;
      }else{
        return 1;
      }
  }else{
    return 1;
  }
}
/******************************************/
/*  
 * Time line state Video/Image/Posts
 *
 */
var aw_local_ppm_stream_timeline_state = "aw_js_ppm_stm_posts_mode";
/******************************************/
/* 
 *
 *
 */
function aw_api_ppm_stream_get_timeline_state(){
  return aw_local_ppm_stream_timeline_state;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stream_set_timeline_state(new_state){
  if( new_state != aw_local_ppm_stream_timeline_state){
      aw_local_ppm_stream_timeline_state = new_state;
      return 1;
  }
  return 0;
}
/*****************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_set_stream_page_bkg(){
  //TODO: Fix me
  var bkg_image = aw_lib_get_default_stream_theme_for_category('unknown');
  $(".aw_js_ppm_stm_theme_bkg").css('background-image', 'url(' + bkg_image + ')');
}

/******************************************/
/* Timeline state change event
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_stm_timeline_state_change(element){
  
  var state_changed = aw_api_ppm_stream_set_timeline_state(element.val());
  
  if(state_changed){
    $("#aw_js_ppm_stm_videos_timeline_list").hide();
    $("#aw_js_ppm_stm_images_timeline_list").hide();
    $("#aw_js_ppm_stm_post_timeline_list").hide();

    if( aw_api_ppm_stream_get_timeline_state() == "aw_js_ppm_stm_videos_mode"){
      $("#aw_js_ppm_stm_videos_timeline_list").show();
      aw_api_ppm_stm_videos_request(1);
    }else if( aw_api_ppm_stream_get_timeline_state() == "aw_js_ppm_stm_images_mode"){
      aw_api_ppm_stm_images_request(1);
      $("#aw_js_ppm_stm_images_timeline_list").show();
    }else{
      /* initialize whole streams page again */
      aw_api_ppm_stm_request_streams(1);
      $("#aw_js_ppm_stm_post_timeline_list").show();
    }
  }
}



/******************************************/
/* Handle click of more button
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_more_click(element){
  if(aw_api_ppm_stream_get_timeline_state() == 'aw_js_ppm_stm_posts_mode'){
    aw_api_ppm_stm_request_streams(); 
  }else if( aw_api_ppm_stream_get_timeline_state() == 'aw_js_ppm_stm_videos_mode'){
    aw_api_ppm_stm_videos_request();
  }else if ( aw_api_ppm_stream_get_timeline_state() == 'aw_js_ppm_stm_images_mode'){
    aw_api_ppm_stm_images_request();
  }
}
/******************************************/
/*
 * filter change handling
 *
 */
function aw_api_ppm_stm_main_handle_filter_change(){
  aw_api_ppm_stm_apply_filter_to_view();
  if( aw_api_ppm_stream_get_timeline_state() == 'aw_js_ppm_stm_videos_mode'){
    aw_api_ppm_stm_videos_request(1);
  }else if ( aw_api_ppm_stream_get_timeline_state() == 'aw_js_ppm_stm_images_mode'){
    aw_api_ppm_stm_images_request(1);
  }else{
    aw_api_ppm_stm_request_streams(1); 
  }

  aw_api_ppm_stm_request_mentions(1);
  aw_api_ppm_stm_request_locations(1);
  aw_api_ppm_stm_request_similar_ppl(1);
  if(aw_api_ppm_stm_get_chn_filter_id()){
    aw_api_ppm_stm_chart_render_filtered_charts();
  }else{
    aw_api_ppm_stm_chart_generate_sources_distribution_chart();
  }

}
/******************************************/
/* Always init the Post mode
 *
 *
 */
function aw_internal_ppm_stm_srv_requests_on_init(){
  aw_api_ppm_stm_apply_filter_to_view();
  aw_api_ppm_stm_request_streams(1);
  aw_api_ppm_stm_request_mentions(1);
  aw_api_ppm_stm_request_locations(1);
  aw_api_ppm_stm_request_similar_ppl(1);
  aw_api_ppm_stm_set_stream_page_bkg();  

  if(aw_api_ppm_stm_get_chn_filter_id()){
    aw_api_ppm_stm_chart_render_filtered_charts();
  }else{
    aw_api_ppm_stm_chart_generate_sources_distribution_chart();
  }
}
/******************************************/
/* Main initializer function
 *
 *
 */
function aw_api_ppm_initialize_stm_page(){
  aw_api_ppm_input_initialize_auto_suggest();
  aw_internal_ppm_stm_srv_requests_on_init();
}
