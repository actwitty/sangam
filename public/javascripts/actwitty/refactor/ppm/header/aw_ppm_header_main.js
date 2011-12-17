/****************************************************************/
/*
 *
 *
 */
function aw_get_currently_active_search_mode(){
  return $("input:radio[name=aw_js_ppm_top_search_type]:checked").val();
}
/****************************************************************/
/*
 *
 *
 */
 function aw_get_search_autocompelte_format(data){
  return data.name;
 }

/****************************************************************/
/* UNUSED FUNCTION
 *
 *
 */
function aw_api_srv_resp_ppm_cmn_header_render_search_any(params){

  var autocomplete_json = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  alert(JSON.stringify(params));
  /* register this only when JSON is ready */
  $("#aw_js_ppm_header_search_text").autocomplete(autocomplete_json, {
     	  minChars: 0,
		    matchContains: true,
		    highlightItem: false,
        formatItem: function(data) {
          return aw_get_search_autocompelte_format(data);
        }
      }).result(function(event, item) {
      });

}
/****************************************************/
/* UNUSED FUNCTION
 *
 *
 */
function aw_ppm_cmn_header_request_data_for_autocomplete(){
  
  var search_type = aw_get_currently_active_search_mode();
  var search_name = element.val();
  alert(search_type);
  var params = {
                  'aw_srv_protocol_params' : {  
                                                type: search_type, 
                                                name: search_name
                                            },
                  'aw_srv_protocol_cookie' : {
                                             }
               };

    aw_api_srv_make_a_get_request('AW_SRV_PPM_CMN_SEARCH_ANY_TYPE',  params);

}
/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_html(item){
  var current_mode = aw_get_currently_active_search_mode();
  var html = '';
  if(current_mode == 'user'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_img_box" >' +
                '<img class="awppm_search_autocomplete_img" src="' + item.image + '" width="25px" height="25px" />' +               
              '</div>' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/user.png" />' + 
              '</div>' +
           '</div>';
           
  }else if(current_mode == 'channel'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/channel.png" />' + 
              '</div>' +
           '</div>';
  }else if(current_mode == 'location'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/location.png" />' + 
              '</div>' +
           '</div>';
  }else if(current_mode == 'entity'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_img_box" >' +
                '<img class="awppm_search_autocomplete_img" src="' + item.image + '" width="25px" height="25px" />' +               
              '</div>' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/mention.png" />' + 
              '</div>' +
           '</div>';
  }
  return html;

}
/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_result_click(item){
  var current_mode = aw_get_currently_active_search_mode();
  var link = "#";
  if( item && item.id){
    if(current_mode == 'user'){
      var link = '/home/show?id=' + item.id;
    }else if (current_mode == 'channel'){
      var link = '/channel_page?id=' + item.id;
    }else if (current_mode == 'location'){
      var link = '/location_page?id=' + item.id;
    }else if (current_mode == 'entity'){
      var link = '/mention_page?id=' + item.id;
    }
    window.location.href = link; 
  }

}
/*******************************************************************************/
/*
 *
 *
 */
function aw_register_search_any_autocomplete(){
  $("#aw_js_ppm_header_search_text").autocomplete(
            "/home/search_any.json?type=" + aw_get_currently_active_search_mode(), 
            {
		          multiple: false,
              minChars: 3,
              autoFill: true,
              max: 8,
              mustMatch: true,
		          dataType: "json",
              parse: function(data){
                 return $.map(data, function(item) {
                    return { data: item, value: item.name, result: item.href };
                 });
              },
              formatItem: function(item) {
                 return aw_get_autocomplete_html(item);
                }
              }).result(function(e, item) {
                aw_get_autocomplete_result_click(item);
              });
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
      $(this).css("background-image", "url(/images/actwitty/refactor/aw_ppm/common/search_inactive.png)");  
    }else{
      $("#aw_js_ppm_search_box").show();
      $(this).css("background-image", "url(/images/actwitty/refactor/aw_ppm/common/search.png)"); 
    }
    $("#aw_js_ppm_header_search_text").val("");
    $("#aw_js_ppm_header_search_ppl").attr("checked", true);
    $("#aw_js_ppm_header_search_chn").attr("checked", false);
    $("#aw_js_ppm_header_search_locations").attr("checked", false);
    $("#aw_js_ppm_header_search_mentions").attr("checked", false);
    aw_register_search_any_autocomplete();
    return false;
  });
  
  $("#aw_js_ppm_header_user_image_click").click(function () {
    $("#awppm_header_options_menu").slideToggle();
    return false;
  });

  $("input:radio[name=aw_js_ppm_top_search_type]").click(function() {
    var value = $(this).val();
    $("#aw_js_ppm_header_search_text").val("");
  });
  
  $(".aw_js_ppm_cmn_search_radio_click").click(function(){
    aw_register_search_any_autocomplete(); 
  });
 
  aw_register_search_any_autocomplete(); 

 

});



