function aw_input_box_reset_to_default(){
  $('#location_field').val("");
  $('#lat_value').val("");
  $('#geo_location').val("");
  $('#location_field').val("");
  $('#activity_field').val("");
  $('#entity_field').val("");
  $('#title_field').val("");
  
  if ($('.home_page_inputs').is(':visible')) {
    $(".p-i-c").trigger('click');
    if($("#input-attachments-section").is(':visible')){
      $("#input-attachments-section").slideToggle("medium");
    }
  }

          

}


$(document).ready(function(){
  $(window).scroll(function(){

   //$(".p-st-filter").css("top",Math.max(0,230-$(this).scrollTop()));
    //var totalHeight = $("#p-ch-st-tab").height() + $("#input-box").height();
    var totalHeight = $("#input-box").height();
    //if($(this).scrollTop() > ( $("#top-bar").height() + $("#input-box").height() )
    if($(this).scrollTop() > totalHeight )
    {
      $(".p-st-filter").css("position","fixed");
      $(".p-st-filter").css("top",98);
      
      $(".p-l-fltr-1").css("position","fixed");
      $(".p-l-fltr-1").css("top",100);
      
      $(".p-l-fltr-2").css("position","fixed");
      $(".p-l-fltr-2").css("top",100);
    
      $(".p-r-fltr-st").css("position","fixed");
      $(".p-r-fltr-st").css("top",100);
  
      $(".p-r-search-fltr").css("position","fixed");
      $(".p-r-search-fltr").css("top",260);
      
      /*
      $("ul.p-cstab").css("position","fixed");
      $("ul.p-cstab").css("top",50);
      */
      $("#p-ch-st-tab-proxy").css("position","fixed");
      $("#p-ch-st-tab-proxy").css("top",50);

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
      /*
      $("ul.p-cstab").css("position","absolute");
      $("ul.p-cstab").css("top","");
      */
      $("#p-ch-st-tab-proxy").css("position","absolute");
      $("#p-ch-st-tab-proxy").css("top","");

    }
  });
  
    /* Note: There are some hardcoded strings used in following 2 functions
     * If in case you are changing any of them, plz make sure to change it in input_box partial
     * as well
     * */
    $("#attachment").live("click",function(){
        $("#input-attachments-section").slideToggle("medium");
        var $image = $(this).children("img");
        if ($image.attr("src") == "/images/alpha/camera_icon.png")
            $image.attr("src", "/images/alpha/camera_pressed_button.png");
        else
            $image.attr("src", "/images/alpha/camera_icon.png");

        var $span = $(this).children("span");
        if ($span.text() == "Add Images")
            $span.text("Close Images");
        else
            $span.text("Add Images");  
    });

    $("#add_subtitle").live("click",function(){
        $("#subtitle-div").slideToggle("medium");
        var $image = $(this).children("img");
        if ($image.attr("src") == "/images/alpha/title_normal_button.png")
            $image.attr("src", "/images/alpha/title_pressed_button.png");
        else
            $image.attr("src", "/images/alpha/title_normal_button.png");
       
        var $span = $(this).children("span");
        if ($span.text() == "Add Title")
            $span.text("Close Title");
        else
            $span.text("Add Title");  

    });


    /* to display the comment input system for inputting comments.  like google+ */ 
    $(".add-comment").live("click",function(){
      $(this).next().show();
      $(this).hide();
    });
  
    $(".cancel-comment-btn").live("click",function(){
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

    /* to make sure that only alphanumeric characters are allowed in activity field*/
    $("#activity_field").alphanumeric();

    $("#aw_login_open").click(function(){
      $("#aw_home_header_signin_box").slideToggle();
    }); 

    if ($.browser.msie && $.browser.version.substr(0,1)<7){
      alert("oops!! You seems to be using older version of browser, ActWitty is not supported yet on your browser version. We suggest you to upgrade to higher version.");
    }

});



function get_trim_text (str_value,len,end_with) {
  var str = str_value;
  if(str.length > len){
        str = str.substring(0,len) + end_with ;
  }
  return str;

}
