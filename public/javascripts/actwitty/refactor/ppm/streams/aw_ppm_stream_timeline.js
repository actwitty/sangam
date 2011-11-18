/******************************************/
/*
 *
 *
 */
var aw_local_ppm_stream_context_manager={};
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stream_context_reinit(){
  aw_local_ppm_stream_context_manager={};
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_add_stream_context(key, stream_info){
    aw_local_ppm_stream_context_manager[key] = stream_info;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_remove_stream_context(key){
  delete aw_local_ppm_stream_context_manager[key];
}

/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_stm_context_id_for_ele(element){
  var key = element.closest(".aw_js_ppm_stream_box_backtracker").attr('id');
  return key;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_stm_context(element){
  var key = element.closest(".aw_js_ppm_stream_box_backtracker").attr('id');
  return aw_local_ppm_stream_context_manager[key];
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_stm_contex_for_key(key){
  return aw_local_ppm_stream_context_manager[key];
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_modify_context_text_for_key(key, text){
  aw_local_ppm_stream_context_manager[key].post.text = text;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_modify_likes(key, user_state, like_count){
  if( aw_local_ppm_stream_context_manager[key]['campaigns']){
    delete aw_local_ppm_stream_context_manager[key]['campaigns'];
  }
  aw_local_ppm_stream_context_manager[key]['campaigns'] = [{
                                                              'name'  :'like',
                                                              'user' : user_state,
                                                              'count' : like_count
                                                           }];

}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_modify_shares(key, social_media_counters_arr){
  if( aw_local_ppm_stream_context_manager[key]['post']['social_counters']){
    delete aw_local_ppm_stream_context_manager[key]['post']['social_counters'];
  }
  aw_local_ppm_stream_context_manager[key]['post']['social_counters'] = social_media_counters_arr;

}

/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_modify_comment_count(key, comment_counter){
  var existing = aw_local_ppm_stream_context_manager[key]['comments']['count'];
  aw_local_ppm_stream_context_manager[key]['comments']['count'] = existing + comment_counter;
}
/*******************************************/
/*
 *
 *
 */
function aw_api_get_stream_id(stream_info){
  return 'aw_ppm_stm_stream_box_' + stream_info.post.id + '_' + stream_info.post.user.id;
}

/*************************************************************/
/*
 *
 *
 */
function aw_get_stream_title_html(stream_info){
  if( stream_info.post.sub_title && stream_info.post.sub_title.length){
    var html = '<div class="aw_ppm_dyn_stm_stream_post_title" >' +
                '<span>' + stream_info.post.sub_title + '</span>' +
               '</div>';

    return html;
  }
  return '';
}
/*************************************************************/
/*
 *
 *
 */
function aw_get_stream_location_html(stream_info){
  if( stream_info.location && stream_info.location.name && stream_info.location.name.length){
    var html = '<div class="aw_ppm_dyn_stm_stream_location_box">' +
                '<img src="/images/actwitty/refactor/aw_ppm/stream/at.png" width="10"/>' + 
                  '<span>' + stream_info.location.name  + '</span>' +
                '</div>';

    return html;
  }
  return '';
}
/************************************************************/
/*
 *
 *
 */
function aw_initialize_actions_box_counters(stream_info){
  aw_api_ppm_stm_shares_revise_counters(stream_info);
  aw_api_ppm_stm_likes_revise_counters(stream_info);
  aw_api_ppm_stm_comments_revise_counters(stream_info);
  aw_api_ppm_stm_mentions_revise_counters(stream_info);

}
/************************************************************/
/*
 *
 *
 */
function aw_get_actions_box_html(stream_info){
  var html =  '<div class="aw_ppm_stm_dyn_actions_box">'  +

                '<div class="aw_ppm_stm_dyn_action_mentions aw_js_ppm_stm_mentions_action">' +
                  '<div class="aw_ppm_stm_dyn_action_mentions_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_mentions_count aw_js_ppm_stm_mentions_counter">0</div>' +
                '</div>' +

                '<div class="aw_ppm_stm_dyn_action_likes aw_js_ppm_stm_like_action">' +
                  '<div class="aw_ppm_stm_dyn_action_likes_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_likes_count aw_js_ppm_stm_likes_counter">0</div>' +
                '</div>' +
                
                '<div class="aw_ppm_stm_dyn_action_shares aw_js_ppm_stm_shares_action">' +
                  '<div class="aw_ppm_stm_dyn_action_shares_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_shares_count aw_js_ppm_stm_shares_counter">0</div>' +
                '</div>' +
                
                '<div class="aw_ppm_stm_dyn_action_comments aw_js_ppm_stm_comments_action">' +
                  '<div class="aw_ppm_stm_dyn_action_comments_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_comments_count aw_js_ppm_stm_comments_counter">0</div>' +
                '</div>' +
              '</div>';
  return html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_get_stream_main_html(stream_info){
  var stream_li_id = aw_api_get_stream_id(stream_info); 
  var html = '<li class="aw_ppm_dyn_stm_stream_li_box aw_js_ppm_stream_box_backtracker" id="' + aw_api_get_stream_id(stream_info) + '" >' +
                '<div class="aw_ppm_dyn_stm_stream_div_box" >' +
                  '<span class="aw_ppm_dyn_stm_stream_delete">X</span>' +
                    '<div class="aw_ppm_dyn_stm_stream_post_info">' +
                      '<a class="aw_ppm_dyn_stm_stream_post_user_img" href="/home/show?id=' + stream_info.post.user.id + '" >' +
                        '<img src="' + stream_info.post.user.photo + '"/>' +
                      '</a>' +
                      '<a class="aw_ppm_dyn_stm_stream_post_user_name" href="/home/show?id=' + stream_info.post.user.id + '">' +
                         stream_info.post.user.full_name +
                      '</a>' +
                      '<span class="aw_ppm_dyn_stm_stream_post_time">' +
                        '<abbr class="aw_js_timeago" title="' + stream_info.post.time + '"></abbr>' +
                      '</span>' +

                        '<a class="aw_ppm_dyn_stm_stream_post_chn_name" href="#" ><span>' + stream_info.post.word.name  + '</span></a>' +
                    '</div>' +
                    /* check and add title */
                    aw_get_stream_title_html(stream_info) +
                    aw_get_stream_location_html(stream_info) +
                    '<div class="aw_ppm_dyn_stm_stream_post_text aw_js_ppm_stm_stream_text">' +
                      '<p>' + stream_info.post.text + '</p> ' +
                    '</div>' +
                    aw_ppm_stm_attachments_get_images_html(stream_info) +
                    aw_ppm_stm_attachments_get_videos_html(stream_info) +
                    aw_get_actions_box_html(stream_info) +
                    aw_api_ppm_stm_shares_get_html_box_html(stream_info) +
                    aw_api_ppm_stm_comment_get_initial_html() +
                '</div>' +
             '</li>';
  return html;
  
}


/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_streams(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_STREAMS');
  var cookie = params['aw_srv_protocol_cookie'];
  
  $.each(data, function(i, stream_info){
    var html = aw_api_get_stream_main_html(stream_info);
    $('#aw_js_ppm_stm_post_timeline_list').append(html);
    aw_api_ppm_stm_attachments_enable_fancybox(stream_info);
    aw_api_ppm_add_stream_context(aw_api_get_stream_id(stream_info), stream_info);

    aw_initialize_actions_box_counters(stream_info);
  });
  $("abbr.aw_js_timeago").timeago();
  /* enable the more button */
  $("#aw_js_ppm_stm_data_more").attr("disabled", false);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").hide();
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_streams(on_init){
  /* disable the more button */
  var params = {};
  var req_cookie = {};
  if( typeof on_init != 'undefined' ){
      on_init = 0;
  }

  var time_cookie = '';
  if( on_init ){
    aw_api_ppm_stm_flip_page_mode("streams");
    aw_api_ppm_stm_context_reinit();
  }else{
    var existing_data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_STREAMS');
    if( existing_data.length){
      time_cookie = existing_data[existing_data.length - 1].time;
    }
  }
  $("#aw_js_ppm_stm_data_more").attr("disabled", true);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").show();
  var srv_params = {
                        user_id : aw_lib_get_page_owner_id(),
                        updated_at : time_cookie,
                        filter : aw_api_ppm_stm_get_filter(),
                        page_type:aw_api_ppm_stm_get_page_scope(),
                        cache_cookie:aw_lib_get_cache_cookie_id()
                   };

  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_STREAMS', params);
}
