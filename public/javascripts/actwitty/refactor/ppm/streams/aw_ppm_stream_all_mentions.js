/***************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_mentions(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  } 

  if( on_init ){
    $("#aw_js_ppm_stm_right_side_related_mentions").html();
  }
  var params = {
                  'aw_srv_protocol_params' :  { 
                                                user_id : aw_lib_get_page_owner_id(), 
                                                filter : aw_api_ppm_stm_get_filter(),
                                                page_type:aw_api_ppm_stm_get_page_scope(),
                                                cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_MENTIONS',  params);
}


/***************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_all_mentions(params){

  var mentions_data = aw_awpi_serv_resp_data_for_post_request_in_params(params); 
  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_related_mentions", mentions_data);

  var html = "";
  $.each(mentions_data, function(i,mention_info){
    if( i < 5){
      var single_html =   '<div class="aw_ppm_stm_dyn_mention_box">' +
                            '<a class="aw_ppm_stm_dyn_mention_link">' +
                              '<span>'  +
                                mention_info.name +
                              '</span>' +
                            '</a>' +
                          '</div>';
      html = html + single_html;
    }
  });
  $("#aw_js_ppm_stm_right_side_related_mentions").html(html);
}

/*****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_mentions_modal_renderer(win_id, trigger_id){
 var mentions_data = aw_api_ppm_stm_modal_get_data("aw_js_ppm_stm_aw_modal_manager_related_mentions");

 var header_html = '<div class="awppm_stm_dyn_mentions_header_box" >' +
                      '<span class="awppm_stm_dyn_mentions_modal_label" >' +
                        'Top mentions in the streams' +
                      '</span>'+
                    '</div>';

  var html = header_html;
  $.each(mentions_data, function(i,mention_info){
    var mention_image = mention_info.image + "?maxWidth=80";
    var mention_html = '<div class="aw_ppm_stm_dyn_mentions_modal_box" style="background:url(' + mention_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  >' +
                            '<input type="hidden" value="' + mention_info.id + '" />' +
                            '<div class="aw_ppm_stm_dyn_mentions_modal_label">' +
                                '<span>' + mention_info.name + '</span>' +
                            '</div>' +
                          '</div>';
    html = html + mention_html;
  });

  $("#" + win_id).append(html);
  return true;


}
