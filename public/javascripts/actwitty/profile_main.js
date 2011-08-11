/*************************************/
var g_page_context = "profile_main";
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
  if( page_context == "profile_main"){
    main_profile_initializer();
  }else if( page_context == "single_post") {
    single_post_initializer();
  }else if( page_context == "drafts") {
    show_all_drafts();
  }else if( page_context == "edit"){
    init_edit_box();
  }

});
