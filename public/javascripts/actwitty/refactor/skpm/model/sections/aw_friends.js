/**********************************************************************/
/*
 *
 *
 */
var aw_local_user_friends_to_pull = {};
var aw_local_user_friends_to_pulled_count = 0;
var aw_local_user_friends_to_pull_total_count = 0;
var aw_local_visited_user_friends={};

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_user_friends_add_service(service_name){
  aw_lib_console_log("DEBUG", "aw_api_model_user_friends_add_service " + service_name); 
  aw_local_user_friends_to_pull[service_name] = 0;
  aw_local_user_friends_to_pull_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_friends_fetch_cb = function(service_name, data, status){
  
  aw_lib_console_log("DEBUG", "aw_api_model_friends_fetch_cb callback: " + service_name);

  /* there must be a service which is not processed */
  if( aw_local_user_friends_to_pull[service_name] != null && 
      aw_local_user_friends_to_pull[service_name] == 0){

      aw_local_user_friends_to_pull[service_name] = status;
      aw_local_visited_user_friends[service_name] = data;
      if( status ){
        aw_local_user_friends_to_pulled_count++;
        if( aw_local_user_friends_to_pulled_count == aw_local_user_friends_to_pull_total_count ){
            aw_api_controller_show_invitables_render(aw_local_visited_user_friends);
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
function aw_api_model_visited_user_friends_fetch(){
  aw_lib_console_log("DEBUG", "entering:aw_api_model_static_profile_trigger_fetch");

  $.each(aw_local_user_friends_to_pull, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_local_user_friends_to_pull calling for " + key);
    aw_global_services_api_registry[key]["contacts"]( aw_api_model_friends_fetch_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_stream_view_fetch"); 
  
}
/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_get_user_friends(){
  return aw_local_visited_user_friends;
}




