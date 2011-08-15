function aw_lib_get_session_owner_id(){
 var session_owner_id=$('#session_owner_id').attr("value");
 return session_owner_id;
}

function aw_lib_get_page_owner_id(){
 var page_owner_id=$('#page_owner_id').attr("value");
 return page_owner_id;
}

jQuery.fn.log = function (msg) {
                                  console.log("%s: %o", msg, this);
                                  return this;
                              };

function aw_lib_console_log(level, msg){
  console.log(msg);

}

function aw_lib_alert(msg){
}
