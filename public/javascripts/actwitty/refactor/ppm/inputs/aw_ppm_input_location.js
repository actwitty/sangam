/*
 * Purpose: (1)To fetch the geo location from google map api's.
 *          (2)To update the hidden fields for getting right location type
 *
 */

var autocomplete, map;
var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));

function aw_api_ppm_input_geo_location_initialize() {
  map = new google.maps.Map(document.getElementById('aw_js_map'));
  map.setMapTypeId('roadmap');
  map.fitBounds(defaultBounds);

  var input = document.getElementById('aw_js_ppm_input_location_name');
  var options = {
    boxStyle: { border: "1px solid black", opacity: 0.75, width:"40px" }
  };
  autocomplete = new google.maps.places.Autocomplete(input, options);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker();
  marker.setMap(map);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
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
    infowindow.setContent(
      '<div><b>actwitty ' + place.name + '</b><br>'
      + address);
    infowindow.open(map, marker);


    /*document.getElementById('map123').style.display = 'block';
    document.getElementById('map321').style.display = 'block'; 
    document.getElementById('map123').innerHTML = "Lat =" + map.getCenter().lat() + "Long=" + map.getCenter().lng();
    document.getElementById('map321').innerHTML = place.geometry.location;
    */
    document.getElementById('aw_js_ppm_input_hidden_user_latlng').value = place.geometry.location;
    document.getElementById('aw_js_ppm_input_hidden_lat_value').value = map.getCenter().lat();
    document.getElementById('aw_js_ppm_input_hidden_lng_value').value = map.getCenter().lng();
    document.getElementById('aw_js_ppm_input_hidden_geo_location').value = document.getElementById('aw_js_ppm_input_location_name').value;
    

  });

  google.maps.event.addListener(map, 'bounds_changed', function() {
    autocomplete.setBounds(map.getBounds());
  });
}

function changeType(value) {
  autocomplete.setTypes(value ? [value] : []);
}


/* Calling initialize function to invoke google maps api   */
$(window).load(aw_api_ppm_input_geo_location_initialize);
