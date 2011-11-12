/*
 *
 *
 */
var mapOptions = {
  zoom: 5,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  center: new google.maps.LatLng(40.730885,-73.997383)
};



/*
 *
 *
 */

function aw_signup_geo_initialize_default_location(default_location){
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
      $("#aw_lpm_signup_location_lat_input").val(lat);
      $("#aw_lpm_signup_location_long_input").val(lng); 
      if (bounds){
        map.fitBounds(bounds);
      }
    }
  });
}

/*
 *
 *
 */
function aw_signup_geo_initialize() {
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
              $("#aw_lpm_signup_location_input").val(results[1].formatted_address);
              $("#aw_lpm_signup_location_lat_input").val(results[1].geometry.location.lat());
              $("#aw_lpm_signup_location_long_input").val(results[1].geometry.location.lng());
            }
          } else {
            alert("ActWitty is unable to support your request");
          }
      });
    }
  });
}

/*
 *
 *
 */
$(document).ready(function(){

    $("#signupbutton").live('click', function() {
      $("#dob_str").val($("#aw_lpm_signup_dob_input").val());
      $.ajax({
        url: "/users",
        type: 'POST',
        dataType:"script",
        data: $(this).closest('form').serialize() ,
        beforeSend: function(){
          $('#LoadingDiv').css('display','block'); 
        },
        success: function(data){
          $('#LoadingDiv').css('display','none');
        },
      });
      return false;
  });


  $("#signinbutton").live('click', function() {

      $.ajax({
        url: "/users/sign_in",
        type: 'POST',
        dataType:"script",
        data: $(this).closest('form').serialize() ,
        beforeSend: function(){
          $('#LoadingDiv').css('display','block'); 
        },
        success: function(data){
          $('#LoadingDiv').css('display','none');
        },
      });
      return false;
    });

  
   $("#aw_lpm_signup_location_input").autocomplete({
      source: function(request, response) {
        if (geocoder == null){
          geocoder = new google.maps.Geocoder();
        }
        geocoder.geocode( {'address': request.term }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var searchLoc = results[0].geometry.location;
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            var latlng = new google.maps.LatLng(lat, lng);
            var bounds = results[0].geometry.bounds;
            $("#aw_lpm_signup_location_lat_input").val('');
            $("#aw_lpm_signup_location_long_input").val('');
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

      var latLng = map.getCenter();

      $("#aw_lpm_signup_location_lat_input").val(latLng.lat());
      $("#aw_lpm_signup_location_long_input").val(latLng.lng());
      if (bounds){
        map.fitBounds(bounds);
      }
     }
  });

});

/*
 *
 *
 *
 */
var map;
var geocoder;
function aw_api_lpm_initialize_sign_up_page(){
  if( $("#aw_lpm_signup_location_input").length){
    map = new google.maps.Map(document.getElementById("aw_lpm_map_selector"),mapOptions);
    geocoder = new google.maps.Geocoder(); 
    aw_signup_geo_initialize();
    aw_signup_geo_initialize_default_location($("#aw_lpm_signup_location_input").val()); 
  }

  if(  $("#aw_lpm_signup_dob_input").length){
    $("#aw_lpm_signup_dob_input").datepicker();
    $("#aw_lpm_signup_dob_input").datepicker({ dateFormat: 'mm/dd/yyyy' });
  }
}

