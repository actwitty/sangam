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
function aw_preprocess_invite_request(service, id){
  if( service == "facebook" ){
    var url = 'https://graph.facebook.com/' + id + '&callback=?';
    var details = {};

    $.getJSON(url, function(fbid_resp_data){
      if(fbid_resp_data.id){
        $("#aw_js_prefetched_info_section").show();
        $("#aw_js_invite_name").html(fbid_resp_data.first_name + ' ' + fbid_resp_data.last_name);
        $("#aw_js_invite_service").html("from Facebook");
        $("#aw_js_invite_image").attr('src', 'http://graph.facebook.com/' + fbid_resp_data.id + '/picture?type=square');
        $("#aw_js_invite_uid").val( fbid_resp_data.id );
        $("#aw_js_invite_service").val( "facebook" );
      }
    });
  }else if( service == "twitter" ){
    var url = 'https://api.twitter.com/1/users/lookup.json?screen_name=' + id + '&callback=?';
    var details = {};
    
    $.getJSON(url, function(tw_resp_data){
      if(tw_resp_data[0].id){
        $("#aw_js_prefetched_info_section").show();
        $("#aw_js_invite_name").html(tw_resp_data[0].name);
        $("#aw_js_invite_service").html("from Twitter");
        $("#aw_js_invite_image").attr('src', tw_resp_data[0].profile_image_url);
        $("#aw_js_invite_uid").val( tw_resp_data[0].id_str );
        $("#aw_js_invite_service").val( "twitter" );
      }
    });
  }
}

/*************************************************/
function aw_api_srv_resp_aw_internal_invite(){
  $("#aw_js_invite_name").html();
  $("#aw_js_invite_image").attr('src', '');
  $("#aw_js_invite_uid").val( '' );
  $("#aw_js_invite_from_facebook").val( '' );
  $("#aw_js_prefetched_info_section").hide();
}
/**************************************************/
/*
 *
 *
 */
function aw_process_invite_request(){
  $.ajax({

            url: '/invites/create_new.json', 
            type: 'POST',
            data: {  
                    id: $("#aw_js_invite_uid").val(),
                    service: $("#aw_js_invite_service").val()
                  },
            dataType: 'json',
            success: function (data) {
              $("#aw_js_server_status").html(JSON.stringify(data));
              $("#aw_js_server_status").show();

          },
          error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_console_log("error",
                              "aw_process_invite_request:  Server request failed for "  
                              +  " error: " + errorThrown + " status:" + textStatus);   
            
           
        }
    });
}
/************************************************/
/*
 *
 *
 */
function aw_process_enable_service_request(){
  $.ajax({

            url: '/invites/backdoor_enable_service.json', 
            type: 'POST',
            data: {  
                    id: $("#aw_js_invite_uid").val(),
                    service: $("#aw_js_invite_service").val()
                  },
            dataType: 'json',
            success: function (data) {
              $("#aw_js_server_status").html(JSON.stringify(data));
              $("#aw_js_server_status").show();

          },
          error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_console_log("error",
                              "aw_process_invite_request:  Server request failed for "  
                              +  " error: " + errorThrown + " status:" + textStatus);   
            
           
        }
    });
}

/***********************************************/
/*
 *
 *
 */
function aw_force_inject_job(){
   $.ajax({

            url: '/invites/force_inject_job_for_user.json', 
            type: 'POST',
            data: {  
                    id: $("#aw_js_invite_uid").val(),
                    service: $("#aw_js_invite_service").val()
                  },
            dataType: 'json',
            success: function (data) {
              $("#aw_js_server_status").html(JSON.stringify(data));
              $("#aw_js_server_status").show();

          },
          error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_console_log("error",
                              "aw_process_invite_request:  Server request failed for "  
                              +  " error: " + errorThrown + " status:" + textStatus);   
            
           
        }
    });
}
/************************************************/
/*
 *
 *
 *
 */
$(document).ready(function(){
  $("#aw_js_facebook_invite_prefetch_btn").click(function(){
    aw_preprocess_invite_request("facebook", $("#aw_js_facebook_invite").val());
  });

  $("#aw_js_twitter_invite_prefetch_btn").click(function(){
    aw_preprocess_invite_request("twitter", $("#aw_js_twitter_invite").val());
  });

  $("#aw_js_invite_btn").click(function(){
    aw_process_invite_request();
  });

  $("#aw_js_inject_job_btn").click(function(){
    aw_force_inject_job();
  });

  $("#aw_js_enable_service_btn").click(function(){
    aw_process_enable_service_request();
  });

});


