
/*
 * classes
 * div.js_aw_info_parent_container
 *  div.js_aw_info_container
 *  input.js_aw_info_more
 *  
 *
 */
var g_aw_filter_insensitive_ids=[
                                  'js_channels_list',
                                ];
/***********************************************/

var g_aw_filter_sensitive_ids=[
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
function toggle_scope_on_summary_page(id){
  aw_lib_console_log("debug", "toggle_scope_on_summary_page");
  $.each(g_aw_filter_insensitive_ids, function(index, key) {
    /* clear tabls on filter change */
    $("#" + key).hide();
  });
  $("#" + id).fadeIn();
}
/***********************************************/
/*
 * Deselect all other sections on streams page
 * Select the specific scope
 */ 
function toggle_scope_on_stream_page(id){
  aw_lib_console_log("debug", "toggle_scope_on_summary_page");
  $.each(g_aw_filter_sensitive_ids, function(index, key) {
    /* clear tabls on filter change */
    $("#" + key).hide();
  });
  $("#" + id).fadeIn();
}
/***********************************************/


/*****************************************************************/

/*
 * call on reset
 */
function aw_reset_dynamic_info_on_filter(){
  aw_lib_console_log("info", "flush cache on change of filter");
  $.each(g_aw_filter_sensitive_ids, function(index, key) {
    /* clear tabls on filter change */
    $("#" + key).html("");
    g_aw_dynamic_info_state[key] = {populated:false,updated_at:''};
  });
}
/*****************************************************************/

/*
 * call on init
 */
function aw_init_dynamic_info(){
  aw_lib_console_log("info", "init dynamic info");
  $.each(g_aw_filter_insensitive_ids, function(index, key) {
    /* clear tabls on filter change */
    $("#" + key).find('.js_aw_info_container').remove();
    g_aw_dynamic_info_state[key] = {populated:false,updated_at:''};
  });

  aw_reset_dynamic_info_on_filter();
}
/*****************************************************************/

/*
 *
 * {user_id : owner_id, updated_at:more_cookie, friend:get_others_filter_state() }
    var page_owner_id=$('#page_owner_id').attr("value");
    var session_owner_id=$('#session_owner_id').attr("value");
    if( page_owner_id == session_owner_id){
      $("#channel_others").addClass("p-r-fltr-others-active");
      $("#stream_others").addClass("p-r-fltr-others-active");
    }else{
      others_filter_state=false;
    }

    */

/*****************************************************************/
$(document).ready(function(){

  $(".js_more_on_info"){
  }
  
});
/*****************************************************************/
