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
  context.services.facebook.processed = true;
  aw_pulled_stream_assimilate_services(context); 
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
  context.services.facebook['data'] = facebook_data;
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
  $.each( fb_data.posts, function( key, post_data ){
    if( post_data.post.source_object_type != "post" ){
      return;
    }
    if( id_list_str.length ){
      id_list_str = id_list_str + ',' + key;
    }else{
      id_list_str = key;
    }
  });
  aw_api_facebook_get_post_data_for_list_of_ids( id_list_str,
                                                aw_pulled_stream_facebook_cb,
                                                context);
                                                              
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
                                                $.each( tw_data.posts, function( key, post_data ){
                                                  var aw_post_json = {};

                                                  aw_post_json["service"] = {
                                                                              name: post_data.post.source_name,
                                                                              pid: post_data.post.source_object_id
                                                                            };

                                                  aw_post_json["timestamp"] = post_data.post.time;
                                                  var values = post_data.post.time.split(" ");
                                                  var timeValue = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
                                                  aw_post_json["local_timestamp"]  = new Date(Date.parse(timeValue)).getTime();
                                                  aw_post_json["originator"] = {
                                                                                  image: post_data.post.user.photo,
                                                                                  name: post_data.post.user.full_name,
                                                                                  url:  "/home/sketch?id=" + post_data.post.user.id,
                                                                                  uid: aw_js_global_visited_user_foreign_ids['twitter']
                                                                               };

                                                  if( post_data.post.if_yaml ){
                                                    var native_object = JSON.parse(post_data.post.text);
                                                    alert(JSON.stringify(native_object));
                                                  }
                                                  if(post_data.post.text){
                                                    aw_post_json["text"] = post_data.post.text;
                                                  }

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
                                              };
                                                            

