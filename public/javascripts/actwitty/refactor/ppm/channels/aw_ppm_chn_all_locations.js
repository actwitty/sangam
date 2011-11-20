/*************************************************************/
/*
 *
 *
 *
 */
function aw_get_location_box_id(location_info){
  return "aw_ppm_chn_location_box_" + aw_lib_get_page_owner_id() + "_" + location_info.time;
}

/*************************************************************/
/*
 *
 *
 */
function aw_get_user_locations_html(location_info){
  var box_id = aw_get_location_box_id(location_info);
  var location_info_html = "";
  if( location_info.type == 2){
    location_info_html = '<div class="aw_ppm_dyn_chn_locations_box"  id="' + box_id + '" >' +
                            '<div class="aw_ppm_dyn_chn_locations_map_box aw_js_ppm_geo_map" id="' + box_id + '_map" >' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_chn_location_label_box">' +
                                '<span>' + location_info.name + '</span>' +
                            '</div>' +
                          '</div>';
  }else{
    var location_image = '/images/actwitty/refactor/aw_ppm/channel/aw_unknown_geo_location.jpg';
    location_info_html = '<div class="aw_ppm_dyn_chn_locations_box" style="background:url(' + location_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                          '<div class="aw_ppm_dyn_chn_location_label_box">' +
                              '<span>' + location_info.name + '</span>' +
                          '</div>' +
                        '</div>';
                          
  }
  return location_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_user_locations(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_LOCATIONS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_user_location_container').html('');
    while ( data.length > 24 ){
      data.pop();
    }
  }
  $.each(data, function(i, location_info){
    
    var map_id =  aw_get_location_box_id(location_info) + "_map";
    var html = aw_get_user_locations_html(location_info);
    $('#aw_js_ppm_user_location_container').append(html);
    if( location_info.type == 2){
      var mapOptions = {
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: new google.maps.LatLng(location_info.lat,location_info.long)
                    };
      map = new google.maps.Map(document.getElementById(map_id),mapOptions);
    }

  });
  /* enable the more button */
  $("#aw_js_ppm_locations_data_more").attr("disabled", false);
  $('#aw_js_ppm_user_location_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_users_locations(on_init){
  /* disable the more button */
  $("#aw_js_ppm_locations_data_more").attr("disabled", true);
  $('#aw_js_ppm_user_location_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
  }
  

  var srv_params =   { 
                        user_id:   aw_lib_get_page_owner_id(), 
                        sort_order: 1,
                        cache_cookie: aw_lib_get_cache_cookie_id()
                      };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_LOCATIONS', params);
}
/*************************************************************/

