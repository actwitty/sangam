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

/*************************************************/
/* 
 * List of services which will be polled to generate
 * static profile
 *
 */
var aw_local_static_profile_services_to_poll = {};
var aw_local_static_profile_processed_count = 0;
var aw_local_static_profile_total_count = 0;
/*************************************************/
/*
 * Base json to populate in callbacks
 *
 */
var aw_local_static_profile_data_json =  {
                                            "name" : "",
                                            "image"  : "",
                                            "work" : "",
                                            "study" : "",
                                            "location" : "",
                                            "country" : "",
                                            "description" : ""
                                        };

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_static_profile_add_service(service_name){
  aw_lib_console_log("DEBUG", "Adding for static profile a service " + service_name); 
  aw_local_static_profile_services_to_poll[service_name] = 0;
  aw_local_static_profile_total_count++;
}

/*************************************************/
/*
 * These credentials are loaded as a part of the main
 * page
 */
function aw_static_profile_get_actwitty_details(){
  return aw_js_global_visited_user_credentials;
}

/*************************************************/
/*
 *
 *
 */
function aw_api_model_static_profile_initialize(){
  aw_local_static_profile_processed_count = 0;
  aw_local_static_profile_total_count = 0;
  aw_local_static_profile_data_json =  {
                                            "name" : aw_js_global_visited_user_credentials['name'],
                                            "image"  : aw_js_global_visited_user_credentials['pic'],
                                            "work" : "",
                                            "study" : "",
                                            "location" :  aw_js_global_visited_user_credentials['location'],
                                            "country" : aw_js_global_visited_user_credentials['country'],
                                            "description" : ""
                                        };

}

/*************************************************/
/*
 * the merger code
 *
 */
function aw_static_profile_merge_to_service(service_name, data){
 $.each(aw_local_static_profile_data_json, function(key, val) {
    if( data[key] && val.length == 0 ){
      aw_local_static_profile_data_json[key] = data[key];
    }
  }); 
}


/*************************************************/
/*
 *
 *
 */
var aw_api_static_profile_fetch_cb = function(service_name, data, status){
  aw_lib_console_log("DEBUG", "static profile data callback: " + service_name + " " + JSON.stringify(data));
  /* there must be a service which is not processed */
  if( aw_local_static_profile_services_to_poll[service_name] != null && 
      aw_local_static_profile_services_to_poll[service_name] == 0){

      aw_local_static_profile_services_to_poll[service_name] = status;
      if( status ){
        aw_static_profile_merge_to_service(service_name, data); 
        aw_local_static_profile_processed_count++;
        if( aw_local_static_profile_processed_count == aw_local_static_profile_total_count ){
            aw_api_controller_render_static_profile(aw_local_static_profile_data_json);
        }

      }
  }else{
    /* why are you even here */
  }
    
 
  
};

/*************************************************/
/*
 * These credentials are loaded as a part of the main
 * page
 * 1. Fetch one by one each service
 * 2. Set cache of the return from each service
 * 3. Report callback
 * 4. Check number of services processed successfully
 * 5. If check requirement meets, trigger render
 */
function aw_api_model_static_profile_trigger_fetch(){
  aw_lib_console_log("DEBUG", "entering:aw_api_model_static_profile_trigger_fetch");

  $.each(aw_local_static_profile_services_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "static_profile calling for " + key);
    aw_global_services_api_registry[key]["static_profile"](aw_api_static_profile_fetch_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_static_profile_trigger_fetch"); 
  
}
/*************************************************/
/*
 * apply interest string
 *
 */
function  aw_api_model_static_profile_apply_description(description){
  aw_local_static_profile_data_json.description =  description; 
}

/*********************************************************/
/*
 *
 *
 */
function aw_api_model_service_list_initialize(){
  var view_json = {};
  var aw_services_list = aw_js_global_services_enabled.services;
  var user_enabled_services = aw_js_global_services_user_enabled;

  var services_icon_base = aw_js_global_services_enabled.services_icon_base_path;

  $.each(aw_services_list, function(service_name, service_details) {
    var user_enabled_key = service_name + "_service_enabled";
    if ( user_enabled_services[user_enabled_key] && 
              user_enabled_services[user_enabled_key] == true ){
      
        view_json[service_name] = {
                                      name: aw_services_list[service_name].name,
                                      icon: services_icon_base + "/" + aw_services_list[service_name].active_icon,
                                      url: aw_global_services_api_registry[service_name].follow_url(),

                                  };
      
    }else{
        var service_auth_url = '#';
        if( aw_services_list[service_name].enabled ){
          service_auth_url = '/users/auth/' + service_name;
        }
        view_json[service_name] = {
                                      name: aw_services_list[service_name].name,
                                      icon: services_icon_base + "/" + aw_services_list[service_name].inactive_icon,
                                      url: service_auth_url

                                  };      
    }
    
  });

  aw_api_controller_render_services_list(view_json);
}

/************************************************/
/* TEST JSON */
var aw_interest_test_json =     [ 
                                        {
                                          interest_id: 101,
                                          name: "entertainment",
                                          category: "entertainment",
                                          video: 0,
                                          image: 100,
                                          post: 10,
                                          link: 10,
                                          location: 15,
                                          mention: 21,
                                          services: [
                                                      {
                                                        name: "facebook",
                                                        share: 10
                                                      },
                                                      { name: "twitter",
                                                        share: 90}
                                                    ]
                                                          
                                        },
                                        {
                                          interest_id: 102,
                                          name: "sports",
                                          category: "sports",
                                          percentage: 10,
                                          video: 12,
                                          image: 88,
                                          post: 8888,
                                          link: 131,
                                          location: 15,
                                          mention: 21,
                                          services: [
                                                     { name: "facebook",
                                                       share: 100}
                                                    ]
                                        },
                                         {
                                          interest_id: 102,
                                          name: "games",
                                          category: "games",
                                          percentage: 10,
                                          video: 0,
                                          image: 245,
                                          post: 11,
                                          link: 0,
                                          location: 54,
                                          mention: 17,
                                          services: [
                                                     { name: "twitter",
                                                       share: 100}
                                                    ]
                                        },
                                        {
                                          interest_id: 102,
                                          name: "nonprofits",
                                          category: "nonprofits",
                                          percentage: 10,
                                          video: 0,
                                          image: 89,
                                          post: 34,
                                          link: 0,
                                          location: 3,
                                          mention: 190,
                                          services: [
                                                      {
                                                        name: "facebook",
                                                        share: 50
                                                      },
                                                      { name: "twitter",
                                                        share: 50}
                                                    ]
                                        }



                                    ];
/************************************************/
/*
 *
 *
 */
var aw_local_interest_data_json = [];
var aw_local_total_posts = 0;
/*************************************************/
/*
 *
 *
 */
function aw_api_model_interests_server_request(){

  $.ajax({

            url: "/home/get_summary.json",
            type: 'GET',
            data: { 
                    user_id :  aw_js_global_visited_user_credentials.id,
                    cache : aw_js_global_visited_user_credentials.cache_time
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              var rank = 1;
              $.each(data, function( index, summary){
                var interest_data =  {
                                          interest_id: 0,
                                          name: "Unknown",
                                          category: "Unknown",
                                          video: 0,
                                          image: 0, 
                                          post: 0, 
                                          link: 0,
                                          effort_rank: 0,
                                          location: 0,
                                          mention: 0, 
                                          services: [], 
                                          analytics:{}
                                     };
                 
                interest_data.interest_id = summary.id;
                interest_data.effort_rank = rank;
                rank++;

                if( summary.word ){
                  interest_data.name =  summary.word.name;
                }

                if( summary.category_id ){
                  interest_data.category =  summary.category_id;
                }

                if( summary.analytics_snapshot ){
                  interest_data.analytics = summary.analytics_snapshot;
                  /******************* post ************************/
                  if( summary.analytics_snapshot.posts ){  

                    if( summary.analytics_snapshot.posts &&
                        summary.analytics_snapshot.posts.counts &&
                        summary.analytics_snapshot.posts.counts.total ){
                      interest_data.post =  summary.analytics_snapshot.posts.counts.total; 
                      aw_local_total_posts += summary.analytics_snapshot.posts.counts.total;
                    }
                    if( summary.analytics_snapshot.posts.counts.services ){
                      $.each(summary.analytics_snapshot.posts.counts.services, 
                          function(service_name, post_count){
                        var service = { 
                                          name: service_name,
                                          share: (post_count/interest_data.post)*100
                                        };
                        interest_data.services.push(service);
                      });
                    }

                  }
                  
                  /**************** documents **********************/
                  if( summary.analytics_snapshot.documents &&
                      summary.analytics_snapshot.documents.counts &&
                      summary.analytics_snapshot.documents.counts.categories ){

                    if(summary.analytics_snapshot.documents.counts.categories.video
                          && summary.analytics_snapshot.documents.counts.categories.video.total){
                        interest_data.video = summary.analytics_snapshot.documents.counts.categories.video.total;
                    }

                    if(summary.analytics_snapshot.documents.counts.categories.image
                          && summary.analytics_snapshot.documents.counts.categories.image.total){
                        interest_data.image = summary.analytics_snapshot.documents.counts.categories.image.total;

                      }

                    if( summary.analytics_snapshot.documents.counts.categories.link
                          && summary.analytics_snapshot.documents.counts.categories.link.total){
                      interest_data.link = summary.analytics_snapshot.documents.counts.categories.link.total;

                    }
                  }

                  /**************** mentions **********************/
                  if( summary.analytics_snapshot.entities &&
                        summary.analytics_snapshot.entities.counts &&
                          summary.analytics_snapshot.entities.counts.total){
                    interest_data.mention = summary.analytics_snapshot.entities.counts.total;
                  }

                  /**************** location **********************/
                  if( summary.analytics_snapshot.locations &&
                        summary.analytics_snapshot.locations.counts &&
                          summary.analytics_snapshot.locations.counts.total){
                    interest_data.location = summary.analytics_snapshot.locations.counts.total;
                  }

                }

                aw_local_interest_data_json.push(interest_data);
              });
              aw_api_controller_render_interests(aw_local_interest_data_json);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_console_log("error",
                              "aw_api_model_interests_server_request:  Server request failed for " + request_tag 
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });
}

/*************************************************/
/* 
 * List of services which will be polled to generate
 * static profile
 *
 */
function aw_api_model_interests_initialize(){
  /* make a get call to server */
  aw_local_total_posts = 0;
  aw_local_interest_data_json = [];
  aw_api_model_interests_server_request();
  //TEST STUB
  //aw_api_controller_render_interests(aw_interest_test_json);
}


/*************************************************/
/*
 *
 *
 */
function aw_api_model_get_interest_sentence(){

  var adjective_map = {
                         ' always talks about ' : {
                                                    share: 100, 
                                                    topics: []
                                                  },
                         ' is dominantly at ' : {
                                                share: 60, 
                                                topics: []
                                            },
                         ' is mostly at ' : {
                                                share: 30, 
                                                topics: []
                                          },
                          ' frequently talks about ' : {
                                                share: 25, 
                                                topics: []
                                          },
                          
                         ' often talks about ' : {
                                                        share: 15, 
                                                        topics: []
                                                  },
                         ' sometimes talks about ' : {
                                                        share: 10, 
                                                        topics: []
                                                  },
                         ' occasionally shares ' :  {
                                                        share: 2, 
                                                        topics: []
                                             }
                        };
  
  


  $.each(aw_local_interest_data_json, function( index, topic_detail){
    
    var adjective = ' rarely shares ';
    var percentage = (topic_detail.post * 100)/aw_local_total_posts;
    
    $.each( adjective_map, function ( key, adjective_detail){
      if( adjective_detail.share <= percentage ){
        adjective = key; 
        return false;        
      }
    });
    adjective_map[adjective].topics.push(topic_detail.name);
    if ( index == 2 )
      return false;
  });

  var sentence = aw_js_global_visited_user_credentials.name + ' these days ';
  var dyn_sentence = "";
  var dyn_sentence_arr = [];

  $.each(adjective_map, function( adjective, adjective_detail){

      if( adjective_detail.topics.length ){
        
          if( adjective_detail.topics.length == 1){

            dyn_sentence = adjective + aw_js_categories_json[adjective_detail.topics[0]].sentence;
          }else{
            
            dyn_sentence = adjective;
            $.each(adjective_detail.topics, function( topic_idx, topic ){
              if( topic_idx == 0 ){
                dyn_sentence = dyn_sentence + aw_js_categories_json[topic].sentence;
              }else if ( topic_idx == adjective_detail.topics.length - 1){
                dyn_sentence = dyn_sentence + ', ' + aw_js_categories_json[topic].end_sentence;
              }else{
                dyn_sentence = dyn_sentence + ', ' + aw_js_categories_json[topic].sentence;
              }
            });
          }
         dyn_sentence_arr.push(dyn_sentence);
        
      }
  });
  
  $.each(dyn_sentence_arr, function(index, dyn_sentence){
    if( index == 0 ){
      sentence = sentence + dyn_sentence;
    }else if ( index == dyn_sentence_arr.length - 1){
      sentence = sentence + ' and ' + dyn_sentence;
    }else{
      sentence = sentence + ', ' + dyn_sentence;
    }  
  });
  return sentence;

}

/************************************************/
/* TEST JSON */
var aw_trends_test_json =   [ 
                                  {
                                        id: 101,
                                        title: "this week",
                                        /* interests in descending order */
                                        interests: [
                                                        {
                                                           interest_id: 101, 
                                                           name: "technology",
                                                           category: "technology",
                                                           percent: 30
                                                        },
                                                        {
                                                           interest_id: 102, 
                                                           name: "stories",
                                                           category: "stories",
                                                           percent: 20
                                                        },
                                                        {
                                                           interest_id: 101, 
                                                           name: "business",
                                                           category: "business",
                                                           percent: 15
                                                        },
                                                       {
                                                           interest_id: 0, 
                                                           name: "entertainment",
                                                           category: "entertainment",
                                                           percent: 35
                                                        },
                                                   ],
                                     },
                                  {
                                        id: 102,
                                        title: "last week",
                                        /* interests in descending order */
                                        interests: [
                                                       {
                                                          interest_id: 101, 
                                                          name : "sports",
                                                          category: "sports",
                                                          percent: 50
                                                       },
                                                       {
                                                          interest_id: 102, 
                                                          name: "entertainment",
                                                          category: "entertainment",
                                                          percent: 30
                                                       },
                                                       {
                                                           interest_id: 101, 
                                                           name: "world",
                                                          category: "world",
                                                           percent: 20
                                                        },

                                                  ],
                                    },
                                     {
                                        id: 103,
                                        title: "two weeks back",
                                        /* interests in descending order */
                                        interests: [
                                                        {
                                                           interest_id: 101, 
                                                           name: "sports",
                                                          category: "sports",
                                                           percent: 37
                                                        },
                                                        {
                                                           interest_id: 102, 
                                                           name: "entertainment",
                                                          category: "entertainment",
                                                           percent: 23
                                                        },
                                                        {
                                                           interest_id: 0, 
                                                           name: "other",
                                                          category: "other",
                                                           percent: 50
                                                        },
                                                   ],
                                     },
                                      {
                                        id: 104,
                                        title: "nearly a month back",
                                        /* interests in descending order */
                                        interests: [
                                                        {
                                                           interest_id: 101, 
                                                           name: "sports",
                                                           category: "sports",
                                                           percent: 50
                                                        },
                                                        {
                                                           interest_id: 102, 
                                                           name: "entertainment",
                                                           category: "entertainment",
                                                           percent: 50
                                                        },
                                                   ],
                                     }
                                 ];
/*************************************************/
/*
 *
 *
 */
function aw_api_model_trends_fetch_data(){
    $.ajax({
            url: "/home/get_analytics_timeline",
            type: 'GET',
            data: {
                    user_id : aw_js_global_visited_user_credentials.id,
                    cache : aw_js_global_visited_user_credentials.cache_time 
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (timeline_data) {
              var trend_data = [];
              var week_json   = {};
              var trend_timeline_data = timeline_data.trends;
              $.each( trend_timeline_data, function( week_key, week_data ){
                //var time = ('' + week_data.start_date).replace(/-/g,"/").replace(/[TZ]/g," ");
                var interests = [];
                var title = week_data.start_date;
                var cumulative_total = 0;

                if( week_data.weeks.services){
                  $.each( week_data.weeks.services, function( service_name, count){
                    cumulative_total += count;
                  });
                }

                if( week_data.weeks.topics && cumulative_total) {
                  $.each(week_data.weeks.topics, function( interest_name, data){
                  
                    if( week_data.weeks.topics[interest_name].posts &&
                          week_data.weeks.topics[interest_name].posts.counts &&
                            week_data.weeks.topics[interest_name].posts.counts.total ){
                            var interest_json = {
                                                  interest_id: week_data.weeks.topics[interest_name].summary_id,
                                                  name: interest_name,
                                                  category: interest_name,
                                                  percent: (week_data.weeks.topics[interest_name].posts.counts.total * 100)/cumulative_total,
                                                  since: week_data.start_date,
                                                  till: week_data.end_date

                                                };
                            interests.push(interest_json);

                    }
                  });
                      

                  week_json = { 
                              'title' : title,
                              'interests' : interests
                            };   

                  trend_data.push(week_json);
                }
  
              });             
              //aw_api_controller_render_trends(time_line_data);
              aw_api_controller_render_trends(trend_data);
              aw_api_modal_handle_service_popularity(timeline_data.popularity);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
              aw_api_controller_render_trends([]);
              aw_api_modal_handle_service_popularity(null);
              aw_lib_console_log("error",
                              "aw_api_model_trends_fetch_data:  Server request failed for "  
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });
}
/*************************************************/
/* 
 * 
 *
 *
 */
function aw_api_model_trends_initialize(){
  /* make a get call to server */
  aw_api_model_trends_fetch_data();

}


/*************************************************/
/*
 *
 *
 */


/**********************************************************/
/*
 *
 *
 */

var aw_js_service_tester = [ 
                              { 
                                name: 'technology',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 100,
                                                        comments: 20,
                                                        likes: 15
                                                      },
                                            twitter: {
                                                        retweets: 20,
                                                     }
                                          }
                              },
                              { 
                                name: 'sports',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 20,
                                                        comments: 6,
                                                        likes: 17
                                                      },
                                            twitter: {
                                                        retweets: 18,
                                                     }
                                          }
                              },
                              { 
                                name: 'arts',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 78,
                                                        comments: 13,
                                                        likes: 16
                                                      },
                                            twitter: {
                                                        retweets: 65,
                                                     }
                                          }
                              },
                              { 
                                name: 'entertainment',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 63,
                                                        comments: 42,
                                                        likes: 31
                                                      },
                                            twitter: {
                                                        retweets: 24,
                                                     }
                                          }
                              },
                              { 
                                name: 'world',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 112,
                                                        comments: 321,
                                                        likes: 21
                                                      },
                                            twitter: {
                                                        retweets: 23,
                                                     }
                                          }
                              }
                                               
                                                
                          ];
/****************************************************/
/*
 *
 *
 */
function aw_api_modal_handle_service_popularity(input_data){
  var popularity_data = [];
  if( input_data ) {

    $.each( input_data, function( interest_name, interest_data ){
      if(interest_data.source_actions){

        var interest = {
                          name : interest_name,
                          id : interest_data.summary_id,
                          services: {}
                        };
        if( interest_data.source_actions.counts &&
              interest_data.source_actions.counts.actions){
          $.each(interest_data.source_actions.counts.actions, 
                        function( action_name, action_data ){

              if( action_data.services ){
                $.each( action_data.services, function( service_name, count ){
                  if( !interest.services[service_name] ){
                    interest.services[service_name] = {};
                  }

                  interest.services[service_name][action_name] = count;
                });
              }

          });


        }
        popularity_data.push(interest);
      }
    });
            
    aw_api_view_service_popularity_render(popularity_data);
  }
}
/****************************************************/
/*
 *
 *
 */
function aw_api_model_service_pouplarity_initialize(){
  /* make a get call to server */
}



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

/***************************************************************/
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



/****************************************************/
/*
 *
 *
 */
