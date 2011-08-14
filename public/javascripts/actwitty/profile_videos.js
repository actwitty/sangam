


$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support video and video modals
     */
   
    $('#cont-typ-fltr-videos_disabled').live("click", function() {
      alert("video");
      var html = '<div id="tabul_videos" class="p-cstab_content"></div>';
      $('.p-awp-post-stream').hide();
      $('#p-st-fltr-box').hide();
      $('#streams_tab').hide();
      //$('#container').hide();
      $('#tabul').hide();
      $('#tabul').remove();
      $('#tabul_videos').remove();
      $('#tabul_videos').show();
      $('#streams_main_bar').append(html);
      aw_boxer_render_tabs("tabul_videos", get_base_json_unit_test_video());
    });
   
  $(".js_video_tab_click").click(function(){
      /* Remove active from all tabs */
		  $(".js_video_tab_click").removeClass("active");


		  $(this).addClass("active"); //Add "active" class to selected tab
      
      var tab_id = $(this).attr("id");

      if(tab_id == "channels_video_tab_head"){
        $("#streams_video_main_bar").hide();
        $("#channels_video_main_bar").fadeIn();

      }else if(tab_id == "streams_video_tab_head"){
        $("#channels_video_main_bar").hide();
        $("#streams_video_main_bar").fadeIn();
        
      }


		  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active ID content
    return false;
  });
});

/*
 * Main render of videos page
 */
function show_videos_init(){
    var page_owner_id=$('#page_owner_id').attr("value");
    var session_owner_id=$('#session_owner_id').attr("value");
    
    
   
    /* At very start Hide all contents on page load */

      /* Bring in personal summary on focus*/
      $("#channels_video_main_bar").show();
      $("#streams_video_main_bar").hide();
      $("#channels_left_side_bar").show();
      $("#channels_right_side_bar").show();
  	  $("ul.p-cstab_mm li:first").addClass("active").show();


}
