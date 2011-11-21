/******************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_comments_revise_counters(stream_info){
  var stream_main_box_id = aw_api_get_stream_id(stream_info);
  var comment_count = 0;
  if(stream_info.comments &&  stream_info.comments.count){
    comment_count = stream_info.comments.count;
  }
  $('#' + stream_main_box_id).find(".aw_js_ppm_stm_comments_counter").html(comment_count);
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_get_comment_li_id(comment){
  return 'aw_js_ppm_stm_cmt_box_' + comment.id;
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_comment_get_initial_html(){
  var html = '<div class="aw_ppm_stm_dyn_comment_main_box aw_js_ppm_stm_comments_container " >' +
                '<div class="aw_ppm_stm_dyn_comment_header_box" >' +
                  '<span>Comments</span>' +
                '</div>' +
                '<div class="aw_ppm_stm_dyn_comments_list_container" >'+
                  '<ul class="aw_js_ppm_stm_comments_lister" >' +
                  '</ul>' +
                  '<div class="aw_ppm_stm_dyn_comment_new_section" >' +
                      '<textarea class="aw_ppm_stm_dyn_comment_new_input aw_js_ppm_stm_comments_input" />' +
                      '<input type="button" class="button_actwitty gray aw_ppm_stm_dyn_comment_submit aw_js_ppm_stm_add_comment" value="Post Comment">  </input>' +
                  '</div>' +
                '</div>' +
             '</div>';
  return html;
}

/*******************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_comments_show_all(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  
  var comments_container = $("#" + stream_main_box_id).find(".aw_js_ppm_stm_comments_container");
  var comments_img_box = $("#" + stream_main_box_id).find(".aw_js_ppm_stm_comments_action .aw_js_ppm_stm_action_image");
  if( comments_container.is(":visible")){
    comments_container.hide();
    comments_img_box.removeClass("aw_ppm_stm_dyn_action_comments_on_img");
    comments_img_box.addClass("aw_ppm_stm_dyn_action_comments_img");
  }else{
    aw_get_comments_retrieve_all(element);
    comments_container.show();
    comments_img_box.removeClass("aw_ppm_stm_dyn_action_comments_img");
    comments_img_box.addClass("aw_ppm_stm_dyn_action_comments_on_img");
  }

}
/*******************************************************/
/*
 *
 *
 */
function aw_get_comments_retrieve_all(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
 
  var params = {
                  'aw_srv_protocol_params' :{
                                                activity_id: stream_info.post.id,
                                                cache:aw_lib_get_cache_cookie_id()
                                            },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id: stream_main_box_id
                                             }
               };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_STREAM_COMMENTS',  params);
}
/*******************************************************/
/*
 *
 *
 */
function aw_get_single_comment_li( comment ){
  var session_owner_id = aw_lib_get_session_owner_id();
  var close_html = '' ;
  if( session_owner_id == comment.user.id ){
    close_html = '<span class="aw_ppm_stm_dyn_comment_delete aw_js_ppm_stm_delete_comment">X</span>' +
                  '<input type="hidden" class="aw_js_ppm_comment_id" value="' + comment.id + '" />';
  }
  var single_html = '<li class="aw_js_ppm_stm_comment_li" id="' + aw_api_get_comment_li_id(comment)  + '" >' +
                      '<div class="aw_ppm_stm_dyn_comment_container" >' +
                        close_html +
                        '<div class="aw_ppm_stm_dyn_comment_info_section">' +
                          '<div class="aw_ppm_stm_dyn_user_pic_section">' +
                            '<a href="/home/show?id=' + comment.user.id + '">' +
                              '<img src="' + comment.user.photo+  '"/>' +
                            '</a>' +
                          '</div>' +

                          '<div class="aw_ppm_stm_dyn_comment_section" >' +
                            '<p class="aw_ppm_stm_dyn_comment_username" >' +
                              '<a>' +
                                  comment.user.full_name + ' : ' +
                              '</a>' +
                            '</p>' +
                          
                            '<p class="aw_ppm_stm_dyn_comment_text" >' +
                             comment.text + 
                            '</p>' + 
                          '</div>' +
                        '</div>' +
                        '<div class="aw_ppm_stm_dyn_comment_date_stamp">' +
                          '<span >' +
                            '<abbr class="aw_js_timeago" title="' + comment.time + '"></abbr>' +
                          '</span>' +
                        '</div>' +
                      '</div>' +
                    '</li>';
  return single_html;
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_stream_comments(params){
  var comments_data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  var comment_list_html = '';
  if( comments_data){
    $.each(comments_data, function(i,single_comment){
      var single_html = aw_get_single_comment_li(single_comment.comment);
      comment_list_html = comment_list_html + single_html;
    });

    comments_ul = $("#" + stream_main_box_id).find(".aw_js_ppm_stm_comments_lister");
    comments_ul.html(comment_list_html);
    $("abbr.aw_js_timeago").timeago();
  }
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_comments_add(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  
  var text_ele = $("#" + stream_main_box_id).find(".aw_js_ppm_stm_comments_input");
  var comment_text = text_ele.val();

  if( comment_text ){
    comment_text.trim();
  }

  if(comment_text.length == 0){
    return;
  }
  var params = {
                  'aw_srv_protocol_params' :{
                                                activity_id: stream_info.post.id,
                                                text:comment_text
                                            },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id: stream_main_box_id
                                             }
               };
  aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_CREATE_COMMENT',  params);
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_comment_add(params){
  var comment_resp  = aw_awpi_serv_resp_data_for_post_request_in_params(params);
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  var comment_html = aw_get_single_comment_li(comment_resp.comment);
  $("#" + stream_main_box_id).find(".aw_js_ppm_stm_comments_lister").append(comment_html);
  aw_api_ppm_stm_modify_comment_count(stream_main_box_id, 1);
  aw_api_ppm_stm_comments_revise_counters(stream_info);
  $("#" + stream_main_box_id).find(".aw_js_ppm_stm_comments_input").val('');
  $("abbr.aw_js_timeago").timeago();
  
}

/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_comment_delete(params){
  var comment_li = params['aw_srv_protocol_cookie']['comment_li'];
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  $("#" + comment_li).remove();
  aw_api_ppm_stm_modify_comment_count(stream_main_box_id, -1);
  aw_api_ppm_stm_comments_revise_counters(stream_info); 
 
}
 
/*******************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_comments_delete(element){
  var comment_li = element.closest(".aw_js_ppm_stm_comment_li");
  var comment_id = comment_li.find(".aw_js_ppm_comment_id").val();
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var params = {
                  'aw_srv_protocol_params' : {  
                                                'comment_id': comment_id 
                                            },
                  'aw_srv_protocol_cookie' : {
                                                'comment_li' : comment_li.attr('id'),
                                                'stream_box_id' : stream_main_box_id
                                             },
               };
  aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_COMMENT',  params);
}
