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
  //alert("BEFORE:" + JSON.stringify(filter));
  if( filter ){
    aw_local_unity_control_registry = new Date().getTime();
    var context={
                    cookie:  aw_local_unity_control_registry,
                    test : 1
                };
    if( fn_cb != null){
      context.no_render_fn_cb = fn_cb;
    }
   // alert(JSON.stringify(filter));
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
                              "aw_pulled_stream_query_filter:  Server request failed for " + request_tag 
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
                              "aw_get_mentions_details_for_mentionlist:  Server request failed for " + request_tag 
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });  
}

