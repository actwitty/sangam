/***************************************************/
/*
 *
 *
 */
function aw_internal_inviteds_get_facebook_fill_details(element, fbid){
  var url = 'https://graph.facebook.com/' + fbid + "&callback=?";
  var details = {};
  $.getJSON(url, function(fbid_resp_data){
    element.closest("tr").find(".aw_js_invited_name_td").html(fbid_resp_data.first_name + ' ' + fbid_resp_data.last_name);
  });
  
}

/***************************************************/
/*
 *
 *
 */
function aw_api_ppm_initialize_aw_internal_inviteds_page(){
  $('.aw_js_process_inviteds_data_from_fb').each(function(){
      aw_internal_inviteds_get_facebook_fill_details($(this), $(this).val());  
  });
}


/**************************************************/
/*
 *
 *
 */
function aw_preprocess_invite_request(fbid){
  var url = 'https://graph.facebook.com/' + fbid + '&callback=?';
  var details = {};
  $.getJSON(url, function(fbid_resp_data){
    if(fbid_resp_data.id){
      $("#aw_js_prefetched_info_section").show();
      $("#aw_js_invite_name").html(fbid_resp_data.first_name + ' ' + fbid_resp_data.last_name);
      $("#aw_js_invite_image").attr('src', 'http://graph.facebook.com/' + fbid + '/picture?type=square');
      $("#aw_js_invite_fbid").val( fbid_resp_data.id );
    }
  

  });
}

/*************************************************/
function aw_api_srv_resp_aw_internal_invite(){
  $("#aw_js_invite_name").html();
  $("#aw_js_invite_image").attr('src', '');
  $("#aw_js_invite_fbid").val( '' );
  $("#aw_js_invite_from_facebook").val( '' );
  $("#aw_js_prefetched_info_section").hide();
}
/**************************************************/
/*
 *
 *
 */
function aw_process_invite_request(){

  var params = {
                  'aw_srv_protocol_params' : {  
                                                id: $("#aw_js_invite_fbid").val(), 
                                            },
                  'aw_srv_protocol_cookie' : {
                                             }
               };
  aw_api_srv_make_a_post_request('AW_SRV_INTERNAL_CREATE_INVITE',  params);
}
/************************************************/
/*
 *
 *
 *
 */
$(document).ready(function(){
  $("#aw_js_invite_prefetch_btn").click(function(){
    aw_preprocess_invite_request($("#aw_js_invite_from_facebook").val());
  });

  $("#aw_js_invite_btn").click(function(){
    aw_process_invite_request();
  });
});


