/*********************************************************/
/*
 *
 *
 */
function aw_api_model_service_list_initialize(){
  var view_json = {};
  var aw_services_list = aw_js_global_services_enabled.services;
  var user_enabled_services = aw_js_global_services_user_enabled;

  var services_icon_base = aw_js_global_services_enabled.services_icon_base_path;

  $.each(aw_services_list, function(service_name, service_details) {
    var user_enabled_key = service_name + "_service_enabled";
    if ( user_enabled_services[user_enabled_key] && 
              user_enabled_services[user_enabled_key] == true ){
      
        view_json[service_name] = {
                                      name: aw_services_list[service_name].name,
                                      icon: services_icon_base + "/" + aw_services_list[service_name].active_icon,
                                      url: aw_global_services_api_registry[service_name].follow_url(),

                                  };
      
    }else{
        var service_auth_url = '#';
        if( aw_services_list[service_name].enabled ){
          service_auth_url = '/users/auth/' + service_name;
        }
        view_json[service_name] = {
                                      name: aw_services_list[service_name].name,
                                      icon: services_icon_base + "/" + aw_services_list[service_name].inactive_icon,
                                      url: service_auth_url

                                  };      
    }
    
  });

  aw_api_controller_render_services_list(view_json);
}

/**********************************************************************/
/*
 *
 *
 */
function aw_model_api_notify_url_twitter(url){
  aw_controller_api_modify_twitter_url(url);
}