var aw_js_mentions_test = {
                              "stories"  :  [
                                                  {
                                                   count : 3,
                                                   id : 1,
                                                   name : "Pizza",
                                                   image : "https://usercontent.googleapis.com/freebase/v1/image/en/bob_dylan",
                                                   description : "https://www.googleapis.com/freebase/v1/text/en/bob_dylan",
      
                                                   source_name : "twitter",
                                                   source_msg_id :  "12233" 
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 2,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 3,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 14,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 12,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  }                                                  
                                                ],
                              "technology"  :  [
                                                  {
                                                   count : 3,
                                                   id : 16,
                                                   name : "Pizza",
                                                   image : "https://usercontent.googleapis.com/freebase/v1/image/en/bob_dylan",
                                                   description : "https://www.googleapis.com/freebase/v1/text/en/bob_dylan",
      
                                                   source_name : "twitter",
                                                   source_msg_id :  "12233"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 17,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 18,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 19,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  }                                                                                                    
                                                ],
                              "entertainment"  :  [
                                                   {
                                                   count : 3,
                                                   id : 10,
                                                   name : "Pizza",
                                                   image : "https://usercontent.googleapis.com/freebase/v1/image/en/bob_dylan",
                                                   description : "https://www.googleapis.com/freebase/v1/text/en/bob_dylan",
      
                                                   source_name : "twitter",
                                                   source_msg_id :  "12233"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 13,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 14,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },                                                  
                                                  {
                                                   count : 3,
                                                   id : 2,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },          
                                                  {
                                                   count : 3,
                                                   id : 3,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  }                                                                                                    
                                                ],
                                    "games"  :  [
                                                  {
                                                   count : 3,
                                                   id : 15,
                                                   name : "Pizza",
                                                   image : "https://usercontent.googleapis.com/freebase/v1/image/en/bob_dylan",
                                                   description : "https://www.googleapis.com/freebase/v1/text/en/bob_dylan",
      
                                                   source_name : "twitter",
                                                   source_msg_id :  "12233",
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 16,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 17,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 18,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 13,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  }                                                  
                                                ],
                                   "world"  :  [
                                                  {
                                                   count : 3,
                                                   id : 2,
                                                   name : "Pizza",
                                                   image : "https://usercontent.googleapis.com/freebase/v1/image/en/bob_dylan",
                                                   description : "https://www.googleapis.com/freebase/v1/text/en/bob_dylan",
      
                                                   source_name : "twitter",
                                                   source_msg_id :  "12233"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 3,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 16,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  }                                                                                                    
                                                ], 
                                   "products"  :  [
                                                  {
                                                   count : 3,
                                                   id : 1,
                                                   name : "Pizza",
                                                   image : "https://usercontent.googleapis.com/freebase/v1/image/en/bob_dylan",
                                                   description : "https://www.googleapis.com/freebase/v1/text/en/bob_dylan",
      
                                                   source_name : "twitter",
                                                   source_msg_id :  "12233"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 2,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 14,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 16,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  },
                                                  {
                                                   count : 3,
                                                   id : 18,
                                                   source_name :"facebook",
                                                   source_msg_id :  "267401179951379_373759045982258"
                                                  }                                                                                                                                                      
                                                ]                                                 

                          };

/****************************************************************/
/*
 *
 *
 */
var aw_pulled_mentions_handler_registry = {
                                            "facebook": function(context){
                                              aw_pulled_mention_facebook_handler(context);
                                            }                                           
                                         };
/*****************************************************************/
/*
*
*
*/
function aw_pulled_mentions_verified_facebook_cb(facebook_data, context){
  var mentions_cookie = {};
  var entity_list = "";
  $.each( facebook_data, function( index, post_data ){
    var pid = post_data.service.pid;
    if(context.foreign_id_look_up["facebook"][pid]){
      var array_offsets = context.foreign_id_look_up["facebook"][pid];
      $.each( array_offsets, function( index, offset){
         var mention_data = context.data_array[offset];
         var mention_id = mention_data.id;

         if(context.data_id_look_up["facebook"][mention_id]['cached']){

            context.data_array[offset]['name'] = context.data_id_look_up["facebook"][mention_id]['name']; 
            context.data_array[offset]['image'] = context.data_id_look_up["facebook"][mention_id]['image'];
            context.data_array[offset]['description'] = context.data_id_look_up["facebook"][mention_id]['description'];
            context.data_array[offset]['process']="done";
         }else{

            if( !context.relook.length ){
              context.relook = context.relook + mention_id;
            }else{
              context.relook = context.relook + "," +mention_id;              
            }
            context.data_array[offset]['process']="done";

         }

      });
    }

  });

 context.awaited_count--;
 if( !context.awaited_count ){
  aw_mentions_verified_fetch_details(context); 
 }

}
/****************************************************************/
/*
 *
 *
 */
function aw_pulled_mention_facebook_handler(context){
  var fb_data = context['services']['facebook'];
  var id_list_str = "";
  $.each( fb_data, function( index, post_id ){   
    if( id_list_str.length ){
      id_list_str = id_list_str + ',' + post_id;
    }else{
      id_list_str = post_id;
    }
                                                
  });
  aw_api_facebook_get_post_data_for_list_of_ids( id_list_str,
                                                 aw_pulled_mentions_verified_facebook_cb,
                                                 context);
}

/*****************************************************/
/*
 *
 *
 */
function aw_pulled_mentions_process_for_verification(context){
  $.each( context.services, function(service_name, id_list){
    if( aw_pulled_mentions_handler_registry[service_name] != null){
      context.awaited_count++;
      aw_pulled_mentions_handler_registry[service_name](context);
    }
  });

  if( !context.awaited_count ){
    aw_verified_mentions_render_all(context);
  }
}

/****************************************************/
/*
 *
 *
 */
