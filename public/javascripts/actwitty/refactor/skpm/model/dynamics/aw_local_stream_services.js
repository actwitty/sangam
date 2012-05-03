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
  if( facebook_data ){
    $.each( facebook_data, function( index, post_data ){

      var pid = post_data.service.pid;
      var post_mention_data = context['services']['facebook']['posts'][pid];
      if( post_mention_data 
            && post_mention_data.entities 
              && post_mention_data.entities.array ){
  
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
  }
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
                                url:  "/" + post_data.post.user.username,
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

       if( aw_js_global_tw_access.uid != json_data.retweeted_status.user.id_str ){
            aw_post_json["action"] = [{
                                  name: 'Retweet',
                                  type: 'link',
                                  url: 'https://twitter.com/intent/retweet?tweet_id=' +  post_data.post.source_object_id
                               }];
          }                              

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
        if( doc.url_title ){
          attachment['title'] = doc.url_title;
        }
        
        if( doc.url_description ) {
          attachment['description'] = doc.url_description;
        }
        
        if( doc.url_image){

          attachment['image_url'] = doc.url_image;
        }
        
        if( doc.url_provider){
          attachment['provider'] = doc.url_provider;
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
                                                            

