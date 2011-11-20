/***************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_similar_ppl(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  } 

  if( on_init ){
    $("#aw_js_ppm_stm_aw_modal_manager_related_people").html();
  }
  var params = {
                  'aw_srv_protocol_params' :  { 
                                                filter : aw_api_ppm_stm_get_filter(),
                                                page_type:aw_api_ppm_stm_get_page_scope(),
                                                cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_SIMILAR_PEOPLE',  params);
}

/**********************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_similar_ppl(params){
  var people_data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_related_people", people_data);
  var html = "";
  $.each(people_data, function(i,person_data){
    if( i < 3){
      var single_html =   '<div class="aw_ppm_stm_dyn_peoples_box">' +
                            '<a class="aw_ppm_stm_dyn_people_img_link" href="/home/show?id=' + person_data.id + '" >' +
                              '<img src="' + person_data.image +'"/>' +
                            '</a>' +
                            '<a class="aw_ppm_stm_dyn_people_name_link" href="/home/show?id=' + person_data.id + '" >' +
                              '<span>'  +
                                person_data.name +
                              '</span>' +
                            '</a>' +
                          '</div>';
      html = html + single_html;
    }
  });
  $(".awppm_stm_right_side_info_related_people").html(html); 
}



