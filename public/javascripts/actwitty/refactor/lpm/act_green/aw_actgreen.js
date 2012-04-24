function bindInfoWindow(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
} 

function aw_actgreen_setMarkersOnMap(map,locations)
{
  var image = new google.maps.MarkerImage('/images/actwitty/refactor/aw_lpm/act_green/tree.png',
      new google.maps.Size(20, 32),
      new google.maps.Point(0,0),
      new google.maps.Point(0, 32));
  var shape = {
      oord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };

  var infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < locations.length; i++) {
    var place = locations[i]["actgreen"];
    var myLatLng = new google.maps.LatLng(place["latitude"], place["longitude"]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: place["email"] + ": has marked a tree at "+ place["location"],
    });
    
    marker.setIcon(image);
    marker.setPosition(myLatLng);
    
    // add an event listener for this marker
    var html_content = '<div><img src="/images/actwitty/refactor/aw_lpm/act_green/tree.png"><strong style="color:#8B5A2B;"> ' + 
                         place["email"] + ' </strong> has marked a wish for a tree at <strong style="color:#008B45;">' + place["location"] + '</strong><br/>'+
                         place["comment"]; 
    bindInfoWindow(marker, map, infowindow, html_content);
    

  }

}


function aw_actgreen_map_initialize() {
  var geocoder;
  var tree_image = '/images/actwitty/refactor/aw_lpm/act_green/tree.png';


  var mapOptions = {
    center: new google.maps.LatLng(12.9715987, 77.59456269999998),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('aw_actgreen_map_canvas'),
    mapOptions);

  var input = document.getElementById('aw_actgreen_location_input');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map
  });
  aw_actgreen_setMarkersOnMap(map,actgreen_list);


  google.maps.event.addListener(map, 'click', function(event) {
    var latLng = event.latLng;
    map.setCenter(latLng);
    if (geocoder == null){
      geocoder = new google.maps.Geocoder();
    }
    if (latLng) {
      geocoder.geocode({'latLng': latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
           if (results[1]) {
              $("#aw_actgreen_location_input").val(results[1].formatted_address);
              $("#aw_actgreen_location_lat_input").val(results[1].geometry.location.lat());
              $("#aw_actgreen_location_long_input").val(results[1].geometry.location.lng());
           }
        } else {
          alert("ActWitty is unable to support your request");
        }
      });

    }
  });


  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    
    infowindow.close();
    var place = autocomplete.getPlace();
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    
    var image = new google.maps.MarkerImage(
        place.icon,
        new google.maps.Size(71, 71),
        new google.maps.Point(0, 0),
        new google.maps.Point(17, 34),
        new google.maps.Size(35, 35));
    marker.setIcon(image);
    marker.setPosition(place.geometry.location);
    
    var address = '';
    if (place.address_components) {
      address = [(place.address_components[0] &&
                  place.address_components[0].short_name || ''),
                 (place.address_components[1] &&
                  place.address_components[1].short_name || ''),
                 (place.address_components[2] &&
                  place.address_components[2].short_name || '')
                ].join(' ');
    }
    infowindow.setContent('<div><img src="/images/actwitty/refactor/aw_lpm/act_green/tree.png"><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
    $("#aw_actgreen_location_input").val(place.name);
    $("#aw_actgreen_location_lat_input").val( map.getCenter().lat() );
    $("#aw_actgreen_location_long_input").val( map.getCenter().lng() );
  });

}



function check_actgreen_page_validity()
{
  var valid = true;
  var email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
  if( $("#aw_actgreen_location_input").val() == "" )
  {
    $("#aw_actgreen_location_err").show();
    valid = false;
  } 
  if ($("#aw_actgreen_email").val() == "") {
    $("#aw_actgreen_email_err").show();
    valid = false;
  }
  if(!email_regex.test($("#aw_actgreen_email").val())) {
    $("#aw_actgreen_email_valid_err").show();
    valid = false;
  }

  return valid;
}



function aw_actgreen_fields_initialize()
{
  $("#aw_actgreen_location_err").hide();
  $("#aw_actgreen_email_err").hide();
  $("#aw_actgreen_email_valid_err").hide();
   
}


$(document).ready(function() {

  $("#actgreen_data_save_report").hide();
  $("#actgreen_data_save_report_err").hide();
  aw_actgreen_fields_initialize();
  aw_actgreen_map_initialize();

  $("#aw_actgreen_submit").live('click',function(){
      return check_actgreen_page_validity();
  });

});

