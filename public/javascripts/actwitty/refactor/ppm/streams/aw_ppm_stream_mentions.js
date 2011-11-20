/**************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mentions_revise_counters(stream_info){
  var stream_main_box_id = aw_api_get_stream_id(stream_info);
  var total_number_of_mentions =  $('#' + stream_main_box_id).find('.js_activity_entity').length;
  $('#' + stream_main_box_id).find(".aw_js_ppm_stm_mentions_counter").html(total_number_of_mentions);
  if( total_number_of_mentions == 0){
    var mentions_image_ele = $('#' + stream_main_box_id).find(".aw_js_ppm_stm_mentions_action .aw_js_ppm_stm_action_image");
    mentions_image_ele.removeClass("aw_ppm_stm_dyn_action_mentions_on_img");
    mentions_image_ele.addClass("aw_ppm_stm_dyn_action_mentions_img");
  }

}
/***************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mentions_invalidate_text(stream_info){
    var stream_main_box_id = aw_api_get_stream_id(stream_info);
  /* Change text to response text from server */
    $("#" + stream_main_box_id).find(".aw_js_ppm_stm_stream_text").html('<p>' + stream_info.post.text + '</p>' );
}

/***************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_mentions_action(element){

  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  var check_class_exist =  $('#' + stream_main_box_id).find('.js_activity_entity').first().hasClass("js_activity_entity_highlighter");
  var mention_count = parseInt(element.find(".aw_js_ppm_stm_mentions_counter").html());
  if (!check_class_exist && mention_count != 0){
    $('#' + stream_main_box_id).find('.js_activity_entity').addClass("js_activity_entity_highlighter");
    if(stream_info.post.user.id == aw_lib_get_session_owner_id()){
      var html = '<span class="aw_js_ppm_stm_delete_mention">Remove Mention</span>';
      $('#' + stream_main_box_id).find('.js_activity_entity').append(html);
      element.find(".aw_js_ppm_stm_action_image").removeClass("aw_ppm_stm_dyn_action_mentions_img");
      element.find(".aw_js_ppm_stm_action_image").addClass("aw_ppm_stm_dyn_action_mentions_on_img");

    }
  }else{
    $('#' + stream_main_box_id).find('.js_activity_entity').removeClass("js_activity_entity_highlighter");
    $('#' + stream_main_box_id).find('.aw_js_ppm_stm_delete_mention').remove();
    element.find(".aw_js_ppm_stm_action_image").removeClass("aw_ppm_stm_dyn_action_mentions_on_img");
    element.find(".aw_js_ppm_stm_action_image").addClass("aw_ppm_stm_dyn_action_mentions_img");
  }
}
/***************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_delete_mention_from_a_stream(params){
  var stream_info = aw_awpi_serv_resp_data_for_post_request_in_params(params); 
  if( typeof stream_info != 'undefined' ){

    var stream_main_box_id = aw_api_get_stream_id(stream_info);

    /* Change text to response text from server */
    aw_api_ppm_stm_mentions_invalidate_text(stream_info);

    /* Re-enable highligher */
    $('#' + stream_main_box_id).find('.js_activity_entity').addClass("js_activity_entity_highlighter");
    var html = '<span class="aw_js_ppm_stm_delete_mention">Remove Mention</span>';
    $('#' + stream_main_box_id).find('.js_activity_entity').append(html);

    /* Re-Calculate the mention counter */
    aw_api_ppm_stm_modify_context_text_for_key(stream_main_box_id, stream_info.post.text );
    aw_api_ppm_stm_mentions_revise_counters(aw_api_ppm_get_stm_contex_for_key(stream_main_box_id));

  }
}

/***************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_delete_mention(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  var mention_id = element.closest(".js_activity_entity").attr('value');
  var params = {
                  'aw_srv_protocol_params' : {  
                                                post_id: stream_info.post.id, 
                                                entity_id: mention_id
                                            },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_MENTION',  params);
 }