function aw_mentions_verified_fetch_details(context){
  $.ajax({
            url: "/home/get_entities_verified",
            type: 'GET',
            data: {
                    user_id : aw_js_global_visited_user_credentials.id,
                    entity_ids : context.relook,
                    cache : aw_js_global_visited_user_credentials.cache_time
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (mentions_data) {
              $.each( mentions_data, function( index, mention_data ){
                  var services_json = context.data_id_look_up;
                  $.each( services_json, function( service_name, per_mention_offests){

                    if( per_mention_offests[mention_data.id] ) {
                      var array_offsets = per_mention_offests[mention_data.id].array_offset;                    
                      if( array_offsets ) {
                        $.each( array_offsets, function( offset_index, offset){
                          if( !context.data_array[offset]['image'] &&
                               context.data_array[offset]['process'] == "done"){
                            if( mention_data.name ){
                              context.data_array[offset]['name'] = mention_data.name;
                            }

                            if( mention_data.image ){
                              context.data_array[offset]['image'] = mention_data.image;
                            }

                            if( mention_data.description ){
                              context.data_array[offset]['description'] = mention_data.description;
                            }
  
                          }
                            
                        });
                      }
                    }
                  });

              });             
               
              aw_verified_mentions_render_all(context);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
              aw_verified_mentions_render_all(context);
              aw_lib_console_log("error",
                              "aw_mentions_verified_fetch_details:  Server request failed for " + request_tag 
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });  
}


/****************************************************/
/*
 *
 *
 */
function aw_process_pulled_mention_data(data){
  var context={};
  context['fetched_data'] = data;
  context['data_array'] = [];
  context['data_id_look_up'] = {};
  context['foreign_id_look_up'] = {};
  context['services'] = {};
  context['verified'] = {};
  context['relook'] = "";
  context['awaited_count'] = 0;
  
  /* get a processable json ready and we are good */
  $.each(data, function( interest_name, mention_arr){
    if( mention_arr.length ){  
      $.each(mention_arr, function( index, mention_data){
        mention_data["interest_name"] = interest_name;
        
        if(  mention_data.image &&
               context.data_id_look_up[mention_data.source_name] &&
               context.data_id_look_up[mention_data.source_name][mention_data.id]){
               
               /* cache whatever is already found and be happy */
               context.data_id_look_up[mention_data.source_name][mention_data.id].verify = false;
        }       
        
        mention_data["process"] = "done";                 

        /* add all let verify and process decide the things */
        context.data_array.push(mention_data);

        /************/
        if( !context.data_id_look_up[mention_data.source_name] ){
          context.data_id_look_up[mention_data.source_name] = {};
        }

        if( !context.data_id_look_up[mention_data.source_name][mention_data.id]){
          context.data_id_look_up[mention_data.source_name][mention_data.id] = {
                                                                  "cached" : false,
                                                                  "array_offset" : [ context.data_array.length - 1 ]
                                                                              };
        }else{
          context.data_id_look_up[mention_data.source_name][mention_data.id].array_offset.push(context.data_array.length - 1);
        }

        var verify = true;
        if( mention_data.image ){
          verify = false;
          /* cache this to not fetch again from server */
          context.data_id_look_up[mention_data.source_name][mention_data.id]['cached'] = true;
          context.data_id_look_up[mention_data.source_name][mention_data.id]['name'] = mention_data.name;
          context.data_id_look_up[mention_data.source_name][mention_data.id]['image'] = mention_data.image;
          context.data_id_look_up[mention_data.source_name][mention_data.id]['description'] = mention_data.description;
        }

        if( verify ){      
          context.data_array[context.data_array.length - 1]["process"] = "awaited"; 
          /************/
          if( !context.foreign_id_look_up[mention_data.source_name] ){
                context.foreign_id_look_up[mention_data.source_name] = {};
          }
          
          if(  !context.foreign_id_look_up[mention_data.source_name][mention_data.source_msg_id]){
            context.foreign_id_look_up[mention_data.source_name][mention_data.source_msg_id] = [];
          }
          context.foreign_id_look_up[mention_data.source_name][mention_data.source_msg_id].push(context.data_array.length - 1);
          
          /************/
          if( !context.services[mention_data.source_name] ){
            context.services[mention_data.source_name] = [];
          }
          /* add the id to verify */
          context.services[mention_data.source_name].push(mention_data.source_msg_id);
        }

      });
    }
  });
  aw_pulled_mentions_process_for_verification(context);
}
/****************************************************/
/*
 *
 *
 */  
function aw_api_model_fetch_mentions(){
  $.ajax({

            url: "/home/get_entities.json",
            type: 'GET',
            data: { 
                    user_id :  aw_js_global_visited_user_credentials.id,
                    cache : aw_js_global_visited_user_credentials.cache_time                    
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              aw_process_pulled_mention_data(data);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
              aw_lib_console_log("error",
                              "aw_api_model_fetch_mentions:  Server request failed for " + request_tag 
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });
}

/****************************************************/
/*
 *
 *
 */
function aw_verified_mentions_render_all(context){
  aw_api_controller_render_mentions(context.data_array);
}

/****************************************************/
/*
 *
 *
 */                                         
function aw_api_model_mentions_initialize(){
  /* make a get call to server */
  aw_api_model_fetch_mentions();
}



/*************************************************/
/*
 *
 *
 */
function aw_api_videos_streams_pulled_cb(data){
  if( data ){
    aw_api_controller_show_videos(data);      
  }

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

/**********************************************************************/
/*
 *
 *
 */
var aw_local_images_services_to_poll = {};
var aw_local_images_processed_count = 0;
var aw_local_images_total_count = 0;
var aw_local_images_data_array=[];

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_images_add_service(service_name){
  aw_lib_console_log("DEBUG", "Adding for fetch images from a service " + service_name); 
  aw_local_images_services_to_poll[service_name] = 0;
  aw_local_images_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_receive_images_cb = function(service_name, data, status){
  aw_lib_console_log("DEBUG", "aw_api_model_receive_images_cb callback: " + service_name);
  /* there must be a service which is not processed */
  if( aw_local_images_services_to_poll[service_name] != null && 
      aw_local_images_services_to_poll[service_name] == 0){

      aw_local_images_services_to_poll[service_name] = status;
      if( status ){
        aw_local_images_data_array = $.merge(aw_local_images_data_array, data);
        aw_local_images_processed_count++;
        if( aw_local_images_processed_count == aw_local_images_total_count ){
          aw_local_images_data_array.sort(function (time1, time2){
                                                                    return time2.local_timestamp - time1.local_timestamp;
                                                                 });
         // aw_lib_console_log("DEBUG", "aw_api_model_receive_images_cb callback: SORTED " + JSON.stringify(data));
          aw_api_controller_render_images(aw_local_images_data_array);
        }

      }
  }else{
    /* why are you even here */
  }
};

/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_images_fetch(){
  aw_local_images=[];
  aw_lib_console_log("DEBUG", "entering:aw_api_model_images_fetch");

  $.each(aw_local_images_services_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_api_model_images_fetch calling for " + key);
    var feed_type = "";

    aw_global_services_api_registry[key]["images"](aw_api_model_receive_images_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_images_fetch"); 
  
}



/**********************************************************************/
/*
 *
 *
 */
var aw_local_stream_view_services_to_poll = {};
var aw_local_stream_view_processed_count = 0;
var aw_local_stream_view_total_count = 0;
var aw_local_stream_view_data_array=[];

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_stream_view_add_service(service_name){
  aw_lib_console_log("DEBUG", "Adding for stream view a service " + service_name); 
  aw_local_stream_view_services_to_poll[service_name] = 0;
  aw_local_stream_view_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_receive_stream_cb = function(service_name, data, status){
  aw_lib_console_log("DEBUG", "aw_api_model_receive_stream_cb callback: " + service_name);

  /* there must be a service which is not processed */
  if( aw_local_stream_view_services_to_poll[service_name] != null && 
      aw_local_stream_view_services_to_poll[service_name] == 0){

      aw_local_stream_view_services_to_poll[service_name] = status;
      if( status ){
        aw_local_stream_view_data_array = $.merge(aw_local_stream_view_data_array, data);
        aw_local_stream_view_processed_count++;
        if( aw_local_stream_view_processed_count == aw_local_stream_view_total_count ){
          aw_local_stream_view_data_array.sort(function (time1, time2){
                                                                      return time2.local_timestamp - time1.local_timestamp;
                                                                      });
         // aw_lib_console_log("DEBUG", "aw_api_model_receive_stream_cb callback: SORTED " + JSON.stringify(data));
          aw_api_controller_render_stream(aw_local_stream_view_data_array);
          if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
            aw_api_controller_update_active_friends(aw_local_stream_view_data_array);

          }else{
            /* tell all the guys waiting for fetching local feed */
            aw_api_controller_copy_stream_to_visited_user_feeds(aw_local_stream_view_data_array);
          }
        }

      }
  }else{
    /* why are you even here */
  }
};

/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_stream_view_fetch(){
  aw_local_stream_view=[];
  aw_lib_console_log("DEBUG", "entering:aw_api_model_stream_view_fetch");

  $.each(aw_local_stream_view_services_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_api_model_stream_view_fetch calling for " + key);
    var feed_type = "";

    if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
      feed_type = "feeds"; 
    }else{
      feed_type = "user_feed"; 
    }
    
    aw_global_services_api_registry[key]["feeds"](feed_type, aw_api_model_receive_stream_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_stream_view_fetch"); 
  
}
/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_get_base_streams(){
  return aw_local_stream_view_data_array;
}


/**********************************************************************/
/*
 *
 *
 */
var aw_local_visited_user_feed_to_poll = {};
var aw_local_visited_user_feed_processed_count = 0;
var aw_local_visited_user_feed_total_count = 0;
var aw_local_visited_user_feed_data_array=[];

/*************************************************/
/*
 * append the service to the list of services
 *
 */
function aw_api_model_visited_user_feed_add_service(service_name){
  aw_lib_console_log("DEBUG", "add visited user feed serviec " + service_name); 
  aw_local_visited_user_feed_to_poll[service_name] = 0;
  aw_local_visited_user_feed_total_count++;
}

/*********************************************************************/
/*
 *
 *
 */
var aw_api_model_visited_user_feed_receive_cb = function(service_name, data, status){
  
  aw_lib_console_log("DEBUG", "aw_api_model_visited_user_feed_receive_cb callback: " + service_name);

  /* there must be a service which is not processed */
  if( aw_local_visited_user_feed_to_poll[service_name] != null && 
      aw_local_visited_user_feed_to_poll[service_name] == 0){

      aw_local_visited_user_feed_to_poll[service_name] = status;
      if( status ){
        aw_local_visited_user_feed_data_array = $.merge(aw_local_visited_user_feed_data_array, data);
        aw_local_visited_user_feed_processed_count++;
        if( aw_local_visited_user_feed_processed_count == aw_local_visited_user_feed_total_count ){
          aw_local_visited_user_feed_data_array.sort(function (time1, time2){
                                                                      return time2.local_timestamp - time1.local_timestamp;
                                                                      });
          aw_lib_console_log("DEBUG", "aw_api_model_visited_user_feed_receive_cb callback: SORTED " + JSON.stringify(data));
          aw_api_controller_notify_feed_fetched(aw_local_visited_user_feed_data_array);
        }

      }
  }else{
    /* why are you even here */
  }
}

/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_visited_user_feed_fetch(){
  aw_local_stream_view=[];
  aw_lib_console_log("DEBUG", "entering:aw_api_model_static_profile_trigger_fetch");

  $.each(aw_local_visited_user_feed_to_poll, function(key, val) {
    aw_lib_console_log("DEBUG", "aw_local_visited_user_feed_to_poll calling for " + key);
    aw_global_services_api_registry[key]["feeds"]( "user_feed", aw_api_model_visited_user_feed_receive_cb);
  });
    

  aw_lib_console_log("DEBUG", "exiting:aw_api_model_stream_view_fetch"); 
  
}
/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_get_visited_user_feeds(){
  return aw_local_visited_user_feed_data_array;
}


/**********************************************************************/
/*
 *
 *
 */
function aw_api_model_set_visited_user_feeds(data_array){
  aw_local_visited_user_feed_data_array = data_array;
  aw_api_controller_notify_feed_fetched(aw_local_visited_user_feed_data_array);
}


/************************************************/
/*
 *
 *
 */
var aw_global_services_api_registry = {
                                        facebook: {
                                                      service_init:   function(fn_cb){
                                                                           aw_api_facebook_access_initialize_token(fn_cb);
                                                                           return;
                                                                      },
                                                      static_profile: function(fn_cb){
                                                                                  aw_api_facebook_get_profile(fn_cb);
                                                                                },
                                                      contacts:       function(fn_cb){
                                                                                  aw_api_facebook_get_contacts(fn_cb);                                                                                                                              },
                                                      images:         function(fn_cb){
                                                                                  aw_api_facebook_get_images(fn_cb);                                                                                                                                },
                                                      videos:         function(fn_cb){
                                                                                  aw_api_facebook_get_videos(fn_cb);                                                                                                                                },
                                                      locations:      function(fn_cb){
                                                                                  aw_api_facebook_get_locations(fn_cb);                                                                                                                             },
                                                      feeds:          function(feed_type, fn_cb){
                                                                                  aw_api_facebook_get_feeds(feed_type, fn_cb);                                                                                                                             },
                                                      
                                                      follow_url:     function(){
                                                                               return  aw_api_facebook_get_follow_url();     
                                                                        },
                                                       pid_list:      function(id_list, fn_cb, cb_arg){
                                                                                return  aw_api_facebook_get_post_data_for_list_of_ids(id_list, fn_cb, cb_arg);
                                                                                }
                                                  },
                                        twitter:  {
                                                      service_init:   function(fn_cb){
                                                                        return;
                                                                            
                                                                      },
                                                      static_profile: function(fn_cb){
                                                                                  aw_api_twitter_get_profile(fn_cb);
                                                                                },
                                                      contacts:       function(fn_cb){
                                                                                  aw_api_twitter_get_contacts(fn_cb);                                                                                                                              },
                                                      images:         function(fn_cb){
                                                                          aw_api_twitter_get_images(fn_cb);
                                                                      },
                                                      videos:         function(fn_cb){
                                                                            aw_api_twitter_get_videos(fn_cb);
                                                                      },
                                                      locations:      function(fn_cb){
                                                                                  aw_api_twitter_get_locations(fn_cb);
                                                                            },                                                    
                                                      feeds:          function(feed_type, fn_cb){
                                                                                  aw_api_twitter_get_feeds(feed_type, fn_cb);
                                                                            },
                                                     

                                                      follow_url:     function(){
                                                                               return  aw_api_twitter_get_follow_url();     
                                                                        },
                                                       pid_list:      null
                                                  }
                                      };


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

                                     id_list: "https://graph.facebook.com/?ids={FB_OBJECT_LISTS}&access_token={FB_ACCESS_TOKEN}&callback=?",
                                     likes: "https://graph.facebook.com/{FB_USER_ID}/likes?access_token={FB_ACCESS_TOKEN}&limit=300&callback=?",
                                     like_list: "https://graph.facebook.com/?access_token={FB_ACCESS_TOKEN}&ids={FB_OBJECT_LISTS}&callback=?",


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
function aw_api_model_facebook_translate_like_to_aw_post(data, like_lookup){
   var aw_post_json = {};
  
  aw_post_json["service"] = {
                              name: "facebook",
                              pid: data.id
                            };
   aw_post_json["originator"] = {
                                    image: "http://graph.facebook.com/" + aw_js_global_visited_user_foreign_ids.facebook + "/picture?type=square",
                                    name: aw_js_global_visited_user_credentials.name,
                                    url:  "http://www.facebook.com/profile.php?id=" + aw_js_global_visited_user_foreign_ids.id,
                                    uid: aw_js_global_visited_user_foreign_ids.id
                                 };

   if( data.name ){
      aw_post_json["text"] = aw_js_global_visited_user_credentials.name 
                              + " likes " 
                              + data.name  ;
   }
   
   if( like_lookup[data.id].created_time ){    
    aw_post_json["timestamp"] = like_lookup[data.id].created_time;
    aw_post_json["local_timestamp"] = aw_api_model_facebook_parse_date(like_lookup[data.id].created_time).getTime();
   }

  var attachment = {};
  if( data.link ){
    attachment['type'] = "link";
    if( data.link ){
      attachment['url'] = data.link;
    }

    if( data.name ){
      attachment['title'] = data.name;
    }

    if( data.website ){
      attachment['name'] = data.website;
    }

    if(  data.description ){
      attachment['description'] = data.description;
    }
  
    if( data.picture ){
      attachment['image_url'] = data.picture;
    }

  }


   if( data.location ){
     aw_post_json["place"] = '';
     if( data.location.street){
      
       aw_post_json["place"] = data.location.street;
     }

     if( data.location.city){
       aw_post_json["place"] = aw_post_json["place"] + ', ' + data.location.city;
     }

    if( data.location.country){
       aw_post_json["place"] = aw_post_json["place"] + ', ' + data.location.country;
     }

    if( data.location.zip){
       aw_post_json["place"] = aw_post_json["zip"] + ', ' + data.location.zip;
     }

  }

  aw_post_json['attachment'] = [attachment];
  return aw_post_json;
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
function aw_api_facebook_get_likes_data_for_list_of_ids_internal( likes_id_list_str,
                                                                 fn_cb,
                                                                 cb_arg,
                                                                 likes_data){
  var fetched_likes = {};
  if( likes_data ){
    var url = aw_local_facebook_request_url_base.like_list.
                                                      replace("{FB_ACCESS_TOKEN}", 
                                                                aw_js_global_fb_access["token"]).
                                                      replace("{FB_OBJECT_LISTS}",
                                                                likes_id_list_str);
    $.jsonp({
            url: url,
            timeout: 10000,
            cache: true,
            success: 
                function(json) {
                  fetched_likes = json;
                }, 
            complete:
                function(xOptions, textStatus) {
                  var like_lookup_json = {};
                  var translated_like_posts_array=[];
                  $.each( likes_data.data, function(index, like_data){
                    like_lookup_json[like_data.id] = like_data;
                  });


                  $.each( fetched_likes, function(index, fetched_like_data){

                    if( like_lookup_json[ fetched_like_data['id'] ]){
                      var translated_post = aw_api_model_facebook_translate_like_to_aw_post(fetched_like_data, like_lookup_json);
                      translated_like_posts_array.push(translated_post);
                    }
                  });


                  fn_cb(translated_like_posts_array, cb_arg);
                  
                 
                }
    });
  }else{
   fn_cb([], cb_arg);
  }
  
}

/*****************************************************/
/*
 *
 *
 */
//TODO: do something better
var aw_global_fb_cache_likes = null;
function aw_api_facebook_get_likes_data_for_list_of_ids( likes_id_list_str,
                                                         fn_cb,
                                                         cb_arg ){
  aw_lib_console_log("DEBUG", "entered:aw_api_facebook_process_likes_list_of_ids");
  if( !aw_global_fb_cache_likes ){
    var url = aw_local_facebook_request_url_base.likes.
                                                      replace("{FB_ACCESS_TOKEN}", 
                                                                aw_js_global_fb_access["token"]).
                                                      replace("{FB_USER_ID}",
                                                                aw_api_facebook_get_visited_user_id());
    $.jsonp({
            url: url,
            timeout: 10000,
            cache: true,
            success: 
                function(json) {
                  aw_global_fb_cache_likes = json;
                }, 
            complete:
                function(xOptions, textStatus) {
                  aw_api_facebook_get_likes_data_for_list_of_ids_internal(likes_id_list_str,
                                                                          fn_cb,
                                                                          cb_arg,
                                                                          aw_global_fb_cache_likes);  
                 
                }


    });


  }else{
           aw_api_facebook_get_likes_data_for_list_of_ids_internal(likes_id_list_str,
                                                                          fn_cb,
                                                                          cb_arg,
                                                                          aw_global_fb_cache_likes);
  }
}


/*****************************************************/
/*
 *
 *
 */
function aw_api_facebook_get_post_data_for_list_of_ids(id_list_str, 
                                                       fn_cb, 
                                                       cb_arg ){
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


/*********************************************************************/
/*
 *
 *
 */
var aw_local_fb_access_token_cb;


/**********************************************************/
/*
 *
 *
 */
function aw_facebook_access_show_dialog(fn_cb){
  aw_lib_console_log("DEBUG", "Now showing FB user login");   
  aw_local_fb_access_token_cb = fn_cb;

  $.fancybox({
        content: $('#aw_js_fb_login_modal_fancybox'),
        onClosed:function() {
                              aw_local_fb_access_token_cb();
                            }
  });
}
/*********************************************************************/
/*
 *
 *
 */
function aw_api_facebook_access_initialize_token(fn_cb){
    
  
    aw_lib_console_log("DEBUG", "entered:aw_api_facebook_access_initialize_token");
    
    if( aw_js_global_fb_access.token ){
      aw_lib_console_log("DEBUG", "entered:User has given FB access no problems");
      fn_cb();
      return;
    }
    
    FB.init({
          appId      : aw_js_global_facebook_app_id,
          channelUrl : aw_lib_get_base_url() + '/channel.html',
          status     : true, 
          cookie     : true, 
          oauth      : true, 
          xfbml      : true
        });
   aw_lib_console_log("DEBUG", "entered: FB init done");

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // the user is logged in and connected to your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire
        aw_lib_console_log("DEBUG", "FB a user who has authorized actwitty is logged in");
        var uid = response.authResponse.userID;
        aw_js_global_fb_access['token'] = response.authResponse.accessToken;
        fn_cb();
      }else if (response.status === 'not_authorized') {
        aw_lib_console_log("DEBUG", "FB detected a user login, who has not authorized Actwitty, show FB login");
        aw_facebook_access_show_dialog(fn_cb);
      }else{
        aw_lib_console_log("DEBUG", "FB user has not loggedin, show FB login");
        aw_facebook_access_show_dialog(fn_cb);        
      }
     
    });
}

/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){

  $("#aw_js_fb_login_btn").click(function(){
    aw_lib_console_log("DEBUG", "FB detected a user login, user ;lxwho has not authorized Actwitty, show FB login");
    FB.login(
        function(response) {
          if (response.authResponse) {
            aw_lib_console_log("DEBUG", "FB detected a user logged in, we got authtoken");
            aw_js_global_fb_access['token'] = response.authResponse.accessToken;
          } else {
          }

          $.fancybox.close();
          aw_local_fb_access_token_cb();
        }, 
        {
          scope: ''
        });
    return false;
  });

  $('#aw_js_local_auth_modal_close').click(function (e) {
        //Cancel the link behavior
        aw_lib_console_log("WARN", "User rejected FB login");
        e.preventDefault();
        $('#aw_js_local_auth_modal_mask, #aw_js_local_auth_modal').hide();
        aw_local_fb_access_token_cb();
    });     
     
    //if mask is clicked
    $('#aw_js_local_auth_modal_mask').click(function () {
        aw_lib_console_log("WARN", "User rejected FB login");
        $(this).hide();
        $('#aw_js_local_auth_modal').hide();
        aw_local_fb_access_token_cb();
    });         
});



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
                                              "id" : aw_api_twitter_get_visited_user_id(),
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
                                              "id" : aw_api_twitter_get_visited_user_id(),
                                              "count" : 200
                                           });
 
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
  
  if(  data.created_at ){
    aw_post_json["timestamp"] = data.created_at; /* convert to a common timestamp*/
    var values = data.created_at.split(" ");
    var timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    aw_post_json["local_timestamp"]  = new Date(Date.parse(timeValue)).getTime();
  }
 
  if ( data.user ){
    aw_post_json["originator"] = {
                                    image:  data.user.profile_image_url,
                                    name: data.user.name,
                                    screen_name: '@' + data.user.screen_name,
                                    url:  'https://twitter.com/#!/' + data.user.screen_name,
                                    uid: data.user.id
                                 };
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

/****************************************************************/
/*
 *
 *
 */
var aw_pulled_stream_services_registry = {
                                            "facebook": function(context){
                                              aw_pulled_stream_facebook_handler(context);
                                            },
                                            "twitter": function(context){
                                              aw_pulled_stream_twitter_handler(context);
                                            },
                                         };
/****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_facebook_mentions_verified_cb(mentions_data, context){
  if( mentions_data ){
    var mentions_cookie = context['services']['facebook']['mentions_cookie'];
    $.each( mentions_data, function( index, mention_data ){

        var mention = {};

        if( mention_data.name ){
          mention['name'] = mention_data.name;
        }

        if( mention_data.image ){
          mention['image'] = mention_data.image;
        }

        if( mention_data.description ){
          mention['description'] = mention_data.description;
        }


       
        var index_arr = mentions_cookie[mention_data.id];
        $.each( index_arr, function( count, post_index ){
          var mention_arr = [ mention ];
          if ( context.services.facebook.data[post_index]['mention'] ){
            mention_arr = context.services.facebook.data[post_index]['mention'];
            mention_arr.push(mention);
          }
          context.services.facebook.data[post_index]['mention'] = mention_arr;      
        });


    });

  }
  context.services.facebook['internal_processed']--;
  if(!context.services.facebook['internal_processed']){
    context.services.facebook.processed = true;
    aw_pulled_stream_assimilate_services(context); 
  }
}
/****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_facebook_likes_cb(facebook_data, context){
  if ( !aw_pulled_stream_allow_cookie(context) ){
    /* abandon */
   return;
  }
  if( context.services.facebook['data'] ){
    context.services.facebook['data'] = $.merge( context.services.facebook['data'], facebook_data);
  }else{
    context.services.facebook['data'] = facebook_data;
  }
  context.services.facebook['internal_processed']--;
  if(!context.services.facebook['internal_processed']){
    context.services.facebook.processed = true;
    aw_pulled_stream_assimilate_services(context); 
  }
}

/*****************************************************************/
/*
*
*
*/
function aw_pulled_stream_facebook_cb(facebook_data, context){
  if ( !aw_pulled_stream_allow_cookie(context) ){
    /* abandon */
   return;
  }
  var mentions_cookie = {};
  var entity_list = "";
  $.each( facebook_data, function( index, post_data ){

    var pid = post_data.service.pid;
    var post_mention_data = context['services']['facebook']['posts'][pid];
    if( post_mention_data.entities && post_mention_data.entities.array ){

      $.each( post_mention_data.entities.array, function( count, entity){
        if( entity_list.length == 0 ){
          entity_list = entity.id;
        }else{
          entity_list = entity_list + "," + entity.id;
        }

        if( mentions_cookie[entity.id] ){
          mentions_cookie[entity.id].push(index);
        }else{
          mentions_cookie[entity.id] = [index];
        }

      });

    }else{
      facebook_data[index]['mention'] = [];
    }
  });
  context.services.facebook['mentions_cookie'] = mentions_cookie;
  if( context.services.facebook['data'] ){
    context.services.facebook['data'] = $.merge( context.services.facebook['data'], facebook_data);
  }else{
    context.services.facebook['data'] = facebook_data;
  }
  aw_get_mentions_details_for_mentionlist(entity_list, aw_pulled_stream_facebook_mentions_verified_cb, context );


}

/*****************************************************************/
/*
*
*
*/
function aw_pulled_stream_facebook_handler ( context ) {
  var fb_data = context['services']['facebook'];
  var id_list_str = "";
  var like_id_list_str = "";
  $.each( fb_data.posts, function( key, post_data ){

    
    if(  post_data.post.source_object_type == "post" ){
     
     if( id_list_str.length ){
        id_list_str = id_list_str + ',' + key;
      }else{
        id_list_str = key;
      }

    }else if(post_data.post.source_object_type == "like"){

      if( like_id_list_str.length ){
        like_id_list_str = like_id_list_str + ',' + key;
      }else{
        like_id_list_str = key;
      }

    }
   
  });
  context.services.facebook['internal_processed'] = 0;
  if( id_list_str.length ){
    context.services.facebook['internal_processed']++;
    aw_api_facebook_get_post_data_for_list_of_ids( id_list_str,
                                                 aw_pulled_stream_facebook_cb,
                                                 context);
  }

  if( like_id_list_str.length ){
    context.services.facebook['internal_processed']++;
    aw_api_facebook_get_likes_data_for_list_of_ids( like_id_list_str,
                                                 aw_pulled_stream_facebook_likes_cb,
                                                 context);
  }
}


/*****************************************************************/
/*
*
*
*/

function aw_pulled_stream_twitter_handler( context ) {
 var tw_data = context['services']['twitter'];
 var aw_post_json = {};
 var twitter_data = []; 
 var json_data = null;
 $.each( tw_data.posts, function( key, post_data ){
    var aw_post_json = {};
   

    aw_post_json["originator"] = {
                                image: post_data.post.user.photo,
                                name: post_data.post.user.full_name,
                                url:  "/home/sketch?id=" + post_data.post.user.id,
                                uid: aw_js_global_visited_user_foreign_ids['twitter']
                               };


    if(post_data.post.text){
      aw_post_json["text"] = post_data.post.text;
        
    }
    if( post_data.post.if_json ){
      json_data = JSON.parse(post_data.post.text);
      var aw_post_json_temp = aw_api_model_twitter_translate_post_to_aw_post(json_data);
      aw_post_json_temp['originator'] = aw_post_json.originator;
      aw_post_json = aw_post_json_temp;
    
      if(  json_data.retweeted_status){
        aw_post_json["originator"] = {
                                image: json_data.retweeted_status.user.profile_image_url,
                                name: json_data.retweeted_status.user.name,
                                url:  'https://twitter.com/#!/' + json_data.retweeted_status.user.screen_name,
                                screen_name: '@' + json_data.retweeted_status.user.screen_name,
                                uid: aw_js_global_visited_user_foreign_ids['twitter']
                              };

      }
    }
    
    aw_post_json["service"] = {
                                name: post_data.post.source_name,
                                pid: post_data.post.source_object_id
                              };

    aw_post_json["timestamp"] = post_data.post.time;
    var values = post_data.post.time.split(" ");
    var timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    aw_post_json["local_timestamp"]  = new Date(Date.parse(timeValue)).getTime();
    if( post_data.location && post_data.location.name ){
      aw_post_json["place"] = { name: post_data.location.name};
    }
    
    if( post_data.location && 
                post_data.location.lat && 
                  post_data.location.lng ){
      aw_post_json["location"] = {
                                    lat: post_data.location.lat,
                                    lng: post_data.location.lng
                                  };
    }
    
    if( post_data.documents && post_data.documents.array ){
      var attachment_arr = [];
      $.each( post_data.documents.array, function( index, doc){
        var attachment = {};

        if( doc.type ){
          attachment['type'] = doc.type;
        }

        if( doc.url ){
          attachment['url'] = doc.url;
        }
        if( doc.name ){
          attachment['title'] = doc.name;
        }
        
        if( doc.url_description ) {
          attachment['description'] = doc.url_description;
        }

        attachment_arr.push( attachment );

      });
      aw_post_json['attachment'] = attachment_arr;
    }


    if( post_data.entities && post_data.entities.array ){
      var mention_arr = [];
      $.each( post_data.entities.array, function( index, entity){
        var mention = {};

        if( entity.name ){
          mention['name'] = entity.name;
        }

        if( entity.image ){
          mention['image'] = entity.image;
        }

        if( entity.description ){
          mention['description'] = entity.description;
        }
        
       
        mention_arr.push( mention );

      });
      aw_post_json['mention'] = mention_arr;
    }


    twitter_data.push(aw_post_json);
  });
    
    
 context.services.twitter['data'] = twitter_data;
 context.services.twitter.processed = true;
 aw_pulled_stream_assimilate_services(context); 
}
                                                            


/*****************************************************************/
/*
 *
 *
 */
var aw_local_unity_control_registry=null;

/*****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_allow_cookie(context){
  if( context.no_render_fn_cb != null){
    /* for callback based calling allow to execute */
    return true;
  }
  if( aw_local_unity_control_registry == context.cookie){
    return true;
  }
  return false;
}
/*****************************************************************/
/*
 *
 * null filter defaults to basic
 */
function aw_pulled_stream_query_filter(filter, fn_cb){
  if( filter ){
    aw_local_unity_control_registry = new Date().getTime();
    var context={
                    cookie:  aw_local_unity_control_registry,
                    test : 1
                };
    if( fn_cb != null){
      context.no_render_fn_cb = fn_cb;
    }

    filter['cache'] = aw_js_global_visited_user_credentials.cache_time;
    $.ajax({
            url: "/home/get_streams",
            type: 'GET',
            data: filter,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                /* some event might have made this redundant */
                if( !aw_pulled_stream_allow_cookie(context)){
                  /* abandon */
                  aw_local_unity_control_registry=null;
                  return;
                }

                context['aw_data'] = data;
                aw_pulled_stream_splitter(context);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
              aw_local_unity_control_registry=null;
              aw_lib_console_log("error",
                              "aw_pulled_stream_query_filter:  Server request failed for "  
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });  
  }else{
    /* no async simply done */
    if( fn_cb != null){
      fn_cb(null); 
    }else{
      aw_api_controller_show_or_hide_close(false);
      aw_api_controller_tweak_stream_header();
      aw_api_controller_render_stream(aw_api_model_get_base_streams());
    }
  }
}


/****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_splitter(context){
  var split_context={};
  context['service_count'] = 0;
  $.each( context.aw_data, function( key, post_data){

    if( !split_context[post_data.post.source_name] ){
      split_context[post_data.post.source_name] = { 
                                                processed: false,
                                                posts:{}
                                             };      
      context.service_count++;
    }
    split_context[post_data.post.source_name]['posts'][post_data.post.source_object_id] = post_data;
  });
  context['services']=split_context;
  aw_pulled_stream_process_services(context);
}



/****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_process_services(context){
  $.each( context.services, function(service_name, split_context){
    aw_pulled_stream_services_registry[service_name](context);
  });
}

/****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_assimilate_services(context){
  var total_count = context.service_count;
  var processed_count = 0;
  $.each(context.services, function(service_name, data){
    if( context.services[service_name].processed){
      processed_count++;
    }
  });

  if( total_count == processed_count){
    aw_pulled_stream_sort_data(context);
  }
}

/****************************************************************/
/*
 *
 *
 */
function aw_pulled_stream_sort_data(context){
  var merged_arr=[];
  $.each(context.services, function(service_name, service_data){
    $.merge(merged_arr, service_data.data);
  });
  merged_arr.sort(function (time1, time2){
                                  return time2.local_timestamp - time1.local_timestamp;
                               });
  if(  context.no_render_fn_cb != null ){
    context.no_render_fn_cb(merged_arr);
  }else{
    aw_api_controller_show_or_hide_close(true);
    aw_api_controller_render_stream(merged_arr);
  }
}

/*****************************************************************/
/*
 *
 * 
 */
function aw_get_mentions_details_for_mentionlist(mention_list, fn_cb, cb_context){
  $.ajax({
            url: "/home/get_entities_verified",
            type: 'GET',
            data: {
                    user_id : aw_js_global_visited_user_credentials.id,
                    entity_ids : mention_list
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
               fn_cb(data, cb_context);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
              fn_cb(null, cb_context);
              aw_lib_console_log("error",
                              "aw_get_mentions_details_for_mentionlist:  Server request failed for "  
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });  
}


/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

/*
 * Copyright 2008 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Here's some JavaScript software for implementing OAuth.

   This isn't as useful as you might hope.  OAuth is based around
   allowing tools and websites to talk to each other.  However,
   JavaScript running in web browsers is hampered by security
   restrictions that prevent code running on one website from
   accessing data stored or served on another.

   Before you start hacking, make sure you understand the limitations
   posed by cross-domain XMLHttpRequest.

   On the bright side, some platforms use JavaScript as their
   language, but enable the programmer to access other web sites.
   Examples include Google Gadgets, and Microsoft Vista Sidebar.
   For those platforms, this library should come in handy.
*/

// The HMAC-SHA1 signature method calls b64_hmac_sha1, defined by
// http://pajhome.org.uk/crypt/md5/sha1.js

/* An OAuth message is represented as an object like this:
   {method: "GET", action: "http://server.com/path", parameters: ...}

   The parameters may be either a map {name: value, name2: value2}
   or an Array of name-value pairs [[name, value], [name2, value2]].
   The latter representation is more powerful: it supports parameters
   in a specific sequence, or several parameters with the same name;
   for example [["a", 1], ["b", 2], ["a", 3]].

   Parameter names and values are NOT percent-encoded in an object.
   They must be encoded before transmission and decoded after reception.
   For example, this message object:
   {method: "GET", action: "http://server/path", parameters: {p: "x y"}}
   ... can be transmitted as an HTTP request that begins:
   GET /path?p=x%20y HTTP/1.0
   (This isn't a valid OAuth request, since it lacks a signature etc.)
   Note that the object "x y" is transmitted as x%20y.  To encode
   parameters, you can call OAuth.addToURL, OAuth.formEncode or
   OAuth.getAuthorization.

   This message object model harmonizes with the browser object model for
   input elements of an form, whose value property isn't percent encoded.
   The browser encodes each value before transmitting it. For example,
   see consumer.setInputs in example/consumer.js.
 */

/* This script needs to know what time it is. By default, it uses the local
   clock (new Date), which is apt to be inaccurate in browsers. To do
   better, you can load this script from a URL whose query string contains
   an oauth_timestamp parameter, whose value is a current Unix timestamp.
   For example, when generating the enclosing document using PHP:

   <script src="oauth.js?oauth_timestamp=<?=time()?>" ...

   Another option is to call OAuth.correctTimestamp with a Unix timestamp.
 */

var OAuth; if (OAuth == null) OAuth = {};

OAuth.setProperties = function setProperties(into, from) {
    if (into != null && from != null) {
        for (var key in from) {
            into[key] = from[key];
        }
    }
    return into;
}

OAuth.setProperties(OAuth, // utility functions
{
    percentEncode: function percentEncode(s) {
        if (s == null) {
            return "";
        }
        if (s instanceof Array) {
            var e = "";
            for (var i = 0; i < s.length; ++s) {
                if (e != "") e += '&';
                e += OAuth.percentEncode(s[i]);
            }
            return e;
        }
        s = encodeURIComponent(s);
        // Now replace the values which encodeURIComponent doesn't do
        // encodeURIComponent ignores: - _ . ! ~ * ' ( )
        // OAuth dictates the only ones you can ignore are: - _ . ~
        // Source: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
        s = s.replace(/\!/g, "%21");
        s = s.replace(/\*/g, "%2A");
        s = s.replace(/\'/g, "%27");
        s = s.replace(/\(/g, "%28");
        s = s.replace(/\)/g, "%29");
        return s;
    }
,
    decodePercent: function decodePercent(s) {
        if (s != null) {
            // Handle application/x-www-form-urlencoded, which is defined by
            // http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1
            s = s.replace(/\+/g, " ");
        }
        return decodeURIComponent(s);
    }
,
    /** Convert the given parameters to an Array of name-value pairs. */
    getParameterList: function getParameterList(parameters) {
        if (parameters == null) {
            return [];
        }
        if (typeof parameters != "object") {
            return OAuth.decodeForm(parameters + "");
        }
        if (parameters instanceof Array) {
            return parameters;
        }
        var list = [];
        for (var p in parameters) {
            list.push([p, parameters[p]]);
        }
        return list;
    }
,
    /** Convert the given parameters to a map from name to value. */
    getParameterMap: function getParameterMap(parameters) {
        if (parameters == null) {
            return {};
        }
        if (typeof parameters != "object") {
            return OAuth.getParameterMap(OAuth.decodeForm(parameters + ""));
        }
        if (parameters instanceof Array) {
            var map = {};
            for (var p = 0; p < parameters.length; ++p) {
                var key = parameters[p][0];
                if (map[key] === undefined) { // first value wins
                    map[key] = parameters[p][1];
                }
            }
            return map;
        }
        return parameters;
    }
,
    getParameter: function getParameter(parameters, name) {
        if (parameters instanceof Array) {
            for (var p = 0; p < parameters.length; ++p) {
                if (parameters[p][0] == name) {
                    return parameters[p][1]; // first value wins
                }
            }
        } else {
            return OAuth.getParameterMap(parameters)[name];
        }
        return null;
    }
,
    formEncode: function formEncode(parameters) {
        var form = "";
        var list = OAuth.getParameterList(parameters);
        for (var p = 0; p < list.length; ++p) {
            var value = list[p][1];
            if (value == null) value = "";
            if (form != "") form += '&';
            form += OAuth.percentEncode(list[p][0])
              +'='+ OAuth.percentEncode(value);
        }
        return form;
    }
,
    decodeForm: function decodeForm(form) {
        var list = [];
        var nvps = form.split('&');
        for (var n = 0; n < nvps.length; ++n) {
            var nvp = nvps[n];
            if (nvp == "") {
                continue;
            }
            var equals = nvp.indexOf('=');
            var name;
            var value;
            if (equals < 0) {
                name = OAuth.decodePercent(nvp);
                value = null;
            } else {
                name = OAuth.decodePercent(nvp.substring(0, equals));
                value = OAuth.decodePercent(nvp.substring(equals + 1));
            }
            list.push([name, value]);
        }
        return list;
    }
,
    setParameter: function setParameter(message, name, value) {
        var parameters = message.parameters;
        if (parameters instanceof Array) {
            for (var p = 0; p < parameters.length; ++p) {
                if (parameters[p][0] == name) {
                    if (value === undefined) {
                        parameters.splice(p, 1);
                    } else {
                        parameters[p][1] = value;
                        value = undefined;
                    }
                }
            }
            if (value !== undefined) {
                parameters.push([name, value]);
            }
        } else {
            parameters = OAuth.getParameterMap(parameters);
            parameters[name] = value;
            message.parameters = parameters;
        }
    }
,
    setParameters: function setParameters(message, parameters) {
        var list = OAuth.getParameterList(parameters);
        for (var i = 0; i < list.length; ++i) {
            OAuth.setParameter(message, list[i][0], list[i][1]);
        }
    }
,
    /** Fill in parameters to help construct a request message.
        This function doesn't fill in every parameter.
        The accessor object should be like:
        {consumerKey:'foo', consumerSecret:'bar', accessorSecret:'nurn', token:'krelm', tokenSecret:'blah'}
        The accessorSecret property is optional.
     */
    completeRequest: function completeRequest(message, accessor) {
        if (message.method == null) {
            message.method = "GET";
        }
        var map = OAuth.getParameterMap(message.parameters);
        if (map.oauth_consumer_key == null) {
            OAuth.setParameter(message, "oauth_consumer_key", accessor.consumerKey || "");
        }
        if (map.oauth_token == null && accessor.token != null) {
            OAuth.setParameter(message, "oauth_token", accessor.token);
        }
        if (map.oauth_version == null) {
            OAuth.setParameter(message, "oauth_version", "1.0");
        }
        if (map.oauth_timestamp == null) {
            OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
        }
        if (map.oauth_nonce == null) {
            OAuth.setParameter(message, "oauth_nonce", OAuth.nonce(6));
        }
        OAuth.SignatureMethod.sign(message, accessor);
    }
,
    setTimestampAndNonce: function setTimestampAndNonce(message) {
        OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
        OAuth.setParameter(message, "oauth_nonce", OAuth.nonce(6));
    }
,
    addToURL: function addToURL(url, parameters) {
        newURL = url;
        if (parameters != null) {
            var toAdd = OAuth.formEncode(parameters);
            if (toAdd.length > 0) {
                var q = url.indexOf('?');
                if (q < 0) newURL += '?';
                else       newURL += '&';
                newURL += toAdd;
            }
        }
        return newURL;
    }
,
    /** Construct the value of the Authorization header for an HTTP request. */
    getAuthorizationHeader: function getAuthorizationHeader(realm, parameters) {
        var header = 'OAuth realm="' + OAuth.percentEncode(realm) + '"';
        var list = OAuth.getParameterList(parameters);
        for (var p = 0; p < list.length; ++p) {
            var parameter = list[p];
            var name = parameter[0];
            if (name.indexOf("oauth_") == 0) {
                header += ',' + OAuth.percentEncode(name) + '="' + OAuth.percentEncode(parameter[1]) + '"';
            }
        }
        return header;
    }
,
    /** Correct the time using a parameter from the URL from which the last script was loaded. */
    correctTimestampFromSrc: function correctTimestampFromSrc(parameterName) {
        parameterName = parameterName || "oauth_timestamp";
        var scripts = document.getElementsByTagName('script');
        if (scripts == null || !scripts.length) return;
        var src = scripts[scripts.length-1].src;
        if (!src) return;
        var q = src.indexOf("?");
        if (q < 0) return;
        parameters = OAuth.getParameterMap(OAuth.decodeForm(src.substring(q+1)));
        var t = parameters[parameterName];
        if (t == null) return;
        OAuth.correctTimestamp(t);
    }
,
    /** Generate timestamps starting with the given value. */
    correctTimestamp: function correctTimestamp(timestamp) {
        OAuth.timeCorrectionMsec = (timestamp * 1000) - (new Date()).getTime();
    }
,
    /** The difference between the correct time and my clock. */
    timeCorrectionMsec: 0
,
    timestamp: function timestamp() {
        var t = (new Date()).getTime() + OAuth.timeCorrectionMsec;
        return Math.floor(t / 1000);
    }
,
    nonce: function nonce(length) {
        var chars = OAuth.nonce.CHARS;
        var result = "";
        for (var i = 0; i < length; ++i) {
            var rnum = Math.floor(Math.random() * chars.length);
            result += chars.substring(rnum, rnum+1);
        }
        return result;
    }
});

OAuth.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

/** Define a constructor function,
    without causing trouble to anyone who was using it as a namespace.
    That is, if parent[name] already existed and had properties,
    copy those properties into the new constructor.
 */
OAuth.declareClass = function declareClass(parent, name, newConstructor) {
    var previous = parent[name];
    parent[name] = newConstructor;
    if (newConstructor != null && previous != null) {
        for (var key in previous) {
            if (key != "prototype") {
                newConstructor[key] = previous[key];
            }
        }
    }
    return newConstructor;
}

/** An abstract algorithm for signing messages. */
OAuth.declareClass(OAuth, "SignatureMethod", function OAuthSignatureMethod(){});

OAuth.setProperties(OAuth.SignatureMethod.prototype, // instance members
{
    /** Add a signature to the message. */
    sign: function sign(message) {
        var baseString = OAuth.SignatureMethod.getBaseString(message);
        var signature = this.getSignature(baseString);
        OAuth.setParameter(message, "oauth_signature", signature);
        return signature; // just in case someone's interested
    }
,
    /** Set the key string for signing. */
    initialize: function initialize(name, accessor) {
        var consumerSecret;
        if (accessor.accessorSecret != null
            && name.length > 9
            && name.substring(name.length-9) == "-Accessor")
        {
            consumerSecret = accessor.accessorSecret;
        } else {
            consumerSecret = accessor.consumerSecret;
        }
        this.key = OAuth.percentEncode(consumerSecret)
             +"&"+ OAuth.percentEncode(accessor.tokenSecret);
    }
});

/* SignatureMethod expects an accessor object to be like this:
   {tokenSecret: "lakjsdflkj...", consumerSecret: "QOUEWRI..", accessorSecret: "xcmvzc..."}
   The accessorSecret property is optional.
 */
// Class members:
OAuth.setProperties(OAuth.SignatureMethod, // class members
{
    sign: function sign(message, accessor) {
        var name = OAuth.getParameterMap(message.parameters).oauth_signature_method;
        if (name == null || name == "") {
            name = "HMAC-SHA1";
            OAuth.setParameter(message, "oauth_signature_method", name);
        }
        OAuth.SignatureMethod.newMethod(name, accessor).sign(message);
    }
,
    /** Instantiate a SignatureMethod for the given method name. */
    newMethod: function newMethod(name, accessor) {
        var impl = OAuth.SignatureMethod.REGISTERED[name];
        if (impl != null) {
            var method = new impl();
            method.initialize(name, accessor);
            return method;
        }
        var err = new Error("signature_method_rejected");
        var acceptable = "";
        for (var r in OAuth.SignatureMethod.REGISTERED) {
            if (acceptable != "") acceptable += '&';
            acceptable += OAuth.percentEncode(r);
        }
        err.oauth_acceptable_signature_methods = acceptable;
        throw err;
    }
,
    /** A map from signature method name to constructor. */
    REGISTERED : {}
,
    /** Subsequently, the given constructor will be used for the named methods.
        The constructor will be called with no parameters.
        The resulting object should usually implement getSignature(baseString).
        You can easily define such a constructor by calling makeSubclass, below.
     */
    registerMethodClass: function registerMethodClass(names, classConstructor) {
        for (var n = 0; n < names.length; ++n) {
            OAuth.SignatureMethod.REGISTERED[names[n]] = classConstructor;
        }
    }
,
    /** Create a subclass of OAuth.SignatureMethod, with the given getSignature function. */
    makeSubclass: function makeSubclass(getSignatureFunction) {
        var superClass = OAuth.SignatureMethod;
        var subClass = function() {
            superClass.call(this);
        };
        subClass.prototype = new superClass();
        // Delete instance variables from prototype:
        // delete subclass.prototype... There aren't any.
        subClass.prototype.getSignature = getSignatureFunction;
        subClass.prototype.constructor = subClass;
        return subClass;
    }
,
    getBaseString: function getBaseString(message) {
        var URL = message.action;
        var q = URL.indexOf('?');
        var parameters;
        if (q < 0) {
            parameters = message.parameters;
        } else {
            // Combine the URL query string with the other parameters:
            parameters = OAuth.decodeForm(URL.substring(q + 1));
            var toAdd = OAuth.getParameterList(message.parameters);
            for (var a = 0; a < toAdd.length; ++a) {
                parameters.push(toAdd[a]);
            }
        }
        return OAuth.percentEncode(message.method.toUpperCase())
         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(URL))
         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(parameters));
    }
,
    normalizeUrl: function normalizeUrl(url) {
        var uri = OAuth.SignatureMethod.parseUri(url);
        var scheme = uri.protocol.toLowerCase();
        var authority = uri.authority.toLowerCase();
        var dropPort = (scheme == "http" && uri.port == 80)
                    || (scheme == "https" && uri.port == 443);
        if (dropPort) {
            // find the last : in the authority
            var index = authority.lastIndexOf(":");
            if (index >= 0) {
                authority = authority.substring(0, index);
            }
        }
        var path = uri.path;
        if (!path) {
            path = "/"; // conforms to RFC 2616 section 3.2.2
        }
        // we know that there is no query and no fragment here.
        return scheme + "://" + authority + path;
    }
,
    parseUri: function parseUri (str) {
        /* This function was adapted from parseUri 1.2.1
           http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
         */
        var o = {key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                 parser: {strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/ }};
        var m = o.parser.strict.exec(str);
        var uri = {};
        var i = 14;
        while (i--) uri[o.key[i]] = m[i] || "";
        return uri;
    }
,
    normalizeParameters: function normalizeParameters(parameters) {
        if (parameters == null) {
            return "";
        }
        var list = OAuth.getParameterList(parameters);
        var sortable = [];
        for (var p = 0; p < list.length; ++p) {
            var nvp = list[p];
            if (nvp[0] != "oauth_signature") {
                sortable.push([ OAuth.percentEncode(nvp[0])
                              + " " // because it comes before any character that can appear in a percentEncoded string.
                              + OAuth.percentEncode(nvp[1])
                              , nvp]);
            }
        }
        sortable.sort(function(a,b) {
                          if (a[0] < b[0]) return  -1;
                          if (a[0] > b[0]) return 1;
                          return 0;
                      });
        var sorted = [];
        for (var s = 0; s < sortable.length; ++s) {
            sorted.push(sortable[s][1]);
        }
        return OAuth.formEncode(sorted);
    }
});

OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT", "PLAINTEXT-Accessor"],
    OAuth.SignatureMethod.makeSubclass(
        function getSignature(baseString) {
            return this.key;
        }
    ));

OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1", "HMAC-SHA1-Accessor"],
    OAuth.SignatureMethod.makeSubclass(
        function getSignature(baseString) {
            b64pad = '=';
            var signature = b64_hmac_sha1(this.key, baseString);
            return signature;
        }
    ));

try {
    OAuth.correctTimestampFromSrc();
} catch(e) {
}

/******************************************************************/
/*
 *
 *
 */
var aw_global_status_manager = {
                                  status : 1,
                                  fancybox_open: false,
                                  fancybox_modal: false,
                                  fancybox_timer: null
                               };


/******************************************************************/
/*
 *
 *
 */
function aw_api_control_verify_status_of_sketch_page(){
  
    $.ajax({
            url: "/home/get_sketch_data_status",
            type: 'GET',
            data: {
                    user_id : aw_js_global_visited_user_credentials.id,
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function ( status_data ) {
              aw_global_status_manager.fancybox_timer = null;
              if(status_data.status ) {
                if(status_data.status == 1){
                  aw_global_status_manager.fancybox_modal = true;
                }else if(status_data.status == 2){
                  aw_global_status_manager.fancybox_modal = false;
                }else if (status_data.status == 3){
                  if(aw_global_status_manager.fancybox_open){
                      $.fancybox.close();
                      aw_global_status_manager.fancybox_open = false;
                  }
                }

                if(  status_data.status != 3 ){                    
                    
                  if( !aw_global_status_manager.fancybox_open ){
                    $.fancybox({
                      content: $('#aw_js_fb_data_busy_modal_fancybox'),
                      modal: aw_global_status_manager.fancybox_modal,
                      onClosed:function() {
                                            if( aw_global_status_manager.fancybox_timer ){
                                              window.clearTimeout(aw_global_status_manager.fancybox_timer); 
                                            }
                                        }
                      });
                      aw_global_status_manager.fancybox_open = true;
                    }

                    aw_global_status_manager.fancybox_timer = window.setTimeout(  aw_api_control_verify_status_of_sketch_page(), 10000);


                }
              }

            },error:function(XMLHttpRequest,textStatus, errorThrown){ 

            }
          });


 
}


/******************************************************************/
var aw_js_global_services_user_enabled={};
/* Main entry point to sketch initialize
 *
 *
 */
function aw_api_controller_sketch_main_init(){

  aw_lib_console_log("DEBUG", "Entry point into main controller");
  aw_api_control_verify_status_of_sketch_page();
  $.each(aw_js_global_rails_user_services_enabled, function( index, service_data){
    if ( service_data['provider'] ){
      aw_js_global_services_user_enabled[ service_data['provider'] + '_service_enabled'] = true;
    }
  });
  if( aw_js_global_services_user_enabled[ 'facebook_service_enabled' ] ){
      aw_lib_console_log("DEBUG", "invoking facebook token init");
    /* facebook is there need to check current log in */    
    aw_global_services_api_registry['facebook']['service_init'](aw_api_controller_sketch_start_data_pulls);
  }else{
    /* facebook is not there no need to check current log in */
    aw_api_controller_sketch_start_data_pulls();
  }

  aw_api_view_search_autocomplete();
}

/******************************************************************/
/*
 *
 *
 */
function aw_api_controller_sketch_start_data_pulls(){
  aw_lib_console_log("DEBUG", "entered: aw_api_controller_sketch_start_data_pulls");
  /*initialize */
  aw_api_model_static_profile_initialize();
  aw_api_model_service_list_initialize();
  aw_api_model_interests_initialize();
  aw_api_model_trends_initialize();
  aw_api_model_mentions_initialize();
  aw_api_model_service_pouplarity_initialize();
  aw_api_view_locations_initialize_map_view(0, 0);
  
  /* prepare */ 
  $.each(aw_js_global_services_enabled.services, function(service_name, detail) { 
    var key = service_name + '_service_enabled';
    if( aw_js_global_services_user_enabled[ key ] ){
      aw_lib_console_log("DEBUG", "preparing:" + service_name);
      /* add to list of services to be processed */
      aw_api_model_static_profile_add_service(service_name);
      aw_api_model_stream_view_add_service(service_name);
      aw_api_model_images_add_service(service_name);

      if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id )
      {
        aw_api_model_visited_user_feed_add_service(service_name);
      }
    }
  });

  /* trigger */
  //1. Static profile section
  aw_api_model_static_profile_trigger_fetch();
  aw_api_model_stream_view_fetch();
  aw_api_model_visited_user_feed_fetch();
  aw_api_model_videos_fetch();
  if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
    aw_api_model_visited_user_feed_fetch();
  }
  aw_api_model_images_fetch();

  aw_lib_console_log("DEBUG", "exitting: aw_api_controller_sketch_start_data_pulls");

}







/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){


  $(".aw_js_show_more_contacts").live('click', function(){
    aw_api_view_show_or_hide_all_active_contacts($(this));
    return false;
  });

  $(".aw_js_show_more_topics").live('click', function(){
    aw_api_view_show_or_hide_all_interest_topics($(this));
    return false;
  });

  $(".aw_js_show_more_mentions").live('click', function(){
    aw_api_view_show_or_hide_all_mentions($(this));
    return false;
  });

  $(".aw_js_show_more_popularity").live('click', function(){
    aw_api_view_show_or_hide_all_popularity($(this));
    return false;
  });

  $(".aw_js_show_more_videos").live('click', function(){
    aw_api_view_show_or_hide_all_videos($(this));
    return false;
  });

  $(".aw_js_show_more_pictures").live('click', function(){
    aw_api_view_show_or_hide_all_images($(this));
    return false;
  });

  $(".aw_js_active_friend_contact_click").live('click', function(){
    var key = aw_api_view_get_key_to_fetch_active_contact_data($(this));
    var data = aw_api_model_get_active_contact_stream(key);
    if( data != null){
      aw_api_view_stream_render(data);
      aw_api_view_show_or_hide_close(true);
    }
    return false;
  });

  $(".aw_js_filterer").live('click', function(){
    aw_api_view_decode_filter($(this));
    return false;
  });

  $("#aw_js_stream_close_control").live('click', function(){
    aw_api_controller_show_or_hide_close(false);
    aw_api_controller_render_stream(aw_api_model_get_base_streams()); 
    return false;
  });
  
 

   var body_height = $(window).height();
   aw_api_view_stream_apply_height(body_height);


    
});

