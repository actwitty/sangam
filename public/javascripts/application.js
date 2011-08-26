jQuery.ajaxSetup({ 
  'cache' : true,
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
});

function touch_cache_cookie(){
  var cache_cookie_hidden=$('#cache_cookie_id');
  if(cache_cookie_hidden.length){
    var now = new Date();
    var time = now.getTime();
    /* add local to avoid scenario that local time is similar to older/future server time */
    cache_cookie_hidden.val(time + '_local');
  }
}

$(document).ajaxSend(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;
  if ( settings.type == 'post' ||  settings.type == 'POST' ) {
    settings.data = settings.data || "";
    settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
    touch_cache_cookie();
  }
});



