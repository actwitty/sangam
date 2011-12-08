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
function aw_api_ppm_stm_update_channel_name_id(key, channel_name, channel_id){
  aw_local_ppm_stream_context_manager[key].post.word.id = channel_id;
  aw_local_ppm_stream_context_manager[key].post.word.name = channel_name;
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
                  '<a href="/location_page?id=' + stream_info.location.id + '">' +
                    '<img src="/images/actwitty/refactor/aw_ppm/stream/at.png" width="10"/>' + 
                    '<span>' + stream_info.location.name  + 
                      '<span>' +
                          'click here to see all posts made at this location' +
                      '</span>' +
                    '</span>' +
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
                  '<span> Click here to highlight key terms mentioned in post. </span>' +
                '</div>' +

                '<div class="aw_ppm_stm_dyn_action_likes aw_js_ppm_stm_like_action">' +
                  '<div class="aw_ppm_stm_dyn_action_likes_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_likes_count aw_js_ppm_stm_likes_counter">0</div>' +
                '</div>' +
                
                '<div class="aw_ppm_stm_dyn_action_shares aw_js_ppm_stm_shares_action">' +
                  '<div class="aw_ppm_stm_dyn_action_shares_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_shares_count aw_js_ppm_stm_shares_counter">0</div>' +
                  '<span> Share this post on twitter or facebook. </span>' +
                '</div>' +
                
                '<div class="aw_ppm_stm_dyn_action_comments aw_js_ppm_stm_comments_action">' +
                  '<div class="aw_ppm_stm_dyn_action_comments_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_comments_count aw_js_ppm_stm_comments_counter">0</div>' +
                  '<span> Click to see comments or add comments. </span>' +
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
  var delete_html = '';
  var chn_rename_html = '';
  var src_html = '';
  var session_owner_id = aw_lib_get_session_owner_id();
  if( session_owner_id == stream_info.post.user.id ){
    delete_html =  '<span class="aw_ppm_dyn_stm_stream_delete aw_js_ppm_stm_delete_post">X</span>';
    chn_rename_html = '<div class="aw_ppm_dyn_stm_stream_rename_channel aw_js_ppm_rename_channel aw_js_ppm_stm_modal_invoker aw_js_ppm_stm_aw_modal_manager_stream_chn_name_change">' +
                        '<span> click here to change channel of this post.</span>' +
                      '</div>';
  }


  var content_html = '';
  if(aw_api_ppm_stm_facebook_post_check(stream_info)){
    content_html = '<div class="aw_ppm_dyn_stm_stream_post_fb_data aw_js_ppm_stm_fb_content_box" />' +
                   '</div>';
    src_html = '<div class="aw_ppm_dyn_stm_stream_img_source">' +
                '<img src="/images/actwitty/refactor/aw_ppm/stream/facebook_src.png" />' +
                '<span> This post has been originated at Facebook </span>' +
               '</div>';
  }else{
    content_html = '<div class="aw_ppm_dyn_stm_stream_post_text aw_js_ppm_stm_stream_text">' +
                      '<p>' + stream_info.post.text + '</p> ' +
                    '</div>';
    src_html = '<div class="aw_ppm_dyn_stm_stream_img_source">' +
                '<img src="/images/actwitty/refactor/aw_ppm/stream/actwitty_src.png" />' +
                '<span> This post has been originated at ActWitty </span>' +
               '</div>';
  }

  var html = '<li class="aw_ppm_dyn_stm_stream_li_box aw_js_ppm_stream_box_backtracker" id="' + aw_api_get_stream_id(stream_info) + '" >' +
                '<div class="aw_ppm_dyn_stm_stream_div_box" >' +
                    delete_html +
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

                        src_html +
                        chn_rename_html +

                        '<a class="aw_ppm_dyn_stm_stream_post_chn_name" href="/channel_page?id=' + stream_info.post.word.id + ' ">' +
                          '<span class="aw_js_ppm_stm_chn_name">' + 
                            stream_info.post.word.name  + 
                            '<span>Click to see all posts made globally under this channel</span>' +
                          '</span>' + 

                        '</a>' +
                    '</div>' +
                    /* check and add title */
                    aw_get_stream_title_html(stream_info) +
                    aw_get_stream_location_html(stream_info) +

                    content_html +

                    aw_ppm_stm_attachments_get_images_html(stream_info) +
                    aw_ppm_stm_attachments_get_videos_html(stream_info) +
                    aw_get_actions_box_html(stream_info) +
                    aw_api_ppm_stm_shares_get_html_box_html(stream_info) +
                    aw_api_ppm_stm_comment_get_initial_html() +
                '</div>' +
             '</li>';
  return html;
  
}
/************************************************************/
function aw_api_srv_add_new_stream(stream_info){
  var html = aw_api_get_stream_main_html(stream_info);
  

  $('#aw_js_ppm_stm_post_timeline_list').prepend(html);
  aw_api_ppm_stm_attachments_enable_fancybox(stream_info);
  aw_api_ppm_add_stream_context(aw_api_get_stream_id(stream_info), stream_info);
  aw_initialize_actions_box_counters(stream_info);

  /* send to enricher looker */
  aw_api_ppm_stm_mention_enricher_register(stream_info);
  $("abbr.aw_js_timeago").timeago();
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_streams(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_STREAMS');
  var cookie = params['aw_srv_protocol_cookie'];

  $.each(data.stream, function(i, stream_info){
    if(stream_info.post){
      if(aw_api_ppm_stm_facebook_post_check(stream_info)){
        aw_api_ppm_stm_facebook_make_srv_get_request(stream_info);
      }
      var html = aw_api_get_stream_main_html(stream_info);
      $('#aw_js_ppm_stm_post_timeline_list').append(html);
      aw_api_ppm_stm_attachments_enable_fancybox(stream_info);
      aw_api_ppm_add_stream_context(aw_api_get_stream_id(stream_info), stream_info);

      aw_initialize_actions_box_counters(stream_info);
    
      aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_STREAMS', stream_info.post.time);
      /* send to enricher looker */
      aw_api_ppm_stm_mention_enricher_register(stream_info);
    }
  });
  $("abbr.aw_js_timeago").timeago();
  /* tell enricher to keep working from now */
  aw_api_ppm_stm_mention_enricher_init();
  //TODO: fix this dirty hack
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
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init ){
    aw_api_ppm_stream_context_reinit();
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_STREAMS', '');
    /* erase the timeline */
    $("#aw_js_ppm_stm_post_timeline_list").html('');
  }
  $("#aw_js_ppm_stm_data_more").attr("disabled", true);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").show();
  var srv_params = {
                        user_id : aw_lib_get_page_owner_id(),
                        updated_at : aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_STM_GET_STREAMS'),
                        filter : aw_api_ppm_stm_get_filter(),
                        page_type:aw_api_ppm_stm_get_page_scope(),
                        cache_cookie:aw_lib_get_cache_cookie_id()
                   };

  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_STREAMS', params);
}

/**************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_post_delete(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);

  var params = {
                  'aw_srv_protocol_params' :{
                                                post_id: stream_info.post.id,
                                            },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id: stream_main_box_id
                                             }
               };
  aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_POST',  params);

}
/*****************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_post_delete(params){
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  $("#" + stream_main_box_id).remove();
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_main_jump_to_post_on_text_click(element){
  var stream_info = aw_api_ppm_get_stm_context(element);
  window.location.href = '/view?id=' + stream_info.post.id; 
}


