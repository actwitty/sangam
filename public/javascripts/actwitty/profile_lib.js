function aw_lib_get_session_owner_id(){
 var session_owner_id=$('#session_owner_id').attr("value");
 return session_owner_id;
}

function aw_lib_get_page_owner_id(){
 var page_owner_id=$('#page_owner_id').attr("value");
 return page_owner_id;
}

function aw_lib_get_page_owner_photo(){
 var page_owner_photo=$('#page_owner_photo').attr("value");
 return page_owner_photo;
}

function aw_lib_get_page_owner_name(){
 var page_owner_name=$('#page_owner_name').attr("value");
 return page_owner_name;
}


function aw_lib_get_cache_cookie_id(){
 var cache_cookie_id=$('#cache_cookie_id').attr("value");
 return cache_cookie_id;
}

function aw_lib_get_base_url(){
 var url = "http://www.actwitty.com";
 return url;
}

function aw_lib_get_trim_name(actual_string, length){
  var str = "";
  if( actual_string.length > length ){  
    var limit = length;                
    str = actual_string;        
    var strtemp = str.substr(0,limit); 
    str = strtemp + '..' + '<span class="hide">' + actual_string + '</span>'; 
  } else {
    str = actual_string;
  }

  return str;
}


jQuery.fn.log = function (msg) {
                                  console.log("%s: %o", msg, this);
                                  return this;
                              };

function aw_lib_console_log(level, msg){
  console.log(msg);

}

function aw_lib_alert(msg){
  //alert(msg);
  console.log(msg);
}
