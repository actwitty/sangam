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

  
  $("#awppm_js_user_img_settings").attr("src", thumb);
  $("#awppm_js_user_profile_settings_profile_pic_url").val(thumb);
 
  $('#awppm_user_profile_change_profile_pic_submit').trigger('click'); 


  $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").hide();
  return true;
}













/*
 *
 *
 *
 */

function aw_api_spm_initialize_user_settings_page(){
  
  
  awppm_settings_page_elem_init();
  aw_api_spm_input_geo_location_initialize();
  if($("#awppm_user_settings_dob_input").length){
    $("#awppm_user_settings_dob_input").datepicker();
    $("#awppm_user_settings_dob_input").datepicker({ dateFormat: 'mm/dd/yyyy' });
  }


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

    $("#awppm_user_profile_settings_user_name").attr("disabled", true); 
}



function trgr_sign_out_aft_pswd_chng()
{
  var count = 5;
  countdown = setInterval(function(){
    $("#awppm_user_profile_settings_pswdchn_success strong").html(count + " seconds!");
    if (count == 0) {
      // TODO : change it to base address
      window.location = 'http://localhost:3000/';
    }
    count--;
  }, 1000);


}


/*
 *
 *
 */
$(document).ready(function(){


    $("#awppm_user_profile_settings_save").live('click',function() {
      $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").show();
      $("#settings_dob_str").val($("#awppm_user_settings_dob_input").val());
      return true;
    });

  


    // to first get the confirmation from the user
    $("#js_awppm_user_deactivate").live('click',function(){ 
      var answer = confirm("Deactivating your account will delete all your posts and data.Are you sure, you want to continue??");
      return answer;
    });  





    $("#js_awppm_profile_setting_pswd_chng").live('click',function(){
      var new_pswd = $(".awppm_user_profile_settings_newpswd").val();
      var cnf_pswd = $(".awppm_user_profile_settings_cnfrmpswd").val();
      if(new_pswd != cnf_pswd){
        awppm_settings_page_elem_init
        $("#awppm_user_profile_settings_mismatchpswd_error").show();
        return false;
      }
      if(sanity_check_password()){
        return true;
      } else{
        awppm_settings_page_elem_init();
        $("#awppm_user_profile_settings_newpswd_error").show();
        return false;
      }
    });
   

    
  
    
  
});



/*
 * Purpose: (1)To fetch the geo location from google map api's.
 *          (2)To update the hidden fields for getting right location type
 * This file is specifically for location fields in Settings page.
 * The auto-complete needs to be uniform across, hence including this as a separate file
 */

var autocomplete_location, map, geocoder;
var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));


function aw_spm_geo_initialize_default_location(default_location){
  
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


function aw_api_spm_input_geo_location_initialize() {
  var default_location = $("#aw_spm_user_setting_location_input").val();
  map = new google.maps.Map(document.getElementById('aw_spm_map_selector'));
  map.setMapTypeId('roadmap');
  map.fitBounds(defaultBounds);

  var input = document.getElementById('aw_spm_user_setting_location_input');
  var options = {
    boxStyle: { border: "1px solid black", opacity: 0.75, width:"40px" }
  };
  autocomplete_location = new google.maps.places.Autocomplete(input, options);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker();
  marker.setMap(map);


  aw_spm_geo_initialize_default_location(default_location); 

  google.maps.event.addListener(autocomplete_location, 'place_changed', function() {
    infowindow.close();
    var place = autocomplete_location.getPlace();
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);  // Why 17? Because it looks good.
    }
    var image = new google.maps.MarkerImage(
      place.icon, new google.maps.Size(71, 71),
      new google.maps.Point(0, 0), new google.maps.Point(17, 34),
      new google.maps.Size(100, 100));
    marker.setIcon(image);
    marker.setPosition(place.geometry.location);

    var address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
         place.address_components[0].short_name || ""),
        (place.address_components[1] &&
         place.address_components[1].short_name || ""),
        (place.address_components[2] &&
         place.address_components[2].short_name || "")].join(" ");
    }
    
    document.getElementById('aw_spm_user_setting_location_lat_input').value = map.getCenter().lat();
    document.getElementById('aw_spm_user_setting_location_long_input').value = map.getCenter().lng();
    document.getElementById('aw_spm_user_setting_location_input').value = document.getElementById('aw_js_ppm_input_location_name').value;

  });

  google.maps.event.addListener(map, 'bounds_changed', function() {
    autocomplete_location.setBounds(map.getBounds());
  });
  
  google.maps.event.addListener(map, 'click', function(event) {
      var latLng = event.latLng;
      map.setCenter(latLng);
      //map.setZoom(8);
      if (geocoder == null){
        geocoder = new google.maps.Geocoder();
      }
      
      if (latLng) {
        geocoder.geocode({'latLng': latLng}, function(results, status) {
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



function changeType(value) {
  autocomplete_location.setTypes(value ? [value] : []);
}




