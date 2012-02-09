/*********************************************************************/
/* Facebook JSONP base url requests
 *
 *
 */
var aw_local_twitter_request_url_base = {
                                    static_profile:  {
                                                        url: "https://api.twitter.com/1/users/show.json",
                                                        notification_cb: null,
                                                        error_timer: null

                                                     },
                                    user_feed: {
                                                    url: "https://api.twitter.com/1/statuses/user_timeline.json",
                                                    notification_cb: null,
                                                    error_timer: null
                                               },
                                    feeds: {
                                               url: "https://api.twitter.com/1/statuses/home_timeline.json",
                                               notification_cb: null,
                                               error_timer: null
                                           }
                                };
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_visited_user_id(){
  return aw_js_global_visited_user_foreign_ids['twitter'];
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_follow_url(){
  //TODO: fix this to use screen_name
  return "http://twitter.com/" + aw_api_twitter_get_visited_user_id();
}
/*****************************************************/
/*
 *
 *
 */
function aw_twitter_cb_static_profile(data){
  if(aw_local_twitter_request_url_base.static_profile.notification_cb){
    
    aw_lib_console_log("DEBUG", "response:aw_twitter_cb_static_profile : " + JSON.stringify(data));
    aw_api_cache_add_service_cache_info("twitter", "static_profile", data);
    
    var profile_json = {};
    if( data.description ) {
      profile_json['description'] = data.description;
    }
    aw_local_twitter_request_url_base.static_profile.notification_cb('twitter', profile_json, 1);
    aw_local_twitter_request_url_base.static_profile.notification_cb = null;
  }
}

/*****************************************************/
/*
 *
 *
 */
function aw_twitter_get_auth_signed_url( twitter_url, callback_fn_name, addl_params ){
  var accessor = {
                   consumerSecret: aw_js_global_tw_access.consumer_secret,
                   tokenSecret   : aw_js_global_tw_access.secret

                 };

  var message = {  action: twitter_url + "?",
                   method: "GET",
                   parameters: []
                };
  
  message.parameters.push(['realm', twitter_url]);
  message.parameters.push(['oauth_version', '1.0']);
  message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
  message.parameters.push(['oauth_consumer_key', aw_js_global_tw_access.consumer_key]);
  message.parameters.push(['oauth_token', aw_js_global_tw_access.token]);
  
  $.each(addl_params, function(key,val){
    message.parameters.push([ key, val]);
  });
 
  message.parameters.push(['callback', callback_fn_name]);

  OAuth.completeRequest(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  
  var url= "";
  $.each(parameterMap, function(key, val) {
    if (url.length == 0){
      url = message.action + key + "=" + val;
    }else{
      url = url + "&" + key + "=" + val;
    }
    
  });
  return url;
}
/*****************************************************/
/*
 *
 *
 */
function aw_twitter_trigger_get_request( twitter_url){
  aw_lib_console_log("DEBUG", "entering: aw_twitter_trigger_get_request ");
  jQuery.ajax({ 
                url: twitter_url, 
                dataType: "jsonp",
                jsonp: false,
                type: "GET",
              });
  aw_lib_console_log("DEBUG", "returning: aw_twitter_trigger_get_request ");
}


/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_profile(fn_cb){
  aw_lib_console_log("DEBUG", "entering: aw_api_twitter_get_profile ");
  var url = aw_local_twitter_request_url_base['static_profile']['url'];
  url = url + "?id=" +  aw_api_twitter_get_visited_user_id() + "&callback=aw_twitter_cb_static_profile";
  
  /* authorization not needed */
  /* cache callback */
  aw_local_twitter_request_url_base['static_profile']['notification_cb'] = fn_cb;
  aw_twitter_trigger_get_request( url );
  aw_lib_console_log("DEBUG", "leaving: aw_api_twitter_get_profile ");
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_contacts(fn_cb){
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_images(fn_cb){
  /*************************************/
  /* no op */
  fn_cb("twitter", [], 1);
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_videos(fn_cb){
  /*************************************/
  /* no op */
  fn_cb("twitter", [], 1);
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_locations(fn_cb){
  /*************************************/
  /* no op */
  fn_cb("twitter", [], 1);
}
/*****************************************************/
/*
 *
 *
 */
function aw_twitter_cb_feeds(tw_data){
  if(aw_local_twitter_request_url_base.feeds.notification_cb){
    if( aw_local_twitter_request_url_base.feeds.error_timer ){
       clearTimeout(aw_local_twitter_request_url_base.feeds.error_timer);
       aw_local_twitter_request_url_base.feeds.error_timer=null;
    }
    var data_arr = [];
    $.each(tw_data, function(key, tweet){
      data_arr.push(aw_api_model_twitter_translate_post_to_aw_post(tweet));
    }); 
    aw_local_twitter_request_url_base.feeds.notification_cb('twitter', data_arr, 1);
    aw_local_twitter_request_url_base.feeds.notification_cb = null;
  }
}
/*****************************************************/
/*
 *
 *
 */
function aw_twitter_cb_user_feed(tw_data){
  if(aw_local_twitter_request_url_base.user_feed.notification_cb){
    if( aw_local_twitter_request_url_base.user_feed.error_timer ){
       clearTimeout(aw_local_twitter_request_url_base.user_feed.error_timer);
       aw_local_twitter_request_url_base.user_feed.error_timer=null;
    }
    var data_arr = [];
    $.each(tw_data, function(key, tweet){
      data_arr.push(aw_api_model_twitter_translate_post_to_aw_post(tweet));
    }); 
    aw_local_twitter_request_url_base.user_feed.notification_cb('twitter', data_arr, 1);
    aw_local_twitter_request_url_base.feedsuser_feednotification_cb = null;
  }
}
/****************************************************/
/*
 *
 *
 */
var aw_twitter_cb_err_feeds = function(){
  if(aw_local_twitter_request_url_base.feeds.notification_cb){
     aw_local_twitter_request_url_base.feeds.notification_cb('twitter', [], 2);
     aw_local_twitter_request_url_base.feeds.notification_cb = null;
  }
};
/****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_feeds(feed_type, fn_cb){
  
  aw_lib_console_log("DEBUG", "entered:aw_api_twitter_get_feeds" + "feed_type");
  if( feed_type == "feeds"){
    var url = "";
    var url = aw_twitter_get_auth_signed_url(aw_local_twitter_request_url_base[feed_type].url,
                                           "aw_twitter_cb_feeds",
                                           {
                                              "include_entities" : true,
                                              "include_rts" : true,
                                              "id" : aw_api_twitter_get_visited_user_id(),
                                              "count" : 200
                                           });

    aw_local_twitter_request_url_base['feeds']['notification_cb'] = fn_cb;
    aw_local_twitter_request_url_base['feeds']['error_timer'] = window.setTimeout(aw_twitter_cb_err_feeds, 10000);
    aw_twitter_trigger_get_request(url);                                           

  }else{
    var url = aw_local_twitter_request_url_base['user_feed']['url'];
    url = url + "?id=" +  aw_api_twitter_get_visited_user_id() + "&callback=aw_twitter_cb_user_feed";
  
    /* authorization not needed */
    /* cache callback */
    aw_local_twitter_request_url_base['user_feed']['notification_cb'] = fn_cb;
    aw_local_twitter_request_url_base['feeds']['error_timer'] = window.setTimeout(aw_twitter_cb_err_feeds, 10000);
    aw_twitter_trigger_get_request( url );
  }
    
}

/***************************************************/
/*
 *
 *
 */
function aw_api_model_twitter_translate_post_to_aw_post(data){
  var aw_post_json = {};
  aw_post_json["service"] = {
                              name: "twitter",
                              pid: data.id
                            };

  aw_post_json["timestamp"] = data.created_at; /* convert to a common timestamp*/
  var values = data.created_at.split(" ");
  var timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  aw_post_json["local_timestamp"]  = new Date(Date.parse(timeValue)).getTime();
  
  aw_post_json["originator"] = {
                                    image:  data.user.profile_image_url,
                                    name: data.user.name,
                                    screen_name: data.user.screen_name,
                                    url:  'https://twitter.com/#!/' + data.user.screen_name,
                                    uid: data.user.id
                                 };

  if( data.place && data.place.name){
    var location_name = data.place.name;
    if( data.place.full_name ){
      var location_name = data.place.full_name;
    }
    aw_post_json["place"] = {
                              name: location_name
                            }; 
    if( data.place.bounding_box ){
        if( data.place.bounding_box.type == "Polygon" ){
          if( data.place.bounding_box.coordinates &&
               data.place.bounding_box.coordinates.length &&
                 data.place.bounding_box.coordinates[0].length ){
                    /* first polygon, first point */
                    aw_post_json["location"] = {
                                                  lat: data.place.bounding_box.coordinates[0][0][0],
                                                  lng: data.place.bounding_box.coordinates[0][0][1],
                                               } ;
          }
        }else if( data.place.bounding_box.type == "Point" ){
          if( data.place.bounding_box.coordinates &&
               data.place.bounding_box.coordinates.length ){
              /* first point */
                aw_post_json["location"] = {
                                              lat: data.place.bounding_box.coordinates[0][0],
                                              lng: data.place.bounding_box.coordinates[0][1],
                                            } ;
          }
        }
    }
  }

  if( data.geo){
    if(!aw_post_json.place){
      aw_post_json["place"] = {
                              name: "reverse geocode needed" 
                            }; 
    }
    if(data.geo.type == "Point" &&
        data.geo.coordinates &&
          data.geo.coordinates.length ){
                aw_post_json["location"] = {
                                              lat: data.geo.coordinates[0],
                                              lng: data.geo.coordinates[1],
                                            } ;
    }
  }
                            

  if( data.text){
    aw_post_json["text"] = data.text;
  }

  if( data.entities ){

    var attachment_arr = [];

    var replacement_array = [];
    /* url, type, start, end */
    if(data.entities.urls){
      $.each(data.entities.urls, function(key, url_data){
        var attachment = {};
        attachment['type'] = "embed";
        attachment['embed'] = data.url;
        attachment_arr.push(attachment);
        if( url_data.expanded_url){
          attachment['embed'] = url_data.expanded_url;
        }
        
        var replacement = {
                              start: url_data.indices[0],
                              end: url_data.indices[1],
                              url: url_data.url,
                              type: "mention_link"
                          };

        replacement_array.push(replacement);

      });

    }
    aw_post_json['attachment'] = attachment_arr;


    if(data.entities.user_mentions){
       $.each(data.entities.user_mentions, function(key, mentions_data){
        var replacement = {
                               start: mentions_data.indices[0],
                               end: mentions_data.indices[1],
                               url: "http://twitter.com/#!/" + mentions_data.screen_name,
                               type: "mention_user"
                            };

            replacement_array.push(replacement);
         
       });
    }

    if(data.entities.media){
       $.each(data.entities.user_mentions, function(key, media_data){
        var replacement = {
                               start: media_data.indices[0],
                               end: media_data.indices[1],
                               url:  media_data.expanded_url,
                               type: "mention_user"
                            };

         replacement_array.push(replacement);
         if( media_data.type == "photo" ){
           var attachment = {};
           attachment['type'] = "link";
           attachment['image_url'] = media_data.url;
           attachment['type'] = "link";
           attachment['url'] = media_data.url;
           attachment_arr.push(attachment);
         }
           
       });
    }

    if(data.entities.hashtags){
       $.each(data.entities.hashtags, function(key, hash_tag_data){
        var replacement = {
                            start: hash_tag_data.indices[0],
                            end: hash_tag_data.indices[1],
                            url: "https://twitter.com/#!/search?q=#" + hash_tag_data.text,
                            type: "mention_hashtag"
                           };

        replacement_array.push(replacement);
      });

    }

    if( replacement_array.length > 0){
      replacement_array.sort(function(tag1, tag2){                       
                                                    return (tag2.start - tag1.start);
                                                 });
      

       $.each(replacement_array, function(key, replace_data){
          var start_str="", replace_str="", trail_str="";
          var length = aw_post_json.text.length;

          if( replace_data.start ){
            start_str = aw_post_json.text.substr(0, replace_data.start);
          }

          var replace_str = aw_post_json.text.substr( replace_data.start,  
                                                         (replace_data.end - replace_data.start));
          


          if( replace_data.end < length ){
            var trail_str = aw_post_json.text.substr(replace_data.end);
          }
       
          //Exception to view handling but I see no go to this 
          replace_str = '<a class="aw_text_mention ' + replace_data.type + ' " href="' + replace_data.url  +  '" >' +
                          replace_str +
                        '</a>';
          aw_post_json.text = start_str + replace_str + trail_str;

       });      
    }

  }
  return aw_post_json;

}
