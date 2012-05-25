
var aw_locations_data_updates={};

/**********************************************************/
/*
 *
 *
 */
function aw_api_model_location_get_visited_user_current_location(){
  var location = {
                    location: aw_js_global_visited_user_credentials.location,
                    country: aw_js_global_visited_user_credentials.country,
                    lat: aw_js_global_visited_user_credentials.lat,
                    lng: aw_js_global_visited_user_credentials.lng
                 };
   return location;
}
/*************************************************/
/*
 *
 *
 */
function aw_api_locations_streams_pulled_cb(data){
  if( data ){
    $.each(data, function(key, post){
      if( post.location ){
        var id = post.service.name + '_' +
                 post.originator.uid + '_' +
                 post.location.lat + '_' +
                 post.location.lng;
        if ( aw_locations_data_updates[id] ){
          aw_locations_data_updates[id].push(post);
        }else{
          aw_locations_data_updates[id] = [ post ];
        }
      }
    });
    aw_api_controller_locations_render(aw_locations_data_updates);
  }

}
/*************************************************/
/* 
 * 
 *
 */
function aw_api_model_location_fetch(){
  /* make a get call to server */
  var filter = {
                  user_id : aw_js_global_visited_user_credentials.id,
                  filter: {
                            document: { 
                                        type : 'location',
                                        all: true
                                        
                                      }
                        }
               };
  aw_pulled_stream_query_filter(filter, aw_api_locations_streams_pulled_cb);
  
}/***************************************************************/
/*
 *
 *
 */
function aw_api_model_connections_update_locations(data){
  $.each(data, function(key, post){
    if( post.location ){
      var id = post.service.name + '_' +
               post.originator.uid + '_' +
               post.location.lat + '_' +
               post.location.lng;
      if ( aw_locations_data_updates[id] ){
        aw_locations_data_updates[id].push(post);
      }else{
        aw_locations_data_updates[id] = [ post ];
      }
    }
  });
  aw_api_controller_locations_render(aw_locations_data_updates);
}


