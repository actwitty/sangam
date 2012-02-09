/**********************************************************************/
/*
 *
 *
 */
var aw_local_stream_view_services_to_poll = {};
var aw_local_stream_view_processed_count = 0;
var aw_local_stream_view_total_count = 0;
var aw_local_stream_view_data_array=[];

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_stream_view_add_service(service_name){
  aw_lib_console_log("DEBUG", "Adding for stream view a service " + service_name); 
  aw_local_stream_view_services_to_poll[service_name] = 0;
  aw_local_stream_view_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_receive_stream_cb = function(service_name, data, status){
  aw_lib_console_log("DEBUG", "aw_api_model_receive_stream_cb callback: " + service_name);

  /* there must be a service which is not processed */
  if( aw_local_stream_view_services_to_poll[service_name] != null && 
      aw_local_stream_view_services_to_poll[service_name] == 0){

      aw_local_stream_view_services_to_poll[service_name] = status;
      if( status ){
        aw_local_stream_view_data_array = $.merge(aw_local_stream_view_data_array, data);
        aw_local_stream_view_processed_count++;
        if( aw_local_stream_view_processed_count == aw_local_stream_view_total_count ){
          aw_local_stream_view_data_array.sort(function (time1, time2){
                                                                      return time2.local_timestamp - time1.local_timestamp;
                                                                      });
         // aw_lib_console_log("DEBUG", "aw_api_model_receive_stream_cb callback: SORTED " + JSON.stringify(data));
          aw_api_controller_render_stream(aw_local_stream_view_data_array);
          if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
            aw_api_controller_update_active_friends(aw_local_stream_view_data_array);

          }else{
            /* tell all the guys waiting for fetching local feed */
            aw_api_controller_copy_stream_to_visited_user_feeds(aw_local_stream_view_data_array);
          }
        }

      }
  }else{
    /* why are you even here */
  }
};

/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_stream_view_fetch(){
  aw_local_stream_view=[];
  aw_lib_console_log("DEBUG", "entering:aw_api_model_stream_view_fetch");

  $.each(aw_local_stream_view_services_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_api_model_stream_view_fetch calling for " + key);
    var feed_type = "";

    if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
      feed_type = "feeds"; 
    }else{
      feed_type = "user_feed"; 
    }
    
    aw_global_services_api_registry[key]["feeds"](feed_type, aw_api_model_receive_stream_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_stream_view_fetch"); 
  
}
/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_get_base_streams(){
  return aw_local_stream_view_data_array;
}

