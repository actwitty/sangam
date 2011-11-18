var aw_srv_local_post_json_data_cache_manager = {
                                                  'AW_SRV_PPM_CMN_CREATE_POST'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_1(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_input_create_post(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : false,
                                                                              'DATA_TYPE': "script",
                                                                              'URL' : "/home/create_activity.json"
                                                                            },
                                                  'AW_SRV_PPM_CHN_SUBSCRIBE_CHANNEL'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_2(params){
                                                                                      /* params -> summary JSON */
                                                                                   aw_api_srv_resp_ppm_resp_subscribe(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'DATA_TYPE': "json",
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/subscribe_summary.json"
                                                                            },
                                                  'AW_SRV_PPM_CHN_UNSUBSCRIBE_CHANNEL'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_3(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_resp_unsubscribe(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/unsubscribe_summary.json"
                                                                            },
                                                  'AW_SRV_PPM_STM_DELETE_POST'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_4(params){
                                                                                      /* params -> summary JSON */
                                                                                      //aw_api_srv_resp_ppm_input_create_post(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'DATA_TYPE': "script",
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/get_latest_summary.json"
                                                                            },
                                                  'AW_SRV_PPM_STM_CREATE_LIKE'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_5(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_like(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'DATA_TYPE': "json",
                                                                              'MULTI' : true,
                                                                              'URL' : "/home/create_campaign.json"
                                                                            },
                                                  'AW_SRV_PPM_STM_DELETE_LIKE'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_6(params){
                                                                                      aw_api_srv_resp_ppm_stm_unlike(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/delete_campaign.json"
                                                                            },
                                                  'AW_SRV_PPM_STM_CREATE_COMMENT'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_7(params){
                                                                                      aw_api_srv_resp_ppm_stm_comment_add(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/create_comment.json"
                                                                            },
                                                  'AW_SRV_PPM_STM_DELETE_COMMENT'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_8(params){
                                                                                      aw_api_srv_resp_ppm_stm_comment_delete(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/delete_comment.json"
                                                                            },
                                                   'AW_SRV_PPM_STM_DELETE_IMAGE_ATTACHMENT'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_9(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_delete_image(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/remove_document.json"
                                                                            },      
                                                   'AW_SRV_PPM_STM_DELETE_VIDEO_ATTACHMENT'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_10(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_delete_video(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/remove_document.json"
                                                                            },      
                                                                            
                                                    'AW_SRV_PPM_STM_UPDATE_SOCIAL_SHARE_COUNTER'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_11(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_shares_update_counters(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/update_social_media_share.json"
                                                                            },             
                                                    'AW_SRV_PPM_STM_RENAME_CHANNEL'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_12(params){
                                                                                      /* params -> summary JSON */
                                                                                      //aw_api_srv_resp_ppm_input_create_post(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "script",
                                                                              'URL' : "/home/get_latest_summary.json"
                                                                            },
                                                     'AW_SRV_PPM_STM_DELETE_MENTION'    : {
                                                                              
                                                                              'CB': function aw_temp_resp_fn_7(params){
                                                                                      /* params -> summary JSON */
                                                                                      aw_api_srv_resp_ppm_stm_delete_mention_from_a_stream(params);
                                                                                    },
                                                                              'DATA' : {},
                                                                              'MULTI' : true,
                                                                              'DATA_TYPE': "json",
                                                                              'URL' : "/home/delete_entities_from_post.json"
                                                                            }

                                                };



/*******************************************************/
/*
 *  This function is agnostic of params and just passes it to the relevant call
 *
 */

function aw_api_srv_make_a_post_request(request_tag, params){
     if( request_tag.length == 0 ){
        aw_lib_console_log("error","aw_api_srv: POST Request " + request_tag ); 
        return -1;
     }
     if( params == null ){
        aw_lib_console_log("error","aw_api_srv: POST Request Params is null "); 
        return -1;
     }else{
        aw_lib_console_log("error","aw_api_srv: POST Request: " + request_tag +  " Params: " + JSON.stringify(params)); 
      }

     aw_lib_console_log("debug","aw_api_srv: POST Request " + request_tag );  
     // Called functions don't know about the tag so just let them know secretively 
     params['__aw_srv_secret_internal_req_tag__'] =  request_tag;
     if(aw_srv_local_post_json_data_cache_manager[request_tag]['URL'].length == 0){
          aw_lib_console_log("debug","aw_api_srv: POST Return " + request_tag );   
          return -1;
     }else{
        var ret_code = aw_srv_internal_srv_post_requestor(params);
        if( ret_code == 0){
          aw_lib_console_log("debug","aw_api_srv: for post request " + request_tag + " RETURN: SUCCESS");   
        }else{
          aw_lib_console_log("error","aw_api_srv: for post request " + request_tag + " RETURN: FAILED");   
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
function aw_api_srv_resp_data_for_post_request(request_tag){
     if( request_tag.length == 0 ){
        aw_lib_console_log("error","aw_api_srv: Post Resp Data " + request_tag ); 
        return {};
     }
    return aw_srv_local_post_json_data_cache_manager[request_tag]['DATA'];
}
/*******************************************************/
/*
 *
 *
 */
function aw_awpi_serv_resp_data_for_post_request_in_params(params){
  return params['aw_srv_protocol_params']['__AW_SRV_RESP__'];
}
/*******************************************************/
/*
 *
 *
 */
function aw_srv_internal_srv_post_requestor(params){
  var request_tag =  params['__aw_srv_secret_internal_req_tag__'];
  var srv_params = params['aw_srv_protocol_params'];
  $.ajax({

            url: aw_srv_local_post_json_data_cache_manager[request_tag]['URL'],
            type: 'POST',
            data: srv_params,
            dataType: aw_srv_local_post_json_data_cache_manager[request_tag]['DATA_TYPE'],
            success: function (data) {
              aw_srv_local_post_json_data_cache_manager[request_tag]['DATA'] = data;
              if( aw_srv_local_post_json_data_cache_manager[request_tag]['MULTI'] == true ){
                 params['aw_srv_protocol_params']['__AW_SRV_RESP__'] = data;
              }
              if(aw_srv_local_post_json_data_cache_manager[request_tag]['CB']){
                  aw_srv_local_post_json_data_cache_manager[request_tag]['CB'](params);
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


