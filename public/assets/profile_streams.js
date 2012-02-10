
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
  aw_api_ppm_stm_set_stream_page_bkg();
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
/*
 *  Check for the initialization analytics
 */
function aw_ppm_local_stm_analytics_init()
{
  // we will not show analytics for subscribed/all view in streams page

  if (aw_api_ppm_stm_get_page_scope() == 1  ){
    $("#awppm_stm_analytics_container_box").show();
  } else {
    $("#awppm_stm_analytics_container_box").hide();
  }
}



/******************************************/
/* Main initializer function
 *
 *
 */
function aw_api_ppm_initialize_stm_page(){
  aw_api_ppm_input_initialize_auto_suggest();
  aw_api_ppm_stm_facebook_initialize_access_token(aw_internal_ppm_stm_srv_requests_on_init);
  aw_ppm_local_stm_analytics_init();
}

/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){

   $("#aw_js_ppm_stm_data_more").click(function(){
    aw_api_ppm_stm_evt_hndl_more_click($(this)); 
    return false;
  });

  $("#aw_js_ppm_stm_timeline_state_selector").live('change', function(){
    aw_api_ppm_stm_evt_hndl_stm_timeline_state_change($(this)); 
    return false;
  });

  $(".aw_js_ppm_stm_delete_post").live('click', function(){
      aw_api_ppm_stm_evt_hndl_post_delete($(this));
      return false;
  });

  $(".aw_js_ppm_stm_change_channel_of_post").live('click', function(){

    return false;
  });

  $(".aw_js_ppm_stm_submit_change_channel_of_post").live('click', function(){
  });

  $(".aw_js_ppm_stm_comments_action").live('click', function(){
    aw_api_ppm_stm_evt_hndl_comments_show_all($(this));
  });

  $(".aw_js_ppm_stm_add_comment").live('click', function(){
    aw_api_ppm_stm_evt_hndl_comments_add($(this));
  });

  $(".aw_js_ppm_stm_delete_comment").live('click', function(){
    aw_api_ppm_stm_evt_hndl_comments_delete($(this));
  });

  $(".aw_js_ppm_stm_images_view_all").live('click', function(){
    aw_api_ppm_stm_evt_hndl_view_all_images($(this));
    return false;
  });

  $(".aw_js_ppm_stm_delete_video").live('click', function(){
    aw_api_ppm_stm_evt_hndl_delete_videos($(this));
    return false;
  });

  $(".aw_js_ppm_stm_delete_image").live('click', function(){
    aw_api_ppm_stm_evt_hndl_delete_images($(this));
    return false;
  });

  $(".aw_js_ppm_stm_show_all_likes").live('click', function(event){
    aw_api_ppm_stm_evt_hndl_show_like($(this));
    return false;
    
  });

  $(".aw_js_ppm_stm_like_action").live('click', function(event){
    /* block show all propagation */
    if ( $(event.target).hasClass('aw_js_ppm_stm_like_action') ||
         $(event.target).hasClass('aw_js_ppm_stm_likes_counter') ||
         $(event.target).hasClass('aw_js_ppm_stm_action_image')){
        aw_api_ppm_stm_evt_hndl_like_action($(this));
    }
    return false;
  });

  $(".aw_js_ppm_stm_mentions_action").live('click', function(){
    aw_api_ppm_stm_evt_hndl_mentions_action($(this));
    return false;
  });

   $(".aw_js_ppm_stm_delete_mention").live('click', function(){
    aw_api_ppm_stm_evt_hndl_delete_mention($(this));
    return false;
  });

  $(".aw_js_ppm_stm_shares_action").live('click', function(){
    aw_api_ppm_stm_evt_hndl_shares_show_all($(this));
    return false;
  });

  $(".aw_js_ppm_stm_share_facebook_action").live('click', function(){
    aw_api_ppm_stm_evt_hndl_shares_facebook_share($(this));
    return false;
  });

  $(".aw_js_ppm_stm_share_twitter_action").live('click', function(){
    aw_api_ppm_stm_evt_hndl_shares_twitter_share($(this));
    return false;
  });

  $(".aw_js_ppm_stm_mention_filter_changer").live('click', function(){
    aw_api_ppm_stm_change_mention_filter($(this)); 
  });

  $(".aw_js_ppm_stm_location_filter_changer").live('click', function(){
    aw_api_ppm_stm_change_location_filter($(this)); 
  });

  $("#aw_js_ppm_stm_chn_filter_delete").click(function(){
    aw_api_ppm_stm_drop_channel_filter();
  });

  $("#aw_js_ppm_stm_mention_filter_delete").click(function(){
    aw_api_ppm_stm_drop_mention_filter();
  });

  $("#aw_js_ppm_stm_location_filter_delete").click(function(){
    aw_api_ppm_stm_drop_location_filter();
  });
  
  /* go to the post */
  $(".aw_js_ppm_stm_stream_text").live('click', function(){
    aw_api_ppm_stm_main_jump_to_post_on_text_click($(this));
    return false;
  });

  /* go to the facebook post */
  $(".aw_js_ppm_stm_fb_post_text").live('click', function(){
    aw_api_ppm_stm_facebook_jump_to_fb_link($(this));
    return false;
  });

  $(".aw_js_ppm_stm_chn_rename_submit").live('click', function(){
    aw_api_ppm_stm_chn_rename_submit_handler($(this));
    return false;
  });

  $(".js_activity_entity_highlighter").live('click', function(){
   window.location.href = "/mention_page?id=" + $(this).attr("value"); 
   return false;
  });
  
});

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
                /*
                '<div class="aw_ppm_stm_dyn_action_likes aw_js_ppm_stm_like_action">' +
                  '<div class="aw_ppm_stm_dyn_action_likes_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_likes_count aw_js_ppm_stm_likes_counter">0</div>' +
                '</div>' +
                */
                '<div class="aw_ppm_stm_dyn_action_shares aw_js_ppm_stm_shares_action">' +
                  '<div class="aw_ppm_stm_dyn_action_shares_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_shares_count aw_js_ppm_stm_shares_counter">0</div>' +
                  '<span> Share this post on twitter or facebook. </span>' +
                '</div>' ;
                /*
                '<div class="aw_ppm_stm_dyn_action_comments aw_js_ppm_stm_comments_action">' +
                  '<div class="aw_ppm_stm_dyn_action_comments_img aw_js_ppm_stm_action_image"></div>' +
                  '<div class="aw_ppm_stm_dyn_action_comments_count aw_js_ppm_stm_comments_counter">0</div>' +
                  '<span> Click to see comments or add comments. </span>' +
                '</div>' +
              '</div>';
              */
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
                    aw_ppm_stm_attachments_get_links_html(stream_info) +
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



/*******************************************/
/*
 *
 *
 */
function aw_api_get_video_id(video_info){
  return 'aw_ppm_stm_video_box_' + video_info.document.activity_id;
}

/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_videos_get_embedded_player_html( url, height, width){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '<p>no video url found - only vimeo and youtube supported</p>';
	}
	return output;
}



/*************************************************************/
/*
 *
 *
 */
