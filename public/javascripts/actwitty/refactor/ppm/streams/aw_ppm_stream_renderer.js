/*******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_view_mode_selector(){
}


/*******************************************/
/*
 *
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
/*******************************************/
/*
 * args: videos, images, streams
 *
 */
function aw_api_ppm_stm_flip_page_mode(mode){
  $(".awppm_stm_post_timeline_list").hide();
  if(mode == "videos"){
    $("#aw_js_ppm_stm_videos_timeline_list").show();
  }else if( mode == "images"){
    $("#aw_js_ppm_stm_images_timeline_list").show();
  }else{
    $("#aw_js_ppm_stm_post_timeline_list").show();
  }

}
/******************************************/
/*
 *
 *
 */
function aw_internal_ppm_stm_srv_requests_on_init(){
  aw_api_ppm_stm_request_streams(1);
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_initialize_stm_page(){
  aw_api_ppm_input_initialize_auto_suggest();
  aw_internal_ppm_stm_srv_requests_on_init();
}
