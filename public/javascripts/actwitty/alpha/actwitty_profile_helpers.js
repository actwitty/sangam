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

    $("#attachment").live("click",function(){
        $("#input-attachments-section").show();
        $(this).hide();
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
        $(".liking-it").css('display','block');
    });
   
    /*
     *  JQuery for enabling character counter on input boxes
     *  Activity input box:32 characters, Location Box:60 characters, Entity Box:600 characters
     *  Idea is to take the maxlength from html attribute and checking the length
     *  Same placeholder to show remaining character is used for all 3 boxes
     *
     */
     
    

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
