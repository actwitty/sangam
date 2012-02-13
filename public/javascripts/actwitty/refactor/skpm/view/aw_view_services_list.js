/*****************************************/
/*
 *
 *
 */
function aw_api_view_service_list_render(data){

  var html = "";
  $.each(data, function(service_name, service_details) {
    html = html + '<div class="aw_dyn_service_image_box" >' +
                    '<a href=' + service_details.url + '>' +
                      '<img class="aw_dyn_service_img_small" src="' + service_details.icon + '" width=64px height=64px />' + 
                      '<img class="aw_dyn_service_img_large" src="' + service_details.icon + '" width=70px height=70px />' + 
                    '</a>' +
                  '</div>';
  });
  $("#aw_js_services_list_box").html(html);

}
