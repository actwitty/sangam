/****************************************************************/
/*
 *
 *
 */
function aw_api_link_resolve_request('url', cookie, cb, cb_err){
  var fn_cb = cb;
  setTimeout(function(){  
                         fn_cb = null;
                         cb_err(cookie); 
                       }, 1500);

   
  if( fn_cb ) {
    fn_cb(cookie, data);
  }
}

