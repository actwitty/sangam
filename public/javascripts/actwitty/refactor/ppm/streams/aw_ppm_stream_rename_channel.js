/*************************************************************/
/*
 *
 *
 */
var aw_local_ppm_stm_channel_rename_choice={};

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_rename_channel(win_id, triggerer){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(triggerer);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  var header_html = '<div class="awppm_stm_dyn_chn_rename_header_box" >' +
                      '<span class="awppm_stm_dyn_chn_rename_modal_label" >' +
                        'Change the channel for the post' +
                      '</span>'+
                    '</div>';
  var data_html = '<div class="awppm_stm_dyn_chn_rename_existing">' +
                    '<span class="awppm_stm_dyn_chn_rename_label" >' +
                      'Current Channel: ' +
                    '</span>' +
                    '<span class="awppm_stm_dyn_chn_rename_existing_name" >' +
                        stream_info.post.word.name +
                    '</span>' +
                  '</div>' +
                  '<div class="awppm_stm_dyn_chn_rename_new">' +
                    '<span class="awppm_stm_dyn_chn_rename_label" >' +
                      'New Channel: ' +
                    '</span>' +
                    '<input class="aw_js_ppm_stm_new_chn_name" placeholder="Channel Name" type="text" />' +
                  '</div>' + 
                  '<div class="awppm_stm_dyn_chn_rename_btn_box" >' +
                    
                    '<div class="awppm_stm_dyn_chn_rename_btn aw_js_ppm_stm_chn_rename_submit">' +
                      '<div class="aw_ppm_stm_dyn_chn_rename_submit_img"></div>' +
                      '<div class="aw_ppm_stm_dyn_chn_rename_submit_text"> Apply </div>' +
                    '</div>'
                  '</div>';



  var html = header_html + data_html;
  
  
  
  $("#" + win_id).append(html);
  aw_ppm_stm_chn_rename_get_user_channel_list();
  return true;

}


/*************************************************************/
/*
 *
 *
 */
function aw_ppm_stm_chn_rename_get_user_channel_list(){
 var params = {
                  'aw_srv_protocol_params' : {
                                                 user_id: aw_lib_get_page_owner_id(),
                                                 sort_order: 1,
                                                 cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {}
               };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHN_RENAME_LIST',  params);
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_rename_channel_list(params){

  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_CHN_RENAME_LIST');
  $(".aw_js_ppm_stm_new_chn_name").autocomplete(data, {
     	minChars: 0,
		  matchContains: true,
		  highlightItem: false,
      mustMatch: true,
      formatItem: function(channel) {
        return channel.name;
      }
    }).result(function(event, item) {
    });
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chn_rename_submit_handler(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
}
