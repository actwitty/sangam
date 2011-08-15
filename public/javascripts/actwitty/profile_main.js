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
    main_profile_initializer();  /* in profile.js */
  }else if( page_context == "single_post") {
    single_post_initializer();  /* in single_post.js */
  }else if( page_context == "edit"){
    init_edit_box();         /* in edit_box_page.js */
  }else if( page_context == "entity"){
    show_all_on_entity();   /* in entity_page.js */
  }else if( page_context == "location"){
    show_all_on_location(); /* in location_page.js */
  }else if( page_context == "channel"){
    show_all_on_channel(); /* in channel_page.js */
  }


});
