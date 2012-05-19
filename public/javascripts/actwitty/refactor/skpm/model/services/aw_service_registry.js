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
                                                                                  aw_api_facebook_get_contacts(fn_cb);                                                                                            },
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
                                                                                  aw_api_twitter_get_contacts(fn_cb);                                                                                 },
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
