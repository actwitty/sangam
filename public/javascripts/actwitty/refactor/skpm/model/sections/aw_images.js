/**********************************************************************/
/*
 *
 *
 */
var aw_local_images_services_to_poll = {};
var aw_local_images_processed_count = 0;
var aw_local_images_total_count = 0;
var aw_local_images_data_array=[];

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_images_add_service(service_name){
  aw_lib_console_log("DEBUG", "Adding for fetch images from a service " + service_name); 
  aw_local_images_services_to_poll[service_name] = 0;
  aw_local_images_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_receive_images_cb = function(service_name, data, status){
  aw_lib_console_log("DEBUG", "aw_api_model_receive_images_cb callback: " + service_name);
  /* there must be a service which is not processed */
  if( aw_local_images_services_to_poll[service_name] != null && 
      aw_local_images_services_to_poll[service_name] == 0){

      aw_local_images_services_to_poll[service_name] = status;
      if( status ){
        aw_local_images_data_array = $.merge(aw_local_images_data_array, data);
        aw_local_images_processed_count++;
        if( aw_local_images_processed_count == aw_local_images_total_count ){
          aw_local_images_data_array.sort(function (time1, time2){
                                                                    return time2.local_timestamp - time1.local_timestamp;
                                                                 });
         // aw_lib_console_log("DEBUG", "aw_api_model_receive_images_cb callback: SORTED " + JSON.stringify(data));
          aw_api_controller_render_images(aw_local_images_data_array);
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
function aw_api_model_images_fetch(){
  aw_local_images=[];
  aw_lib_console_log("DEBUG", "entering:aw_api_model_images_fetch");

  $.each(aw_local_images_services_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_api_model_images_fetch calling for " + key);
    var feed_type = "";

    aw_global_services_api_registry[key]["images"](aw_api_model_receive_images_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_images_fetch"); 
  
}


