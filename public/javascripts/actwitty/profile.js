/*
 * home/show or profile page activities related jqueries
 *
 */


/*
 * Globals
 *
 */
var default_tab = $('#default_page_mode').attr("value");


function main_profile_initializer(){
    var page_owner_id=aw_lib_get_page_owner_id();
    var session_owner_id=aw_lib_get_session_owner_id();
    
    /* initialize filters for carry forward to another page*/
    profile_filter_init();

    /* initialize stream page mode for carry forward to another page*/
    aw_stream_select_mode_on_load();
    aw_toggle_scope_on_stream_page(aw_get_current_stream_mode());

    /* At very start Hide all contents on page load */

    //Decide to bring one tab on focus
    if(default_tab =='filtered'){
  	  $("ul.p-cstab li:last").addClass("active").show();
      $("#streams_left_side_bar").show();
      $("#streams_main_bar").show();
      $("#streams_right_side_bar").show();
      /* Bring in stream filtered view on focus*/
      aw_reload_streams_on_viewed_user();
    }else{
      /* Bring in personal summary on focus*/
      $("#channels_main_bar").show();
  	  $("ul.p-cstab li:first").addClass("active").show(); 
      $('#channels_display_list').html("");
      $("#more_channels_cookie").val("");
      append_personal_summary(page_owner_id);
    }
}

/*
 * Execute on load
 */
$(document).ready(function(){

     aw_lib_console_log("debug", "profile.js:ready called"); 
     var page_owner_id=aw_lib_get_page_owner_id();
     var session_owner_id=aw_lib_get_session_owner_id();  
	 
    
    /*
     * Bind Click on the tab
     */
	  $("ul.p-cstab li").click(function() {
     
      aw_lib_console_log("debug", "profile.js: tab clicked"); 
      /* Remove active from all tabs */
		  $("ul.p-cstab li").removeClass("active");


		  $(this).addClass("active"); //Add "active" class to selected tab
      
      var tab_id = $(this).attr("id");
      
      if(tab_id == "channels_tab_head"){
        aw_lib_console_log("debug", "profile.js: channels tab selected"); 
        $("#streams_left_side_bar").hide();
        $("#streams_main_bar").hide();
        $("#streams_right_side_bar").hide();
        $("#channels_main_bar").fadeIn();
        $('#channels_display_list').html("");
        $("#more_channels_cookie").val("");
        append_personal_summary(page_owner_id);

      }else if(tab_id == "streams_tab_head"){
        aw_lib_console_log("debug", "profile.js: streams tab selected"); 
        $("#channels_main_bar").hide();
        $("#streams_left_side_bar").fadeIn();
        $("#streams_main_bar").fadeIn();
        $("#streams_right_side_bar").fadeIn();
        aw_lib_console_log("debug", "profile.js: reload streams"); 
        aw_reload_streams_on_viewed_user();
          
      }


		  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active ID content
		  return false;
	  });
    /********************** click on tab ends here ****************************/
   
    


    
    
   
   


    $("div.p-awp-content p").expander({
      slicePoint:       300,  // default is 100
      expandText:         'read more', // default is 'read more...'
      userCollapseText: '...less'  // default is '[collapse expanded text]'
    });

    

  }); /* ready ends here */


  

