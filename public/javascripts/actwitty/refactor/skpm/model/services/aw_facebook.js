
/*********************************************************************/
/* Facebook JSONP base url requests
 *
 *
 */
var aw_local_facebook_request_url_base = {
                                    static_profile:  "https://graph.facebook.com/{FB_USER_ID}?access_token={FB_ACCESS_TOKEN}&callback=?",
                                    user_feed: "https://graph.facebook.com/{FB_USER_ID}/feed?access_token={FB_ACCESS_TOKEN}&fields=id,from,message,link,name,picture,caption,type,source,description,place,story&limit=50&callback=?",

                                    feeds: "https://graph.facebook.com/{FB_USER_ID}/home?access_token={FB_ACCESS_TOKEN}&fields=id,from,message,link,name,picture,caption,type,source,description,place,story&limit=50&callback=?",
                                    
                                    albums: "https://graph.facebook.com/{FB_USER_ID}/albums?access_token={FB_ACCESS_TOKEN}&fields=id&limit=100&callback=?",
                                    images: "https://graph.facebook.com/{FB_USER_ID}/photos&fields=id,from,picture,source&limit=100?access_token={FB_ACCESS_TOKEN}&callback=?",

                                    videos: "https://graph.facebook.com/{FB_USER_ID}/videos?fields=id,from,name,picture,embed_html&limit=100,access_token={FB_ACCESS_TOKEN}&callback=?",

                                     post_id_list: "https://graph.facebook.com/?ids={FB_OBJECT_LISTS}&fields=id,from,message,link,name,picture,caption,type,source,description,place,story&access_token={FB_ACCESS_TOKEN}&callback=?",

                                     id_list: "https://graph.facebook.com/?ids={FB_OBJECT_LISTS}&access_token={FB_ACCESS_TOKEN}&callback=?"

                                };
