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




var aw_api_global_interest_id;

var aw_global_track_topic_stream_req;
var aw_global_topical_length;

function aw_api_model_set_interests_data(data, summary_id)
{
  console.log("**in fetch interest data");
  var filter_id = "aw.interestdata." + summary_id;
  
  var cache_data = {
                      id : filter_id,
                      data : data 
                   };

  aw_cache_api_set_data(filter_id, data);
  aw_global_track_topic_stream_req++;

  if (aw_global_track_topic_stream_req === aw_global_topical_length && aw_js_active_interest_stream === "all") {
      aw_cache_api_get_data("aw.interests.data", aw_api_view_home_in_streams_layout);  
  }
    
}

/*
 * SAMARTH : fetch and keep topical data for different interets
 *
 *
 */

function aw_api_model_fetch_interests_data(data)
{
  
  var interest_data =  data; //aw_cache_api_get_data("aw.interests.data", null);
  aw_global_topical_length = interest_data.length;
  aw_global_track_topic_stream_req = 0;
  $.each( interest_data, function( key, summary) {
    
      var filter = {
                      user_id : aw_js_global_visited_user_credentials.id,
                      summary_id : summary.interest_id
                   }
      
      aw_api_global_interest_id = summary.interest_id;
       
      aw_pulled_stream_query_filter(filter, aw_api_model_set_interests_data); 
      console.log("********************in fetch interest data"); 
  });
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
                    test : 1,
                    summary_id : filter.summary_id
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
    // SAMARTH : added summary id
    context.no_render_fn_cb(merged_arr, context.summary_id);
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

