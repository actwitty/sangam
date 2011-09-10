
/*
 * classes
 * div.js_aw_info_parent_container
 *  div.js_aw_info_container
 *  input.js_aw_info_more
 *  
 *
 */
/***********************************************/

var g_stream_modes=[
                                  'js_streams_list',

                                  'js_images_list',

                                  'js_videos_list',

                                  'js_drafts'

                              ];
/***********************************************/


/*
 * Deselect all other sections on summary page
 * Select the specific scope
 */ 
/*function aw_toggle_scope_on_summary_page(id){
  aw_lib_console_log("debug", "toggle_scope_on_summary_page");
  $.each(g_aw_filter_insensitive_ids, function(index, key) {
    $("#" + key).hide();
  });
  $("#" + id).fadeIn();
}*/
/***********************************************/
/*
 * Deselect all other sections on streams page
 * Select the specific scope
 */ 
/*function aw_toggle_scope_on_stream_page(id){
  aw_lib_console_log("debug", "toggle_scope_on_summary_page");
  $.each(g_stream_modes, function(index, key) {
    $("#" + key).hide();
  });
  $("#" + id).fadeIn();
}*/
/***********************************************/


/*****************************************************************/

/
/*****************************************************************/
$(document).ready(function(){
  alert("hi");
  //aw_toggle_scope_on_stream_page('js_streams_list');
});

/*****************************************************************/
