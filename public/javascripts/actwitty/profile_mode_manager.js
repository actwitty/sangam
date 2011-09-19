
/*
 * classes
 * div.js_aw_info_parent_container
 *  div.js_aw_info_container
 *  input.js_aw_info_more
 *  
 *
 */
/***********************************************/

var g_aw_stream_modes=[
                                  'js_streams_list',

                                  'js_images_list',

                                  'js_videos_list',

                                  'js_drafts_list'

                              ];

var g_aw_current_active_mode = 'js_streams_list'; 
/***********************************************/
/*
 * Deselect all other sections on streams page
 * Select the specific scope
 */ 
function aw_toggle_scope_on_stream_page(id){
  aw_lib_console_log("debug", "toggle_scope_on_summary_page");
  var found = false;
  $.each(g_aw_stream_modes, function(index, key) {
    $("#" + key).hide();
    if ( key == id ){
      found = true;
    }
  });
  /* go to stream list if its a bad setting */
  if( !found ){ 
    id = 'js_streams_list';
  }
  $("#" + id).show();
  g_aw_current_active_mode = id;
}
/***********************************************/
function aw_stream_select_mode_on_load(){
  g_aw_current_active_mode = $("#stream_page_mode").val();
}
/***********************************************/
function aw_get_current_stream_mode(){
  return g_aw_current_active_mode;
}
/***********************************************/
function clear_all_stream_modes(){
  $("#streams_list_parent").html('');
  $("#streams_list_parent").html('<div class="p-awp-post-stream" id="streams_list"> </div>');
  $("#more_streams_cookie").val("");

  $("#streams_drafts_list_parent").html('');
  $("#streams_drafts_list_parent").html('<div class="p-awp-post-stream" id="streams_drafts_list"> </div>');
  $("#more_streams_drafts_cookie").val("");


  $("#streams_images_list_parent").html('');
  $("#streams_images_list_parent").html('<div class="p-awp-post-stream" id="streams_images_list"> </div>');
  $("#more_streams_images_cookie").val("");


  $("#streams_videos_list_parent").html('');
  $("#streams_videos_list_parent").html('<div class="p-awp-post-stream" id="streams_videos_list"> </div>');
  $("#more_streams_videos_cookie").val("");
}

/*****************************************************************/
/*
 *
 */
function aw_redirect_to_streams_filtered_of_other_user(page_owner_id){
    // commented based on the feedback that we should always land on the "all tab of stream" for visiting user
    //params='id=' + page_owner_id +'&mode=filtered&stream_mode=' + g_aw_current_active_mode + "&" + get_long_string_filter();
    params='id=' + page_owner_id +'&mode=filtered&stream_mode=js_streams_list ' + "&" + get_long_string_filter();
    window.location.href ='/home/show?' + params;
}


/*****************************************************************/

/*
 * On change of filter we need to do all these
 * On load of page as well we need to do all these
 */
function aw_reload_streams_on_viewed_user(){
  /* we are working on browser cache so we can delete the context on DOM */
  clear_all_stream_modes();
  aw_stream_clear_stream_jsons();

  /*
   * pick up the specific mode
   */
  if( g_aw_current_active_mode == 'js_images_list'){
    show_all_images(); 
  }else if( g_aw_current_active_mode == 'js_videos_list'){
    show_all_videos(); 
  }else if( g_aw_current_active_mode == 'js_drafts_list'){
    show_all_drafts();
  }else {
    append_stream(aw_lib_get_page_owner_id(), 
                  aw_lib_get_session_owner_id());
  }

  clear_related_entities();
  list_related_entities(aw_lib_get_page_owner_id());

  clear_related_locations();
  list_related_locations(aw_lib_get_page_owner_id());

  clear_related_friends();
  if( aw_lib_get_session_owner_id()){ 
    list_related_friends();
  }
  
  

}
/*****************************************************************/
$(document).ready(function(){
  

  
  /*
   * Go back to streams mode
   */
  $("#cont-typ-fltr-all").click(function(){
    aw_toggle_scope_on_stream_page('js_streams_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    append_stream(aw_lib_get_page_owner_id(), 
                  aw_lib_get_session_owner_id());

    $("#cont-typ-fltr-all").addClass("blue_active");
    $("#cont-typ-fltr-drafts").removeClass("blue_active");
    $("#cont-typ-fltr-videos").removeClass("blue_active");
    $("#cont-typ-fltr-images").removeClass("blue_active");
    $("#cont-typ-fltr-twitter").removeClass("blue_active");

    /*
    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all2.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');
    */
   
  });
  
  /*
   * Go to drafts mode
   */
  $("#cont-typ-fltr-drafts").click(function(){
    
    aw_toggle_scope_on_stream_page('js_drafts_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    show_all_drafts();

    $("#cont-typ-fltr-all").removeClass("blue_active");
    $("#cont-typ-fltr-drafts").addClass("blue_active");
    $("#cont-typ-fltr-videos").removeClass("blue_active");
    $("#cont-typ-fltr-images").removeClass("blue_active");
    $("#cont-typ-fltr-twitter").removeClass("blue_active");

    /*
    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft2.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');
    */

  });

  /*
   * Go to videos mode
   */
  $("#cont-typ-fltr-videos").click(function(){
    aw_toggle_scope_on_stream_page('js_videos_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    show_all_videos(); 

    $("#cont-typ-fltr-all").removeClass("blue_active");
    $("#cont-typ-fltr-drafts").removeClass("blue_active");
    $("#cont-typ-fltr-videos").addClass("blue_active");
    $("#cont-typ-fltr-images").removeClass("blue_active");
    $("#cont-typ-fltr-twitter").removeClass("blue_active");

    /*
    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video2.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');
    */

  });

  /*
   * Go to images mode
   */
  $("#cont-typ-fltr-images").click(function(){
    aw_toggle_scope_on_stream_page('js_images_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();
    show_all_images(); 

    $("#cont-typ-fltr-all").removeClass("blue_active");
    $("#cont-typ-fltr-drafts").removeClass("blue_active");
    $("#cont-typ-fltr-videos").removeClass("blue_active");
    $("#cont-typ-fltr-images").addClass("blue_active");
    $("#cont-typ-fltr-twitter").removeClass("blue_active");

    /*
    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images2.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter1.jpg)');
    */


  });

  /*
   * Go to twitter mode
   */
  $("#cont-typ-fltr-twitter").click(function(){
    aw_toggle_scope_on_stream_page('js_images_list');
    clear_all_stream_modes();
    aw_stream_clear_stream_jsons();


    $("#cont-typ-fltr-all").removeClass("blue_active");
    $("#cont-typ-fltr-drafts").removeClass("blue_active");
    $("#cont-typ-fltr-videos").removeClass("blue_active");
    $("#cont-typ-fltr-images").removeClass("blue_active");
    $("#cont-typ-fltr-twitter").addClass("blue_active");

    /*
    $("#cont-typ-fltr-all").css('background-image', 'url(/images/alpha/all1.jpg)');
    $("#cont-typ-fltr-drafts").css('background-image', 'url(/images/alpha/draft1.jpg)');
    $("#cont-typ-fltr-videos").css('background-image', 'url(/images/alpha/Video1.jpg)');
    $("#cont-typ-fltr-images").css('background-image', 'url(/images/alpha/Images1.jpg)');
    $("#cont-typ-fltr-twitter").css('background-image', 'url(/images/alpha/Twitter2.jpg)'); 
    */

  });
   
});

/*****************************************************************/
