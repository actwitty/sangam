var aw_connections_data_updates={};

/********************************************************/
/*
 *
 *
 */
function aw_api_model_connections_update_active_friends(data){
   aw_connections_data_updates={};
   $.each(data, function(key, post) {
    var hash_id = post.service.name + '_' +  post.originator.uid;
    if ( aw_connections_data_updates[hash_id] ){
      aw_connections_data_updates[hash_id].push(post);
    }else {
      aw_connections_data_updates[hash_id] = [ post ];
    }
    
   });
   aw_api_controller_connections_active_friends_render(aw_connections_data_updates);
 
}
/********************************************************/
/*
 *
 *
 */
function aw_api_model_get_active_contact_stream(key){
  return aw_connections_data_updates[key];
}
