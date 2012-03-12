/*****************************************/
/*
 *
 *
 */
function aw_api_view_service_list_render(data){

  var html = "";
  //'rel="twipsy" data-original-title="'
  $.each(data, function(service_name, service_details) {
    var twipsy_string = '';
    if (service_details.icon.indexOf("inactive") >= 0){
      twipsy_string = service_details.name  + " is not activated.";
    }else{
      twipsy_string = service_details.name  + " is active.";
    }

    html = html + '<div class="aw_dyn_service_image_box" >' +
                    '<a href=' + service_details.url + '>' +
                      '<img class="aw_dyn_service_img_small" src="' + service_details.icon + '" width=40px height=40px  />' + 
                      '<img class="aw_dyn_service_img_large" src="' + service_details.icon + '" width=44px height=44px  rel="twipsy" data-original-title="' + twipsy_string + '"/>' + 
                    '</a>' +
                  '</div>';
  });
  $("#aw_js_services_list_box").html(html);

}
