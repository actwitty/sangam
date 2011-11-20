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

  /* more click event handler end */
  
});
