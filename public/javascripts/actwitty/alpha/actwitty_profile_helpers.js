function reset_to_default(){
  $('#location_field').val("");
  $('#lat_value').val("");
  $('#geo_location').val("");
  $('#location_field').val("");
  $('#activity_field').val("");
  $('#entity_field').val("");
  $('#title_field').val("");

  $("#attachment").show();
  $("#input-attachments-section").slideToggle("medium");
  $("#input-attachments-section").hide();
  $(".home_page_inputs").slideToggle("medium");
  $(".add-page-input").show();
          

}


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
  

    $("#attachment").live("click",function(){
         $("#input-attachments-section").slideToggle("medium");
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


    /* to display the input system for creating posts.....*/ 
    $(".add-page-input").click(function(event){
      $(this).hide();
      $(".home_page_inputs").slideToggle("medium");
    });

    $(".p-i-c").click(function(event){
      $(".home_page_inputs").slideToggle("medium");
      $(".add-page-input").show();
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


    $(".campaign-btn").click(function () {
        var state = get_campaign_status($(this).val());
        if(state == false){
          $(this).addClass('selected-camp');
          $(this).prev().show();
          set_campaign_status($(this).val(), true);
        }
        return false;
    });

    $(".del-camp").click(function () {
        var state = get_campaign_status($(this).next().val());
        if(state == true){
          $(this).next().removeClass('selected-camp');
          $(this).hide();
          set_campaign_status($(this).next().val(), false);
        }else{
          this.hide();
        }
        return false;
    });

    /*enable auto increase of textarea*/
    $('#entity_field').elastic();
		$('#entity_field').trigger('update');



});
