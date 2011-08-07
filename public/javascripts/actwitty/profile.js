/*
 * home/show or profile page activities related jqueries
 *
 */




/*
 * Execute on load
 */
$(document).ready(function(){

    
    var page_owner_id=$('#page_owner_id').attr("value");
    var session_owner_id=$('#session_owner_id').attr("value");
    var default_tab = $('#default_page_mode').attr("value");
    var populated_personal=false;
    var populated_friends=false;
    var populated_stream=false;
 
   
    /* At very start Hide all contents on page load */
	  $(".tab_content").hide(); 

    //Decide to bring one tab on focus
    if(default_tab =='filtered'){
  	  $("ul.p-cstab li:last").addClass("active").show();
      $("#streams_left_side_bar").show();
      $("#streams_main_bar").show();
      $("#streams_right_side_bar").show();
	    $(".tab_content:last").show();
      /* Bring in stream filtered view on focus*/
      if(populated_stream == false){
        reload_streams_on_viewed_user(page_owner_id,session_owner_id);
        populated_stream=true;
      }
    }else{
      /* Bring in personal summary on focus*/
      $("#channels_left_side_bar").show();
      $("#channels_main_bar").show();
      $("#channels_right_side_bar").show();
  	  $("ul.p-cstab li:first").addClass("active").show(); 
	    $(".tab_content:first").show();
      if(populated_personal == false){
        append_personal_summary(page_owner_id);
        populated_personal=true;
      }
    }
    /***********************************************************/
	  /*
     * Bind Click on the tab
     */
	  $("ul.p-cstab li").click(function() {
      /* Remove active from all tabs */
		  $("ul.p-cstab li").removeClass("active");


		  $(this).addClass("active"); //Add "active" class to selected tab
      
      var tab_id = $(this).attr("id");

      if(tab_id == "channels_tab_head"){
        $("#streams_left_side_bar").hide();
        $("#streams_main_bar").hide();
        $("#streams_right_side_bar").hide();
        $("#channels_left_side_bar").fadeIn();
        $("#channels_main_bar").fadeIn();
        $("#channels_right_side_bar").fadeIn();
        if(populated_personal == false){
          append_personal_summary(page_owner_id);
          populated_personal=true;
        }

      }else if(tab_id == "streams_tab_head"){
        $("#channels_left_side_bar").hide();
        $("#channels_main_bar").hide();
        $("#channels_right_side_bar").hide();
        $("#streams_left_side_bar").fadeIn();
        $("#streams_main_bar").fadeIn();
        $("#streams_right_side_bar").fadeIn();
        if(populated_stream == false){
          reload_streams_on_viewed_user(page_owner_id,session_owner_id);
          populated_stream=true;
        }
          
      }

		  $(".tab_content").hide(); //Hide all tab content

		  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active ID content
		  return false;
	  });
    /********************** click on tab ends here ****************************/
   
    


    /*
     * Bind click to more on personal summary
     */
    $('#more_personal').click(function() {
      if(populated_personal == true){
        append_personal_summary(page_owner_id);
      }

        return false;
    });
    
   
    /*
     * Bind click to more on streams tab
     */
     $('#more_streams').click(function() {
        append_stream(page_owner_id, session_owner_id);
        return false;
    });


    $("div.p-awp-content p").expander({
      slicePoint:       100,  // default is 100
      expandText:         'read more', // default is 'read more...'
      userCollapseText: '...less'  // default is '[collapse expanded text]'
    });

    

  }); /* ready ends here */


  

