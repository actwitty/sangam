$(document).ready(function(){


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
        alert("fdgdfgd");
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
        $(this).hide();
    });
    $("#delete-all-attachment").click(function(){
        $("#input-attachments-section").hide();
        $("#attachment").show();
    });
    $(".delete-attachment").click(function(){
        $(this).parent().remove();
    });
    
    $("#add-more-attachment").click(function(){
        $("#attachment-list").append("<div class='input-attachment'><img src='photo.jpg'><a href='#' class='delete-attachment'>delete</a></div>");
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



    
 });
