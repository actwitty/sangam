var aw_srv_local_json_data_cache_manager = {
                                      /* Landing Page Get Latest Channels */
                                      'AW_SRV_LPM_GET_LATEST_CHANNELS'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_1(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_lpm_render_latest_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_latest_summary.json"
                                                                            },
                                      'AW_SRV_PPM_CHN_GET_USER_CHANNELS'  : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_1(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_chn_render_user_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_summary.json"
                                                                            },
                                                                                                          
                                      'AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS' : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_2(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_chn_render_subscribed_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_summary.json"
                                                                            },
                                      'AW_SRV_PPM_CHN_GET_ALL_CHANNELS'      : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_3(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_chn_render_all_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_summary.json"
                                                                            },
                                      'AW_SRV_PPM_CHN_GET_ALL_MENTIONS'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_4(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_chn_render_user_mentions(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_entities.json"
                                                                            },
                                      'AW_SRV_PPM_CHN_GET_ALL_LOCATIONS'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_5(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_chn_render_user_locations(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_locations.json"
                                                                            },     
                                      'AW_SRV_PPM_STM_GET_STREAMS'      : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_6(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_streams(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_streams.json"
                                                                            },     
                                      'AW_SRV_PPM_STM_GET_STREAM_LIKES'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_7(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_stream_likes(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_users_of_campaign.json"
                                                                            },        
                                      'AW_SRV_PPM_STM_GET_STREAM_COMMENTS'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_8(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_stream_comments(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_all_comments.json"
                                                                            },         
                                      'AW_SRV_PPM_STM_GET_STREAM_SHARES'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_9(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_stream_shares(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_social_counter.json"
                                                                            },     
                                       'AW_SRV_PPM_STM_GET_RECOMMENDED_CHANNELS'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_10(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_recommended_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_recommended_channels.json"
                                                                            },           
                                       'AW_SRV_PPM_STM_GET_ALL_MENTIONS'      : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_11(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_all_mentions(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_related_entities"
                                                                            },       
                                      'AW_SRV_PPM_STM_GET_ALL_LOCATIONS'      : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_12(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_all_locations(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_related_locations.json"                                                                            },     
                                      'AW_SRV_PPM_STM_GET_SIMILAR_PEOPLE'      : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_15(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_similar_ppl(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_related_friends.json"
                                                                            },
                                       'AW_SRV_PPM_CMN_GET_USER_AUTOCOMPELTE_CHANNELS'  : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_16(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_cmn_render_user_suggest_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'URL' : "/home/get_channels.json"
                                                                            },
                                        'AW_SRV_PPM_CMN_GET_MENTION_ENRICHED_STREAMS'  : {
                                                                             
                                                                              'CB': function aw_temp_resp_fn_17(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_mention_enriched_streams(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_enriched_activities.json"
                                                                            },
                                        'AW_SRV_PPM_INPUT_RESP_GET_NEW_POST' : {
                                                                                  'CB': function aw_temp_resp_fn_18(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_input_get_new_stream(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_single_activity.json"
                                                                                
                                                                               },
                                        'AW_SRV_PPM_INPUT_RESP_GET_NEW_CHN' : {
                                                                                  'CB': function aw_temp_resp_fn_19(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_input_get_new_channels(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_single_channel.json"
                                                                                
                                                                               },

                                        'AW_SRV_PPM_STM_GET_ALL_VIDEOS' : {
                                                                                  'CB': function aw_temp_resp_fn_20(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_videos(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_document_stream.json"
                                                                                
                                                                               },
                                        'AW_SRV_PPM_STM_GET_ALL_IMAGES' : {
                                                                                  'CB': function aw_temp_resp_fn_20(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_render_images(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_document_stream.json"
                                                                                
                                                                               },
                                        'AW_SRV_PPM_CMN_SEARCH_ANY_TYPE': {
                                                                            'CB': function aw_temp_resp_fn_20(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_cmn_header_render_search_any(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/search_any.json"
                                                                          },
                                        'AW_SRV_PPM_STM_SINGLEPOST_FETCH' : {
                                                                                'CB' : function aw_temp_resp_fn_21(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_single(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_single_activity.json"
                                                                            }
                                          

                                                                            
                                    };


/*******************************************************/
/*
 *  This function is agnostic of params and just passes it to the relevant call
 *
 */
function aw_api_srv_make_a_get_request(request_tag, params){
     if( request_tag.length == 0 ){
        aw_lib_console_log("error","aw_api_srv: Request " + request_tag ); 
        return -1;
     }
     if( params == null ){
        aw_lib_console_log("error","aw_api_srv: Request Params is null "); 
        return -1;
     }else{
        aw_lib_console_log("error","aw_api_srv: Request: " + request_tag +  " Params: " + JSON.stringify(params)); 
      }

     aw_lib_console_log("debug","aw_api_srv: Request " + request_tag );  
     // Called functions don't know about the tag so just let them know secretively 
     params['__aw_srv_secret_internal_req_tag__'] =  request_tag;
     if(aw_srv_local_json_data_cache_manager[request_tag]['URL'].length == 0){
          aw_lib_console_log("debug","aw_api_srv: Return " + request_tag );   
          return -1;
     }else{
        var ret_code = aw_srv_internal_srv_get_requestor(params);
        if( ret_code == 0){
          aw_lib_console_log("debug","aw_api_srv: for request " + request_tag + " RETURN: SUCCESS");   
        }else{
          aw_lib_console_log("error","aw_api_srv: for request " + request_tag + " RETURN: FAILED");   
          return -1;
        }
     }
     aw_lib_console_log("debug","aw_api_srv: Return " + request_tag );  
     return 0;
}


/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_get_data_for_request(request_tag){
    if( request_tag.length == 0 ){
        aw_lib_console_log("error","aw_api_srv: Get Data " + request_tag ); 
        return {};
     }
    return aw_srv_local_json_data_cache_manager[request_tag]['DATA'];
}

/*******************************************************/
/*
 *
 *
 */
function aw_awpi_serv_resp_data_for_get_request_in_params(params){
  return params['aw_srv_protocol_params']['__AW_SRV_RESP__'];
}

/*******************************************************/
/*
 *
 *
 */
function aw_srv_internal_srv_get_requestor(params){
  var request_tag =  params['__aw_srv_secret_internal_req_tag__'];
  var srv_params = params['aw_srv_protocol_params'];
  $.ajax({

            url: aw_srv_local_json_data_cache_manager[request_tag]['URL'],
            type: 'GET',
            data: srv_params,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {


              if( aw_srv_local_json_data_cache_manager[request_tag]['MULTI'] == true ){
                 params['aw_srv_protocol_params']['__AW_SRV_RESP__'] = data;
              }

              aw_srv_local_json_data_cache_manager[request_tag]['DATA'] = data;

              aw_lib_console_log("debug","aw_api_srv_internal: response for  " + request_tag + "[" + JSON.stringify(data) +  "]" );   
              if(aw_srv_local_json_data_cache_manager[request_tag]['CB']){
                  aw_srv_local_json_data_cache_manager[request_tag]['CB'](params);
              }else{
                  aw_lib_console_log("error","aw_api_srv_internal:  No call back for the tag " + request_tag );   
                  return -1;
              }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_console_log("error",
                              "aw_api_srv_internal:  Server request failed for " + request_tag 
                              +  " error: " + errorThrown + " status:" + textStatus);   
            aw_lib_alert('A request to server has failed.');
            return -1;
        }
    });
    return 0;
}


