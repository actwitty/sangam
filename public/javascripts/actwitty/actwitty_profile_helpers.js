$(document).ready(function(){
  $(window).scroll(function(){

    //$(".p-st-filter").css("top",Math.max(0,230-$(this).scrollTop()));
    var totalHeight = $("#top-bar").height() + $("#input-box").height();
    //if($(this).scrollTop() > ( $("#top-bar").height() + $("#input-box").height() )
    if($(this).scrollTop() > totalHeight )
    {
      $(".p-st-filter").css("position","fixed");
      $(".p-st-filter").css("top",50);
      
      $(".p-l-fltr-1").css("position","fixed");
      $(".p-l-fltr-1").css("top",50);
      
      $(".p-l-fltr-2").css("position","fixed");
      $(".p-l-fltr-2").css("top",50);
    
      $(".p-r-fltr-st").css("position","fixed");
      $(".p-r-fltr-st").css("top",50);
  
      $(".p-r-search-fltr").css("position","fixed");
      $(".p-r-search-fltr").css("top",50);
      
      //alert(totalHeight);

    }
    else
    {
      $(".p-st-filter").css("position","absolute");
      $(".p-st-filter").css("top","");
      
      $(".p-l-fltr-1").css("position","absolute");
      $(".p-l-fltr-1").css("top","");
      
      $(".p-l-fltr-2").css("position","absolute");
      $(".p-l-fltr-2").css("top","");

      $(".p-r-fltr-st").css("position","absolute");
      $(".p-r-fltr-st").css("top","");
  
      $(".p-r-search-fltr").css("position","absolute");
      $(".p-r-search-fltr").css("top","");
    }
  });
  
    /* to view comments on streams */
    $(".view-comments").click(function(event){
      $(this).parent().next().slideToggle();
      
    });




  
    /* to display the comment input system for inputting comments.  like google+ */ 
    $(".add-comment").click(function(event){
      $(this).next().show();
      $(this).hide();
    });
  
    $(".cancel-comment-btn").click(function(event){
      var parentTag = $(this).parent().prev().show();
      $(this).parent().hide();
    });


    /* to display the input system for creating posts.....  like google+ */ 
    $(".add-page-input").click(function(event){
      //alert("clicked here");
      $(this).hide();
      $(".home_page_inputs").slideToggle("medium");
    });

    $(".p-i-c").click(function(event){
      $(".home_page_inputs").slideToggle("medium");
      $(".add-page-input").show();
    });


    //Default Actions on tabs for me/friends/streams
	  $(".tab_content").hide(); //Hide all content
	  $("ul.tabs li:first").addClass("active").show(); //Activate first tab
	  $(".tab_content:first").show(); //Show first tab content
	
	  //On Click Event
	  $("ul.tabs li").click(function() {
		  $("ul.tabs li").removeClass("active"); //Remove any "active" class
	 	  $(this).addClass("active"); //Add "active" class to selected tab
		  $(".tab_content").hide(); //Hide all tab content
		  var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active content
		  return false;
	  });

    /*
    $(".trigger-feedback").click(function(){
		  $(".panel").toggle("fast");
		  $(this).toggleClass("active");
		  return false;
	  });*/
    
    $(".trigger-feedback").click(function(){
		  $(".panel").show();
		  $(this).hide();
		  return false;
	  });
    $(".cancel-feedback").click(function(){
      $(".panel").hide();
      $(".trigger-feedback").show();
    });
   

    $(".post-like-link").click(function() {
        //alert("fdgdfgd");
        $(".liking-it").css('display','block');
    });
   
    /*
     *  JQuery for enabling character counter on input boxes
     *  Activity input box:32 characters, Location Box:60 characters, Entity Box:600 characters
     *  Idea is to take the maxlength from html attribute and checking the length
     *  Same placeholder to show remaining character is used for all 3 boxes
     *
     */
     
    

    $(".count-enable").blur(function() {
        $("#input-char-count").hide();
    });
    
    $(".count-enable").bind('focus keyup', function() {
        $("#input-char-count").show();
        var maxlength = $(this).attr("maxlength");
        $(this).val($(this).val().slice(0,maxlength));
        var remaining_length = maxlength - $(this).val().length;
        $("#char-count").text(": "+ remaining_length);

    });

    $("#attachment").click(function(){
        $("#input-attachments-section").show();
         /*$("#attachment-list").append(" <div class='input-attachment'> " +
                    "<input type='file' class='choose-attach'> " +
                    "<input type='text' placeholder='Caption' class='attach-caption'/>" +
                    "<input type='button' value='Delete' class='delete-attach'/>" +
                "</div>");*/
        $(this).hide();
    });



    /* delete all the attachments... thus deleting all the elements with class as 
     * input attachment
     */
    $("#delete-all-attachment").click(function(){
        $("#input-attachments-section").hide();
        $(".input-attachment").remove();
        $("#attachment").show();
    });
    
    
    
    /* not used probably...keep it */ 
    $(".delete-attachment").click(function(){
        $(this).parent().remove();
        //alert($('.attachment-list').children.length);
    });
    
    /* to get functionality of add more images*/ 
    $("#add-more-attachment").click(function(){
        $("#attachment-list").append(" <div class='input-attachment'> " +
                    "<input type='file' class='choose-attach'> " +
                    "<input type='text' placeholder='Caption' class='attach-caption'/>" +
                    "<input type='button' value='Delete' class='delete-attach'/>" +
                "</div>");
        $(this).disabled = true;
    });


    /* to get functionality of delete a particular attachment
     * in case all the attachments are deleted, we will close the attachment box and
     * move to add-image box as we do in delete all
     * 
     */
    $(".delete-attach").live('click', function() {
       $(this).parent().remove(); 
       if ($("#attachment-list").children().length == 0) {
          $("#input-attachments-section").hide();
          $("#attachment").show();
       }
    });

    $(".dropdown").click(function () {
        /*$("ul.the_menu").slideToggle("medium");*/
    });


   
    $("#menu_class").click(function () {
        /*$("ul.the_menu").slideToggle("medium");*/
    });
   
    $(".show-summary-post").click(function () {
        $(this).parent().next().slideToggle("medium");
    });

    $(".campaign-btn").click(function () {
        $(this).toggleClass('selected-camp');
        $(this).prev().show();
    });
   
    $(".del-camp").click(function () {
        $(this).next().toggleClass('selected-camp');
        $(this).hide();
    });

    /* to make sure that only alphanumeric characters are allowed in activity field*/
    $("#activity_field").alphanumeric();

   

});


