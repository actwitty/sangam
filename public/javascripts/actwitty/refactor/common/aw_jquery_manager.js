/*************************************/
var g_page_context = "profile_chn_page";
function get_current_page_context(){
  return g_page_context;
}

function set_current_page_context(context){
  g_page_context = context;
}
/*************************************/

$(document).ready(function(){
  /* main pump to decide page flow */
  
  var page_context=$('#page_mode').attr("value");
  set_current_page_context(page_context);

  
  if( page_context == "landing_page" ){

    aw_api_lpm_initialize_landing_page(); 

  } else if( page_context == "authentications_page" ){

    aw_api_lpm_initialize_sign_up_page();

  } else if( page_context == "profile_chn_page" ){

   aw_api_ppm_initialize_chn_page(); 

  } else if( page_context == "profile_stm_page" ){

   aw_api_ppm_initialize_stm_page(); 

  }else if( page_context == "profile_usr_settings_page" ) {
    
  aw_api_spm_initialize_user_settings_page();  
  
  }else if( page_context == "profile_channel_settings_page" ) {
    
   aw_api_cspm_chn_setting_request_user_channels();  
  
  } else if( page_context == "profile_single_activity_page" ) {

    aw_api_ppm_initialize_single_post_page();

  } else if( page_context == "single_channel_page" ){

    aw_api_ppm_initialize_single_channel_page();

  } else if( page_context == "single_mention_page" ){

    aw_api_ppm_initialize_single_mention_page();
  
  } else if( page_context == "single_location_page" ){
    
    aw_api_ppm_initialize_single_location_page();

  } else if( page_context == "facebook_friends_page" ){
    //TODO: Add this page quickly for a viral
  } else if(page_context == "aw_internal_inviteds_show_page"){
    aw_api_ppm_initialize_aw_internal_inviteds_page();

  }

 
   
});
