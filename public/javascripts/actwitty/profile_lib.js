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
 var url = "http://localhost:3000";
 //var url = "http://www.actwitty.com";
 return url;
}

jQuery.fn.log = function (msg) {
                                  console.log("%s: %o", msg, this);
                                  return this;
                              };

function aw_lib_console_log(level, msg){
  console.log(msg);

}

function aw_lib_alert(msg){
  alert(msg);
}
