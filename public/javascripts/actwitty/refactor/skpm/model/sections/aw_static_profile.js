/*************************************************/
/* 
 * List of services which will be polled to generate
 * static profile
 *
 */
var aw_local_static_profile_services_to_poll = {};
var aw_local_static_profile_processed_count = 0;
var aw_local_static_profile_total_count = 0;
/*************************************************/
/*
 * Base json to populate in callbacks
 *
 */
var aw_local_static_profile_data_json =  {
                                            "name" : "",
                                            "image"  : "",
                                            "work" : "",
                                            "study" : "",
                                            "location" : "",
                                            "country" : "",
                                            "description" : ""
                                        };

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_static_profile_add_service(service_name){
  aw_lib_console_log("DEBUG", "Adding for static profile a service " + service_name); 
  aw_local_static_profile_services_to_poll[service_name] = 0;
  aw_local_static_profile_total_count++;
}

/*************************************************/
/*
 * These credentials are loaded as a part of the main
 * page
 */
function aw_static_profile_get_actwitty_details(){
  return aw_js_global_visited_user_credentials;
}

/*************************************************/
/*
 *
 *
 */
function aw_api_model_static_profile_initialize(){
  aw_local_static_profile_processed_count = 0;
  aw_local_static_profile_total_count = 0;
  aw_local_static_profile_data_json =  {
                                            "name" : aw_js_global_visited_user_credentials['name'],
                                            "image"  : aw_js_global_visited_user_credentials['pic'],
                                            "work" : "",
                                            "study" : "",
                                            "location" :  aw_js_global_visited_user_credentials['location'],
                                            "country" : aw_js_global_visited_user_credentials['country'],
                                            "description" : aw_js_global_visited_user_credentials.userbio

                                        };

}

/*************************************************/
/*
 * the merger code
 *
 */
function aw_static_profile_merge_to_service(service_name, data){
 $.each(aw_local_static_profile_data_json, function(key, val) {
    if( data[key] && val.length == 0 ){
      aw_local_static_profile_data_json[key] = data[key];
    }
  }); 
}


/*************************************************/
/*
 *
 *
 */
var aw_api_static_profile_fetch_cb = function(service_name, data, status){
  aw_lib_console_log("DEBUG", "static profile data callback: " + service_name + " " + JSON.stringify(data));
  /* there must be a service which is not processed */
  if( aw_local_static_profile_services_to_poll[service_name] != null && 
      aw_local_static_profile_services_to_poll[service_name] == 0){

      aw_local_static_profile_services_to_poll[service_name] = status;
      if( status ){
        aw_static_profile_merge_to_service(service_name, data); 
        aw_local_static_profile_processed_count++;
        if( aw_local_static_profile_processed_count == aw_local_static_profile_total_count ){
            aw_api_controller_render_static_profile(aw_local_static_profile_data_json);
        }

      }
  }else{
    /* why are you even here */
  }
    
 
  
};

/*************************************************/
/*
 * These credentials are loaded as a part of the main
 * page
 * 1. Fetch one by one each service
 * 2. Set cache of the return from each service
 * 3. Report callback
 * 4. Check number of services processed successfully
 * 5. If check requirement meets, trigger render
 */
function aw_api_model_static_profile_trigger_fetch(){
  aw_lib_console_log("DEBUG", "entering:aw_api_model_static_profile_trigger_fetch");

  $.each(aw_local_static_profile_services_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "static_profile calling for " + key);
    aw_global_services_api_registry[key]["static_profile"](aw_api_static_profile_fetch_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_static_profile_trigger_fetch"); 
  
}
/*************************************************/
/*
 * apply interest string
 *
 */
function  aw_api_model_static_profile_apply_description(description){
  aw_local_static_profile_data_json.description =  description; 
}


/*************************************************/
/*
 * 
 *
 */
function aw_api_model_static_profile_patch_profile_pic_cb(service, url){
  aw_api_controller_apply_profile_pic_patch(service, url);
}

