/*********************************************************************/
/*
 *
 *
 */
var aw_local_fb_access_token_cb;


/**********************************************************/
/*
 *
 *
 */
function aw_facebook_access_show_dialog(fn_cb){
  aw_lib_console_log("DEBUG", "Now showing FB user login");   
  aw_local_fb_access_token_cb = fn_cb;

  $.fancybox({
        content: $('#aw_js_fb_login_modal_fancybox'),
        onClosed:function() {
                              aw_local_fb_access_token_cb();
                            }
  });
}
/*********************************************************************/
/*
 *
 *
 */
function aw_api_facebook_access_initialize_token(fn_cb){
    
  
    aw_lib_console_log("DEBUG", "entered:aw_api_facebook_access_initialize_token");

    FB.init({
          appId      : aw_js_global_facebook_app_id,
          channelUrl : aw_lib_get_base_url() + '/channel.html',
          status     : true, 
          cookie     : true, 
          oauth      : true, 
          xfbml      : true,
          frictionlessRequests: true
        });


    if( aw_js_global_fb_access.token ){
      aw_lib_console_log("DEBUG", "entered:User has given FB access no problems");
      fn_cb();
      return;
    }
    

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // the user is logged in and connected to your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire
        aw_lib_console_log("DEBUG", "FB a user who has authorized actwitty is logged in");
        var uid = response.authResponse.userID;
        aw_js_global_fb_access['token'] = response.authResponse.accessToken;
          
        fn_cb();
      }else if (response.status === 'not_authorized') {
        aw_lib_console_log("DEBUG", "FB detected a user login, who has not authorized Actwitty, show FB login");
        aw_facebook_access_show_dialog(fn_cb);
      }else{
        aw_lib_console_log("DEBUG", "FB user has not loggedin, show FB login");
        aw_facebook_access_show_dialog(fn_cb);        
      }
     
    });

  
   aw_lib_console_log("DEBUG", "entered: FB Login status done");
}

/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){

  $("#aw_js_fb_login_btn").click(function(){
    aw_lib_console_log("DEBUG", "FB detected a user login, user ;lxwho has not authorized Actwitty, show FB login");
    FB.login(
        function(response) {
          if (response.authResponse) {
            aw_lib_console_log("DEBUG", "FB detected a user logged in, we got authtoken");
            aw_js_global_fb_access['token'] = response.authResponse.accessToken;
          } else {
          }

          $.fancybox.close();
          aw_local_fb_access_token_cb();
        }, 
        {
          scope: ''
        });
    return false;
  });

  $('#aw_js_local_auth_modal_close').click(function (e) {
        //Cancel the link behavior
        aw_lib_console_log("WARN", "User rejected FB login");
        e.preventDefault();
        $('#aw_js_local_auth_modal_mask, #aw_js_local_auth_modal').hide();
        aw_local_fb_access_token_cb();
    });     
     
    //if mask is clicked
    $('#aw_js_local_auth_modal_mask').click(function () {
        aw_lib_console_log("WARN", "User rejected FB login");
        $(this).hide();
        $('#aw_js_local_auth_modal').hide();
        aw_local_fb_access_token_cb();
    });         
});


