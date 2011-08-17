
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
  $.each(g_aw_stream_modes, function(index, key) {
    $("#" + key).hide();
  });
  $("#" + id).show();
  g_aw_current_active_mode = id;
}
/***********************************************/


/*****************************************************************/

/*****************************************************************/
$(document).ready(function(){
  

  
  /*
   * Go back to streams mode
   */
  $("#cont-typ-fltr-all").click(function(){
    aw_toggle_scope_on_stream_page('js_streams_list');
    clear_streams(); 
    $("#cont-typ-fltr-all").css({backgroundImage: "/images/alpha/all_selected.png"});
    $("#cont-typ-fltr-drafts").css({backgroundImage: "/images/alpha/drafts_unselected.png"});
    $("#cont-typ-fltr-videos").css({backgroundImage: "/images/alpha/videos_unselected.png"});
    $("#cont-typ-fltr-images").css({backgroundImage: "/images/alpha/images_unselected.png"});
    $("#cont-typ-fltr-twitter").css({backgroundImage: "/images/alpha/twitter_unselected.png"});
  });
  
  /*
   * Go to drafts mode
   */
  $("#cont-typ-fltr-drafts").click(function(){
    
    aw_toggle_scope_on_stream_page('js_drafts_list');
    clear_streams(); 
    show_all_drafts();
    $("#cont-typ-fltr-all").css({backgroundImage: "/images/alpha/all_unselected.png"});
    $("#cont-typ-fltr-drafts").css({backgroundImage: "/images/alpha/drafts_unselected.png"});
    $("#cont-typ-fltr-videos").css({backgroundImage: "/images/alpha/videos_selected.png"});
    $("#cont-typ-fltr-images").css({backgroundImage: "/images/alpha/images_unselected.png"});
    $("#cont-typ-fltr-twitter").css({backgroundImage: "/images/alpha/twitter_unselected.png"});
  });

  /*
   * Go to videos mode
   */
  $("#cont-typ-fltr-videos").click(function(){
    aw_toggle_scope_on_stream_page('js_videos_list');
    clear_streams(); 
    show_all_videos(); 

    $("#cont-typ-fltr-all").css({backgroundImage: "/images/alpha/all_unselected.png"});
    $("#cont-typ-fltr-drafts").css({backgroundImage: "/images/alpha/drafts_unselected.png"});
    $("#cont-typ-fltr-videos").css({backgroundImage: "/images/alpha/videos_selected.png"});
    $("#cont-typ-fltr-images").css({backgroundImage: "/images/alpha/images_unselected.png"});
    $("#cont-typ-fltr-twitter").css({backgroundImage: "/images/alpha/twitter_unselected.png"});
  });

  /*
   * Go to images mode
   */
  $("#cont-typ-fltr-images").click(function(){
    aw_toggle_scope_on_stream_page('js_images_list');
    clear_streams(); 
    show_all_images(); 

    $("#cont-typ-fltr-all").css("background-image", "/images/alpha/all_unselected.png");
    $("#cont-typ-fltr-drafts").css("background-image", "/images/alpha/drafts_unselected.png");
    $("#cont-typ-fltr-videos").css("background-image", "/images/alpha/videos_unselected.png");
    $("#cont-typ-fltr-images").css("background-image", "/images/alpha/images_selected.png");
    $("#cont-typ-fltr-twitter").css("background-image", "/images/alpha/twitter_unselected.png");
  });

  /*
   * Go to twitter mode
   */
  $("#cont-typ-fltr-twitter").click(function(){
    aw_toggle_scope_on_stream_page('js_images_list');
    clear_streams(); 
    $("#cont-typ-fltr-all").css("background-image", "/images/alpha/all_unselected.png");
    $("#cont-typ-fltr-drafts").css("background-image", "/images/alpha/drafts_unselected.png");
    $("#cont-typ-fltr-videos").css("background-image", "/images/alpha/videos_unselected.png");
    $("#cont-typ-fltr-images").css("background-image", "/images/alpha/images_unselected.png");
    $("#cont-typ-fltr-twitter").css("background-image", "/images/alpha/twitter_selected.png");
  });
   
});

/*****************************************************************/
