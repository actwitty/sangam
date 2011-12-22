$(document).ready(function() {
  var activate_feedback = $("#aw_common_feedback_btn");
  var feedback_form_box = $("#aw_common_feedback_form_box");
  var feedback_close = $("#aw_common_feedback_close");
  
  activate_feedback.click(function(){
    $(this).hide();
    feedback_form_box.slideToggle('slow', function() {
    });
  });

  feedback_close.click(function(){
    feedback_form_box.slideToggle('slow', function() {
      activate_feedback.show();
    });    
  });
  

});