function aw_ppm_stm_videos_append_html(video_info){
    var video_box_id = aw_api_get_video_id(video_info);
    if($("#" + video_box_id).length){
       $("#" + video_box_id).find(".aw_js_ppm_video_list").append(aw_ppm_stm_videos_get_embedded_player_html(video_info.document.url,
                                                                                                                323,
                                                                                                                430));
    }else{
      var html = '<li class="aw_ppm_dyn_stm_videos_li_box" id="' + video_box_id  + '" >' +
                  '<div class="aw_ppm_dyn_stm_videos_div_box" >' +
                      '<div class="aw_ppm_dyn_stm_videos_post_info">' +
                        '<a class="aw_ppm_dyn_stm_videos_post_user_img" href="/home/show?id=' + video_info.user.id + '" >' +
                          '<img src="' + video_info.user.photo + '"/>' +
                        '</a>' +
                        '<a class="aw_ppm_dyn_stm_videos_post_user_name" href="/home/show?id=' + video_info.user.id + '">' +
                           video_info.user.full_name +
                        '</a>' +
                        '<span class="aw_ppm_dyn_stm_videos_post_time">' +
                          '<abbr class="aw_js_timeago" title="' + video_info.time + '"></abbr>' +
                        '</span>' +

                          '<a class="aw_ppm_dyn_stm_stream_videos_chn_name" href="#" ><span>' + video_info.word.name  + '</span></a>' +
                      '</div>' +
                      /* check and add title */
                      '<div class="aw_ppm_dyn_stm_videos_list_per_post aw_js_ppm_video_list" >' +
                        aw_ppm_stm_videos_get_embedded_player_html(video_info.document.url,
                                                                  323,
                                                                  430) +
                    '</div>' +
                    '<div class="aw_ppm_dyn_stm_video_view_full_post" >' +
                    '<a class="aw_ppm_dyn_stm_video_goto_post_link"  href="/view?id=' + video_info.document.activity_id + '">' +
                      '<span>' +
                        'Goto Post' +
                      '</span>' +
                    '</a>' +
                  '</div>' +
                     
                  '</div>' +

                  
               '</li>';
      $('#aw_js_ppm_stm_videos_timeline_list').append(html);
    }
    

}

/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_videos(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_ALL_VIDEOS');
  $.each(data, function(i, video_info){
    aw_ppm_stm_videos_append_html(video_info);
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_ALL_VIDEOS', video_info.time);
  });
  $("abbr.aw_js_timeago").timeago();
  
  
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
function aw_api_ppm_stm_videos_request(on_init){
 /* disable the more button */
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }

  var time_cookie = '';
  if( on_init ){
    /* erase the timeline */
    $("#aw_js_ppm_stm_videos_timeline_list").html('');
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_ALL_VIDEOS', '');
  }
  $("#aw_js_ppm_stm_data_more").attr("disabled", true);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").show();
  var srv_params = {
                        user_id : aw_lib_get_page_owner_id(),
                        updated_at : aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_STM_GET_ALL_VIDEOS'),
                        filter : aw_api_ppm_stm_get_filter(),
                        page_type:aw_api_ppm_stm_get_page_scope(),
                        category : "video",
                        cache_cookie:aw_lib_get_cache_cookie_id()
                   };

  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_VIDEOS', params);  
}


/*******************************************/
/*
 *
 *
 */
function aw_api_get_image_id(image_info){
  return 'aw_ppm_stm_image_box_' + image_info.document.activity_id;
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_images_activate_fancybox(){
    $('a[rel=aw_ppm_stm_img_timeline_images_fancybox]').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function( title, currentArray, currentIndex, currentOpts) {
					var fancybox_html = '<span id="fancybox-title-over">' +
                                'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                              '</span>' ;
          return fancybox_html;
				},
        'onStart' : function(selectedArray, selectedIndex, selectedOpts){
          var obj = selectedArray[ selectedIndex ];
        }
	});
}
/*************************************************************/
/*
 *
 *
 */
function aw_get_one_image_html(image_info){
  var caption = "";
  if(image_info.document.caption && image_info.document.caption.length){
    caption = image_info.document.caption;
  }
  var thumb_nail = image_info.document.url; 
  if (image_info.document.thumb_url){
    thumb_nail = image_info.document.thumb_url; 
  }
  var html = '<div class="awppm_dyn_stm_img_single_box " >' +
              '<a rel="aw_ppm_stm_img_timeline_images_fancybox' +'" href="' + image_info.document.url + '" title="' + caption  + '" >' + 
                '<img alt="" src="'+ thumb_nail + '"   height="100" max-width="100" alt="" />' +
              '</a>' +
            '</div>';
  return html;
}


/*************************************************************/
/*
 *
 *
 */
function aw_ppm_stm_images_append_html(image_info){
    var image_box_id = aw_api_get_image_id(image_info);
    if($("#" + image_box_id).length){
      $("#" + image_box_id).find(".aw_js_ppm_image_list").append(aw_get_one_image_html(image_info));

    }else{
      var html = '<li class="aw_ppm_dyn_stm_images_li_box" id="' + image_box_id  + '" >' +
                  '<div class="aw_ppm_dyn_stm_images_div_box" >' +
                      '<div class="aw_ppm_dyn_stm_images_post_info">' +
                        '<a class="aw_ppm_dyn_stm_images_post_user_img" href="/home/show?id=' + image_info.user.id + '" >' +
                          '<img src="' + image_info.user.photo + '"/>' +
                        '</a>' +
                        '<a class="aw_ppm_dyn_stm_images_post_user_name" href="/home/show?id=' + image_info.user.id + '">' +
                           image_info.user.full_name +
                        '</a>' +
                        '<span class="aw_ppm_dyn_stm_images_post_time">' +
                          '<abbr class="aw_js_timeago" title="' + image_info.time + '"></abbr>' +
                        '</span>' +

                          '<a class="aw_ppm_dyn_stm_stream_images_chn_name" href="#" ><span>' + image_info.word.name  + '</span></a>' +
                      '</div>' +
                      /* check and add title */
                      '<div class="aw_ppm_dyn_stm_images_list_per_post aw_js_ppm_image_list" >' +
                        aw_get_one_image_html(image_info) + 
                      '</div>' +
                      '<div class="aw_ppm_dyn_stm_image_view_full_post" >' +
                        '<a class="aw_ppm_dyn_stm_image_goto_post_link"  href="/view?id=' + image_info.document.activity_id + '">' +
                          '<span>' +
                            'Goto Post' +
                          '</span>' +
                        '</a>' +
                      '</div>' +
                  '</div>' +
               '</li>';
      $('#aw_js_ppm_stm_images_timeline_list').append(html);
    }
    

}

/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_images(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_ALL_IMAGES');

  $.each(data, function(i, image_info){
    aw_ppm_stm_images_append_html(image_info);
  });
  $("abbr.aw_js_timeago").timeago();
  aw_ppm_stm_images_activate_fancybox();
  
  
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
function aw_api_ppm_stm_images_request(on_init){
/* disable the more button */
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  var time_cookie = '';
  if( on_init ){
    /* erase the timeline */
    $("#aw_js_ppm_stm_images_timeline_list").html('');
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_ALL_IMAGES', '');
  }
  $("#aw_js_ppm_stm_data_more").attr("disabled", true);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").show();
  var srv_params = {
                        user_id : aw_lib_get_page_owner_id(),
                        updated_at : aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_STM_GET_ALL_IMAGES'),
                        filter : aw_api_ppm_stm_get_filter(),
                        page_type:aw_api_ppm_stm_get_page_scope(),
                        category : "image",
                        cache_cookie:aw_lib_get_cache_cookie_id()
                   };

  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_IMAGES', params);   
}


/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachment_get_embedded_player_html( url, height, width){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '<p>no video url found - only vimeo and youtube supported</p>';
	}
	return output;
}

/*********************************************************/
/*
 *
 *
 */
function aw_api_stm_get_images_attachments_container_id(stream_info){
  return aw_api_get_stream_id(stream_info) + '_img_attachments';
}

/*********************************************************/
/*
 *
 *
 */
function aw_api_stm_get_attachment_box_id(stream_info, attachment_id){
  return aw_api_get_stream_id(stream_info) + '_attachment_' + attachment_id;
}

