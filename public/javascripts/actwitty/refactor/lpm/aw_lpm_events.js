/*******************************************************/
/*
 *
 *
 */
function aw_lpm_redirect_on_click(post_id){
  var url = aw_lib_get_base_url() + '/view?id=' + post_id;
  window.location.href = "http://localhost:3000";
}

/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){
  $("#aw_js_lpm_info_link_checkin").click(function(){
    aw_lpm_redirect_on_click("123");
  });
  
  $("#aw_js_lpm_info_link_oneword").click(function(){
    aw_lpm_redirect_on_click("123");
  });

  $("#aw_js_lpm_info_link_categorization").click(function(){
    aw_lpm_redirect_on_click("123");
  });

  $("#aw_js_lpm_info_link_recommendations").click(function(){
    aw_lpm_redirect_on_click("123");
  });

  $("#aw_js_lpm_info_link_ranking").click(function(){
      aw_lpm_redirect_on_click("123");
  });

  $("#aw_js_lpm_info_link_subscription").click(function(){
    aw_lpm_redirect_on_click("123");
  });

});
