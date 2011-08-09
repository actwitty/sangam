$(document).ready(function(){
  var page_context=$('#page_mode').attr("value");
  if( page_context == "profile_main"){
    main_profile_initializer();
  }else if( page_context == "single_post") {
    single_post_initializer();
  }
});
