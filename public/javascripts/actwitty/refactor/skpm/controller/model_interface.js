/*****************************************************/
/*
 *
 *
 */
function aw_api_controller_render_static_profile(data){
  aw_api_view_static_profile_render(data);
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_controller_render_services_list(data){
  aw_api_view_service_list_render(data);
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_controller_render_interests(data){
  aw_api_view_interest_render(data);
  var description = aw_api_model_get_interest_sentence();
  aw_api_model_static_profile_apply_description(description);
  aw_api_view_static_profile_update_description(description);
}

/******************************************************/
/*
 *
 *
 */
function aw_api_controller_render_trends(data){
  aw_api_view_trends_render(data);
  
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_controller_render_mentions(data){
  aw_api_view_mentions_render(data);
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_controller_render_service_popularity(data){
  aw_api_view_service_popularity_render(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_render_stream(data){
  aw_api_view_stream_render(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_update_active_friends(data){
  aw_api_model_connections_update_active_friends(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_connections_active_friends_render(data){
    aw_api_view_connections_active_friends_render(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_get_visited_user_current_location(){
  return aw_api_model_location_get_visited_user_current_location();
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_copy_stream_to_visited_user_feeds(feed_data){
  aw_api_model_set_visited_user_feeds(feed_data);
}
/*********************************************************/
/*
 *
 *
 */
function aw_api_controller_notify_feed_fetched(data){
  aw_api_model_connections_update_locations(data);
}
/**********************************************************/
/*
 *
 *
 */
function aw_api_controller_locations_render(data){
  aw_api_view_locations_render(data);
}
/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_render_images(data){
  aw_api_view_images_render(data);
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_change_filter_on_stream(filter){
  aw_api_view_show_stream_waiting();
  aw_pulled_stream_query_filter(filter, null);
}

/************************************************************/
/*
 *
 *
 *
 */
function aw_api_controller_show_or_hide_close(show){
  aw_api_view_show_or_hide_close(show);
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_tweak_stream_header(header_data){
  if( header_data == null || header_data.length == 0){
    header_data = "Wall Feeds";
    aw_api_view_stream_header_render(header_data);
  }
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_show_videos(data){
  aw_api_view_videos_render(data);
}
/******************************************************/
/*
 *
 *
 */
function aw_controller_api_modify_twitter_url(url){
  aw_api_view_services_modify_twitter_url(url);
  
}
