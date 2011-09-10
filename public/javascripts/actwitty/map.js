function getmapinfo(lang,lat,id){
 alert("INSIDE getmapinfo");
 /*
 var html;
 if (GBrowserIsCompatible()) {
        var map = new GMap2(document.getElementById(id));
        html = map.setCenter(new GLatLng(37.4419, -122.1419), 13);
        alert(html);
      }
      return html;
 */
 alert(id);
  var latlng = new google.maps.LatLng(lang,lat);
    var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById(id),
        myOptions);
 }
