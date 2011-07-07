// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery.ajaxSetup({
   cache: true,
   'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
 });

$(document).ajaxSend(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;  
  if ( settings.type != 'GET' &&  settings.type != 'get') {
        settings.data = settings.data || "";
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
  }
});

/*$(document).ready(function(){
    $('#slider').nivoSlider();
});*/

$(window).load(function() {
        $('#slider').nivoSlider();
    });

