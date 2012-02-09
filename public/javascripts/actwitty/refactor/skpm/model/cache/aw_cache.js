/*****************************************************/
/*
 * This is a global cache of feeds fetched from source services
 */
var aw_local_cache_services = {};

/*
 * Cache is headed under the sections of
 * Information -> used to generate static profile
 * Feeds -> Feeds fetched for the case of current user being visited user
 * Contacts -> List of contacts of the user
 * Locations -> Locations fetched directly from the services
 * Images -> Image urls fetched directly from services
 *
   aw_service_cache_elements = {
                            information:{},
                            feeds:{},
                            contacts:{},
                            locations:{},
                            images:{}
                        };
*/


/*****************************************************/                        
/*
 * Clear service from cache
 *
 */
function aw_api_cache_clear_service_from_cache(service_name){
  if ( aw_local_cache_services[service_name] != null){
    aw_local_cache_services[service_name] = { };
  }else{
    return;
  }
}


/*****************************************************/                        
/*
 * Add a field to service json 
 * If a service is not added add it, else do nothing
 * service_name can be
 * facebook, twitter, github, linkedin, stackoverflow
 */
function aw_api_cache_add_service_cache_info(service_name, field, data){
  if ( aw_local_cache_services[service_name] == null){
    aw_local_cache_services[service_name] = { };
  }
  aw_local_cache_services[service_name][field] = data;
}

/*****************************************************/                        
/*
 * get field data of a service 
 * return {} json if the field is not set
 */
function aw_api_cache_get_service_field_data(service_name, field){
  if ( aw_local_cache_services[service_name] == null || 
       aw_local_cache_services[service_name][field] == null){
    return {};
  }
  return aw_local_cache_services[service_name][field];
}
