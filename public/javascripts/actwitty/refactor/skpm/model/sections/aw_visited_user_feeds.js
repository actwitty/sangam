/**********************************************************************/
/*
 *
 *
 */
var aw_local_visited_user_feed_to_poll = {};
var aw_local_visited_user_feed_processed_count = 0;
var aw_local_visited_user_feed_total_count = 0;
var aw_local_visited_user_feed_data_array=[];

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_visited_user_feed_add_service(service_name){
  aw_lib_console_log("DEBUG", "add visited user feed serviec " + service_name); 
  aw_local_visited_user_feed_to_poll[service_name] = 0;
  aw_local_visited_user_feed_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_visited_user_feed_receive_cb = function(service_name, data, status){
  
  aw_lib_console_log("DEBUG", "aw_api_model_visited_user_feed_receive_cb callback: " + service_name);

  /* there must be a service which is not processed */
  if( aw_local_visited_user_feed_to_poll[service_name] != null && 
      aw_local_visited_user_feed_to_poll[service_name] == 0){

      aw_local_visited_user_feed_to_poll[service_name] = status;
      if( status ){
        aw_local_visited_user_feed_data_array = $.merge(aw_local_visited_user_feed_data_array, data);
        aw_local_visited_user_feed_processed_count++;
        if( aw_local_visited_user_feed_processed_count == aw_local_visited_user_feed_total_count ){
          aw_local_visited_user_feed_data_array.sort(function (time1, time2){
                                                                      return time2.local_timestamp - time1.local_timestamp;
                                                                      });
          aw_lib_console_log("DEBUG", "aw_api_model_visited_user_feed_receive_cb callback: SORTED " + JSON.stringify(data));
          aw_api_controller_notify_feed_fetched(aw_local_visited_user_feed_data_array);
        }

      }
  }else{
    /* why are you even here */
  }
}

/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_visited_user_feed_fetch(){
  aw_local_stream_view=[];
  aw_lib_console_log("DEBUG", "entering:aw_api_model_static_profile_trigger_fetch");

  $.each(aw_local_visited_user_feed_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_local_visited_user_feed_to_poll calling for " + key);
    aw_global_services_api_registry[key]["feeds"]( "user_feed", aw_api_model_visited_user_feed_receive_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_stream_view_fetch"); 
  
}
/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_get_visited_user_feeds(){
  return aw_local_visited_user_feed_data_array;
}


/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_set_visited_user_feeds(data_array){
  aw_local_visited_user_feed_data_array = data_array;
  aw_api_controller_notify_feed_fetched(aw_local_visited_user_feed_data_array);
}

