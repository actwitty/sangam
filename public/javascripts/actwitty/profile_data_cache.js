the_big_profile_data_cache={};
/*
 * cache_suffixes 
 *
 * MY_CHANNELS
 * SUBSCRIBED_CHANNELS
 * ALL_CHANNELS
 *
 * MY_STREAMS
 * SUBSCRIBED_STREAMS
 * ALL_STREAMS
 *
 * MY_PICS
 * SUBSCRIBED_PICS
 * ALL_PICS
 *
 * MY_VIDEOS
 * SUBSCRIBED_VIDEOS
 * ALL_VIDEOS
 *
 */

var g_aw_filter_sensitive_cache_keys=[
                                'MY_STREAMS',
                                'SUBSCRIBED_STREAMS',
                                'ALL_STREAMS',

                                'MY_PICS',
                                'SUBSCRIBED_PICS',
                                'ALL_PICS',

                                'MY_VIDEOS',
                                'SUBSCRIBED_VIDEOS',
                                'ALL_VIDEOS'
                            ];



function aw_cache_set_into_cache(key, json){
  aw_lib_console_log("debug", "set cache entry for key: " + key);
  var page_owner = aw_lib_get_page_owner_id();
  key = key + '_' + page_owner;
  the_big_profile_data_cache[key] = json; 
}

function aw_cache_get_from_cache(key){

  aw_lib_console_log("debug", "called get  cached entry for key: " + key);
  var page_owner = aw_lib_get_page_owner_id();
  key = key + '_' + page_owner;
  var ret_json = {valid:false, value:undefined};
  if ( the_big_profile_data_cache[key] ){
    aw_lib_console_log("info", "returning cached entry for key: " + key);
    ret_json = {valid:true, value:the_big_profile_data_cache[key]};
  }
 
  return ret_json;

}

function aw_cache_reset_on_filter_change(){
  aw_lib_console_log("info", "flush cache on change of filter");
  var page_owner = aw_lib_get_page_owner_id();
  $.each(g_aw_filter_sensitive_cache_keys, function(index, key) {
    var cache_key = key + '_' + page_owner;
    if( the_big_profile_data_cache[cache_key] ){
      aw_lib_console_log("info", "deleteing cached entry for key: " + cache_key);
      delete the_big_profile_data_cache[cache_key];
    }
  });

}
