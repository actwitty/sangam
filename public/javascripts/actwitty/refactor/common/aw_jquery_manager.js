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

  }else if ( page_context == "profile_sketch_page" ){
     aw_api_controller_sketch_main_init();
  }

 
   
});
