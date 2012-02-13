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
  var modal_id = "#aw_js_local_auth_modal";
  var maskHeight = $(document).height();
  var maskWidth = $(window).width();
     
  //Set height and width to mask to fill up the whole screen
  $('#aw_js_local_auth_modal_mask').css({'width':maskWidth,'height':maskHeight});
         
  //transition effect     
  $('#aw_js_local_auth_modal_mask').fadeIn(1000);    
  $('#aw_js_local_auth_modal_mask').fadeTo("slow",0.8);  
     
  //Get the window height and width
  var winH = $(window).height();
  var winW = $(window).width();
               
  //Set the popup window to center
  $(modal_id).css('top',  winH/2-$(modal_id).height()/2);
  $(modal_id).css('left', winW/2-$(modal_id).width()/2);
     
  //transition effect
  $(modal_id).fadeIn(2000); 
  aw_local_fb_access_token_cb = fn_cb;
}
/*********************************************************************/
/*
 *
 *
 */
function aw_api_facebook_access_initialize_token(fn_cb){
  
  
    aw_lib_console_log("DEBUG", "entered:aw_api_facebook_access_initialize_token");
    
    if( aw_js_global_fb_access.token ){
      aw_lib_console_log("DEBUG", "entered:User has given FB access no problems");
      fn_cb();
      return;
    }
    
    FB.init({
          appId      : aw_js_global_facebook_app_id,
          channelUrl : aw_lib_get_base_url() + '/channel.html',
          status     : true, 
          cookie     : true, 
          oauth      : true, 
          xfbml      : true
        });
   aw_lib_console_log("DEBUG", "entered: FB init done");

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
        }, 
        {
          scope: ''
        });
    $('#aw_js_local_auth_modal_mask, #aw_js_local_auth_modal').hide();
    aw_local_fb_access_token_cb();
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


