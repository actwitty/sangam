/**********************************************************/
/*
 *
 *
 */
function aw_get_singlepostid(){
  return $("#aw_js_ppm_singlepost_id").val();
}
/**********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_singlepost_render_user_details(stream_info){
  $(".aw_js_ppm_singlepost_user_link").attr("href", "/home/show?id=" + stream_info.post.user.id );
  $(".aw_js_ppm_singlepost_user_image").attr("src", stream_info.post.user.photo );
  $(".aw_js_ppm_singlepost_user_name").html( stream_info.post.user.full_name );
}
/**********************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_single(params){
  var data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 

  $.each(data, function(i, stream_info){
    aw_ppm_stm_singlepost_render_user_details(stream_info);
    var html = aw_api_get_stream_main_html(stream_info);
    $('#aw_js_ppm_stm_singlepost_list').append(html);
    aw_api_ppm_stm_attachments_enable_fancybox(stream_info);
    aw_api_ppm_add_stream_context(aw_api_get_stream_id(stream_info), stream_info);
    aw_initialize_actions_box_counters(stream_info);
    aw_api_ppm_stm_mention_enricher_register(stream_info);
  });
  $("abbr.aw_js_timeago").timeago();
    
  $('#aw_js_ppm_stm_stream_singlepost_div').find(".aw_js_ppm_loading_animation").hide();
  retrn;
}

/**********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_singlepost_get_stream(){
  $('#aw_js_ppm_stm_stream_singlepost_div').find(".aw_js_ppm_loading_animation").show();
  var params = {
                  'aw_srv_protocol_params' : {  
                                                id: aw_get_singlepostid()
                                            },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_SINGLEPOST_FETCH',  params);
  return;
}

/**********************************************************/
/*
 *
 *
 */
function aw_api_ppm_initialize_single_post_page(){
  aw_ppm_stm_singlepost_get_stream();
}