/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachments_get_videos_html(stream_info){
  var aw_videos_html = '';
  var aw_img_delete_html = '';
  var aw_video_delete_html = '';
  var aw_videos_html = '';
  var videos_count = 0;
  if(aw_api_ppm_stm_facebook_post_check(stream_info)){
    return '';
  }
  if( stream_info.post.user.id == aw_lib_get_session_owner_id()){
    aw_video_delete_html = '<div class="awppm_stm_attachment_video_delete aw_js_ppm_stm_delete_video" >' +
                            '<img src="/images/actwitty/refactor/aw_common/aw_close.png"> </img>' +
                            '<span>Click here to delete the video.</span>' +
                          '</div>';
  } 
  $.each(stream_info.documents.array, function(i, attachment){
      if( attachment.category == "video" ){
        var attachment_box_id = aw_api_stm_get_attachment_box_id(stream_info, attachment.id);
        var single_html = '<div class="awppm_stm_attachment_single_video_box aw_js_ppm_stm_video_attachment_box"  id= "' + attachment_box_id + '">' +
                            aw_video_delete_html + 
                            aw_ppm_stm_attachment_get_embedded_player_html(attachment.url, 323, 430) +
                            '<input type="hidden" class="aw_js_ppm_stm_hidden_attachment_id" value="' +  attachment.id + '"  >' +
                        '</div>';
        videos_count++;
        aw_videos_html = aw_videos_html + single_html;
      }
  });

  if( videos_count ){
    var html = '<div class="awppm_stm_post_attachments" >' +
                 aw_videos_html +
              '</div>';
      return html;
  }else{
    return '';
  }
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachments_get_links_html(stream_info){

  var aw_link_delete_html  = '';
  var links_count = 0;
  var aw_links_html = '';
  var single_html = '';
  
  $.each(stream_info.documents.array, function(i, attachment){
      if( attachment.category == "link" ){
        var attachment_box_id = aw_api_stm_get_attachment_box_id(stream_info, attachment.id);
        var title_html = '';
        var link_detail_html ='';
        var link_provider_html = '';

        /************************/
        if( attachment.url_title ) {
          title_html = '<a class="awppm_stm_attachment_link_title" src="' + attachment.url + '">' +
                      attachment.url_title +
                   '</a>';
    
        }else{
          title_html = '<a class="awppm_stm_attachment_link_title" src="' + attachment.url + '"> Goto Link </a>';
        }

        /************************/
        if ( attachment.url_description || attachment.url_image){
          var description_html = '';
          var img_html = '';
          if( attachment.url_description ) {
            description_html = '<p class="awppm_stm_attachment_link_description" >' +
                              attachment.url_description +                    
                           '</p>';
          }

          if( attachment.url_image ) {
            img_html = '<img class="awppm_stm_attachment_link_thumbnail" src="' + attachment.url_image + '" />';
          }
          link_detail_html = '<div class="awppm_stm_attachment_single_link_details">' +
                          img_html +
                          description_html +
                         '</div>';


        }
        /************************/
        if ( attachment.url_provider ){
          link_provider_html =  '<p class="awppm_stm_attachment_link_provider">' + 
                                  'Provider: ' + attachment.url_provider +
                                '</p>';
        }
        /************************/

        links_count++;

        var single_html = '<div class="awppm_stm_attachment_single_link_box aw_js_ppm_stm_link_attachment_box"  id="' + attachment_box_id + '">' +
                              title_html +
                              link_detail_html +
                              link_provider_html +
                          '</div>';

        aw_links_html = aw_links_html + single_html;
      }
  });


        

  if( links_count ){
    var html = '<div class="awppm_stm_post_attachments" >' +
                 aw_links_html +
              '</div>';
      return html;
  }else{
    return '';
  }

    


    
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachments_get_images_html(stream_info){
  var aw_images_count = 0;
  var max_images_to_show = 3;
  var aw_images_html = '';
  var aw_img_delete_html = '';


  if(aw_api_ppm_stm_facebook_post_check(stream_info)){
    return '';
  }
  if( stream_info.post.user.id == aw_lib_get_session_owner_id()){
    aw_img_delete_html = '<div class="awppm_stm_attachment_image_delete aw_js_ppm_stm_delete_image" >' +
                            '<span>Click here to delete the image.</span>' +
                            '<img src="/images/actwitty/refactor/aw_common/aw_close.png" > </img>' + 
                          '</div>';

  } 
  /* images container id */
  var aw_images_container_id = aw_api_stm_get_images_attachments_container_id(stream_info);

  $.each(stream_info.documents.array, function(i, attachment){

    if( attachment.category == "image" ){
      var caption = "";
      if(attachment.caption && attachment.caption.length){
        caption = attachment.caption;
      }
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }

      var aw_images_hide_class = '';
      if( aw_images_count >= max_images_to_show ){
           aw_images_hide_class = 'style="display:none;"';
      }
      var attachment_box_id = aw_api_stm_get_attachment_box_id(stream_info, attachment.id);
      var single_html = '<div class="awppm_stm_attachment_single_image_box aw_js_ppm_stm_img_attachment_box" ' + aw_images_hide_class +  ' id="' + attachment_box_id + '">' +
                          aw_img_delete_html +    
                          '<a rel="aw_ppm_stm_fancy_box_img_grp_'+ aw_images_container_id +'" href="' + attachment.url + '" title="' + caption  + '" >' + 
                            '<img alt="" src="'+ thumb_nail + '"   width="150" alt="" />' +
                             '<input type="hidden" class="aw_js_ppm_stm_hidden_attachment_id" value="' +  attachment.id + '"  >' +
                          '</a>' +
                        '</div>';
      aw_images_count++;
     
      aw_images_html = aw_images_html + single_html;
    }
  });


  var images_view_all_html = "";
  if( aw_images_count > max_images_to_show){
    images_view_all_html = '<div class="awppm_stm_post_attachments_view_all">' +
                                  '<span class="aw_js_ppm_stm_images_view_all"  >View All ' + aw_images_count + ' Images</span>' +
                            '</div>';
  }


  if( aw_images_count > 0 ){
      var html = '<div class="awppm_stm_post_attachments aw_js_ppm_stm_post_images_container " id="' + aw_images_container_id + '">' +
                    aw_images_html +
                    images_view_all_html +
                 '</div>';

      return html;

  }else{
    return '';
  }
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_activate_fancybox(post_group){
    $('a[rel=aw_ppm_stm_fancy_box_img_grp_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function( title, currentArray, currentIndex, currentOpts) {
					var fancybox_html = '<span id="fancybox-title-over">' +
                                'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                              '</span>' ;
          return fancybox_html;
				},
        'onStart' : function(selectedArray, selectedIndex, selectedOpts){
          var obj = selectedArray[ selectedIndex ];
        }
	});
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_attachments_enable_fancybox(stream_info){
    var aw_images_box_id = aw_api_stm_get_images_attachments_container_id(stream_info);
    if( $("#" + aw_images_box_id).length){
     /* activate fancy box  */
      aw_ppm_stm_activate_fancybox(aw_images_box_id);   
    }
}
/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_view_all_images(element){
    var stream_id = aw_api_ppm_get_stm_context_id_for_ele(element);
    $("#" + stream_id).find(".aw_js_ppm_stm_post_images_container a").first().trigger('click');

}

/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_delete_images(element){
    var attachment_id = element.closest(".aw_js_ppm_stm_img_attachment_box").find(".aw_js_ppm_stm_hidden_attachment_id").val();
    var stream_id = aw_api_ppm_get_stm_context_id_for_ele(element);
    var params = {
                    'aw_srv_protocol_params' : { "doc_id" : attachment_id },
                    'aw_srv_protocol_cookie' : {
                                                  "attachment_id" : attachment_id,
                                                  "stream_id"     : stream_id                                                
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_IMAGE_ATTACHMENT',  params);


}

/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_delete_videos(element){
    var attachment_id = $(element).closest(".aw_js_ppm_stm_video_attachment_box").find(".aw_js_ppm_stm_hidden_attachment_id").val();
    var stream_id = aw_api_ppm_get_stm_context_id_for_ele(element);
    var params = {
                    'aw_srv_protocol_params' : { "doc_id" : attachment_id },
                    'aw_srv_protocol_cookie' : {
                                                  "attachment_id" : attachment_id,
                                                  "stream_id"     : stream_id                                                
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_VIDEO_ATTACHMENT',  params);

}

/************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_delete_video(params){
  var stream_id = params['aw_srv_protocol_cookie']['stream_id'];
  var attachment_id = params['aw_srv_protocol_cookie']['attachment_id'];
  var video_box_id  = aw_api_stm_get_attachment_box_id(aw_api_ppm_get_stm_contex_for_key(stream_id), attachment_id);
  $("#" + video_box_id).remove();

}
/************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_delete_image(params){
  var stream_id = params['aw_srv_protocol_cookie']['stream_id'];
  var attachment_id = params['aw_srv_protocol_cookie']['attachment_id'];
  var image_box_id = aw_api_stm_get_attachment_box_id(aw_api_ppm_get_stm_contex_for_key(stream_id), attachment_id);
  $("#" + image_box_id).remove();
}





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
      var html = '<span class="aw_ppm_dyn_stm_stream_remove_mention aw_js_ppm_stm_delete_mention">Remove Mention</span>';
      $('#' + stream_main_box_id).find('.js_activity_entity').append(html);
    }
    element.find(".aw_js_ppm_stm_action_image").removeClass("aw_ppm_stm_dyn_action_mentions_img");
    element.find(".aw_js_ppm_stm_action_image").addClass("aw_ppm_stm_dyn_action_mentions_on_img");

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





/**************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_shares_revise_counters(stream_info){
    var share_counter = 0;
    var twitter_count = 0;
    var fb_count = 0;

    if(stream_info.post.social_counters){
      $.each(stream_info.post.social_counters, function(i, counter) { 
        if( counter.source_name == "twitter"){
          twitter_count = counter.count;
        }

        if( counter.source_name == "facebook"){
          fb_count = counter.count;
        }

        share_counter = share_counter + counter.count;
      });
    }
    
    var stream_main_box_id = aw_api_get_stream_id(stream_info);
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_shares_counter").html(share_counter);
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_share_facebook_counter").html(fb_count);
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_share_twitter_counter").html(twitter_count);
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_shares_get_html_box_html(stream_info){

   var html =  '<div class="aw_ppm_stm_dyn_share_box aw_js_ppm_stm_shares_main_box">'  +
                '<div class="aw_ppm_stm_dyn_share_header" >' +
                  '<span> Share over other networks </span>' +
                '</div>' +
                '<div class="aw_ppm_stm_dyn_share_twitter aw_js_ppm_stm_share_twitter_action">' +
                  '<div class="aw_ppm_stm_dyn_share_twitter_img "></div>' +
                  '<div class="aw_ppm_stm_dyn_share_twitter_count aw_js_ppm_stm_share_twitter_counter">0</div>' +
                '</div>' +

                '<div class="aw_ppm_stm_dyn_share_facebook aw_js_ppm_stm_share_facebook_action">' +
                  '<div class="aw_ppm_stm_dyn_share_facebook_img "></div>' +
                  '<div class="aw_ppm_stm_dyn_shares_facebook_count aw_js_ppm_stm_share_facebook_counter">0</div>' +
                '</div>' +
              
              '</div>';
  return html;

}

/****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_shares_show_all(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  
  var ext_share_main_box = $("#" + stream_main_box_id).find(".aw_js_ppm_stm_shares_main_box");
  var ext_share_action_img_box = $('#' + stream_main_box_id).find(".aw_js_ppm_stm_shares_action .aw_js_ppm_stm_action_image");
  if(ext_share_main_box.is(":visible") ){
    ext_share_main_box.hide();
    ext_share_action_img_box.removeClass('aw_ppm_stm_dyn_action_shares_on_img');
    ext_share_action_img_box.addClass('aw_ppm_stm_dyn_action_shares_img');
  }else{
    ext_share_main_box.show();
    ext_share_action_img_box.removeClass('aw_ppm_stm_dyn_action_shares_img');
    ext_share_action_img_box.addClass('aw_ppm_stm_dyn_action_shares_on_img');
  }
  
}
/****************************************************/
/*
 * Get post url for sharing
 */
function aw_get_post_url(stream_info){
   var url = aw_lib_get_base_url() + '/view?id=' + stream_info.post.id;
   return url;
}
/****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_shares_twitter_share(element){
  
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  aw_update_social_media_share_counter(stream_info,  'twitter', 'share');

  var host = window.location.hostname;
  var post_title =   stream_info.post.user.full_name + '\'s post about ' +   stream_info.post.word.name  + ' on actwitty.com';
  var url = aw_get_post_url(stream_info);
  var modal_href = "";
  
  modal_href = 'http://twitter.com/home?status='+ post_title + '%20' + url;
  
  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 
  
  var win_popup = window.open(modal_href, "Share ActWitty post", 'top=' + wint + ', left=' + winl + ' width=600, height=400, resizable, toolbar=no');
  return win_popup.focus();

}

/****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_shares_facebook_share(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);

  aw_update_social_media_share_counter(stream_info,  'facebook', 'share');
  var host = window.location.hostname;

  var post_title =   stream_info.post.user.full_name + '\'s post about ' +   stream_info.post.word.name  + ' on actwitty.com';
  var url = aw_get_post_url(stream_info);
  var modal_href = "";

  modal_href = 'http://www.facebook.com/sharer.php?status=wow&u=' + url;

  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 

  var win_popup = window.open(modal_href, "Share ActWitty post", 'top=' + wint + ', left=' + winl + ' width=600, height=400, resizable, toolbar=no');
  return win_popup.focus();


}

/****************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_shares_update_counters(params){
   /*do nothing function */
}

/****************************************************/
/*
 *
 *
 */
function aw_update_social_media_share_counter(stream_info, source, action){
  
   var twitter_count = 0;
   var fb_count =0;
   if(stream_info.post.social_counters){
      $.each(stream_info.post.social_counters, function(i, counter) { 
        if( counter.source_name == "twitter"){
          twitter_count = counter.count;
        }

        if( counter.source_name == "facebook"){
          fb_count = counter.count;
        }

      });
  }
  if( source == "twitter"){
    twitter_count++;
  }else if( source == "facebook"){
    fb_count++;
  }


  var social_media_share_count = [ 
                                    {"source_name":"twitter","action":"share","count":twitter_count},
                                    {"source_name":"facebook","action":"share","count":fb_count}
                                 ];
  aw_api_ppm_stm_modify_shares( aw_api_get_stream_id(stream_info), social_media_share_count); 
  aw_api_ppm_stm_shares_revise_counters(stream_info);
  var params = {
                  'aw_srv_protocol_params' : {
                                                activity_id: stream_info.post.id,
                                                summary_id: stream_info.post.summary_id,
                                                source_name:source,
                                                action_type:action
                                              },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id: aw_api_get_stream_id(stream_info)
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_UPDATE_SOCIAL_SHARE_COUNTER',  params);





}



/*******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_handle_filter_change(){
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_filter(){
  var filter_json =  { 
                        word_id     : $("#aw_js_ppm_stm_filter_chn_id").attr("value"),
                        entity_id   : $("#aw_js_ppm_stm_filter_mention_id").attr("value"),
                        location_id : $("#aw_js_ppm_stm_filter_location_id").attr("value")
                    }; 
  return filter_json;
}
/**********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_chn_filter_id(){
  return $("#aw_js_ppm_stm_filter_chn_id").attr("value");
}
/**********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_chn_filter_name(){
  return $("#aw_js_ppm_stm_filter_chn_text").attr("value");
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_apply_filter_to_view(){
  
  if(   $("#aw_js_ppm_stm_filter_chn_id").attr("value").length &&
        $("#aw_js_ppm_stm_filter_chn_text").attr("value").length){
        
        $(".aw_js_ppm_stm_chn_filter_text_on_view").html(  $("#aw_js_ppm_stm_filter_chn_text").val() );
        $("#aw_js_ppm_stm_page_label").html( $("#aw_js_ppm_stm_filter_chn_text").val() +  " streams");
        $("#aw_js_ppm_stm_chn_filter_delete").show();

    }else{
      $("#aw_js_ppm_stm_page_label").html( "streams" );
      $(".aw_js_ppm_stm_chn_filter_text_on_view").html( "All Channels" );
      $("#aw_js_ppm_stm_chn_filter_delete").hide();
    }
  
  if( $("#aw_js_ppm_stm_filter_mention_id").attr("value").length &&
      $("#aw_js_ppm_stm_filter_mention_text").attr("value").length){
        
        $(".aw_js_ppm_stm_mention_filter_text_on_view").html(  $("#aw_js_ppm_stm_filter_mention_text").val());
        $("#aw_js_ppm_stm_mention_filter_delete").show();

      }else{
        $(".aw_js_ppm_stm_mention_filter_text_on_view").html( "All Mentions" );
        $("#aw_js_ppm_stm_mention_filter_delete").hide();
      }
  if( $("#aw_js_ppm_stm_filter_location_id").attr("value").length &&
      $("#aw_js_ppm_stm_filter_location_text").attr("value").length){
       $(".aw_js_ppm_stm_location_filter_text_on_view").html($("#aw_js_ppm_stm_filter_location_text").val());
       $("#aw_js_ppm_stm_location_filter_delete").show();

      }else{
        $(".aw_js_ppm_stm_location_filter_text_on_view").html( "All Locations" );
        $("#aw_js_ppm_stm_location_filter_delete").hide();
      }
}

/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_change_mention_filter(element){
  $("#aw_js_ppm_stm_filter_mention_id").val(element.find(".aw_js_ppm_stm_mention_filter_changer_id").val());
  $("#aw_js_ppm_stm_filter_mention_text").val(element.find(".aw_js_ppm_stm_mention_filter_changer_name").val());
  aw_api_ppm_stm_main_handle_filter_change();
  aw_api_ppm_stm_modal_close("aw_js_ppm_stm_aw_modal_manager_related_mentions");
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_change_location_filter(element){
  $("#aw_js_ppm_stm_filter_location_id").val(element.find(".aw_js_ppm_stm_location_filter_changer_id").val());
  $("#aw_js_ppm_stm_filter_location_text").val(element.find(".aw_js_ppm_stm_location_filter_changer_name").val());
  aw_api_ppm_stm_main_handle_filter_change();
  aw_api_ppm_stm_modal_close("aw_js_ppm_stm_aw_modal_manager_related_locations");
}

/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_drop_mention_filter(){
  $("#aw_js_ppm_stm_filter_mention_id").val('');
  $("#aw_js_ppm_stm_filter_mention_text").val('');
  aw_api_ppm_stm_main_handle_filter_change();
}

/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_drop_location_filter(){
  $("#aw_js_ppm_stm_filter_location_id").val('');
  $("#aw_js_ppm_stm_filter_location_text").val('');
  aw_api_ppm_stm_main_handle_filter_change();
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_drop_channel_filter(){
  $("#aw_js_ppm_stm_filter_chn_id").val('');
  $("#aw_js_ppm_stm_filter_chn_text").val('');
  aw_api_ppm_stm_main_handle_filter_change();
}

/***************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_similar_ppl(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  } 

  if( on_init ){
    $("#aw_js_ppm_stm_aw_modal_manager_related_people").html();
  }
  var params = {
                  'aw_srv_protocol_params' :  { 
                                                filter : aw_api_ppm_stm_get_filter(),
                                                page_type:aw_api_ppm_stm_get_page_scope(),
                                                cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_SIMILAR_PEOPLE',  params);
}

/**********************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_similar_ppl(params){
  var people_data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_related_people", people_data);
  var html = "";
  $.each(people_data, function(i,person_data){
    if( i < 3){
      var single_html =   '<div class="aw_ppm_stm_dyn_peoples_box">' +
                            '<a class="aw_ppm_stm_dyn_people_img_link" href="/home/show?id=' + person_data.id + '" >' +
                              '<img src="' + person_data.image +'"/>' +
                            '</a>' +
                            '<a class="aw_ppm_stm_dyn_people_name_link" href="/home/show?id=' + person_data.id + '" >' +
                              '<span>'  +
                                person_data.name +
                              '</span>' +
                            '</a>' +
                          '</div>';
      html = html + single_html;
    }
  });
  $(".awppm_stm_right_side_info_related_people").html(html); 
}




/***************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_mentions(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  } 

  if( on_init ){
    $("#aw_js_ppm_stm_right_side_related_mentions").html();
  }
  var params = {
                  'aw_srv_protocol_params' :  { 
                                                user_id : aw_lib_get_page_owner_id(), 
                                                filter : aw_api_ppm_stm_get_filter(),
                                                page_type:aw_api_ppm_stm_get_page_scope(),
                                                cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_MENTIONS',  params);
}


/***************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_all_mentions(params){

  var mentions_data = aw_awpi_serv_resp_data_for_post_request_in_params(params); 
  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_related_mentions", mentions_data);

  var html = "";
  $.each(mentions_data, function(i,mention_info){
    if( i < 5){
      var single_html =   '<div class="aw_ppm_stm_dyn_mention_box">' +
                            '<a class="aw_ppm_stm_dyn_mention_link aw_js_ppm_stm_mention_filter_changer">' +
                              '<span>'  +
                                mention_info.name +
                              '</span>' +
                              '<input type="hidden" class="aw_js_ppm_stm_mention_filter_changer_id" value="' + mention_info.id + '" >' +
                              '<input type="hidden" class="aw_js_ppm_stm_mention_filter_changer_name" value="' + mention_info.name + '" >' +
                            '</a>' +
                          '</div>';
      html = html + single_html;
    }
  });
  $("#aw_js_ppm_stm_right_side_related_mentions").html(html);
}

/*****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mentions_modal_renderer(win_id, triggerer){
 var mentions_data = aw_api_ppm_stm_modal_get_data("aw_js_ppm_stm_aw_modal_manager_related_mentions");

 var header_html = '<div class="awppm_stm_dyn_mentions_header_box" >' +
                      '<span class="awppm_stm_dyn_mentions_modal_label" >' +
                        'Top mentions in the streams' +
                      '</span>'+
                    '</div>';

  var html = header_html;
  $.each(mentions_data, function(i,mention_info){
    var mention_image = mention_info.image + "?maxWidth=80";
    var mention_html = '<div class="aw_ppm_stm_dyn_mentions_modal_box aw_js_ppm_stm_mention_filter_changer" style="background:url(' + mention_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  >' +
                              '<input type="hidden" class="aw_js_ppm_stm_mention_filter_changer_id" value="' + mention_info.id + '" >' +
                              '<input type="hidden" class="aw_js_ppm_stm_mention_filter_changer_name" value="' + mention_info.name + '" >' +
                            '<div class="aw_ppm_stm_dyn_mentions_modal_label">' +
                                '<span>' + mention_info.name + '</span>' +
                            '</div>' +
                          '</div>';
    html = html + mention_html;
  });

  $("#" + win_id).append(html);
  return true;


}




/***************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_locations(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  } 

  if( on_init ){
    $("#aw_js_ppm_stm_right_side_related_locations").html();
  }
  var params = {
                  'aw_srv_protocol_params' :  { 
                                                user_id : aw_lib_get_page_owner_id(), 
                                                filter : aw_api_ppm_stm_get_filter(),
                                                page_type:aw_api_ppm_stm_get_page_scope(),
                                                cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_LOCATIONS',  params);
}


/***************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_all_locations(params){
  
  var locations_data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_related_locations", locations_data);

  var html = "";
  $.each(locations_data, function(i,location_info){
    if( i < 5){
      var single_html =   '<div class="aw_ppm_stm_dyn_location_box">' +
                            '<a class="aw_ppm_stm_dyn_location_link aw_js_ppm_stm_location_filter_changer">' +
                              '<input type="hidden" class="aw_js_ppm_stm_location_filter_changer_id" value="' + location_info.id + '" >' +
                              '<input type="hidden" class="aw_js_ppm_stm_location_filter_changer_name" value="' + location_info.name + '" >' +
                              '<span>'  +
                                location_info.name +
                              '</span>' +
                            '</a>' +
                          '</div>';
      html = html + single_html;
    }
  });
  $("#aw_js_ppm_stm_right_side_related_locations").html(html);
}
/*****************************************************/
/*
 *
 *
 */
function aw_get_location_box_id(location_info){
  return "aw_ppm_stm_location_modal_" + location_info.id;
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_locations_modal_renderer(win_id, triggerer){
 var locations_data = aw_api_ppm_stm_modal_get_data("aw_js_ppm_stm_aw_modal_manager_related_locations");

 var header_html = '<div class="awppm_stm_dyn_locations_header_box" >' +
                      '<span class="awppm_stm_dyn_locations_modal_label" >' +
                        'Top locations in the streams' +
                      '</span>'+
                    '</div>';

  var html = header_html;
  $.each(locations_data, function(i,location_info){
    var location_info_html = "";
    if( location_info.type == 2){
      location_info_html = '<div class="aw_ppm_stm_dyn_locations_modal_box aw_js_ppm_stm_location_filter_changer" >' +
                            '<div class="aw_ppm_stm_dyn_locations_map_box" id="' + aw_get_location_box_id(location_info) +  '"  >' +
                            '</div>' +
                            '<div class="aw_ppm_stm_dyn_location_label_box">' +
                                '<span>' + location_info.name + '</span>' +
                            '</div>' +
                            '<input type="hidden" class="aw_js_ppm_stm_location_filter_changer_id" value="' + location_info.id + '" >' +
                            '<input type="hidden" class="aw_js_ppm_stm_location_filter_changer_name" value="' + location_info.name + '" >' +
                          '</div>';
  } else{
      var location_image = '/images/actwitty/refactor/aw_ppm/channel/aw_unknown_geo_location.jpg';
      location_info_html = '<div class="aw_ppm_stm_dyn_locations_modal_box" style="background:url(' + location_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"   >' +
                          '<div class="aw_ppm_stm_dyn_location_label_box">' +
                              '<span>' + location_info.name + '</span>' +
                          '</div>' +
                          '<input type="hidden" class="aw_js_ppm_stm_location_filter_changer_id" value="' + location_info.id + '" >' +
                          '<input type="hidden" class="aw_js_ppm_stm_location_filter_changer_name" value="' + location_info.name + '" >' +
                        '</div>';
                          
  }
     
    html = html + location_info_html;
  });

  $("#" + win_id).append(html);

  $.each(locations_data, function(i, location_info){
    
    if( location_info.type == 2){
      var mapOptions = {
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: new google.maps.LatLng(location_info.lat,location_info.long)
                    };
      map = new google.maps.Map(document.getElementById(aw_get_location_box_id(location_info)),mapOptions);
    }

  });
  return true;


}



/*
 * Main json that will hold all the data for rendering of modal screen
 */
var aw_local_modal_reg_prefix="aw_js_ppm_stm_aw_modal_manager_";


var aw_local_modal_manager_registry = {
    /* Related friends modal configuration */
    "aw_js_ppm_stm_aw_modal_manager_related_people"  :  {
                                          renderer_fn:function aw_internal_modal_related_friends_caller(win_id, triggerer){
                                            return true;
                                           // return aw_friends_render_related_modal(win_id, triggerer);
                                          },
                                          title:"Related Friends",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{},

                                      },
    /* Related entities modal configuration */
    "aw_js_ppm_stm_aw_modal_manager_related_mentions"  :  {
                                          renderer_fn:function aw_internal_modal_related_mentions_caller(win_id, triggerer){
                                            return aw_api_ppm_stm_mentions_modal_renderer(win_id, triggerer);
                                          },
                                          title:"Related Entities",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* Related locations modal configuration */
     "aw_js_ppm_stm_aw_modal_manager_related_locations"  :  {
                                          renderer_fn:function aw_internal_modal_related_locations_caller(win_id, triggerer){
                                            return aw_api_ppm_stm_locations_modal_renderer(win_id, triggerer);
                                          },
                                          title:"Related Locations",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* All channels modal configuration */
    "aw_js_ppm_stm_aw_modal_manager_all_channels" : {
                                          renderer_fn:function aw_internal_modal_all_channels_caller(win_id, triggerer){
                                            //alert("calling related locations renderer");
                                            //return aw_channels_render_all_modal(win_id, triggerer);
                                            return true;
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                     
                                   },

    "aw_js_ppm_stm_aw_modal_manager_stream_likes" : {
                                          renderer_fn:function aw_internal_modal_like(win_id, triggerer){
                                            //alert("calling related locations renderer");
                                            return aw_api_ppm_stm_like_modal_renderer(win_id, triggerer);
                                          },
                                          title:" Stream Likes",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}
                                     
                        },
    "aw_js_ppm_stm_aw_modal_manager_stream_chn_name_change" : {
                                          renderer_fn:function aw_internal_modal_like(win_id, triggerer){
                                            //alert("calling related locations renderer");
                                            return aw_api_ppm_stm_rename_channel(win_id, triggerer);
                                          },
                                          title:" Stream Likes",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}
                                     
                                        }
                  };



/*
 * set the data json for the modal
 */
function aw_api_ppm_stm_modal_set_data( registered_modal_id, json_data){
  if(aw_local_modal_manager_registry[registered_modal_id]){
    aw_local_modal_manager_registry[registered_modal_id].data_json = json_data;
  }else{
    alert("There is a problem in caching modal rendering data. \n Actwitty is trying to solve the problem");
  }
}
/*
 * get data json for the modal
 */
function aw_api_ppm_stm_modal_get_data( registered_modal_id){
  if(aw_local_modal_manager_registry[registered_modal_id]){
    return aw_local_modal_manager_registry[registered_modal_id].data_json;
  }else{
    return {};
  }
}

/*
 * Call the target renderer of internal modal
 */
function aw_api_ppm_stm_dialog_maker(registered_modal_id, container_window_id, triggerer){
  if(aw_local_modal_manager_registry[registered_modal_id]){
    if(aw_local_modal_manager_registry[registered_modal_id].renderer_fn){
      var ret_val =  aw_local_modal_manager_registry[registered_modal_id].renderer_fn(container_window_id,triggerer);
      if ( ret_val == true){
        $("html,body").css("overflow","hidden");
      }
      return ret_val;
    }else{
      return false;
    }
    
  }else{
    alert("There is a fucking problem in rendering modal screen. \n Actwitty is trying to solve the problem");
    return false;
  }
}


function aw_api_ppm_stm_modal_close(registered_modal_id){
  $('#modal_box_window_id').empty();
  $("#modal_box_id").hide();
  $(".aw_js_ppm_stm_modal_close").hide();
  $('#modal_box_window_id').hide();
  $('#modal_box_mask_id').hide();
  $("html,body").css("overflow","auto");

}
/*
 * Register modal handler on init
 */
$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.aw_js_ppm_stm_modal_invoker').live("click", function(e) {
        //Cancel the link behavior
        e.preventDefault();
        //Get the A tag
        /* show the modal dialogs parent window*/
        //alert("clicked");

        var modal_window =   $('#modal_box_window_id');
        var modal_bkg_mask = $('#modal_box_mask_id');
        var modal_close = $('#modal_c');
        //alert(modal_window);

        $("#modal_box_id").show();
        $(".aw_js_ppm_stm_modal_close").show();

        //Get the screen height and width
        var mask_height = $(document).height();
        var mask_width = $(window).width();
        //Set height and width to mask to fill up the whole screen
        modal_bkg_mask.css({'width':mask_width,'height':mask_height});
        
        //transition effect     
        modal_bkg_mask.fadeIn(1000);    
        modal_bkg_mask.fadeTo("slow",0.8);  
    
        /* find the modal height and widhth*/
        var registered_modal_id = ""; 
        $($(this).attr('class').split(' ')).each(function() { 
          if (this !== '' 
              && this.substring(0,aw_local_modal_reg_prefix.length) == aw_local_modal_reg_prefix){
              registered_modal_id = this;
            }    
        });
        
         if( registered_modal_id.length ){
           var config_json = aw_local_modal_manager_registry[registered_modal_id];
           if(config_json){
             modal_window.css({'width':config_json.width,'height':config_json.height});
             modal_window.css({'top':config_json.top,'left':config_json.left});
             //alert("if"); 
             //modal_close.css({'width':config_json.width,'height':config_json.height});
             modal_close.css({'margin-top':config_json.top-10,'margin-left':config_json.width+config_json.left+4});

           }
         }else{
              //Set the popup window to center
              //alert("else"); 
              modal_window.css('top',  winH/2 - modal_window.height()/2);
              modal_window.css('left', winW/2 - modal_window.width()/2);

              modal_close.css('top',  winH/2 - modal_window.height()/2);
              modal_close.css('left', winW/2 - modal_window.width()/2);

         }


        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
     
     
        //transition effect
        modal_window.fadeIn(2000); 
        if( registered_modal_id.length ){
          var ret_code = aw_api_ppm_stm_dialog_maker(registered_modal_id, "modal_box_window_id", $(this));
          if(!ret_code){
            /*hide the parent of modal window box*/
            $("#modal_box_id").hide();
            $(".aw_js_ppm_stm_modal_close").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
            $("html,body").css("overflow","auto");
          }
        }else{
            $("#modal_box_id").hide();
            $(".aw_js_ppm_stm_modal_close").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
            $("html,body").css("overflow","auto");
        }
     
    });
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.aw_js_ppm_stm_modal_close').live("click", function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $('#modal_box_window_id').html('');
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("#modal_box_id").hide();
        $(".aw_js_ppm_stm_modal_close").hide();
        $("html,body").css("overflow","auto");
        return false;
    });     
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.modal_mask').live("click",function () {
        $('#modal_box_window_id').html('');
        $("#modal_box_id").hide();
        $(".aw_js_ppm_stm_modal_close").hide();
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("html,body").css("overflow","auto");
        return false;
    });         
     
});



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



