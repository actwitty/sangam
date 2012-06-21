/*************************************************/
/*
 *
 *
 */
function aw_api_videos_streams_pulled_cb(data){
  if( data ){
    aw_api_controller_show_videos(data);      
  }
  aw_cache_api_set_data("aw.videos", data);
}
/*************************************************/
/* 
 * 
 *
 */
function aw_api_model_videos_fetch(){
  /* make a get call to server */
  var filter = {
                  user_id : aw_js_global_visited_user_credentials.id,
                  filter: {
                            document: { 
                                        type : 'video',
                                        all: true
                                        
                                      }
                        }
               };
  aw_pulled_stream_query_filter(filter, aw_api_videos_streams_pulled_cb);
  
}
