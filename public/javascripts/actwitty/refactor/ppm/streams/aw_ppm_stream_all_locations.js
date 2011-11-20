


/***************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_request_locations(on_init){
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  } 

  if( on_init ){
    $("#aw_js_ppm_stm_right_side_related_locations").html();
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
    aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_LOCATIONS',  params);
}


/***************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_all_locations(params){
  
  var locations_data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  aw_api_ppm_stm_modal_set_data( "aw_js_ppm_stm_aw_modal_manager_related_locations", locations_data);

  var html = "";
  $.each(locations_data, function(i,location_info){
    if( i < 5){
      var single_html =   '<div class="aw_ppm_stm_dyn_location_box">' +
                            '<a class="aw_ppm_stm_dyn_location_link">' +
                              '<span>'  +
                                location_info.name +
                              '</span>' +
                            '</a>' +
                          '</div>';
      html = html + single_html;
    }
  });
  $("#aw_js_ppm_stm_right_side_related_locations").html(html);
}
/*****************************************************/
/*
 *
 *
 */
function aw_get_location_box_id(location_info){
  return "aw_ppm_stm_location_modal_" + location_info.id;
}
/*****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_locations_modal_renderer(win_id, trigger_id){
 var locations_data = aw_api_ppm_stm_modal_get_data("aw_js_ppm_stm_aw_modal_manager_related_locations");

 var header_html = '<div class="awppm_stm_dyn_locations_header_box" >' +
                      '<span class="awppm_stm_dyn_locations_modal_label" >' +
                        'Top locations in the streams' +
                      '</span>'+
                    '</div>';

  var html = header_html;
  $.each(locations_data, function(i,location_info){
    var location_info_html = "";
    if( location_info.type == 2){
      location_info_html = '<div class="aw_ppm_stm_dyn_locations_modal_box" >' +
                            '<div class="aw_ppm_stm_dyn_locations_map_box" id="' + aw_get_location_box_id(location_info) +  '"  >' +
                            '</div>' +
                            '<div class="aw_ppm_stm_dyn_location_label_box">' +
                                '<span>' + location_info.name + '</span>' +
                            '</div>' +
                          '</div>';
  } else{
      var location_image = '/images/actwitty/refactor/aw_ppm/channel/aw_unknown_geo_location.jpg';
      location_info_html = '<div class="aw_ppm_stm_dyn_locations_modal_box" style="background:url(' + location_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"   >' +
                          '<div class="aw_ppm_stm_dyn_location_label_box">' +
                              '<span>' + location_info.name + '</span>' +
                          '</div>' +
                        '</div>';
                          
  }
     
    html = html + location_info_html;
  });

  $("#" + win_id).append(html);

  $.each(locations_data, function(i, location_info){
    
    if( location_info.type == 2){
      var mapOptions = {
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: new google.maps.LatLng(location_info.lat,location_info.long)
                    };
      map = new google.maps.Map(document.getElementById(aw_get_location_box_id(location_info)),mapOptions);
    }

  });
  return true;


}