/***********************************************************/
var aw_local_fb_access_token;
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_initialize_access_token(fn_cb){
  var auth_token = $("#aw_js_ppm_fb_access_token").val();
  if(auth_token.length){
    aw_local_fb_access_token = auth_token;
    fn_cb();
    return;
  }
  FB.init({
        appId      : '172893766124779',
        channelUrl : aw_lib_get_base_url() + '/channel.html',
        status     : true, 
        cookie     : true, 
        oauth      : true, 
        xfbml      : true  
      });
  FB.getLoginStatus(function(response) {
  if (response.authResponse) {
    aw_local_fb_access_token = response.authResponse.accessToken;
  } 
  fn_cb();
});
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_post_check(stream_info){
  if( stream_info.post.source_name == 'facebook' && stream_info.post.source_object_id ){
    return true;
  }
  return false;
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_facebook_get_signed_in_auth_token(){
  return aw_local_fb_access_token;
 
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_skip_processing(stream_info, fb_resp_data){
 
  if( (fb_resp_data.message && fb_resp_data.message.length) || ( fb_resp_data.link &&  fb_resp_data.link.length) ){
    return false;
  }else{
    var stream_main_box_id = aw_api_get_stream_id(stream_info);                       
    $("#" + stream_main_box_id).remove();
    aw_api_ppm_remove_stream_context(stream_main_box_id);
    return true;
  }


}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_link_is_video(url){
  if(url.match('http://(www.)?youtube|youtu\.be')){
    return true;
  }else if(url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/)){
    return true;
  }
  return false;
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_image_link(url){
  if (url.match(/(\.|\/)(gif|jpe?g|png)$/i)){
    return true;
  }
  return false;
}

/************************************************************/
/*
 *
 *
 */
function aw_get_params_by_name( url, name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_fb_link_with_fbid(fb_resp_data){
  return aw_get_params_by_name(fb_resp_data.link, 'fbid'); 
}

/************************************************************/
/*
 *
 *
 */
function aw_api_process_facebook_links_with_fbid(stream_info, fbid, fb_resp_data){
  var fbid_url = 'https://graph.facebook.com/' + fbid +"?access_token="+ aw_api_ppm_facebook_get_signed_in_auth_token() + "&callback=?";
  $.getJSON(fbid_url, function(fbid_resp_data){
    var fb_data_json = {};
    if(fbid_resp_data.message){
      fb_data_json['internal_message'] = fbid_resp_data.message;
    }
    if(fbid_resp_data.source){
      fb_data_json['internal_src'] = fbid_resp_data.source;
     if(aw_api_ppm_stm_facebook_check_link_is_video(fbid_resp_data.source)){
        fb_data_json['video'] = fbid_resp_data.source; 
      }else if(aw_api_ppm_stm_facebook_check_image_link(fbid_resp_data.source)){
         fb_data_json['image'] = fbid_resp_data.source; 
      }else{
        fb_data_json['unresolved'] = fbid_resp_data.source; 
      }
    }

     if(fb_resp_data.message){
      fb_data_json['message'] = fb_resp_data.message;
    } 
    fb_data_json['link'] = fb_resp_data.link;
    aw_api_facebook_render_post_data(stream_info, fb_data_json);
  });
}


/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_process_fb_data(stream_info, fb_resp_data){
  var fb_data_json = {};
  fb_data_json['link'] = '';
  if(fb_resp_data.link){
    fb_data_json['link'] = fb_resp_data.link;
    if(aw_api_ppm_stm_facebook_check_link_is_video(fb_resp_data.link)){
      fb_data_json['video'] = fb_resp_data.link; 
      fb_data_json['caption'] = fb_resp_data.caption; 
      if(fb_resp_data.message){
        fb_data_json['message'] = fb_resp_data.message;
      }
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }else if(aw_api_ppm_stm_facebook_check_image_link(fb_resp_data.link)){
      fb_data_json['image'] = fb_resp_data.link; 
      fb_data_json['caption'] = fb_resp_data.caption; 
      if(fb_resp_data.message){
        fb_data_json['message'] = fb_resp_data.message;
      }
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }else{
      var fbid = aw_api_ppm_stm_facebook_check_fb_link_with_fbid(fb_resp_data);
      if(fbid.length){
        aw_api_process_facebook_links_with_fbid(stream_info, fbid, fb_resp_data);
      }else{
        fb_data_json['unresolved'] = fb_resp_data.link; 
        fb_data_json['description'] = fb_resp_data.description; 
        fb_data_json['caption'] = fb_resp_data.caption; 
        if(fb_resp_data.message){
          fb_data_json['message'] = fb_resp_data.message;
        }
        aw_api_facebook_render_post_data(stream_info, fb_data_json);
      }
    }

  }else{
    if(fb_resp_data.message){
      fb_data_json['message'] = fb_resp_data.message;
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }
  }
  
  
  

}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_make_srv_get_request(stream_info){
   var fb_url = 'https://graph.facebook.com/' + stream_info.post.source_object_id +"?access_token="+ aw_api_ppm_facebook_get_signed_in_auth_token() + "&callback=?";
    $.getJSON(fb_url, function(fb_resp_data){
       if( !aw_api_ppm_stm_facebook_check_skip_processing(stream_info, fb_resp_data) ){
          aw_api_ppm_stm_facebook_process_fb_data(stream_info, fb_resp_data);
       }
    });

}

/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_facebook_attachment_get_embedded_player_html( url, height, width){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '<p>no video url found - only vimeo and youtube supported</p>';
	}
	return output;
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_activate_facebook_fancybox(post_group){
    $('a[rel=aw_ppm_stm_facebook_fancy_box_img_grp_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function( title, currentArray, currentIndex, currentOpts) {
					var fancybox_html = '<span id="fancybox-title-over">' +
                                'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                              '</span>' ;
          return fancybox_html;
				},
        'onStart' : function(selectedArray, selectedIndex, selectedOpts){
          var obj = selectedArray[ selectedIndex ];
        }
	});
}
/********************************************************/
/*
 *
 *
 */
function aw_api_facebook_render_post_data(stream_info, fb_data_json){
  var image_html='';
  var video_html='';
  var text_html='';
  var link_html = '';
  var caption = '';
  
  if(fb_data_json['caption']){
    caption = fb_data_json['caption'];
  }

  var aw_images_container_id = aw_api_get_stream_id(stream_info) + '_fb_img';
  //alert(JSON.stringify(fb_data_json));
  if(fb_data_json['image']){
    image_html ='<div class="awppm_stm_fb_post_attachments">'  +
                  '<div class="awppm_stm_fb_attachment_single_image_box" >' +
                    '<a rel="aw_ppm_stm_facebook_fancy_box_img_grp_'+ aw_images_container_id +'" href="' + fb_data_json['image'] + '" title="' + caption  + '" >' + 
                            '<img alt="" src="'+ fb_data_json['image'] + '"   width="300" alt="" />' +
                    '</a>' +
                  '</div>' +
                '</div>';
  }

  if( fb_data_json['video']){
    video_html = '<div class="awppm_stm_fb_post_attachments">' +
                    '<div class="awppm_stm_fb_attachment_single_video_box" >' +
                        aw_ppm_stm_facebook_attachment_get_embedded_player_html(fb_data_json['video'], 323, 430) +
                    '</div>' +
                  '</div>';
  }



  if( fb_data_json['message'] || fb_data_json['internal_message'] || fb_data_json['description'] || fb_data_json['unresolved'] ){
    var link = '';
    var description = '';

    if ( fb_data_json['unresolved'] ){
      link = fb_data_json['unresolved'];
      if( fb_data_json['description'] ){
        description = fb_data_json['description'];
      }

    }
    var message = '';
    if( fb_data_json['message'] ){
      message = fb_data_json['message'] + '<br>';
    }

    if( fb_data_json['internal_message'] ){
      message = fb_data_json['internal_message'] + '<br>';
    }

    
    text_html = '<div class="aw_ppm_dyn_stm_fb_post_text aw_js_ppm_stm_fb_post_text">' +
                    '<p class="aw_ppm_dyn_stm_fb_text_box ">' +
                        message +
                    '</p>' +

                    '<p class="aw_ppm_dyn_stm_fb_link_text_box">' +
                        description + '<br>' +
                        '<a href="' + link + '">' + link + '</a>' +
                    '</p>' +
                    '<input type="hidden" class="aw_js_ppm_stm_fb_link" value="' + fb_data_json['link'] + '" />'+
                    '</div>' +
                  '</div>';
  }

  var html = image_html + video_html + text_html;
  var stream_main_box_id = aw_api_get_stream_id(stream_info);                       
  $("#" + stream_main_box_id).find(".aw_js_ppm_stm_fb_content_box").html(html);
  if(fb_data_json['image']){
    aw_ppm_stm_activate_facebook_fancybox(aw_images_container_id);
  }

}


function  aw_api_ppm_stm_facebook_jump_to_fb_link(element){
  var link = element.find(".aw_js_ppm_stm_fb_link").val();
  window.location.href = link; 
}

/*************************************************************/
/*
 *
 *
 */
var aw_local_ppm_stm_channel_rename_choice={};

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_rename_channel(win_id, triggerer){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(triggerer);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  
  var header_html = '<div class="awppm_stm_dyn_chn_rename_header_box" >' +
                      '<span class="awppm_stm_dyn_chn_rename_modal_label" >' +
                        'Change the channel for the post' +
                      '</span>'+
                    '</div>';
  
  var data_html = '<div class="awppm_stm_dyn_chn_rename_existing">' +
                    '<span class="awppm_stm_dyn_chn_rename_label" >' +
                      'Current Channel: ' +
                    '</span>' +
                    '<span class="awppm_stm_dyn_chn_rename_existing_name" >' +
                        stream_info.post.word.name +
                    '</span>' +
                  '</div>' +
                  '<div class="awppm_stm_dyn_chn_rename_new">' +
                    '<span class="awppm_stm_dyn_chn_rename_label" >' +
                      'New Channel: ' +
                    '</span>' +
                    '<input class="aw_js_ppm_stm_new_chn_name" placeholder="Channel Name" type="text" />' +
                  '</div>' + 
                  '<div class="awppm_stm_dyn_chn_rename_btn_box" >' +
                    
                    '<div class="awppm_stm_dyn_chn_rename_btn aw_js_ppm_stm_chn_rename_submit">' +
                      '<input type="hidden" id="aw_js_ppm_stm_rename_id" value="' + stream_main_box_id + '"/>' +
                      '<div class="aw_ppm_stm_dyn_chn_rename_submit_img"></div>' +
                      '<div class="aw_ppm_stm_dyn_chn_rename_submit_text"> Apply </div>' +
                    '</div>' +
                  '</div>';



  var html = header_html + data_html;
  
  
  
  $("#" + win_id).append(html);
  aw_ppm_stm_chn_rename_get_user_channel_list();
  return true;

}


/*************************************************************/
/*
 *
 *
 */
function aw_ppm_stm_chn_rename_get_user_channel_list(){
 var params = {
                  'aw_srv_protocol_params' : {
                                                 user_id: aw_lib_get_page_owner_id(),
                                                 sort_order: 1,
                                                 cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {}
               };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHN_RENAME_LIST',  params);
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_rename_channel_list(params){

  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_CHN_RENAME_LIST');
  $(".aw_js_ppm_stm_new_chn_name").autocomplete(data, {
     	minChars: 0,
		  matchContains: true,
		  highlightItem: false,
      mustMatch: true,
      formatItem: function(channel) {
        return channel.name;
      }
    }).result(function(event, item) {
    });
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chn_rename_submit_handler(element){
  var stream_main_box_id = $("#aw_js_ppm_stm_rename_id").val();
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
 
  var params = {
                  'aw_srv_protocol_params' : {
                                                 id:        stream_info.post.id,
                                                 new_name:  $(".aw_js_ppm_stm_new_chn_name").val()
                                             },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id: stream_main_box_id
                                             }
               };
  aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_RENAME_CHANNEL',  params);
}

/************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chn_rename_done(params){
  var stream_info = aw_awpi_serv_resp_data_for_post_request_in_params(params);
  var stream_main_box_id = params['aw_srv_protocol_cookie']['stream_box_id'];
  aw_api_ppm_stm_modal_close("aw_js_ppm_stm_aw_modal_manager_stream_chn_name_change");
  aw_api_ppm_stm_update_channel_name_id(stream_main_box_id, stream_info.activity_name, stream_info.activity_word_id);
  $("#" + stream_main_box_id).find(".aw_js_ppm_stm_chn_name").html(stream_info.activity_name);
}
