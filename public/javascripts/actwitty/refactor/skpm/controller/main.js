/******************************************************************/
/* Main entry point to sketch initialize
 *
 *
 */
function aw_api_controller_sketch_main_init(){

  aw_lib_console_log("DEBUG", "Entry point into main controller");
  if( aw_js_global_services_user_enabled.profile[ 'facebook_service_enabled' ] ){
      aw_lib_console_log("DEBUG", "invoking facebook token init");
    /* facebook is there need to check current log in */    
    aw_global_services_api_registry['facebook']['service_init'](aw_api_controller_sketch_start_data_pulls);
  }else{
    /* facebook is not there no need to check current log in */
    aw_api_controller_sketch_start_data_pulls();
  }
}

/******************************************************************/
/*
 *
 *
 */
function aw_api_controller_sketch_start_data_pulls(){
  aw_lib_console_log("DEBUG", "entered: aw_api_controller_sketch_start_data_pulls");
  /*initialize */
  aw_api_model_static_profile_initialize();
  aw_api_model_service_list_initialize();
  aw_api_model_interests_initialize();
  aw_api_model_trends_initialize();
  aw_api_model_mentions_initialize();
  aw_api_model_service_pouplarity_initialize();
  aw_api_view_locations_initialize_map_view(0, 0);
  
  /* prepare */ 
  $.each(aw_js_global_services_enabled.services, function(service_name, detail) { 
    var key = service_name + '_service_enabled';
    if( aw_js_global_services_user_enabled.profile[ key ] ){
      aw_lib_console_log("DEBUG", "preparing:" + service_name);
      /* add to list of services to be processed */
      aw_api_model_static_profile_add_service(service_name);
      aw_api_model_stream_view_add_service(service_name);
      aw_api_model_images_add_service(service_name);

      if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
        aw_api_model_visited_user_feed_add_service(service_name);
      }
    }
  });

  /* trigger */
  //1. Static profile section
  aw_api_model_static_profile_trigger_fetch();
  aw_api_model_stream_view_fetch();
  aw_api_model_visited_user_feed_fetch();
  if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
    aw_api_model_visited_user_feed_fetch();
  }
  aw_api_model_images_fetch();

  aw_lib_console_log("DEBUG", "exitting: aw_api_controller_sketch_start_data_pulls");

}






