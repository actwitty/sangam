function aw_notify_profile_image(main, thumb){

  // TODO : get the summary category from category.yml
  var post_json = { 
                    word : 'ProfileUpdate',
                    summary_category: 'stories',
                    text : aw_lib_get_page_owner_name() + ' has updated profile picture',
                    enrich : true,
                    //location:get_location_json(),
                    documents:[{url:main, thumb_url:thumb, caption:"Profile Picture"}],
                    campaign_types:get_campaigns(),
                    source_name:"actwitty",
                    fb: "false",
                    tw: "false"
                  };

   
  //alert(JSON.stringify(post_json));
  post_activity_to_server(post_json);

  
  $("#awppm_js_user_img_settings").attr("src", main);
  $("#awppm_js_user_profile_settings_profile_pic_url").val(thumb);
 
  $('#awppm_user_profile_change_profile_pic_submit').trigger('click'); 

  return true;
}


/*
 *
 *
 */
/*
var mapOptions_user_settings = {
  zoom: 5,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  center: new google.maps.LatLng(40.730885,-73.997383)
};
*/


/*
 *
 *
 */
/*
function aw_user_settings_geo_initialize_default_location(default_location){
  
  //alert("++++++++++++++++++");
  if (geocoder == null){
    geocoder = new google.maps.Geocoder();
  }
  geocoder.geocode( {'address': default_location }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var searchLoc = results[0].geometry.location;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      var latlng = new google.maps.LatLng(lat, lng);
      var bounds = results[0].geometry.bounds;
      $("#aw_spm_user_setting_location_lat_input").val(lat);
      $("#aw_spm_user_setting_location_long_input").val(lng); 
      if (bounds){
        map.fitBounds(bounds);
      }
    }
  });
 
}
 */

/*
 *
 *
 */


/*
function aw_user_settings_geo_initialize() {
  /*
  //alert("---------");
  google.maps.event.addListener(map_user_settings, 'click', function(event) {
       //alert("===");
      var latLng = event.latLng;
      map_user_settings.setCenter(latLng);
      //map.setZoom(8);
      if (geocoder_user_settings == null){
        geocoder_user_settings = new google.maps.Geocoder();
      }
      
      if (latLng) {
        geocoder_user_settings.geocode({'latLng': latLng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              $("#aw_spm_user_setting_location_input").val(results[1].formatted_address);
              $("#aw_spm_user_setting_location_lat_input").val(results[1].geometry.location.lat());
              $("#aw_spm_user_setting_location_long_input").val(results[1].geometry.location.lng());
            }
          } else {
            alert("ActWitty is unable to support your request");
          }
      });
    }
  });
  
}
*/

function awppm_settings_page_elem_init()
{
    $("#awppm_user_profile_settings_curpswd_error").hide();
    $("#awppm_user_profile_settings_newpswd_error").hide();
    $("#awppm_user_profile_settings_mismatchpswd_error").hide();

    $("#js_awppm_user_setting_oldpswd").val("");
    $("#js_awppm_user_setting_newpswd").val("");
    $("#js_awppm_user_setting_cnfrmpswd").val("");

    $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").hide();
}


/*
 *
 *
 *
 */

var map_user_settings;
var geocoder_user_settings;
function aw_api_spm_initialize_user_settings_page(){
  
  //alert("setting JS in place");
  awppm_settings_page_elem_init();

  

  if($("#awppm_user_settings_dob_input").length){
    $("#awppm_user_settings_dob_input").datepicker();
    $("#awppm_user_settings_dob_input").datepicker({ dateFormat: 'mm/dd/yyyy' });
  }


  /*
  if( $("#aw_spm_user_setting_location_input").length){
    //alert("setting map in user settings");
    map_user_settings = new google.maps.Map(document.getElementById("aw_spm_map_selector"),mapOptions_user_settings);
    geocoder_user_settings = new google.maps.Geocoder(); 
    aw_user_settings_geo_initialize();
    aw_user_settings_initialize_default_location($("#aw_spm_user_setting_location_input").val()); 
  }


  
  
 



  $("#aw_spm_user_setting_location_input").autocomplete({
      source: function(request, response) {
        if (geocoder_user_settings == null){
          geocoder_user_settings = new google.maps.Geocoder();
        }
        geocoder_user_settings.geocode( {'address': request.term }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var searchLoc = results[0].geometry.location;
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            var latlng = new google.maps.LatLng(lat, lng);
            var bounds = results[0].geometry.bounds;
            $("#aw_spm_user_setting_location_lat_input").val('');
            $("#aw_spm_user_setting_location_long_input").val('');
            geocoder.geocode({'latLng': latlng}, function(results1, status1) {
              if (status1 == google.maps.GeocoderStatus.OK) {
                if (results1[1]) {
                  response($.map(results1, function(loc) {
                    return {
                      label  : loc.formatted_address,
                      value  : loc.formatted_address,
                      bounds   : loc.geometry.bounds
                    }
                  }));
                }
              }
            });
        }
      });
    },
    select: function(event,ui){
      var pos = ui.item.position;
      var lct = ui.item.locType;
      var bounds = ui.item.bounds;

      var latLng = map_user_settings.getCenter();

      $("#aw_spm_user_setting_location_lat_input").val(latLng.lat());
      $("#aw_spm_user_setting_location_long_input").val(latLng.lng());
      if (bounds){
        map_user_settings.fitBounds(bounds);
      }
     }
  });
  */
 
}








/*
 *  Do all sanity checks for password fields
 *
 */


function sanity_check_password()
{
  var new_pswd = $(".awppm_user_profile_settings_newpswd").val();
  var cnf_pswd = $(".awppm_user_profile_settings_cnfrmpswd").val();
  if(new_pswd == '' || cnf_pswd == '' || new_pswd != cnf_pswd)
    return false;
  if(new_pswd.length < 5)
    return false;
  if(new_pswd.match(/[0-9]/))
    return true;
  return false;
}

function pswd_mismatch()
{

}






/*
 *
 *
 */
$(document).ready(function(){

    //alert("i am settings page");

    awppm_settings_page_elem_init();

    $("#awppm_user_profile_settings_user_name").attr("disabled", true); 

    $("#awppm_user_profile_settings_save").live('click',function() {
      $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").show();
      //alert("saving values");
      $("#settings_dob_str").val($("#awppm_user_settings_dob_input").val());
     
      //alert($("#settings_dob_str").val());
      return true;
    });

  


    // to first get the confirmation from the user
    $("#js_awppm_user_deactivate").live('click',function(){
      var answer = confirm("Are you sure, you want to deactivate your ActWitty account??");
      return answer;
    });  





    $("#js_awppm_profile_setting_pswd_chng").live('click',function(){
      //alert("I am changing the password"); 
      var new_pswd = $(".awppm_user_profile_settings_newpswd").val();
      var cnf_pswd = $(".awppm_user_profile_settings_cnfrmpswd").val();
      if(new_pswd != cnf_pswd)
      {

        $("#awppm_user_profile_settings_mismatchpswd_error").show();
        return false;
      }
      if(sanity_check_password())
      {
        return true;
      }
      else
      {
        $("#awppm_user_profile_settings_newpswd_error").show();
        return false;
      }
    });

});


