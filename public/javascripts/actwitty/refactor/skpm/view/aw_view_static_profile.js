/*************************************************/
/*
 *
 *
 */
function aw_api_view_static_profile_render(data){
   aw_lib_console_log("DEBUG", "entered:aw_api_view_static_profile_render");
   if ( data ){
      var location_html = "", work_html ="", study_html = "";
      if( data.location && data.location.length > 0){
        location_html = '<div class="aw_dyn_static_profile_details_element" >' +
                          '<h3> Lives in: </h3>' +
                          '<span>' + data.location +  '</span>' +
                        '</div>';

      }

      if( data.work && data.work.length > 0){
        work_html = '<div class="aw_dyn_static_profile_details_element" >' +
                          '<h3> Works at : </h3>' +
                          '<span>' + data.work +  '</span>' +
                        '</div>';

      }

       if( data.study && data.study.length > 0){
        study_html = '<div class="aw_dyn_static_profile_details_element" >' +
                         '<h3> Studied from: </h3>' +
                          '<span>' + data.study +  '</span>' +
                        '</div>';

      }

      var html = location_html + work_html + study_html;
      $("#aw_js_user_details").html(html);
      if( data.description && data.description.length ){
        $("#aw_js_user_description").html(data.description);
      }
   }
   aw_lib_console_log("DEBUG", "exited:aw_api_view_static_profile_render");
}

/*************************************************/
/*
 *
 *
 */
function aw_api_view_static_profile_update_description(description){
  $("#aw_js_user_description").html(description);
}
