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
                                           },
                                    followers:{
                                                url: "https://api.twitter.com/1/followers/ids.json",
                                                notification_cb: null,
                                                error_timer: null
                                              },
                                    followings:{
                                                  url: "https://api.twitter.com/1/friends/ids.json",
                                                  notification_cb: null,
                                                  error_timer: null
                                               },
                                    lookup:{
                                              url: "https://api.twitter.com/1/users/lookup.json",
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
  return "http://twitter.com/#!/" + aw_api_twitter_get_visited_user_id();

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

    if( data.screen_name ){
      var url = "https://twitter.com/#!/" + data.screen_name;
      aw_api_handle_twitter_profile_pic(data.screen_name);
      aw_model_api_notify_url_twitter(url);
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
    if( key == "oauth_signature" ){
      val = encodeURIComponent(val);
    }
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
  var url = aw_twitter_get_auth_signed_url(aw_local_twitter_request_url_base['static_profile'].url,
                                           "aw_twitter_cb_static_profile",
                                           {
                                              "user_id" : aw_api_twitter_get_visited_user_id(),
                                           });
  
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
function aw_twitter_cb_lookup(tw_data){
  if(aw_local_twitter_request_url_base.lookup.notification_cb){
    if( aw_local_twitter_request_url_base.lookup.error_timer ){
       clearTimeout(aw_local_twitter_request_url_base.lookup.error_timer);
       aw_local_twitter_request_url_base.lookup.error_timer=null;
    }
    var data_arr=[];
    if( tw_data ){
      $.each(tw_data, function(index, contact){
        var follower ={
                        name: contact.name,
                        id: contact.id,
                        screen_name: contact.screen_name,
                        photo: contact.profile_image_url
                      };
        data_arr.push(follower);
      });

      aw_local_twitter_request_url_base.lookup.notification_cb('twitter', data_arr, 1);
      aw_local_twitter_request_url_base.lookup.notification_cb = null;
    }else{
      aw_local_twitter_request_url_base.lookup.notification_cb('twitter', [], 1);
      aw_local_twitter_request_url_base.lookup.notification_cb = null;
    }
  }
}
/****************************************************/
/*
 *
 *
 */
var aw_twitter_cb_err_lookup = function(){
  if(aw_local_twitter_request_url_base.lookup.notification_cb){
     aw_local_twitter_request_url_base.lookup.notification_cb('twitter', [], 2);
     aw_local_twitter_request_url_base.lookup.notification_cb = null;
  }
};

/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_lookup_contacts(fn_cb, ids_arr){
   aw_lib_console_log("DEBUG", "entered:aw_api_twitter_lookup_contacts");
   var id_str = "";
   $.each(ids_arr, function(index, id){
    if(index > 99){ /* twitter only allows 100 lookups in a go */
      return false;
    }

    if( id_str.length ){
      id_str = id_str + ',' + id;
    }else{
      id_str = '' + id;
    }
   });
   var url = aw_twitter_get_auth_signed_url(aw_local_twitter_request_url_base.lookup.url,
                                           "aw_twitter_cb_lookup",
                                           {
                                              "include_entities" : false,
                                              "user_id" : id_str,
                                           });

    aw_local_twitter_request_url_base['lookup']['notification_cb'] = fn_cb;
    aw_local_twitter_request_url_base['lookup']['error_timer'] = window.setTimeout(aw_twitter_cb_err_lookup, 10000);
    aw_twitter_trigger_get_request(url);               
}
/*****************************************************/
/*
 *
 *
 */
function aw_twitter_cb_contacts(tw_data){
  if(aw_local_twitter_request_url_base.followers.notification_cb){
    if( aw_local_twitter_request_url_base.followers.error_timer ){
       clearTimeout(aw_local_twitter_request_url_base.followers.error_timer);
       aw_local_twitter_request_url_base.followers.error_timer=null;
    }
    var id_str="";
    if( tw_data && tw_data.ids ){
      
      aw_api_twitter_lookup_contacts( aw_local_twitter_request_url_base.followers.notification_cb,
                                      tw_data.ids);
      aw_local_twitter_request_url_base.followers.notification_cb = null;
    }else{
      aw_local_twitter_request_url_base.followers.notification_cb('twitter', [], 1);
      aw_local_twitter_request_url_base.followers.notification_cb = null;
    }
  }
}
/****************************************************/
/*
 *
 *
 */
var aw_twitter_cb_err_followers = function(){
  if(aw_local_twitter_request_url_base.followers.notification_cb){
     aw_local_twitter_request_url_base.followers.notification_cb('twitter', [], 2);
     aw_local_twitter_request_url_base.followers.notification_cb = null;
  }
};
/*****************************************************/
/*
 *
 *
 */
function aw_api_twitter_get_contacts(fn_cb){

   aw_lib_console_log("DEBUG", "entered:aw_api_twitter_get_contacts");
   var url = aw_twitter_get_auth_signed_url(aw_local_twitter_request_url_base.followers.url,
                                           "aw_twitter_cb_contacts",
                                           {
                                              "include_entities" : false,
                                              "user_id" : aw_api_twitter_get_visited_user_id(),
                                           });

    aw_local_twitter_request_url_base['followers']['notification_cb'] = fn_cb;
    aw_local_twitter_request_url_base['followers']['error_timer'] = window.setTimeout(aw_twitter_cb_err_followers, 10000);
    aw_twitter_trigger_get_request(url);                                           

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
     var data_err = [];
     data_err.push(aw_api_model_twitter_inject_error_post());
     aw_local_twitter_request_url_base.feeds.notification_cb('twitter', data_err, 2);
     aw_local_twitter_request_url_base.feeds.notification_cb = null;
  }
};
/***************************************************/
/*
 *
 *
 */
var aw_twitter_cb_err_user_feed = function(){
  if(aw_local_twitter_request_url_base.user_feed.notification_cb){
     var data_err = [];
     data_err.push(aw_api_model_twitter_inject_error_post());
     aw_local_twitter_request_url_base.user_feed.notification_cb('twitter', data_err, 2);
     aw_local_twitter_request_url_base.user_feed.notification_cb = null;
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
    var url = aw_twitter_get_auth_signed_url(aw_local_twitter_request_url_base[feed_type].url,
                                           "aw_twitter_cb_user_feed",
                                           {
                                              "include_entities" : true,
                                              "include_rts" : true,
                                              "id" : aw_api_twitter_get_visited_user_id(),
                                              "count" : 200
                                           });
 
    /* authorization not needed */
    /* cache callback */
    aw_local_twitter_request_url_base['user_feed']['notification_cb'] = fn_cb;
    aw_local_twitter_request_url_base['user_feed']['error_timer'] = window.setTimeout(aw_twitter_cb_err_user_feed, 10000);
    aw_twitter_trigger_get_request( url );
  }
    
}
/***************************************************/
/*
 *
 *
 */
function aw_api_model_twitter_inject_error_post(){
  aw_lib_console_log("DEBUG", "aw_api_model_twitter_inject_error_post:Entered");
  var aw_post_json = {};
   aw_post_json["service"] = {
                              name: "twitter",
                              pid: "aw_service_error"
                            };
   aw_post_json["originator"] = {
                                    image: aw_js_global_visited_user_credentials.pic,
                                    name: aw_js_global_visited_user_credentials.name,
                                    url:  "/" + aw_js_global_visited_user_credentials.username,
                                    uid: aw_js_global_visited_user_foreign_ids.id
                                 };

   aw_post_json["timestamp"] = '';  
   aw_post_json["local_timestamp"] = 0;

   aw_post_json["text"] = "Access to Twitter data has not be authorized to you.";

   var attachment = {};
   attachment['type'] = "link";
   attachment['url'] = '/show';
   attachment['title'] = "Twitter data could not be fetched";
   attachment['image_url'] = "/images/actwitty/refactor/aw_sketch/stream_view/denied/aw_twitter_access_denied.png";

   aw_post_json['attachment'] = [attachment];

  return aw_post_json;

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
                              pid: data.id_str
                            };
  aw_post_json["timestamp"]='';
  aw_post_json["local_timestamp"]=0;
  if(  data.created_at ){
    aw_post_json["timestamp"] = data.created_at; /* convert to a common timestamp*/
    var values = data.created_at.split(" ");
    var timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    aw_post_json["local_timestamp"]  = new Date(Date.parse(timeValue)).getTime();
  }
  aw_post_json["action"] = [];
  
  if ( data.retweet_count && data.retweet_count != 0 ){
      aw_post_json["action"].push({
                                  name: data.retweet_count + ' Retweets',
                                  type: 'static'
                               });

  }

  if ( data.user ){
    aw_post_json["originator"] = {
                                    image:  data.user.profile_image_url,
                                    name: data.user.name,
                                    screen_name: '@' + data.user.screen_name,
                                    url:  'https://twitter.com/#!/' + data.user.screen_name,
                                    uid: data.user.id
                                 };
    if( aw_js_global_tw_access.uid != data.user.id 
      && data.retweeted == false){
      aw_post_json["action"].push({
                                  name: 'Retweet',
                                  type: 'link',
                                  url: 'https://twitter.com/intent/retweet?tweet_id=' + data.id_str
                               });

    }

  }

  


  
  
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
        if( url_data.url && url_data.url.length){
          var attachment = {};
          attachment['type'] = "embed";
          attachment['embed'] = url_data.url;
          attachment_arr.push(attachment);
          if( url_data.expanded_url){
            attachment['embed'] = url_data.expanded_url;
          }
        }
        var replace_url = '';
        if( !url_data.expanded_url &&
            (!url_data.url ||
            !url_data.url.length)){
            replace_url = aw_post_json.text.substr( url_data.indices[0], 
                                                  (url_data.indices[1] -
                                                  url_data.indices[0])  );
            url_data['url'] = replace_url;
            url_data['expanded_url'] = replace_url;
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
        var replace_screen_name = mentions_data.screen_name;
        if( !replace_screen_name ||
            !replace_screen_name.length ){
          replace_screen_name = aw_post_json.text.substr( mentions_data.indices[0], 
                                                          (mentions_data.indices[1] -
                                                          mentions_data.indices[0])  )
        }
        var replacement = {
                               start: mentions_data.indices[0],
                               end: mentions_data.indices[1],
                               url: "http://twitter.com/#!/" + replace_screen_name,
                               type: "mention_user"
                            };

        replacement_array.push(replacement);
         
       });
    }


    if(data.entities.media){
       $.each(data.entities.media, function(key, media_data){

        var replace_url = '';
        if( !media_data.expanded_url &&
            !media_data.url ){
          replace_url = aw_post_json.text.substr( media_data.indices[0], 
                                                  (media_data.indices[1] -
                                                  media_data.indices[0])  );
          media_data['url'] = replace_url;
          media_data['expanded_url'] = replace_url;
        }

        var replacement = {
                               start: media_data.indices[0],
                               end: media_data.indices[1],
                               url:  media_data.expanded_url,
                               type: "mention_link"
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

        var replace_hashtag = '';
        if( !hash_tag_data.text ){
          replace_hashtag = aw_post_json.text.substr( hash_tag_data.indices[0], 
                                                  (hash_tag_data.indices[1] -
                                                  hash_tag_data.indices[0])  )
          hash_tag_data['text'] = replace_hashtag;
        }

        var replacement = {
                            start: hash_tag_data.indices[0],
                            end: hash_tag_data.indices[1],
                            url: "https://twitter.com/#!/search?q=%23" + hash_tag_data.text,
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
          replace_str = '<a class="aw_text_mention ' + replace_data.type + ' " href="' + replace_data.url  +  '"  target="_blank" >' +
                          replace_str +
                        '</a>';
          aw_post_json.text = start_str + replace_str + trail_str;

       });      
    }

  }
  return aw_post_json;

}

/*****************************************************/
/*
 *
 *
 */
function aw_api_handle_twitter_profile_pic(screen_name){
  var url = 'https://api.twitter.com/1/users/profile_image?screen_name=' + screen_name + '&size=bigger';
  aw_api_model_static_profile_patch_profile_pic_cb('twitter', url);
}
