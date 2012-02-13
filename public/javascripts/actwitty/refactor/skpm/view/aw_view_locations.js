/***********************************************************/
/*
 *
 *
 */
var aw_local_geo_map=null;
function aw_api_view_locations_initialize_map_view(lat, lng){
  var visited_user_home = aw_api_controller_get_visited_user_current_location();
  var home = new google.maps.LatLng(visited_user_home.lat, 
                                    visited_user_home.lng);  
  var mapOptions = {  
    zoom:      5,  
    center:    home,  
    mapTypeId: google.maps.MapTypeId.ROADMAP  
  }  
  aw_local_geo_map = new google.maps.Map($("#aw_js_locations_map_canvas")[0], mapOptions);  

  var marker = new google.maps.Marker({  
                                        position: new google.maps.LatLng(visited_user_home.lat, 
                                                                         visited_user_home.lng),  
                                        map:      aw_local_geo_map,  
                                        title:    'Home Location : ' + visited_user_home.location,  
                                        icon:     '/images/actwitty/refactor/aw_sketch/location_pins/active/home_location.png'
                                      }); 
  marker.setAnimation(google.maps.Animation.DROP); 
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_locations_render(data){
  $.each(data, function(key, post_arr){
    $.each(post_arr,  function(key2, post){
      var marker = new google.maps.Marker({  
                                        position: new google.maps.LatLng(post.location.lat, 
                                                                         post.location.lng),  
                                        map:      aw_local_geo_map,  
                                        title:    post.place.name,  
                                        icon:     '/images/actwitty/refactor/aw_sketch/location_pins/active/' + post.service.name + '_location.png'
                                      }); 
    });
  });
}
