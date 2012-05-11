/*************************************************/
/*
 *
 *
 */
function aw_api_view_static_profile_render(data){
   aw_lib_console_log("DEBUG", "entered:aw_api_view_static_profile_render");
   if ( data ){
      var location_html = "", work_html ="", study_html = "";
      if( data.location && data.location.length > 0 && data.location != "unknown"){
        location_html =data.location;

      }

      if( data.work && data.work.length > 0){
        work_html =  data.work;

      }

       if( data.study && data.study.length > 0){
        study_html = data.study;

      }

      if(location_html.length){
        $("#aw_js_user_location").html(location_html);
      }
      if(work_html.length){
        $("#aw_js_user_work").html(work_html);
      }
      if(study_html.length){
        $("#aw_js_user_study").html(study_html);
      }
      if( data.description && data.description.length ){
        $("#aw_js_user_description").html( data.description );
      }
   }
   $("#aw_js_static_profile_nav").show();
   aw_lib_console_log("DEBUG", "exited:aw_api_view_static_profile_render");
}


/*************************************************/
/*
 *
 *
 */
function aw_api_view_change_profile_pic(service, url){
  var existing_pic = $("#aw_profile_picture").attr("src");
  if( existing_pic.indexOf("graph.facebook.com") >=0 ){
    if( service == "facebook"){
      $("#aw_profile_picture").attr("src", url);
    }
  }else{
     if( service == "twitter"){
      $("#aw_profile_picture").attr("src", url);
     }
  }

}


