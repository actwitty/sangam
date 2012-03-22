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
    var target_blank = '';

    if (service_details.icon.indexOf("inactive") >= 0){
      if( service_details.url != '#' ){
        twipsy_string = service_details.name  + " is not activated by user.";
      }else{
        twipsy_string = 'Actwitty is still working to bring ' + service_details.name  + " live.";
      }
    }else{
      twipsy_string = service_details.name  + ' is active.  Click to open ' + service_details.name +  ' page."';
      target_blank = ' target="_blank" ';
    }
    
    html = html + '<div class="aw_dyn_service_image_box" >' +
                    '<a href=' + service_details.url + ' ' + target_blank  +' >' +
                      '<img class="aw_dyn_service_img_small" src="' + service_details.icon + '" width=40px height=40px  />' + 
                      '<img class="aw_dyn_service_img_large" src="' + service_details.icon + '" width=44px height=44px  rel="twipsy" data-original-title="' + twipsy_string + '"/>' + 
                    '</a>' +
                  '</div>';

  });
  if( html.length ){
    $("#aw_js_services_list_box").html(html);
    $("#aw_js_services_main_container").show();
  }
}
