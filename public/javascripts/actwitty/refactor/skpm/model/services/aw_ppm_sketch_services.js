/*******************************************************/
/*
 *
 *
 */
var aw_js_local_services_list= {
                                  'facebook' : {
                                                'init' :  $(function () {
                                                                        })

                                               },
                                  'twitter' : {
                                                'init' :  $(function () {
                                                                        })
                                                    
                                              }                                               
                                    
                               };
/*******************************************************/
/*
 *
 *
 */
function aw_api_sketch_get_services_data_initialize_fn(provider){
  return aw_js_local_services_list[provider]['init'];
}

/*******************************************************/
/*
 *
 *
 */
$.aw_api_js_modal_list_new_services = function(){


  $('#aw_modal_header_h3').html('Enable more services');
  
  

  var services_icons_base = aw_js_global_services_enabled.services_icon_base_path;
  var services = aw_js_global_services_enabled.services;
  var service_list_html = '';
  
  $.each(services, function(index, service){
    service_list_html = service_list_html +
                        '<img  class="aw_ppm_sketch_service_enabled aw_js_ppm_sketch_add_service" src="' +  services_icons_base + service.inactive_icon + '" value="' + index + '" width="50px" />';
  });
  var modal_body_html = '<div class="aw_ppm_sketch_add_new_service_list">' + service_list_html + '</div>';
  $('#aw_modal_body').html(modal_body_html);
}


/*******************************************************/
/*
 *
 *
 */
function aw_api_list_user_enabled_services(){
  var services_icons_base = aw_js_global_services_enabled.services_icon_base_path;
  var services = aw_js_global_services_enabled.services;
  var service_list_html = '';
  $.each(services, function(index, service){
     if ( aw_js_global_services_user_enabled.profile &&
            aw_js_global_services_user_enabled.profile[ index + '_service_enabled' ] &&
             aw_js_global_services_user_enabled.profile[ index + '_service_enabled' ] == true ){
           service_list_html = service_list_html +
                        '<img  class="aw_ppm_sketch_service_user_enabled" src="' +  services_icons_base + service.inactive_icon + '" value="' + index + '" width="50px" />';
     }
  });
  $(".aw_ppm_sketch_service_user_enabled_list").html(service_list_html);

}

/*******************************************************/
/*
 *
 *
 */
function aw_api_sketch_initialize(){
  aw_api_list_user_enabled_services();

}

/*******************************************************/
/*
 *
 *
 */
function aw_api_check_service_enabled(provider){
  if ( 
        aw_js_global_services_user_enabled &&
        aw_js_global_services_user_enabled[ provider + '_service_enabled' ] &&
        aw_js_global_services_user_enabled[ provider + '_service_enabled' ] == true ){
    return true;
  }
  return false;

}



/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){
  

  

});