// for the window resize
$(window).resize(function() {
  var body_height = $(window).height();
  aw_api_view_stream_apply_height(body_height);
});

/*****************************************************/
/*
 *
 *
 */
function aw_api_controller_render_static_profile(data){
  aw_api_view_static_profile_render(data);
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_controller_render_services_list(data){
  aw_api_view_service_list_render(data);
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_controller_render_interests(data){
  aw_api_view_interest_render(data);
  var description = aw_api_model_get_interest_sentence();
  aw_api_model_static_profile_apply_description(description);
  aw_api_view_static_profile_update_description(description);
}

/******************************************************/
/*
 *
 *
 */
function aw_api_controller_render_trends(data){
  aw_api_view_trends_render(data);
  
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_controller_render_mentions(data){
  aw_api_view_mentions_render(data);
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_controller_render_service_popularity(data){
  aw_api_view_service_popularity_render(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_render_stream(data){
  aw_api_view_stream_render(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_update_active_friends(data){
  aw_api_model_connections_update_active_friends(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_connections_active_friends_render(data){
    aw_api_view_connections_active_friends_render(data);
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_get_visited_user_current_location(){
  return aw_api_model_location_get_visited_user_current_location();
}
/********************************************************/
/*
 *
 *
 */
function aw_api_controller_copy_stream_to_visited_user_feeds(feed_data){
  aw_api_model_set_visited_user_feeds(feed_data);
}
/*********************************************************/
/*
 *
 *
 */
function aw_api_controller_notify_feed_fetched(data){
  aw_api_model_connections_update_locations(data);
}
/**********************************************************/
/*
 *
 *
 */
function aw_api_controller_locations_render(data){
  aw_api_view_locations_render(data);
}
/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_render_images(data){
  aw_api_view_images_render(data);
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_change_filter_on_stream(filter){
  aw_api_view_show_stream_waiting();
  aw_pulled_stream_query_filter(filter, null);
}

/************************************************************/
/*
 *
 *
 *
 */
function aw_api_controller_show_or_hide_close(show){
  aw_api_view_show_or_hide_close(show);
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_tweak_stream_header(header_data){
  if( header_data == null || header_data.length == 0){
    header_data = "Wall Feeds";
    aw_api_view_stream_header_render(header_data);
  }
}

/***********************************************************/
/*
 *
 *
 */
function aw_api_controller_show_videos(data){
  aw_api_view_videos_render(data);
}

/*************************************************/
/*
 *
 *
 */
function aw_api_view_static_profile_render(data){
   aw_lib_console_log("DEBUG", "entered:aw_api_view_static_profile_render");
   if ( data ){
      var location_html = "", work_html ="", study_html = "";
      if( data.location && data.location.length > 0){
        location_html = '<div class="aw_dyn_static_profile_details_element" >' +
                          '<h3> Lives in: </h3>' +
                          '<span>' + data.location +  '</span>' +
                        '</div>';

      }

      if( data.work && data.work.length > 0){
        work_html = '<div class="aw_dyn_static_profile_details_element" >' +
                          '<h3> Works at : </h3>' +
                          '<span>' + data.work +  '</span>' +
                        '</div>';

      }

       if( data.study && data.study.length > 0){
        study_html = '<div class="aw_dyn_static_profile_details_element" >' +
                         '<h3> Studied from: </h3>' +
                          '<span>' + data.study +  '</span>' +
                        '</div>';

      }

      var html = location_html + work_html + study_html;
      $("#aw_js_user_details").html(html);
      if( data.description && data.description.length ){
        $("#aw_js_user_description").html(data.description);
      }
   }
   aw_lib_console_log("DEBUG", "exited:aw_api_view_static_profile_render");
}

/*************************************************/
/*
 *
 *
 */
function aw_api_view_static_profile_update_description(description){
  $("#aw_js_user_description").html(description);
}

/*****************************************/
/*
 *
 *
 */
function aw_api_view_service_list_render(data){

  var html = "";
  //'rel="twipsy" data-original-title="'
  $.each(data, function(service_name, service_details) {
    var twipsy_string = '';
    var target_blank = '';

    if (service_details.icon.indexOf("inactive") >= 0){
      if( service_details.url != '#' ){
        twipsy_string = service_details.name  + " is not activated by user.";
      }else{
        twipsy_string = 'Actwitty is still working to bring ' + service_details.name  + " live.";
      }
    }else{
      twipsy_string = service_details.name  + ' is active.  Click to open ' + service_details.name +  ' page."';
      target_blank = ' target="_blank" ';
    }
    
    html = html + '<div class="aw_dyn_service_image_box" >' +
                    '<a href=' + service_details.url + ' ' + target_blank  +' >' +
                      '<img class="aw_dyn_service_img_small" src="' + service_details.icon + '" width=40px height=40px  />' + 
                      '<img class="aw_dyn_service_img_large" src="' + service_details.icon + '" width=44px height=44px  rel="twipsy" data-original-title="' + twipsy_string + '"/>' + 
                    '</a>' +
                  '</div>';

  });
  $("#aw_js_services_list_box").html(html);
}


/*********************************************************/
/*
 *
 *
 */
function aw_api_view_interest_render(data){
  var html = "";
  var single_box_html = "";
  var shown_count = 0;
  var total_count = data.length;
  var max_show = 6;
  $.each(data, function(index, topic_detail) { 
    var internal_details_html = "";
    var position_count = 0;
    var display_class="aw_js_topics_box_show_always";

    var internal_image_list = '';
    var image_path = "/images/actwitty/refactor/aw_sketch/topics/internals/";

    if ( topic_detail.video  && topic_detail.video != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.video + ' Videos" src="' + image_path + 'video.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="video,topic" video="all"  />';
    }

    if ( topic_detail.image  && topic_detail.image != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer"  rel="twipsy" data-original-title="' + topic_detail.image + ' Pictures" src="' + image_path + 'image.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="image,topic" />';
    }
   
    if ( topic_detail.link  && topic_detail.link != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.link + ' Links" src="' + image_path + 'link.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="link,topic" />';
    }

    if ( topic_detail.location  && topic_detail.location != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.location + ' Places" src="' + image_path + 'location.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="location,topic" />';
    }

    if ( topic_detail.mention  && topic_detail.mention != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.mention + ' Mentions" src="' + image_path + 'mention.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="mention,topic" />';
    }

  var services_html_internal = '';
  $.each( topic_detail.services, function ( index, service){
    services_html_internal = services_html_internal + 
                       '<img class="aw_sketch_dyn_topics_box_services_img aw_js_filterer" '
                      + 'src="/images/actwitty/refactor/aw_sketch/topics/services/' + service.name + '.png" '                      +  'rel="twipsy" data-original-title="' + parseInt(service.share) + '% from ' + service.name + '" '    
                      + 'aw_interest_filter="' + topic_detail.interest_id + '" '
                      + 'aw_filter_on="service,topic" aw_service_filter="' + service.name + '" />';
  });

   var topic_twipsy = "";
   if(aw_js_categories_json[topic_detail.name] &&
          aw_js_categories_json[topic_detail.name]['name']){
    topic_twipsy = topic_detail.post + ' posts on ' + aw_js_categories_json[topic_detail.name]['name'];
  }else{
   topic_twipsy = topic_detail.post + ' posts ';    
  }
    if( shown_count >= max_show){
      display_class="aw_js_topics_box_hide_on_less";
    }
    single_box_html = '<div class="aw_sketch_dyn_topics_box ' + display_class + ' " >' +
                        '<div class="aw_sketch_dyn_topics_box_index aw_js_filterer"' + 
                        'aw_filter_on="topic"'  + 
                        'aw_interest_filter="' + topic_detail.interest_id + '" >' +
                          '<p>' + topic_detail.post  + '</p>' +
                        '</div>' +
                        '<div class="aw_sketch_dyn_topics_box_name aw_js_filterer" aw_filter_on="topic"   aw_interest_filter="' + topic_detail.interest_id + '" >' +
                          '<p rel="twipsy" data-original-title="'  + topic_twipsy + '" >' + topic_detail.name + '</p>' +
                        '</div>' +
                        '<div class="aw_sketch_dyn_topics_box_images" >' +
                          internal_image_list + 
                        '</div>' +
                        '<div class="aw_sketch_dyn_topics_box_delimiter" > </div>' +
                        '<div class="aw_sketch_dyn_topics_box_services">' +
                          services_html_internal +
                        '</div>' +
                      '</div>';
    html = html + single_box_html;
    shown_count++;
  });

  
  

  var gender_img = "/images/actwitty/refactor/aw_sketch/topics/women.svg"; 
  if( aw_js_global_visited_user_credentials.gender == "male" ){
    gender_img = "/images/actwitty/refactor/aw_sketch/topics/men.svg"; 
  }
  var base_html = '<div class="aw_sketch_interest_main_box" >' +
                    '<div class="aw_sketch_interest_background_box"  >' +
                      '<img class="aw_sketch_interest_background_img" src="' + gender_img +  '" height=100% />' +
                    '</div>' +
                    html +
                  '</div>';

   var residue = shown_count - max_show;
   var more_html = "";
   if( residue > 0){
    more_html = '<div class="aw_show_more_topics_box aw_js_show_more_topics"  state="show" total="' + residue + '" >' +
                  'Show ' + residue + ' more interest topics' +
                '</div>';
   }
  
  html = base_html + more_html;
  $("#aw_js_topics_list_box").html(html);
  $("img[rel=twipsy]").twipsy({  live: true, placement: "below" });
  $("p[rel=twipsy]").twipsy({  live: true, placement: "below" });


  var topic_box_min_height = $(".aw_sketch_dyn_topics_box:first").css("min-height");
  topic_box_min_height = topic_box_min_height.replace("px","");
  var main_box_min_height = $(".aw_sketch_interest_main_box:first").css("min-height");
  main_box_min_height = main_box_min_height.replace("px","");
  var display_height = parseInt(topic_box_min_height) * total_count;
  
  if( display_height < main_box_min_height ){
    var min_box_height = main_box_min_height / total_count;
    $(".aw_sketch_dyn_topics_box").each(function(index) {
      $(this).height(min_box_height + 'px');
    });

  }

  $("#aw_js_topics_shared_busy").hide();

}
/****************************************************************/
/*
 *
 *
 */
function aw_api_view_reapply_interest_bkg(){
  var gender_img = "/images/actwitty/refactor/aw_sketch/topics/women.svg"; 
  if( aw_js_global_visited_user_credentials.gender == "male" ){
    gender_img = "/images/actwitty/refactor/aw_sketch/topics/men.svg"; 
  }
  var html = '<img class="aw_sketch_interest_background_img" src="' + gender_img +  '"  height=100% />';
  $(".aw_sketch_interest_background_box").html(html);
}
/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_interest_topics(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_topics_box_hide_on_less").removeClass("aw_js_topics_box_hide_on_less").addClass("aw_js_topics_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_topics_box_show_on_more").removeClass("aw_js_topics_box_show_on_more").addClass("aw_js_topics_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html( 'Show ' + residue + ' more interest topics');
  }

  aw_api_view_reapply_interest_bkg();
}



  

/***************************************************/
function aw_get_graph_html(interests){
  var html = "";
  var lowest = 100;
  var highest = 0;
  $.each(interests, function(key, interest_detail) {
    if( lowest > interest_detail.percent){
      lowest = interest_detail.percent;
    }
    if( highest < interest_detail.percent){
      highest = interest_detail.percent;
    }
  });
  var range = highest - lowest ;
  var minimum_width = 50;
  if ( lowest == highest ) {
    var minimum_width = 100;
  }
  $.each(interests, function(key, interest_detail) {
    var graph_width = 0;
    if( range != 0 ){
      graph_width = minimum_width + ((interest_detail.percent - lowest)/range) * 150;
    }else{
      graph_width = minimum_width + interest_detail.percent;
    }
    //alert("range:" + range+ " lowest:" + lowest + " highest:" + highest + " percent:" + interest_detail.percent + " width:" + graph_width);
    html = html + '<div class="aw_sketch_timeline_single_topic_box aw_js_filterer" ' + 
                        ' aw_filter_on="topic,since,till" ' +
                        ' aw_interest_filter="' + interest_detail.interest_id + '" ' +                       
                        ' aw_since_filter="' + interest_detail.since + '" ' +                        
                        ' aw_till_filter="' + interest_detail.till + '" ' +                        
                      '>' +

                      '<img src="/images/actwitty/refactor/aw_sketch/topics/' + interest_detail.category + '.png" width=25px height=25px >' +
                      '<div class="aw_label_box" >' +
                        '<span>' +
                          interest_detail.name +
                        '</span>' +
                      '</div>' +
                      '<div class="aw_graph_box" style="width:' + graph_width + 'px;" />' +                      
                  '</div>';
  });
  return html;
}

/**************************************************/
/*
 *
 *
 */
function aw_api_view_trends_render(data){

  var dates_html = "";
  var details_html = "";


      
  $.each(data.reverse(), function(key, snapshot) {
     var timeline_id = 'aw_js_timeline_' + key;
     dates_html = dates_html + '<li>' +
                                  '<a class="aw_sketch_timeline_links" href="#' + timeline_id + '">' +
                                    '<abbr class="aw_js_trend_timeago" title="' +  snapshot.title + '"></abbr>' +
                                  '</a>' + 
                               '</li>';
    
      details_html = details_html + '<li id="' + timeline_id + '" >' +
                                      '<div class="aw_sketch_timeline_week_snapshot_box">' +
                                        aw_get_graph_html(snapshot.interests) + 
                                        '<div class="aw_graph_axis_box">' +
                                          '<span class="left_limit"> Lowest </span>' +
                                          '<span class="right_limit"> Highest </span>' +
                                          '<span class="mid_limit"> Moderate </span>' +
                                        '</div>' +
                                      '</div>' +
                                      
                                    '</li>';
     
  });

  $("#aw_js_sketch_timeline_dates").html(dates_html);
  $("#aw_js_sketch_timeline_details").html(details_html);

  $("abbr.aw_js_trend_timeago").timeago();
  /* invoke timeliner */
  $().timelinr();
  $("#aw_js_trends_busy").hide();
}

/**********************************************************/
/*
 *
 *
 */
function aw_view_mentions_get_html(data){

  var max_to_show_in_one_interest = 7;
  var max_interests_to_show = 3;

  var last_interest_name = "";
  var count_in_this_interest = 0;

  var show_more = false;

  var display_class = "aw_js_mentions_box_show_always";
  var tab_class = "aw_js_mentions_box_show_always";


  var main_html = "";
  var one_interest_html = "";
  var running_interest_count = 0;

  $.each(data, function(index, mention_data){
    if( mention_data.process == "done" && mention_data.image){

      if( last_interest_name.length == 0 ||
          last_interest_name != mention_data.interest_name ){

          display_class = "aw_js_mentions_box_show_always";
          count_in_this_interest = 0;
       
          /* close the column */
          if(one_interest_html.length){
            one_interest_html = one_interest_html + '</div></div>' ;
          }

          /* handle end of the tab */
          if(running_interest_count >= max_interests_to_show){                       
            tab_class = 'aw_js_mentions_tab_hide_on_less';
            show_more = true;
          }
          
          /* park a tab */
          main_html = main_html + one_interest_html;
          
          /* start a new tab */
          one_interest_html = '<div id="aw_js_mentions_view_tab" ' + 'class="aw_sketch_mentions_segment ' + tab_class + '">' +
                                '<div class="aw_sketch_one_interest_header">' +
                                  '<span>' +
                                    mention_data.interest_name.toUpperCase() +
                                  '</span>' +
                                '</div>' +
                              '<div class="aw_sketch_one_interest_mention" >';
          running_interest_count++;
          last_interest_name = mention_data.interest_name;
        }


        if(  mention_data.name && mention_data.image ){

          count_in_this_interest++;
          if( count_in_this_interest >= max_to_show_in_one_interest){
            display_class = "aw_js_mentions_box_hide_on_less";
            show_more = true;
          }

          one_interest_html = one_interest_html +
                              '<div class="aw_sketch_mention_box aw_js_filterer ' + display_class + '" ' +
                                  'aw_filter_on="mention" ' +
                                  'aw_mention_filter="' + mention_data.id + '" ' +
                                '>' +
                                '<div class="aw_sketch_mention_img_box" >' +
                                  '<img ' + 
                                    'class="aw_js_mention_image_class" ' +
                                    ' src="' + mention_data.image + '?maxwidth=200&key=' + aw_global_freebase_api_key  +  '"' +                                                                  ' desc_url="' + mention_data.description + '" ' +
                                    ' name="' + mention_data.name + '" rel="aw_js_twipsy_mention_image" data-original-title="' + mention_data.name.toUpperCase() + ' " ' +
                                    ' />' +
                              '</div>' +
                            '</div>';
        }
      }


  });


 if( show_more ){
   main_html = main_html  +
                '<div class="aw_show_more_mentions_box aw_js_show_more_mentions"  state="show"  >' +
                  'Show more mentions made' +
                '</div>';
 }
  return main_html;
 

}

/**********************************************************/
/*
 *
 *
 */
function aw_api_view_mentions_render(data){
  $("#aw_js_mentions_list_box").html(aw_view_mentions_get_html(data));
  $("img[rel=aw_js_twipsy_mention_image]").twipsy({  live: true, placement: "below" }); 
  $("#aw_js_mentions_busy").hide();
  /* fetch descriptions */ 
  $(".aw_js_mention_image_class").each( function(index){
    $(this).aw_api_js_get_description_fn();
  });


  
}

/*******************************************************/
/*
 *
 *
 */
jQuery.fn.aw_api_js_get_description_fn = function() {
  var element = $(this[0]);
  var name = element.attr("name");
  var desc_url = $(this).attr("desc_url");
  if( desc_url.length ){
    $.getJSON(desc_url + '?format=plain&maxlength=150&key=' + aw_global_freebase_api_key  +  '&callback=?', function(data) {
    })
    .success(function(data){
      if( data && data.result){
        var twipsy = element.attr("data-original-title");
        twipsy = twipsy + '  :  ' + data.result;
        
        element.attr("data-original-title", twipsy);
        $("img[rel=aw_js_twipsy_mention_image]").twipsy({  live: true, placement: "below" }); 

      }
    });
  }
   

     
};
/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_mentions(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_mentions_tab_hide_on_less").removeClass("aw_js_mentions_tab_hide_on_less").addClass("aw_js_mentions_tab_show_on_more");
    $(".aw_js_mentions_box_hide_on_less").removeClass("aw_js_mentions_box_hide_on_less").addClass("aw_js_mentions_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less mentions made' );
  }else{

    $(".aw_js_mentions_tab_show_on_more").removeClass("aw_js_mentions_tab_show_on_more").addClass("aw_js_mentions_tab_hide_on_less");
    $(".aw_js_mentions_box_show_on_more").removeClass("aw_js_mentions_box_show_on_more").addClass("aw_js_mentions_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html( 'Show more mentions made');
  }

}





                
/***************************************************************/
/*
 *
 *
 */
var aw_js_service_color_codes = {
                                   facebook: "aw_service_color_facebook",
                                   twitter: "aw_service_color_twitter"
                                };


/***************************************************************/
/*
 *
 *
 */
function aw_view_get_all_details_for_interest_html(data){
  var html = '';
  $.each(data.services, function(service_name, service_data) {
      $.each(service_data, function(field_name, field_data) {
        html = html + '<div class="aw_service_popularity_details_box aw_js_filterer " ' + 
                        ' aw_filter_on="topic,action" ' +
                        ' aw_interest_filter="' + data.id + '" ' +                       
                        ' aw_action_filter="' + field_name + '" ' +                        
                        ' >' +
                        '<span class="aw_service_popularity_number">' +
                            field_data +
                        '</span>'+
                        '<img class="aw_service_popularity_field"' + 
                              'src="/images/actwitty/refactor/aw_sketch/service_popularity/' + service_name + '_' + field_name + '.png">' +
                       
                      '</div>';
      });

    });
  
  return html;
}
/***************************************************************/
/*
 *
 *
 */
var show_more_popularity = false; /*TODO: fix this without global*/
function aw_view_get_topic_popularity_html(index, data){
   var html = "";
   var max_to_show = 3;
   var display_class = "aw_js_popularity_box_show_always";
   if( index >= max_to_show){
     display_class = "aw_js_popularity_box_hide_on_less";
     show_more_popularity = true;
   }
   html = html + '<div class ="aw_service_popularity_segment ' + display_class + '" >' +
                     '<div class="aw_service_popularity_interest_header" >' +
                      '<span>' +
                        data.name + 
                     '</div>' +
                     '<div class="aw_service_popularity_interest_details" >' +
                        aw_view_get_all_details_for_interest_html(data) +
                     '</div>' +
                '</div>';
   return html;  
}
/***************************************************************/
/*
 *
 *
 */
function aw_api_view_service_popularity_render(data){
  var html= "";
  $.each(data, function(index, interest_data) {
     html = html + '<div class="aw_service_popularity_segment" >' +
                      aw_view_get_topic_popularity_html(index, interest_data) +
                   '</div>';
  });
  if( show_more_popularity){
    html =  html + '<div class="aw_show_more_popularity_box aw_js_show_more_popularity"  state="show"  >' +
                  'Show all interest popularities.' +
                '</div>';
  }
  $("#aw_js_service_popularity_box").html(html);
  $("#aw_js_popularity_busy").hide();
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_popularity(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_popularity_box_hide_on_less").removeClass("aw_js_popularity_box_hide_on_less").addClass("aw_js_popularity_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_popularity_box_show_on_more").removeClass("aw_js_popularity_box_show_on_more").addClass("aw_js_popularity_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html(  'Show all interest popularities.' );
  }

}

/**********************************************************************/
/*
 *
 *
 */
function aw_api_view_connections_active_friends_render(data){
   var html = "<h3> Currently active friends on various networks</h3>";
   var count_elements = 0;
   var max_to_show = 21;
   $.each(data, function(key, data) {
     var single_post = data[0];
     var display_class = "aw_js_single_contact_box_show_always";

     if( count_elements >= max_to_show){
        display_class = "aw_js_single_contact_box_hide_on_less";
     }
     html = html + '<div class="aw_single_contact_box aw_js_active_friend_contact_click ' + display_class +  ' " key='+ key +'>' +
                      '<img class="aw_single_contact_image" src="' + single_post.originator.image + '" width=56px height=56px />' +
                      '<img class="aw_single_contact_service_img" src="/images/actwitty/refactor/aw_sketch/contacts/' +   single_post.service.name +  '.png" width=16px height=16px />' +
                      
                      '<div class="aw_single_contact_posts_count" >' +
                        '<span>' +
                          data.length +
                        '</span>' +
                      '</div>' +
                   '</div>';
                   count_elements++;

    
   });
   var residue = count_elements - max_to_show;
   var more_html = "";
   if( residue > 0){
    more_html = '<div class="aw_show_more_contacts_box aw_js_show_more_contacts" state="show" total="' + residue + '">' +
                'Show ' + residue + ' more active contacts' +
              '</div>';
   }
  
   html = html + more_html;
   $("#aw_js_contacts").html(html);
   $("#aw_js_connections_busy").hide();
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_active_contacts(object){
  if( object.attr('state') == "show") {
    
    $(".aw_js_single_contact_box_hide_on_less").removeClass("aw_js_single_contact_box_hide_on_less").addClass("aw_js_single_contact_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_single_contact_box_show_on_more").removeClass("aw_js_single_contact_box_show_on_more").addClass("aw_js_single_contact_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html( 'Show ' + residue + ' more active contacts');
  }
  
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_view_get_key_to_fetch_active_contact_data(object){
  return object.attr('key');
}

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
  $("#aw_js_locations_busy").hide();
}

/***************************************************************/
/*
 *
 *
 */
function aw_api_view_images_render(data){
  var html="";
  var count = 0;
  var max_images_to_show = 10;
  var show_more = false;
  var display_class = "aw_js_image_box_show_always";
  var html_col_1 = '<div class="aw_images_col" >';
  var html_col_2 = '<div class="aw_images_col" >';
  var html_col_3 = '<div class="aw_images_col" >';

  $.each(data, function(key, image_json){

    if( count > max_images_to_show){
      show_more = true;
      display_class = "aw_js_image_box_hide_on_less";
    }

    var img_html =  '<div class="aw_single_img_box ' + display_class + '"  >' +
                      '<a rel="example_group" href="'+ image_json.url +'">' +
                        '<img src="' + image_json.url + '" width=160px class="aw_tiled_image" />' +
                      '</a>'+
                       '<img class="aw_images_service_img" src="/images/actwitty/refactor/aw_sketch/images/' +   image_json.service.name +  '.png" width=16px height=16px />' +
                    '</div>';
    if(count%3 == 0){
        html_col_1 = html_col_1 + img_html;
    }else if(count%3 == 1){
        html_col_2 = html_col_2 + img_html;
    }else{
        html_col_3 = html_col_3 + img_html;
    }
    count++; 
  });


  html_col_1 = html_col_1 + '</div>';
  html_col_2 = html_col_2 + '</div>';
  html_col_3 = html_col_3 + '</div>';
  html =  '<div class="aw_images_internal_container_box" >' +
              html_col_1 + 
              html_col_2 +
              html_col_3 +
          '</div>';

  if( show_more ){
    html = html +
           '<div class="aw_show_more_image_box aw_js_show_more_pictures"  state="show" >' +
              'Show more pictures' +
          '</div>';  
  }
  $("#aw_js_images_box").html(html);
  
	
  $("a[rel=example_group]").fancybox({
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'titlePosition' 	: 'over',
		'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
		    return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
	  }
  });
  $("#aw_js_images_busy").hide();
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_images(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_image_box_hide_on_less").removeClass("aw_js_image_box_hide_on_less").addClass("aw_js_image_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_image_box_show_on_more").removeClass("aw_js_image_box_show_on_more").addClass("aw_js_image_box_hide_on_less");
    object.attr('state', "show");
    object.html( 'Show more pictures');
  }


}

/*********************************************************/
/*
 *
 *
 */
function aw_view_videos_get_video_iframe_html( url, width, height){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '';
	}
	return output;
}
/*********************************************************/
/*
 *
 *
 */
function aw_api_view_videos_render(data){
  var max_to_show = 6;
  var show_count = 0;
  var show_more = false;
  var display_class = "aw_js_video_box_show_always";
  var html='';
  $.each(data, function(key, entry){
    if( entry.attachment ){
      $.each(entry.attachment, function(key, attachment){
          if( attachment.type == 'embed'){
            if( attachment.embed){
              var video_html =aw_view_videos_get_video_iframe_html(attachment.embed, 230, 173);
              if( show_count >= max_to_show){
                display_class = "aw_js_video_box_hide_on_less";
                show_more = true;
              }
              if( video_html && video_html.length){
                html = html + '<div class="aw_single_video_container_box ' + display_class + '">' +
                                video_html +
                              '</div>';
                show_count++;
                
              }
                       
            }
          }
      });
    }
  });

  html =  '<div class="aw_all_videos_container_box">' +
              html + 
            '</div>';
  if( show_more){
    
    html = html + '<div class="aw_show_more_videos_box aw_js_show_more_videos"  state="show" >' +
                    'Show more videos' +
                  '</div>'; 
  }

  $("#aw_js_videos").html(html);
  $("#aw_js_videos_busy").hide();
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_videos(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_video_box_hide_on_less").removeClass("aw_js_video_box_hide_on_less").addClass("aw_js_video_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_video_box_show_on_more").removeClass("aw_js_video_box_show_on_more").addClass("aw_js_video_box_hide_on_less");
    object.attr('state', "show");
    object.html( 'Show more videos');
  }


}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_decode_filter(object){
  var filter_titles_as_str =  object.attr("aw_filter_on");
  if ( !filter_titles_as_str || !filter_titles_as_str.length ){
    /* who wrote this code */
    return;
  }
  var filter_set_arr=[];
  var filter_set = filter_titles_as_str.split(',');

  if( $.isArray(filter_set)){
    filter_set_arr = filter_set;
  }else{
    filter_set_arr = [filter_set];
  }
  var filter = {
                  user_id : aw_js_global_visited_user_credentials.id
               };
  
  $.each( filter_set_arr, function( index, filter_title){
    if( filter_title == 'topic' ){
      filter['summary_id'] =  object.attr("aw_interest_filter");
    }
    
    if( filter_title == 'service'){
      filter['source_name'] =  object.attr("aw_service_filter");
    }

    if( filter_title == 'mention'){
      var mention_id = object.attr("aw_mention_filter");
      if( !mention_id || !mention_id.length){
        filter['filter'] ={
                            entity: { 
                                      'all' : true
                                    }
                          };
      }else{
        filter['filter'] ={
                            entity: { 
                                      'id' : mention_id
                                    }
                          };

      }

    }


    if( filter_title == 'since' ){
      var since = object.attr("aw_since_filter");
      filter['since'] =  since;
    }


    if( filter_title == 'till' ){
      var till = object.attr("aw_till_filter");
      filter['till'] = till;
    }

    if( filter_title == 'action'){
      var aw_actions_name = object.attr("aw_action_filter");
      filter['filter'] = {};
      if( aw_actions_name && aw_actions_name.length){
        filter['filter']['source_action'] = {
                                    name : aw_actions_name 
                                  }
      }else{
         filter['filter']['source_action'] = {
                                    all : true
                                  }
      }
        
    }

    if( filter_title == 'image'){


        filter['filter'] ={
                          document: { 
                                      'type' : 'image',
                                      'all' : true
                                    }
                        };                              
    }

    if( filter_title == 'video'){
       filter['filter'] ={
                          document: { 
                                    'type' : 'video',
                                    'all' : true
                                  }
                        };                   
    }

    if( filter_title == 'link'){
        filter['filter'] ={
                          document: { 
                                      'type' : 'link',
                                      'all' : true
                                  }
                        }; 
    }

    if( filter_title == 'location'){
      filter['filter'] ={
                          location: { 
                                    'all' : 'true'
                                  }
                        }; 
    }

  });

  aw_api_controller_change_filter_on_stream(filter);


}

var social_media_sources = {
                                twitter: "/images/actwitty/refactor/aw_sketch/stream_view/services/twitter.png",
                                facebook: "/images/actwitty/refactor/aw_sketch/stream_view/services/facebook.png"
                           };
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_display_name(entry){
  var screen_name_html = "";
  var name = "";
  if ( entry.originator.screen_name ){
    screen_name_html =  '<a class="aw_stream_content_name" href="' + entry.originator.url + '" target="_blank">' +
                          entry.originator.name +
                        '</a>' +
                        '<a class="aw_stream_content_screen_name" href="' + entry.originator.url + '" target="_blank">' +
                          entry.originator.screen_name +
                        '</a>';
  }else{
    screen_name_html = '<a class="aw_stream_content_name" href="' + entry.originator.url + '" target="_blank">' +
                        entry.originator.name +
                      '</a>';
  }
  return screen_name_html;

}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_text_html(entry){
  var html = "";
  if( entry.text ){
    html = '<div class="aw_stream_text_box" >' +
              '<p>' +
                entry.text +
              '</p>' +
           '</div>';
  }

  return html;
}


/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_mentions_html(entry){
  var html = "";
  if( entry.mention && entry.mention.length ){
    var internal_html = "";

    $.each( entry.mention, function(index, mention_data){
      internal_html = internal_html + '<a src="' + mention_data.description + '" target="_blank"  >' +
                                        mention_data.name + 
                                      '</a>';
    });

    html = '<div class="aw_stream_mentions_box" >' +
               '<span> Mentions </span>' +
                internal_html + 
           '</div>';
  }
  
  return html;
}




/*********************************************************/
/*
 *
 *
 */
function aw_view_api_check_and_get_video_iframe_html( url, width, height){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '';
	}
	return output;
}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_attachments_html(entry){
  var html = "";
  
  if ( entry.attachment ){
    var attachment_arr = entry.attachment;
    $.each(entry.attachment, function(key, attachment){
      if( attachment.type == 'link') {
        var title_html = "";
        var content_html = "";
        var caption_html = "";
       
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title" >' +
                          '<a href="' + attachment.url + '" target="_blank" >' +
                            attachment.title +    
                          '</a>' +
                       '</div>';
        }else{
           title_html = '<div class="aw_attachment_title_milder" >' +
                          '<a href="' + attachment.url + '" target="_blank">' +
                            attachment.url +    
                          '</a>' +
                       '</div>';
        }

        if( attachment.description){
          var image_html = "";
          if ( attachment.image_url ){
             image_html = '<div class="aw_attachment_image_box" >' +
                            '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:300px;" />' +
                          '</div>';
          }
          content_html = content_html + '<div class="aw_attachment_content" >' +
                          image_html + 
                          '<p class="aw_attachment_paragraph" >' +
                              attachment.description +
                          '</p>' +
                        '</div>';
        }else{
          var image_html = "";
          if ( attachment.image_url ){
             image_html = '<div class="aw_attachment_image_box" >' +
                            '<img class="aw_attachment_image" src="' + attachment.image_url + ' " style="max-width:300px;" />' +
                          '</div>';
          }

          content_html = content_html + '<div class="aw_attachment_content" >' +
                          '<p class="aw_attachment_paragraph" >' +
                              image_html + 
                          '</p>' +
                        '</div>';
        }

        if( attachment.name ){
          caption_html = '<div class="aw_attachment_caption" >' +
                                attachment.name +
                             '</div>';
        }

        html = html + '<div class="aw_attachment_box">' +
                         title_html +
                         content_html + 
                         caption_html +
                      '</div>';
      }else if( attachment.type == 'embed'){

        var title_html = "";
        var embed_html = "";
        var description_html = "";

       
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title" >' +
                          '<a href="' + attachment.url + '" target="_blank" >' +
                            attachment.title +    
                          '</a>' +
                       '</div>';
        }

        if( attachment.embed){
          embed_html = '<div class="aw_attachment_embed" >' + 
                          aw_view_api_check_and_get_video_iframe_html(attachment.embed,300,225) +
                       '</div>';
        }


        if( attachment.description){
           description_html = '<div class="aw_attachment_content" >' +
                                '<p class="aw_attachment_paragraph" >' +
                                    attachment.description +
                                '</p>' +
                              '</div>';
        }

        html = html + '<div class="aw_attachment_box">' +
                         title_html +
                         embed_html + 
                         description_html +
                      '</div>';

      }
    });
  }

  return html;
}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_location_html(entry){
  if( entry.place && entry.place.name){
    
    var html = '<div class="aw_location_box" >' +
                  '<p>' +
                    '<img src="/images/actwitty/refactor/aw_sketch/stream_view/icons/location.png" height=25px />' +
                    entry.place.name +
                  '</p>' +
               '</div>';
    return html; 
  }
  return "";
}
/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_entry_html(entry){

  var html = '<div class="aw_stream_entry_container" >' +
                '<div class="aw_stream_originator_img" >' +
                  '<a href="' + entry.originator.url + '" target="_blank">' +
                    '<img src="' +  entry.originator.image  + '" width=100% height=100% />' +
                  '</a>' +
                  '<span>'+ aw_view_stream_get_display_name(entry) + '</span>' +
                '</div>' +
                '<div class="aw_stream_src_img" >' +
                  '<img src="' + social_media_sources[entry.service.name] + '" width=16px height=16px />' +
                '</div>' +
                '<div class="aw_stream_time_orig" >' +
                    '<abbr class="aw_js_timeago" title="' + entry.timestamp + '"></abbr>' +
                '</div>' +
                '<div class="aw_stream_content" >' +
                  aw_view_stream_get_text_html(entry) +
                  aw_view_stream_get_attachments_html(entry) +
                  aw_view_stream_get_mentions_html(entry) +
                  aw_view_stream_get_location_html(entry) +
                  
                '</div>' +
             '</div>';
  return html;
}
/***********************************************************/
/*
 *
 *
 */
function aw_api_view_stream_render(data){
  var html = "";
  $.each(data, function(key, entry){
    html= html + aw_view_stream_get_entry_html(entry);
  });
  
  $("#aw_js_stream_entries").html(html);
  
  $("abbr.aw_js_timeago").timeago();
  $("#aw_js_stream_busy").hide();

}


/***********************************************************/
/*
 *
 *
 */
function aw_api_view_stream_header_render(data){
 var html = "Wall Feed";
 
 $("#aw_stream_container_header_label").html(data);


}
/***********************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_close(show){
  if( show ){
    $("#aw_js_stream_close_control").show();
  }else{
    $("#aw_js_stream_close_control").hide();
  }
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_view_stream_apply_height(body_height){
  $("#aw_js_stream_entries").height(body_height - 105 );
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_view_show_stream_waiting(){
  $("#aw_js_stream_busy").show();
}

/****************************************************/
/*
 *
 *
 */
function aw_api_view_search_autocomplete(){
  $("#aw_js_ppm_header_search_text").autocomplete(
            "/home/search_user.json", 
            {
		          multiple: false,
              minChars: 3,
              autoFill: true,
              max: 8,
              mustMatch: true,
		          dataType: "json",
              parse: function(data){
                 return $.map(data, function(item) {
                    return { data: item, value: item.name, result: item.href };
                 });
              },
              formatItem: function(item) {
                 return aw_get_autocomplete_html(item);
                }
              }).result(function(e, item) {
                aw_get_autocomplete_result_click(item);
              });

}


/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_result_click(item){
  if( item ){
    window.location.href = '/home/sketch?id=' + item.id;
  }
}

/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_html(item){

  var html = '';
  html = '<div class="awppm_search_autocomplete_box" >' +

              '<div class="awppm_search_img_box" >' +
                '<img class="awppm_search_autocomplete_img" src="' + item.image + '" width="22px" height="22px" />' +               
              '</div>' +

              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              
          '</div>';
           
  return html;

}

/* ----------------------------------
jQuery Timelinr 0.9.5
tested with jQuery v1.6+

Copyright 2011, CSSLab.cl
Free under the MIT license.
http://www.opensource.org/licenses/mit-license.php

instructions: http://www.csslab.cl/2011/08/18/jquery-timelinr/
---------------------------------- */

jQuery.fn.timelinr = function(options){
	// default plugin settings
	settings = jQuery.extend({
		orientation: 				'horizontal',		// value: horizontal | vertical, default to horizontal
		containerDiv: 				'#aw_sketch_timeline',		// value: any HTML tag or #id, default to #timeline
		datesDiv: 					'#aw_js_sketch_timeline_dates',			// value: any HTML tag or #id, default to #dates
		datesSelectedClass: 		'selected',			// value: any class, default to selected
		datesSpeed: 				'normal',			// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
		issuesDiv: 					'#aw_js_sketch_timeline_details',			// value: any HTML tag or #id, default to #issues
		issuesSelectedClass: 		'selected',			// value: any class, default to selected
		issuesSpeed: 				'fast',				// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
		issuesTransparency: 		0.2,				// value: integer between 0 and 1 (recommended), default to 0.2
		issuesTransparencySpeed: 	500,				// value: integer between 100 and 1000 (recommended), default to 500 (normal)
		prevButton: 				'#prev',			// value: any HTML tag or #id, default to #prev
		nextButton: 				'#next',			// value: any HTML tag or #id, default to #next
		arrowKeys: 					'false',			// value: true | false, default to false
		startAt: 					1,					// value: integer, default to 1 (first)
		autoPlay: 					'false',			// value: true | false, default to false
		autoPlayDirection: 			'forward',			// value: forward | backward, default to forward
		autoPlayPause: 				2000				// value: integer (1000 = 1 seg), default to 2000 (2segs)
		
	}, options);

	$(function(){
		// setting variables... many of them
		var howManyDates = $(settings.datesDiv+' li').length;
		var howManyIssues = $(settings.issuesDiv+' li').length;
		var currentDate = $(settings.datesDiv).find('a.'+settings.datesSelectedClass);
		var currentIssue = $(settings.issuesDiv).find('li.'+settings.issuesSelectedClass);
		var widthContainer = $(settings.containerDiv).width();
		var heightContainer = $(settings.containerDiv).height();
		var widthIssues = $(settings.issuesDiv).width();
		var heightIssues = $(settings.issuesDiv).height();
		var widthIssue = $(settings.issuesDiv+' li').width();
		var heightIssue = $(settings.issuesDiv+' li').height();
		var widthDates = $(settings.datesDiv).width();
		var heightDates = $(settings.datesDiv).height();
		var widthDate = $(settings.datesDiv+' li').width();
		var heightDate = $(settings.datesDiv+' li').height();
		
		// set positions!
		if(settings.orientation == 'horizontal') {	
			$(settings.issuesDiv).width(widthIssue*howManyIssues);
			$(settings.datesDiv).width(widthDate*howManyDates).css('marginLeft',widthContainer/2-widthDate/2);
			var defaultPositionDates = parseInt($(settings.datesDiv).css('marginLeft').substring(0,$(settings.datesDiv).css('marginLeft').indexOf('px')));
		} else if(settings.orientation == 'vertical') {
			$(settings.issuesDiv).height(heightIssue*howManyIssues);
			$(settings.datesDiv).height(heightDate*howManyDates).css('marginTop',heightContainer/2-heightDate/2);
			var defaultPositionDates = parseInt($(settings.datesDiv).css('marginTop').substring(0,$(settings.datesDiv).css('marginTop').indexOf('px')));
		}
		
		$(settings.datesDiv+' a').click(function(event){
			event.preventDefault();
			// first vars
			var whichIssue = $(this).text();
			var currentIndex = $(this).parent().prevAll().length;

			// moving the elements
			if(settings.orientation == 'horizontal') {
				$(settings.issuesDiv).animate({'marginLeft':-widthIssue*currentIndex},{queue:false, duration:settings.issuesSpeed});
			} else if(settings.orientation == 'vertical') {
				$(settings.issuesDiv).animate({'marginTop':-heightIssue*currentIndex},{queue:false, duration:settings.issuesSpeed});
			}
			$(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed}).removeClass(settings.issuesSelectedClass).eq(currentIndex).addClass(settings.issuesSelectedClass).fadeTo(settings.issuesTransparencySpeed,1);
			
			// now moving the dates
			$(settings.datesDiv+' a').removeClass(settings.datesSelectedClass);
			$(this).addClass(settings.datesSelectedClass);
			if(settings.orientation == 'horizontal') {
				$(settings.datesDiv).animate({'marginLeft':defaultPositionDates-(widthDate*currentIndex)},{queue:false, duration:'settings.datesSpeed'});
			} else if(settings.orientation == 'vertical') {
				$(settings.datesDiv).animate({'marginTop':defaultPositionDates-(heightDate*currentIndex)},{queue:false, duration:'settings.datesSpeed'});
			}
		});

		$(settings.nextButton).bind('click', function(event){
			event.preventDefault();
			if(settings.orientation == 'horizontal') {
				var currentPositionIssues = parseInt($(settings.issuesDiv).css('marginLeft').substring(0,$(settings.issuesDiv).css('marginLeft').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/widthIssue;
				var currentPositionDates = parseInt($(settings.datesDiv).css('marginLeft').substring(0,$(settings.datesDiv).css('marginLeft').indexOf('px')));
				var currentIssueDate = currentPositionDates-widthDate;
				if(currentPositionIssues <= -(widthIssue*howManyIssues-(widthIssue))) {
					$(settings.issuesDiv).stop();
					$(settings.datesDiv+' li:last-child a').click();
				} else {
					if (!$(settings.issuesDiv).is(':animated')) {
						$(settings.issuesDiv).animate({'marginLeft':currentPositionIssues-widthIssue},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).next().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						$(settings.datesDiv).animate({'marginLeft':currentIssueDate},{queue:false, duration:'settings.datesSpeed'});
						$(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().next().children().addClass(settings.datesSelectedClass);
					}
				}
			} else if(settings.orientation == 'vertical') {
				var currentPositionIssues = parseInt($(settings.issuesDiv).css('marginTop').substring(0,$(settings.issuesDiv).css('marginTop').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/heightIssue;
				var currentPositionDates = parseInt($(settings.datesDiv).css('marginTop').substring(0,$(settings.datesDiv).css('marginTop').indexOf('px')));
				var currentIssueDate = currentPositionDates-heightDate;
				if(currentPositionIssues <= -(heightIssue*howManyIssues-(heightIssue))) {
					$(settings.issuesDiv).stop();
					$(settings.datesDiv+' li:last-child a').click();
				} else {
					if (!$(settings.issuesDiv).is(':animated')) {
						$(settings.issuesDiv).animate({'marginTop':currentPositionIssues-heightIssue},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).next().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						$(settings.datesDiv).animate({'marginTop':currentIssueDate},{queue:false, duration:'settings.datesSpeed'});
						$(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().next().children().addClass(settings.datesSelectedClass);
					}
				}
			}
		});

		$(settings.prevButton).click(function(event){
			event.preventDefault();
			if(settings.orientation == 'horizontal') {
				var currentPositionIssues = parseInt($(settings.issuesDiv).css('marginLeft').substring(0,$(settings.issuesDiv).css('marginLeft').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/widthIssue;
				var currentPositionDates = parseInt($(settings.datesDiv).css('marginLeft').substring(0,$(settings.datesDiv).css('marginLeft').indexOf('px')));
				var currentIssueDate = currentPositionDates+widthDate;
				if(currentPositionIssues >= 0) {
					$(settings.issuesDiv).stop();
					$(settings.datesDiv+' li:first-child a').click();
				} else {
					if (!$(settings.issuesDiv).is(':animated')) {
						$(settings.issuesDiv).animate({'marginLeft':currentPositionIssues+widthIssue},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).prev().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						$(settings.datesDiv).animate({'marginLeft':currentIssueDate},{queue:false, duration:'settings.datesSpeed'});
						$(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().prev().children().addClass(settings.datesSelectedClass);
					}
				}
			} else if(settings.orientation == 'vertical') {
				var currentPositionIssues = parseInt($(settings.issuesDiv).css('marginTop').substring(0,$(settings.issuesDiv).css('marginTop').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/heightIssue;
				var currentPositionDates = parseInt($(settings.datesDiv).css('marginTop').substring(0,$(settings.datesDiv).css('marginTop').indexOf('px')));
				var currentIssueDate = currentPositionDates+heightDate;
				if(currentPositionIssues >= 0) {
					$(settings.issuesDiv).stop();
					$(settings.datesDiv+' li:first-child a').click();
				} else {
					if (!$(settings.issuesDiv).is(':animated')) {
						$(settings.issuesDiv).animate({'marginTop':currentPositionIssues+heightIssue},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						$(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).prev().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						$(settings.datesDiv).animate({'marginTop':currentIssueDate},{queue:false, duration:'settings.datesSpeed'},{queue:false, duration:settings.issuesSpeed});
						$(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().prev().children().addClass(settings.datesSelectedClass);
					}
				}
			}
		});
		
		// keyboard navigation, added since 0.9.1
		if(settings.arrowKeys=='true') {
			if(settings.orientation=='horizontal') {
				$(document).keydown(function(event){
					if (event.keyCode == 39) { 
				       $(settings.nextButton).click();
				    }
					if (event.keyCode == 37) { 
				       $(settings.prevButton).click();
				    }
				});
			} else if(settings.orientation=='vertical') {
				$(document).keydown(function(event){
					if (event.keyCode == 40) { 
				       $(settings.nextButton).click();
				    }
					if (event.keyCode == 38) { 
				       $(settings.prevButton).click();
				    }
				});
			}
		}
		
		// default position startAt, added since 0.9.3
		$(settings.datesDiv+' li').eq(settings.startAt-1).find('a').trigger('click');
		
		// autoPlay, added since 0.9.4
		if(settings.autoPlay == 'true') { 
			setInterval("autoPlay()", settings.autoPlayPause);
		}
	});

};

// autoPlay, added since 0.9.4
function autoPlay(){
	var currentDate = $(settings.datesDiv).find('a.'+settings.datesSelectedClass);
	if(settings.autoPlayDirection == 'forward') {
		if(currentDate.parent().is('li:last-child')) {
			$(settings.datesDiv+' li:first-child').find('a').trigger('click');
		} else {
			currentDate.parent().next().find('a').trigger('click');
		}
	} else if(settings.autoPlayDirection == 'backward') {
		if(currentDate.parent().is('li:first-child')) {
			$(settings.datesDiv+' li:last-child').find('a').trigger('click');
		} else {
			currentDate.parent().prev().find('a').trigger('click');
		}
	}
}

/*!
 * jquery.tagcloud.js
 * A Simple Tag Cloud Plugin for JQuery
 *
 * https://github.com/addywaddy/jquery.tagcloud.js
 * created by Adam Groves
 */
(function($) {

  /*global jQuery*/
  "use strict";

  var compareWeights = function(a, b)
  {
    return a - b;
  };

  // Converts hex to an RGB array
  var toRGB = function(code) {
    if (code.length === 4) {
      code = jQuery.map(/\w+/.exec(code), function(el) {return el + el; }).join("");
    }
    var hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  };

  // Converts an RGB array to hex
  var toHex = function(ary) {
    return "#" + jQuery.map(ary, function(i) {
      var hex =  i.toString(16);
      hex = (hex.length === 1) ? "0" + hex : hex;
      return hex;
    }).join("");
  };

  var colorIncrement = function(color, range) {
    return jQuery.map(toRGB(color.end), function(n, i) {
      return (n - toRGB(color.start)[i])/range;
    });
  };

  var tagColor = function(color, increment, weighting) {
    var rgb = jQuery.map(toRGB(color.start), function(n, i) {
      var ref = Math.round(n + (increment[i] * weighting));
      if (ref > 255) {
        ref = 255;
      } else {
        if (ref < 0) {
          ref = 0;
        }
      }
      return ref;
    });
    return toHex(rgb);
  };

  $.fn.tagcloud = function(options) {

    var opts = $.extend({}, $.fn.tagcloud.defaults, options);
    var tagWeights = this.map(function(){
      return $(this).attr("rel");
    });
    tagWeights = jQuery.makeArray(tagWeights).sort(compareWeights);
    var lowest = tagWeights[0];
    var highest = tagWeights.pop();
    var range = highest - lowest;
    if(range === 0) {range = 1;}
    // Sizes
    var fontIncr, colorIncr;
    if (opts.size) {
      fontIncr = (opts.size.end - opts.size.start)/range;
    }
    // Colors
    if (opts.color) {
      colorIncr = colorIncrement (opts.color, range);
    }
    return this.each(function() {
      var weighting = $(this).attr("rel") - lowest;
      if (opts.size) {
        $(this).css({"font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit});
      }
      if (opts.color) {
        $(this).css({"color": tagColor(opts.color, colorIncr, weighting)});
      }
    });
  };

  $.fn.tagcloud.defaults = {
    size: {start: 14, end: 18, unit: "pt"}
  };

})(jQuery);

/*!
 * jQCloud Plugin for jQuery
 *
 * Version 0.2.10
 *
 * Copyright 2011, Luca Ongaro
 * Licensed under the MIT license.
 *
 * Date: Mon Jan 16 23:31:12 +0100 2012
*/

(function( $ ) {
  "use strict";
  $.fn.jQCloud = function(word_array, options) {
    // Reference to the container element
    var $this = this;
    // Namespace word ids to avoid collisions between multiple clouds
    var cloud_namespace = $this.attr('id') || Math.floor((Math.random()*1000000)).toString(36);

    // Default options value
    var default_options = {
      width: $this.width(),
      height: $this.height(),
      center: {
        x: $this.width() / 2.0,
        y: $this.height() / 2.0
      },
      delayedMode: word_array.length > 50,
      randomClasses: 0,
      nofollow: false,
      shape: false // It defaults to elliptic shape
    };

    // Maintain backward compatibility with old API (pre 0.2.0), where the second argument of jQCloud was a callback function
    if (typeof options === 'function') {
      options = { callback: options };
    }

    options = $.extend(default_options, options || {});

    // Add the "jqcloud" class to the container for easy CSS styling
    $this.addClass("jqcloud");

    var drawWordCloud = function() {
      // Helper function to test if an element overlaps others
      var hitTest = function(elem, other_elems){
        // Pairwise overlap detection
        var overlapping = function(a, b){
          if (Math.abs(2.0*a.offsetLeft + a.offsetWidth - 2.0*b.offsetLeft - b.offsetWidth) < a.offsetWidth + b.offsetWidth) {
            if (Math.abs(2.0*a.offsetTop + a.offsetHeight - 2.0*b.offsetTop - b.offsetHeight) < a.offsetHeight + b.offsetHeight) {
              return true;
            }
          }
          return false;
        };
        var i = 0;
        // Check elements for overlap one by one, stop and return false as soon as an overlap is found
        for(i = 0; i < other_elems.length; i++) {
          if (overlapping(elem, other_elems[i])) {
            return true;
          }
        }
        return false;
      };

      // Make sure every weight is a number before sorting
      for (var i = 0; i < word_array.length; i++) {
        word_array[i].weight = parseFloat(word_array[i].weight, 10);
      }

      // Sort word_array from the word with the highest weight to the one with the lowest
      word_array.sort(function(a, b) { if (a.weight < b.weight) {return 1;} else if (a.weight > b.weight) {return -1;} else {return 0;} });

      var step = (options.shape === "rectangular") ? 18.0 : 2.0;
      var already_placed_words = [];
      var aspect_ratio = options.width / options.height;

      // Function to draw a word, by moving it in spiral until it finds a suitable empty place. This will be iterated on each word.
      var drawOneWord = function(index, word) {
        // Define the ID attribute of the span that will wrap the word, and the associated jQuery selector string
        var word_id = cloud_namespace + "_word_" + index,
            word_selector = "#" + word_id,

            // If the option randomClasses is a number, and higher than 0, assign this word randomly to a class
            // of the kind 'r1', 'r2', 'rN' with N = randomClasses
            // If option randomClasses is an array, assign this word randomly to one of the classes in the array
            random_class = (typeof options.randomClasses === "number" && options.randomClasses > 0) ?
          " r" + Math.ceil(Math.random()*options.randomClasses) :
          (($.isArray(options.randomClasses) && options.randomClasses.length > 0) ?
            " " + options.randomClasses[ Math.floor(Math.random()*options.randomClasses.length) ] :
            ""),

            angle = 6.28 * Math.random(),
            radius = 0.0,

            // Only used if option.shape == 'rectangular'
            steps_in_direction = 0.0,
            quarter_turns = 0.0,
            weight = 5,
            inner_html,
            word_span;

        // Check is min(weight) > max(weight) otherwise use default
        if (word_array[0].weight > word_array[word_array.length - 1].weight) {
          // Linearly map the original weight to a discrete scale from 1 to 10
          weight = Math.round((word.weight - word_array[word_array.length - 1].weight) /
                              (word_array[0].weight - word_array[word_array.length - 1].weight) * 9.0) + 1
        }
        word_span = $('<span>').attr('id',word_id).attr('class','w' + weight).addClass(random_class).addClass(word.customClass||null).attr('title', word.title || word.text || '');

        // set data-X attributes if passed
        if(word.dataAttributes){
          $.each( word.dataAttributes , function(i,v){ word_span.attr('data-'+i,v); } );
        }

        // Append link if word.url attribute was set
        if (!!word.url) {
          inner_html = $('<a>').attr('href', encodeURI(word.url).replace(/'/g, "%27")).text(word.text);
          // If nofollow: true set rel='nofollow'
          if (!!options.nofollow) {
            inner_html.attr("rel", "nofollow");
          }
        } else {
          inner_html = word.text;
        }
        word_span.append(inner_html);

        // Bind handlers to words
        if (!!word.handlers) {
          for (var prop in word.handlers) {
            if (word.handlers.hasOwnProperty(prop) && typeof word.handlers[prop] === 'function') {
              $(word_span).bind(prop, word.handlers[prop]);
            }
          }
        }

        $this.append(word_span);

        var width = word_span.width(),
            height = word_span.height(),
            left = options.center.x - width / 2.0,
            top = options.center.y - height / 2.0;

        // Save a reference to the style property, for better performance
        var word_style = word_span[0].style;
        word_style.position = "absolute";
        word_style.left = left + "px";
        word_style.top = top + "px";

        while(hitTest(document.getElementById(word_id), already_placed_words)) {
          // option shape is 'rectangular' so move the word in a rectangular spiral
          if (options.shape === "rectangular") {
            steps_in_direction++;
            if (steps_in_direction * step > (1 + Math.floor(quarter_turns / 2.0)) * step * ((quarter_turns % 4 % 2) === 0 ? 1 : aspect_ratio)) {
              steps_in_direction = 0.0;
              quarter_turns++;
            }
            switch(quarter_turns % 4) {
              case 1:
                left += step * aspect_ratio + Math.random() * 2.0;
                break;
              case 2:
                top -= step + Math.random() * 2.0;
                break;
              case 3:
                left -= step * aspect_ratio + Math.random() * 2.0;
                break;
              case 0:
                top += step + Math.random() * 2.0;
                break;
            }
          } else { // Default settings: elliptic spiral shape
            radius += step;
            angle += (index % 2 === 0 ? 1 : -1)*step;

            left = options.center.x - (width / 2.0) + (radius*Math.cos(angle)) * aspect_ratio;
            top = options.center.y + radius*Math.sin(angle) - (height / 2.0);
          }
          word_style.left = left + "px";
          word_style.top = top + "px";
        }
        already_placed_words.push(document.getElementById(word_id));

        // Invoke callback if existing
        if (typeof word.callback === "function") {
          word.callback.call(word_span);
        }
      };

      var drawOneWordDelayed = function(index) {
        index = index || 0;
        if (index < word_array.length) {
          drawOneWord(index, word_array[index]);
          setTimeout(function(){drawOneWordDelayed(index + 1);}, 10);
        } else {
          if (typeof options.callback === 'function') {
            options.callback.call(this);
          }
        }
      };

      // Iterate drawOneWord on every word. The way the iteration is done depends on the drawing mode (delayedMode is true or false)
      if (options.delayedMode || options.delayed_mode){
        drawOneWordDelayed();
      }
      else {
        $.each(word_array, drawOneWord);
        if (typeof options.callback === 'function') {
          options.callback.call(this);
        }
      }
    };

    // Delay execution so that the browser can render the page before the computatively intensive word cloud drawing
    setTimeout(function(){drawWordCloud();}, 10);
    return this;
  };
})(jQuery);

/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) $
 * $Rev: 4265 $
 *
 * Version: 3.0
 * 
 * Requires: $ 1.2.2+
 */

(function($) {

$.event.special.mousewheel = {
	setup: function() {
		var handler = $.event.special.mousewheel.handler;
		
		// Fix pageX, pageY, clientX and clientY for mozilla
		if ( $.browser.mozilla )
			$(this).bind('mousemove.mousewheel', function(event) {
				$.data(this, 'mwcursorposdata', {
					pageX: event.pageX,
					pageY: event.pageY,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
	
		if ( this.addEventListener )
			this.addEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		var handler = $.event.special.mousewheel.handler;
		
		$(this).unbind('mousemove.mousewheel');
		
		if ( this.removeEventListener )
			this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = function(){};
		
		$.removeData(this, 'mwcursorposdata');
	},
	
	handler: function(event) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		event = $.event.fix(event || window.event);
		// Get correct pageX, pageY, clientX and clientY for mozilla
		$.extend( event, $.data(this, 'mwcursorposdata') || {} );
		var delta = 0, returnValue = true;
		
		if ( event.wheelDelta ) delta = event.wheelDelta/120;
		if ( event.detail     ) delta = -event.detail/3;
		if ( $.browser.opera  ) delta = -event.wheelDelta;
		
		event.data  = event.data || {};
		event.type  = "mousewheel";
		
		// Add delta to the front of the arguments
		args.unshift(delta);
		// Add event to the front of the arguments
		args.unshift(event);

		return $.event.handle.apply(this, args);
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});

})(jQuery);
/* Copyright (c) 2006 Kelvin Luck (kelvin AT kelvinluck DOT com || http://www.kelvinluck.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * See http://kelvinluck.com/assets/jquery/jScrollPane/
 * $Id: jScrollPane.js 24 2008-11-29 07:08:14Z kelvin.luck $
 */

/**
 * Replace the vertical scroll bars on any matched elements with a fancy
 * styleable (via CSS) version. With JS disabled the elements will
 * gracefully degrade to the browsers own implementation of overflow:auto.
 * If the mousewheel plugin has been included on the page then the scrollable areas will also
 * respond to the mouse wheel.
 *
 * @example jQuery(".scroll-pane").jScrollPane();
 *
 * @name jScrollPane
 * @type jQuery
 * @param Object	settings	hash with options, described below.
 *								scrollbarWidth	-	The width of the generated scrollbar in pixels
 *								scrollbarMargin	-	The amount of space to leave on the side of the scrollbar in pixels
 *								wheelSpeed		-	The speed the pane will scroll in response to the mouse wheel in pixels
 *								showArrows		-	Whether to display arrows for the user to scroll with
 *								arrowSize		-	The height of the arrow buttons if showArrows=true
 *								animateTo		-	Whether to animate when calling scrollTo and scrollBy
 *								dragMinHeight	-	The minimum height to allow the drag bar to be
 *								dragMaxHeight	-	The maximum height to allow the drag bar to be
 *								animateInterval	-	The interval in milliseconds to update an animating scrollPane (default 100)
 *								animateStep		-	The amount to divide the remaining scroll distance by when animating (default 3)
 *								maintainPosition-	Whether you want the contents of the scroll pane to maintain it's position when you re-initialise it - so it doesn't scroll as you add more content (default true)
 *								scrollbarOnLeft	-	Display the scrollbar on the left side?  (needs stylesheet changes, see examples.html)
 *								reinitialiseOnImageLoad - Whether the jScrollPane should automatically re-initialise itself when any contained images are loaded
 * @return jQuery
 * @cat Plugins/jScrollPane
 * @author Kelvin Luck (kelvin AT kelvinluck DOT com || http://www.kelvinluck.com)
 */

(function($) {

$.jScrollPane = {
	active : []
};
$.fn.jScrollPane = function(settings)
{
	settings = $.extend({}, $.fn.jScrollPane.defaults, settings);

	var rf = function() { return false; };
	
	return this.each(
		function()
		{
			var $this = $(this);
			// Switch the element's overflow to hidden to ensure we get the size of the element without the scrollbars [http://plugins.jquery.com/node/1208]
			$this.css('overflow', 'hidden');
			var paneEle = this;
			
			if ($(this).parent().is('.jScrollPaneContainer')) {
				var currentScrollPosition = settings.maintainPosition ? $this.offset({relativeTo:$(this).parent()[0]}).top : 0;
				var $c = $(this).parent();
				var paneWidth = $c.innerWidth();
				var paneHeight = $c.outerHeight();
				var trackHeight = paneHeight;
				$('>.jScrollPaneTrack, >.jScrollArrowUp, >.jScrollArrowDown', $c).remove();
				$this.css({'top':0});
			} else {
				var currentScrollPosition = 0;
				this.originalPadding = $this.css('paddingTop') + ' ' + $this.css('paddingRight') + ' ' + $this.css('paddingBottom') + ' ' + $this.css('paddingLeft');
				this.originalSidePaddingTotal = (parseInt($this.css('paddingLeft')) || 0) + (parseInt($this.css('paddingRight')) || 0);
				var paneWidth = $this.innerWidth();
				var paneHeight = $this.innerHeight();
				var trackHeight = paneHeight;
				$this.wrap(
					$('<div></div>').attr(
						{'className':'jScrollPaneContainer'}
					).css(
						{
							'height':paneHeight+'px', 
							'width':paneWidth+'px'
						}
					)
				);
				// deal with text size changes (if the jquery.em plugin is included)
				// and re-initialise the scrollPane so the track maintains the
				// correct size
				$(document).bind(
					'emchange', 
					function(e, cur, prev)
					{
						$this.jScrollPane(settings);
					}
				);
				
			}
			
			if (settings.reinitialiseOnImageLoad) {
				// code inspired by jquery.onImagesLoad: http://plugins.jquery.com/project/onImagesLoad
				// except we re-initialise the scroll pane when each image loads so that the scroll pane is always up to size...
				// TODO: Do I even need to store it in $.data? Is a local variable here the same since I don't pass the reinitialiseOnImageLoad when I re-initialise?
				var $imagesToLoad = $.data(paneEle, 'jScrollPaneImagesToLoad') || $('img', $this);
				var loadedImages = [];
				
				if ($imagesToLoad.length) {
					$imagesToLoad.each(function(i, val)	{
						$(this).bind('load', function() {
							if($.inArray(i, loadedImages) == -1){ //don't double count images
								loadedImages.push(val); //keep a record of images we've seen
								$imagesToLoad = $.grep($imagesToLoad, function(n, i) {
									return n != val;
								});
								$.data(paneEle, 'jScrollPaneImagesToLoad', $imagesToLoad);
								settings.reinitialiseOnImageLoad = false;
								$this.jScrollPane(settings); // re-initialise
							}
						}).each(function(i, val) {
							if(this.complete || this.complete===undefined) { 
								//needed for potential cached images
								this.src = this.src; 
							} 
						});
					});
				};
			}

			var p = this.originalSidePaddingTotal;
			
			var cssToApply = {
				'height':'auto',
				'width':paneWidth - settings.scrollbarWidth - settings.scrollbarMargin - p + 'px'
			}

			if(settings.scrollbarOnLeft) {
				cssToApply.paddingLeft = settings.scrollbarMargin + settings.scrollbarWidth + 'px';
			} else {
				cssToApply.paddingRight = settings.scrollbarMargin + 'px';
			}

			$this.css(cssToApply);

			var contentHeight = $this.outerHeight();
			var percentInView = paneHeight / contentHeight;

			if (percentInView < .99) {
				var $container = $this.parent();
				$container.append(
					$('<div></div>').attr({'className':'jScrollPaneTrack'}).css({'width':settings.scrollbarWidth+'px'}).append(
						$('<div></div>').attr({'className':'jScrollPaneDrag'}).css({'width':settings.scrollbarWidth+'px'}).append(
							$('<div></div>').attr({'className':'jScrollPaneDragTop'}).css({'width':settings.scrollbarWidth+'px'}),
							$('<div></div>').attr({'className':'jScrollPaneDragBottom'}).css({'width':settings.scrollbarWidth+'px'})
						)
					)
				);
				
				var $track = $('>.jScrollPaneTrack', $container);
				var $drag = $('>.jScrollPaneTrack .jScrollPaneDrag', $container);
				
				if (settings.showArrows) {
					
					var currentArrowButton;
					var currentArrowDirection;
					var currentArrowInterval;
					var currentArrowInc;
					var whileArrowButtonDown = function()
					{
						if (currentArrowInc > 4 || currentArrowInc%4==0) {
							positionDrag(dragPosition + currentArrowDirection * mouseWheelMultiplier);
						}
						currentArrowInc ++;
					};
					var onArrowMouseUp = function(event)
					{
						$('html').unbind('mouseup', onArrowMouseUp);
						currentArrowButton.removeClass('jScrollActiveArrowButton');
						clearInterval(currentArrowInterval);
					};
					var onArrowMouseDown = function() {
						$('html').bind('mouseup', onArrowMouseUp);
						currentArrowButton.addClass('jScrollActiveArrowButton');
						currentArrowInc = 0;
						whileArrowButtonDown();
						currentArrowInterval = setInterval(whileArrowButtonDown, 100);
					};
					$container
						.append(
							$('<a></a>')
								.attr({'href':'javascript:;', 'className':'jScrollArrowUp'})
								.css({'width':settings.scrollbarWidth+'px'})
								.html('Scroll up')
								.bind('mousedown', function()
								{
									currentArrowButton = $(this);
									currentArrowDirection = -1;
									onArrowMouseDown();
									this.blur();
									return false;
								})
								.bind('click', rf),
							$('<a></a>')
								.attr({'href':'javascript:;', 'className':'jScrollArrowDown'})
								.css({'width':settings.scrollbarWidth+'px'})
								.html('Scroll down')
								.bind('mousedown', function()
								{
									currentArrowButton = $(this);
									currentArrowDirection = 1;
									onArrowMouseDown();
									this.blur();
									return false;
								})
								.bind('click', rf)
						);
					var $upArrow = $('>.jScrollArrowUp', $container);
					var $downArrow = $('>.jScrollArrowDown', $container);
					if (settings.arrowSize) {
						trackHeight = paneHeight - settings.arrowSize - settings.arrowSize;
						$track
							.css({'height': trackHeight+'px', top:settings.arrowSize+'px'})
					} else {
						var topArrowHeight = $upArrow.height();
						settings.arrowSize = topArrowHeight;
						trackHeight = paneHeight - topArrowHeight - $downArrow.height();
						$track
							.css({'height': trackHeight+'px', top:topArrowHeight+'px'})
					}
				}
				
				var $pane = $(this).css({'position':'absolute', 'overflow':'visible'});
				
				var currentOffset;
				var maxY;
				var mouseWheelMultiplier;
				// store this in a seperate variable so we can keep track more accurately than just updating the css property..
				var dragPosition = 0;
				var dragMiddle = percentInView*paneHeight/2;
				
				// pos function borrowed from tooltip plugin and adapted...
				var getPos = function (event, c) {
					var p = c == 'X' ? 'Left' : 'Top';
					return event['page' + c] || (event['client' + c] + (document.documentElement['scroll' + p] || document.body['scroll' + p])) || 0;
				};
				
				var ignoreNativeDrag = function() {	return false; };
				
				var initDrag = function()
				{
					ceaseAnimation();
					currentOffset = $drag.offset(false);
					currentOffset.top -= dragPosition;
					maxY = trackHeight - $drag[0].offsetHeight;
					mouseWheelMultiplier = 2 * settings.wheelSpeed * maxY / contentHeight;
				};
				
				var onStartDrag = function(event)
				{
					initDrag();
					dragMiddle = getPos(event, 'Y') - dragPosition - currentOffset.top;
					$('html').bind('mouseup', onStopDrag).bind('mousemove', updateScroll);
					if ($.browser.msie) {
						$('html').bind('dragstart', ignoreNativeDrag).bind('selectstart', ignoreNativeDrag);
					}
					return false;
				};
				var onStopDrag = function()
				{
					$('html').unbind('mouseup', onStopDrag).unbind('mousemove', updateScroll);
					dragMiddle = percentInView*paneHeight/2;
					if ($.browser.msie) {
						$('html').unbind('dragstart', ignoreNativeDrag).unbind('selectstart', ignoreNativeDrag);
					}
				};
				var positionDrag = function(destY)
				{
					destY = destY < 0 ? 0 : (destY > maxY ? maxY : destY);
					dragPosition = destY;
					$drag.css({'top':destY+'px'});
					var p = destY / maxY;
					$pane.css({'top':((paneHeight-contentHeight)*p) + 'px'});
					$this.trigger('scroll');
					if (settings.showArrows) {
						$upArrow[destY == 0 ? 'addClass' : 'removeClass']('disabled');
						$downArrow[destY == maxY ? 'addClass' : 'removeClass']('disabled');
					}
				};
				var updateScroll = function(e)
				{
					positionDrag(getPos(e, 'Y') - currentOffset.top - dragMiddle);
				};
				
				var dragH = Math.max(Math.min(percentInView*(paneHeight-settings.arrowSize*2), settings.dragMaxHeight), settings.dragMinHeight);
				
				$drag.css(
					{'height':dragH+'px'}
				).bind('mousedown', onStartDrag);
				
				var trackScrollInterval;
				var trackScrollInc;
				var trackScrollMousePos;
				var doTrackScroll = function()
				{
					if (trackScrollInc > 8 || trackScrollInc%4==0) {
						positionDrag((dragPosition - ((dragPosition - trackScrollMousePos) / 2)));
					}
					trackScrollInc ++;
				};
				var onStopTrackClick = function()
				{
					clearInterval(trackScrollInterval);
					$('html').unbind('mouseup', onStopTrackClick).unbind('mousemove', onTrackMouseMove);
				};
				var onTrackMouseMove = function(event)
				{
					trackScrollMousePos = getPos(event, 'Y') - currentOffset.top - dragMiddle;
				};
				var onTrackClick = function(event)
				{
					initDrag();
					onTrackMouseMove(event);
					trackScrollInc = 0;
					$('html').bind('mouseup', onStopTrackClick).bind('mousemove', onTrackMouseMove);
					trackScrollInterval = setInterval(doTrackScroll, 100);
					doTrackScroll();
				};
				
				$track.bind('mousedown', onTrackClick);
				
				$container.bind(
					'mousewheel',
					function (event, delta) {
						initDrag();
						ceaseAnimation();
						var d = dragPosition;
						positionDrag(dragPosition - delta * mouseWheelMultiplier);
						var dragOccured = d != dragPosition;
						return !dragOccured;
					}
				);

				var _animateToPosition;
				var _animateToInterval;
				function animateToPosition()
				{
					var diff = (_animateToPosition - dragPosition) / settings.animateStep;
					if (diff > 1 || diff < -1) {
						positionDrag(dragPosition + diff);
					} else {
						positionDrag(_animateToPosition);
						ceaseAnimation();
					}
				}
				var ceaseAnimation = function()
				{
					if (_animateToInterval) {
						clearInterval(_animateToInterval);
						delete _animateToPosition;
					}
				};
				var scrollTo = function(pos, preventAni)
				{
					if (typeof pos == "string") {
						$e = $(pos, this);
						if (!$e.length) return;
						pos = $e.offset().top - $this.offset().top;
					}
					ceaseAnimation();
					var destDragPosition = -pos/(paneHeight-contentHeight) * maxY;
					if (preventAni || !settings.animateTo) {
						positionDrag(destDragPosition);
					} else {
						_animateToPosition = destDragPosition;
						_animateToInterval = setInterval(animateToPosition, settings.animateInterval);
					}
				};
				$this[0].scrollTo = scrollTo;
				
				$this[0].scrollBy = function(delta)
				{
					var currentPos = -parseInt($pane.css('top')) || 0;
					scrollTo(currentPos + delta);
				};
				
				initDrag();
				
				scrollTo(-currentScrollPosition, true);
			
				// Deal with it when the user tabs to a link or form element within this scrollpane
				$('*', this).bind(
					'focus',
					function(event)
					{
						var eleTop = $(this).position().top;
						var viewportTop = -parseInt($pane.css('top')) || 0;
						var maxVisibleEleTop = viewportTop + paneHeight;
						var eleInView = eleTop > viewportTop && eleTop < maxVisibleEleTop;
						if (!eleInView) {
							$container.scrollTop(0);
							var destPos = eleTop - settings.scrollbarMargin;
							if (eleTop > viewportTop) { // element is below viewport - scroll so it is at bottom.
								destPos += $(this).height() + 15+ settings.scrollbarMargin - paneHeight;
							}
							scrollTo(destPos);
						}
					}
				)
				
				
				if (location.hash) {
					// the timeout needs to be longer in IE when not loading from cache...
					setTimeout(function() {
						$(location.hash, $this).trigger('focus');
					}, $.browser.msie ? 100 : 0);
				}
				
				// use event delegation to listen for all clicks on links and hijack them if they are links to
				// anchors within our content...
				$(document).bind(
					'click',
					function(e)
					{
						$target = $(e.target);
						if ($target.is('a')) {
							var h = $target.attr('href');
							if (h.substr(0, 1) == '#') {
								$linkedEle = $(h, $this);
								if ($linkedEle.length) {
									$linkedEle.trigger('focus');
									return false;
								}
							}
						}
					}
				);
				
				$.jScrollPane.active.push($this[0]);
				
			} else {
				$this.css(
					{
						'height':paneHeight+'px',
						'width':paneWidth-this.originalSidePaddingTotal+'px',
						'padding':this.originalPadding
					}
				);
				// remove from active list?
			}
			
		}
	)
};

$.fn.jScrollPane.defaults = {
	scrollbarWidth : 10,
	scrollbarMargin : 5,
	wheelSpeed : 18,
	showArrows : false,
	arrowSize : 0,
	animateTo : false,
	dragMinHeight : 1,
	dragMaxHeight : 99999,
	animateInterval : 100,
	animateStep: 3,
	maintainPosition: true,
	scrollbarOnLeft: false,
	reinitialiseOnImageLoad: false
};

// clean up the scrollTo expandos
$(window)
	.bind('unload', function() {
		var els = $.jScrollPane.active; 
		for (var i=0; i<els.length; i++) {
			els[i].scrollTo = els[i].scrollBy = null;
		}
	}
);

})(jQuery);
// jquery.jsonp 2.2.1 (c)2012 Julian Aubourg | MIT License
// http://code.google.com/p/jquery-jsonp/
(function(a){function b(){}function c(a){A=[a]}function d(a,b,c,d){try{d=a&&a.apply(b.context||b,c)}catch(e){d=!1}return d}function e(a){return/\?/.test(a)?"&":"?"}function D(l){function V(a){O++||(P(),I&&(y[K]={s:[a]}),E&&(a=E.apply(l,[a])),d(l.success,l,[a,t]),d(D,l,[l,t]))}function W(a){O++||(P(),I&&a!=u&&(y[K]=a),d(l.error,l,[l,a]),d(D,l,[l,a]))}l=a.extend({},B,l);var D=l.complete,E=l.dataFilter,F=l.callbackParameter,G=l.callback,H=l.cache,I=l.pageCache,J=l.charset,K=l.url,L=l.data,M=l.timeout,N,O=0,P=b,Q,R,S,T,U;return l.abort=function(){!(O++)&&P()},d(l.beforeSend,l,[l])===!1||O?l:(K=K||h,L=L?typeof L=="string"?L:a.param(L,l.traditional):h,K+=L?e(K)+L:h,F&&(K+=e(K)+encodeURIComponent(F)+"=?"),!H&&!I&&(K+=e(K)+"_"+(new Date).getTime()+"="),K=K.replace(/=\?(&|$)/,"="+G+"$1"),I&&(N=y[K])?N.s?V(N.s[0]):W(N):(v[G]=c,S=a(s)[0],S.id=k+z++,J&&(S[g]=J),C&&C.version()<11.6?(T=a(s)[0]).text="document.getElementById('"+S.id+"')."+n+"()":S[f]=f,p in S&&(S.htmlFor=S.id,S.event=m),S[o]=S[n]=S[p]=function(a){if(!S[q]||!/i/.test(S[q])){try{S[m]&&S[m]()}catch(b){}a=A,A=0,a?V(a[0]):W(i)}},S.src=K,P=function(a){U&&clearTimeout(U),S[p]=S[o]=S[n]=null,w[r](S),T&&w[r](T)},w[j](S,x),T&&w[j](T,x),U=M>0&&setTimeout(function(){W(u)},M)),l)}var f="async",g="charset",h="",i="error",j="insertBefore",k="_jqjsp",l="on",m=l+"click",n=l+i,o=l+"load",p=l+"readystatechange",q="readyState",r="removeChild",s="<script>",t="success",u="timeout",v=window,w=a("head")[0]||document.documentElement,x=w.firstChild,y={},z=0,A,B={callback:k,url:location.href},C=v.opera;D.setup=function(b){a.extend(B,b)},a.jsonp=D})(jQuery)
/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: data.results[0]
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);
