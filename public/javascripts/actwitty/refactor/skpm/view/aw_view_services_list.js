/*****************************************/
/*
 *
 *
 */
function aw_api_view_service_list_render(data){

  var html = "";
  var hover_html = "";
  var self_page = false;
  if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id )
  {
    self_page = true;
  }
  //'rel="twipsy" data-original-title="'
  $.each(data, function(service_name, service_details) {
    var twipsy_string = '';
    var target_blank = '';
    var add_to_hover = false;
    
    if (service_details.icon.indexOf("inactive") >= 0){
      if(self_page ){
        if( service_details.url != '#' ){
          twipsy_string = service_details.name  + " is not connected. Enable this to complete your profile.";
        }else{
          add_to_hover = true;
          twipsy_string = service_details.name  + " will be enabled by Actwitty shortly.";
        }
      }
      
    }else{
      if( self_page ){
       twipsy_string = ' Checkout your ' + service_details.name +  ' page."';
      }else{
       twipsy_string =  'Click to see ' + aw_js_global_visited_user_credentials.name + '\'s ' +  service_details.name  + ' page."';
      }

      target_blank = ' target="_blank" ';
    }
    if( add_to_hover ) {
      hover_html = hover_html + '<div class="aw_dyn_service_image_box" >' +
                      '<a id="aw_service_url_' + service_details.name + '" href=' + service_details.url + ' ' + target_blank  +' >' +
                        '<img class="aw_dyn_service_img_small" src="' + service_details.icon + '" width=40px height=40px  />' + 
                        '<img class="aw_dyn_service_img_large" src="' + service_details.icon + '" width=44px height=44px  rel="twipsy" data-original-title="' + twipsy_string + '"/>' + 
                      '</a>' +
                    '</div>';
    }else{
      html = html + '<div class="aw_dyn_service_image_box" >' +
                      '<a id="aw_service_url_' + service_details.name + '" href=' + service_details.url + ' ' + target_blank  +' >' +
                        '<img class="aw_dyn_service_img_small" src="' + service_details.icon + '" width=40px height=40px  />' + 
                        '<img class="aw_dyn_service_img_large" src="' + service_details.icon + '" width=44px height=44px  rel="twipsy" data-original-title="' + twipsy_string + '"/>' + 
                      '</a>' +
                    '</div>';
    }

    

  });

  if( html.length ){
    $("#aw_js_services_list").html(html);
  }
  if( self_page ){
       var html_coming = '<div class="aw_actwitty_whats_coming" >' +
                            '<h2> Upcoming services </h2>' +
                            '<div class="aw_actwitty_whats_coming_hover">' +
                              hover_html +
                            '</div>' +
                          '</div>';
       $("#aw_js_actwitty_upcoming").html(html_coming);
    }

  //if( !self.page && !aw_js_global_logged_in_user_credentials.id){
    $("#aw_js_get_actwitty").show();
  //}
}

/********************************************************/
/*
 *
 *
 */
function aw_api_view_services_modify_twitter_url(url){
  $('#aw_service_url_Twitter').attr("href", url);
}