/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_visited_user_id(){
  return aw_js_global_visited_user_foreign_ids['facebook'];
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_follow_url(){
  return "http://www.facebook.com/profile.php?id=" + aw_api_facebook_get_visited_user_id();
}





/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_profile(fn_cb){
  aw_lib_console_log("DEBUG", "entered:aw_api_facebook_get_profile");
  var url = aw_local_facebook_request_url_base.static_profile.
                                                              replace("{FB_ACCESS_TOKEN}", 
                                                                      aw_js_global_fb_access["token"]).
                                                              replace("{FB_USER_ID}",
                                                                      aw_api_facebook_get_visited_user_id());


   var profile_json={};
   $.jsonp({
            url: url,
            timeout: 10000,
            cache: true,
            success:
                function(data) {
        
                aw_api_cache_add_service_cache_info("facebook", "static_profile", data);



                if ( data.name )
                  profile_json['name'] = data.name;

                if ( data.location && data.location.name )
                   profile_json['location'] = data.location.name;

                if ( data.work 
                      && data.work.length 
                        && data.work[0].employer 
                          && data.work[0].employer.name )
                    profile_json['work'] = data.work[0].employer.name;

                if ( data.education ){
                  var tentative_school = null;
                  var tentative_type = 0;
                  var school_order = {
                                        "High School" : 1,
                                        "College" : 2,
                                        "Graduate School": 3
                                     };
                  $.each(data.education, function(index, school_info) { 
                    if( school_info.school && school_info.school.name ){
                      if ( school_info.type){
                        if( school_order[school_info.type]){
                          if( school_order[school_info.type] > tentative_type ){
                            tentative_school = school_info.school.name;
                            tentative_type = school_order[school_info.type];
                          }
                        }else{
                          if( tentative_school == null ){
                            tentative_school = school_info.school.name;
                            tentative_type = school_order[school_info.type];
                          }
                        }
                      }
                    }

                  });
                  if ( tentative_school ){
                    profile_json['study'] = tentative_school;
                  }
                }

                profile_json['image'] = "http://graph.facebook.com/" + aw_api_facebook_get_visited_user_id() + "/picture?type=large";
                
                
               
          },
          complete:
            function(xOptions, textStatus) {
               fn_cb("facebook", profile_json, 1);
            }
    });


  
  aw_lib_console_log("DEBUG", "returned:aw_api_facebook_get_profile");

}
/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_contacts(fn_cb){
}
/*****************************************************/
/*
 *
 *
 */
function aw_facebook_fetch_photos_for_all_albums(albums_data, fn_cb){
  var id_list = [];
  var albums_count = 0;
  
  var processed_count = 0;
  var photos_lookup_json={};
  var photos_return_array=[];

  if( albums_data.data && albums_data.data.length){
    $.each( albums_data.data, function ( key, single_album_data){
        id_list.push(single_album_data.id);
    });
  }
  
  /* add url for tagged photos */
  id_list.push( aw_api_facebook_get_visited_user_id());
  albums_count = id_list.length;
  albums_processed_count = 0;
    
  $.each( id_list, function ( key, id){ 
    var url = aw_local_facebook_request_url_base.images.
                                                      replace("{FB_ACCESS_TOKEN}", 
                                                              aw_js_global_fb_access["token"]).
                                                      replace("{FB_USER_ID}",
                                                              id);
     $.jsonp({
          url: url,
          timeout: 5000,
          success: 
              function(json) {
                var photo_data = json.data; 
                $.each(photo_data, function(key, single_photo_data){
                    /* keep track we are not repeating pictures from tags to albums*/
                    if( !single_photo_data.id || photos_lookup_json[single_photo_data.id] ){
                      return;
                    }else{
                      photos_lookup_json[single_photo_data.id] =  single_photo_data.id;
                    }

                    var photo_json = {};
                     photo_json["originator"] = {
                                  image:  "http://graph.facebook.com/" + single_photo_data.from.id + "/picture?type=square",
                                  name: single_photo_data.from.name,
                                  url:  "http://www.facebook.com/profile.php?id=" + single_photo_data.from.id,
                                  uid: single_photo_data.from.id
                               };
                     photo_json["service"] = {
                                                name: "facebook",
                                                pid: single_photo_data.id
                                              };
                     photo_json['thumb_url'] =  single_photo_data.picture;
                     photo_json['url'] =  single_photo_data.source;

                     photo_json["timestamp"] = single_photo_data.created_time;
                     photo_json["local_timestamp"] = aw_api_model_facebook_parse_date(single_photo_data.created_time).getTime();
                     photos_return_array.push(photo_json);

                });
              },
          complete:
              function(xOptions, textStatus) {
                albums_processed_count++;
                if( albums_processed_count == albums_count){
                  aw_api_cache_add_service_cache_info("facebook", "images", photos_return_array);
                  fn_cb("facebook", photos_return_array, 1);
                }
              }
    });
  });
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_images(fn_cb){
  aw_lib_console_log("DEBUG", "entered:aw_api_facebook_get_images");
  var url = aw_local_facebook_request_url_base.albums.
                                                      replace("{FB_ACCESS_TOKEN}", 
                                                                aw_js_global_fb_access["token"]).
                                                      replace("{FB_USER_ID}",
                                                                aw_api_facebook_get_visited_user_id());
  var albums_data= {};
  $.jsonp({
            url: url,
            timeout: 5000,
            success: 
                function(json) {
                  albums_data = json;

                }, 
            complete:
                function(xOptions, textStatus) {
                  aw_facebook_fetch_photos_for_all_albums(albums_data, fn_cb)
                }


    });

    
            
  
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_videos(fn_cb){
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_locations(fn_cb){
}
/***************************************************/
/*
 *
 *
 */
function aw_api_model_facebook_parse_date(fb_date){
    var year = fb_date.substr(0,4);
    var month = fb_date.substr(5,2) - 1;
    var day = fb_date.substr(8,2);
    var hour = fb_date.substr(11,2);
    var minute = fb_date.substr(14,2);
    var second = fb_date.substr(17,2);
    return new Date(year, month, day, hour, minute, second);
  }
/***************************************************/
/*
 *
 *
 */
function aw_api_model_facebook_translate_post_to_aw_post(data){
  var aw_post_json = {};
  var aw_post_list_images_fetch = [];
  var relookup_id = null;
  aw_post_json["service"] = {
                              name: "facebook",
                              pid: data.id
                            };

  aw_post_json["timestamp"] = data.created_time;
  aw_post_json["local_timestamp"] = aw_api_model_facebook_parse_date(data.created_time).getTime();
  
  if( data.from != null && data.from.id != null && data.from.name ){
    aw_post_json["originator"] = {
                                    image: "http://graph.facebook.com/" + data.from.id + "/picture?type=square",
                                    name: data.from.name,
                                    url:  "http://www.facebook.com/profile.php?id=" + data.from.id,
                                    uid: data.from.id
                                 };
  }
 
  if( data.place && data.place.name){
    aw_post_json["place"] = {
                              name: data.place.name
                            } 
    if( data.place.location &&
        data.place.location.latitude &&
        data.place.location.longitude ){
        aw_post_json["location"] = {
                              lat: data.place.location.latitude,
                              lng: data.place.location.longitude
                            } 
    }
  }

  if( data.message){
    aw_post_json["text"] = data.message;
  }else{
    if( data.story ){
      aw_post_json["text"] = data.story;
    }
  }

   var attachment = {};
   if(data.picture){

      var pic_query_string = data.picture.split("?")[1];
      var src_url_found = false;
      if(pic_query_string){
        var params_arr = pic_query_string.split("&");
        $.each(params_arr, function(key, param){
          var temp = param.split("=");
          if ( temp[0] == "src" || temp[0] == "url" ){
            try {
             attachment['image_url'] = decodeURIComponent(decodeURIComponent(temp[1].replace(/00/g,'%')));
             attachment['type'] = "link";
             src_url_found = true;
            }catch(e){
            }
          }

        });
        
        
      }

      if( !src_url_found ){
        if (data.picture.match(/(\.|\/)(gif|jpe?g|png)$/i)){
          attachment['image_url'] = data.picture;
          attachment['type'] = "link";
        }
      }


    }

  if( data.link ){
    attachment['type'] = "link";
    attachment['url'] = data.link;
    attachment['title'] = data.name;
    attachment['name'] = data.caption;
    attachment['description'] = data.description;
    
    if( !attachment['image_url'] ){
       var link_query_string = data.link.split("?")[1];
       if(link_query_string){
        var params_arr = link_query_string.split("&");
         
        var img_found = false;
        $.each(params_arr, function(key, param){
            var temp = param.split("=");
            if(temp[0] == "fbid"){
              attachment['image_url'] = "http://graph.facebook.com/" + temp[1] + "/picture";
            }

        });
      }
    }

    if(data.source){
      attachment['embed'] = data.source;
      attachment['type'] = "embed";

    }
  }
  aw_post_json['attachment'] = [attachment];

  return aw_post_json;

}
/****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_feeds(feed_type, fn_cb){
  var url = "";
  var data_json={};
  aw_lib_console_log("DEBUG", "entered:aw_api_facebook_get_feeds:" + feed_type);
  var url = aw_local_facebook_request_url_base[feed_type].
                                                          replace("{FB_ACCESS_TOKEN}", 
                                                              aw_js_global_fb_access["token"]).
                                                          replace("{FB_USER_ID}",
                                                              aw_api_facebook_get_visited_user_id());


    var data_arr = [];
    $.jsonp({
            url: url,
            timeout: 10000,
            cache: true,
            success:
                function(fb_data) {
                  aw_lib_console_log("DEBUG", "response:aw_api_facebook_get_feeds : " + feed_type);
                  aw_api_cache_add_service_cache_info("facebook", feed_type, fb_data);
                  if(fb_data.data){
                    $.each(fb_data.data, function(key,post){
                      var post_json = aw_api_model_facebook_translate_post_to_aw_post(post);
                      data_arr.push(post_json);
                      /* handle cases for missing images */
                    });
                  }
                },
            complete:
                function(fb_data) {
                     fn_cb("facebook", data_arr, 1);
                }
    });
   
}

/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_post_data_for_list_of_ids(id_list_str, fn_cb, cb_arg ){
  aw_lib_console_log("DEBUG", "entered:aw_api_facebook_get_data_for_list_of_ids");
  var url = aw_local_facebook_request_url_base.post_id_list.
                                                      replace("{FB_ACCESS_TOKEN}", 
                                                                aw_js_global_fb_access["token"]).
                                                      replace("{FB_USER_ID}",
                                                                aw_api_facebook_get_visited_user_id()).
                                                      replace("{FB_OBJECT_LISTS}",
                                                                id_list_str);
  var id_list_data= {};
  $.jsonp({
            url: url,
            timeout: 10000,
            cache: true,
            success: 
                function(json) {
                  id_list_data = json;
                }, 
            complete:
                function(xOptions, textStatus) {
                  var translated_data_array=[];
                  if( id_list_data){
                    $.each( id_list_data, function ( key, post_data){
                      translated_data_array.push(aw_api_model_facebook_translate_post_to_aw_post(post_data));
                    });
                  }
                  fn_cb(translated_data_array, cb_arg);
                }


    });
}

