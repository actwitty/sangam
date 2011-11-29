/****************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_cmn_header_render_search_any(params){
}

/*******************************************************************************/
/*
 *
 *
 */
$(document).ready(function() {
  $("#aw_js_ppm_header_search").click(function () {
    if($("#aw_js_ppm_search_box").is(":visible")){
      $("#aw_js_ppm_search_box").hide();
    }else{
      $("#aw_js_ppm_search_box").show();
    }
    $("#aw_js_ppm_header_search_text").val("");
    $("#aw_js_ppm_header_search_ppl").attr("checked", true);
    $("#aw_js_ppm_header_search_chn").attr("checked", false);
    $("#aw_js_ppm_header_search_locations").attr("checked", false);
    $("#aw_js_ppm_header_search_mentions").attr("checked", false);
  });
  
  $("#aw_js_ppm_header_user_image_click").click(function () {
    $("#awppm_header_options_menu").slideToggle();
  });

  $("input:radio[name=aw_js_ppm_top_search_type]").click(function() {
    var value = $(this).val();
    $("#aw_js_ppm_header_search_text").val("");
  });


  $("#aw_js_ppm_header_search_text").autocomplete({
    change: function(event, ui){
      alert("i m hit");

    },
    source: function(request, response){
      alert("source called");
    }
  });
});


