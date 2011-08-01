$(document).ready(function(){
  

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

