

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_likes_revise_counters(stream_info){
  var campaigns = stream_info.campaigns;
  var user_likes = false;
  var like_count = 0;
   $.each(campaigns, function(i,campaign){
    if( campaign.name == "like" ){
       if(campaign.user && campaign.user != false){
         user_likes = campaign.user;
       }
       like_count = campaign.count;
    } 
  }); 
  var stream_main_box_id = aw_api_get_stream_id(stream_info);
  $('#' + stream_main_box_id).find(".aw_js_ppm_stm_likes_counter").html(like_count);
  var like_action_img_element = $('#' + stream_main_box_id).find(".aw_js_ppm_stm_like_action .aw_js_ppm_stm_action_image");
  if( user_likes == true){
    like_action_img_element.removeClass("aw_ppm_stm_dyn_action_likes_img");
   like_action_img_element.addClass("aw_ppm_stm_dyn_action_likes_on_img");    
  }else{
    like_action_img_element.removeClass("aw_ppm_stm_dyn_action_likes_on_img");
    like_action_img_element.addClass("aw_ppm_stm_dyn_action_likes_img");
      
  }

  if( like_count > 0 ){
    var html = '<span class="aw_js_ppm_stm_show_all_likes" > Show All </span>' +
                '<div class="aw_js_ppm_stm_modal_invoker aw_js_ppm_stm_aw_modal_manager_stream_likes">'+
                '</div>';
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_like_action").prepend(html);
  }else{
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_like_action .aw_js_ppm_stm_show_all_likes").remove();
  }
}
/*********************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_like(params){
  
  var campaign_info      = aw_awpi_serv_resp_data_for_post_request_in_params(params);
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  if( typeof campaign_info != 'undefined' ){
    
    aw_api_ppm_stm_modify_likes(stream_main_box_id, true, campaign_info.count);  
    aw_api_ppm_stm_likes_revise_counters(stream_info);
  }

}

/*********************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_unlike(params){
  var campaign_info      = aw_awpi_serv_resp_data_for_post_request_in_params(params);
  
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  if( typeof campaign_info != 'undefined' ){
    aw_api_ppm_stm_modify_likes(stream_main_box_id, false, campaign_info.count);  
    aw_api_ppm_stm_likes_revise_counters(stream_info);
  }

}

/*********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_like_action(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);

  var campaigns = stream_info.campaigns;
  var user_likes = false;
  var like_count = 0;
   
   $.each(campaigns, function(i,campaign){
    if( campaign.name == "like" ){
       if(campaign.user ){
         user_likes = campaign.user;
       }
    } 
  });
  if(user_likes){
    /* like to dislike */
    var params = {
                  'aw_srv_protocol_params' :  { 
                                                name: 'like', 
                                                activity_id: stream_info.post.id
                                              },
                  'aw_srv_protocol_cookie' : {
                                                'stream_box_id': stream_main_box_id 
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_LIKE',  params);
    
  }else{
    /* dislike to like */
    var params = {
                  'aw_srv_protocol_params' :  { 
                                                name: 'like', 
                                                value: 1, 
                                                activity_id: stream_info.post.id
                                              },
                  'aw_srv_protocol_cookie' : {
                                                'stream_box_id': stream_main_box_id 
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_CREATE_LIKE',  params);
  }


         
}
/********************************************************************************/
/*
 * Handling all likes
 *
 */
function aw_api_ppm_stm_evt_hndl_show_like(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
        
  var params = {
                  'aw_srv_protocol_params' : { 
                                                name:"like", 
                                                activity_id: stream_info.post.id,
                                                cache:aw_lib_get_cache_cookie_id()
                                            },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id : stream_main_box_id
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_STREAM_LIKES',  params);
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_stream_likes(params){
  var likes_arr = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];

  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_stream_likes", likes_arr);
  $('#' + stream_main_box_id).find(".aw_js_ppm_stm_like_action .aw_js_ppm_stm_modal_invoker").first().trigger('click');
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_like_modal_renderer(win_id, triggerer){
  var likes_data = aw_api_ppm_stm_modal_get_data( "aw_js_ppm_stm_aw_modal_manager_stream_likes");
  var header_title = '';
  if (likes_data.length > 1){
    header_title = likes_data.length + " Persons like this post ";
  }else if(likes_data.length == 1){
    header_title = likes_data.length + " Person likes this post  ";
  }else{
    header_title = "No one so far likes this post. ";
  }
  var header_html = '<div class="awppm_stm_dyn_like_header_box" >' +
                      '<span class="awppm_stm_dyn_like_modal_label" >' +
                        header_title +
                      '</span>'+
                    '</div>';

  var data_html = "";
  $.each(likes_data, function(i, like){
      var single_html = '<div class="awppm_stm_dyn_like_user_infomation_box" >' +
                          '<div class="awppm_stm_dyn_user_img" >' +
                            '<a href="/home/show?id=' +  like.id + '">' +
                              '<img src="' + like.photo+  '"/>' +
                             '</a>' +
                          '</div>' +
                          '<div class="awppm_stm_dyn_user_name" >' +
                            '<a href="/home/show?id=' +  like.id + '">' +
                              '<span>' +
                                like.full_name +
                              '</span>' +
                            '</a>' +
                          '</div>' +
                          '<div class="awppm_stm_dyn_like_img" />' +
                        '</div>';
      data_html = data_html + single_html;

  });
  

  var html = header_html + data_html;
   $("#" + win_id).append(html);

  return true;
}
