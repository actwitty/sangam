// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function append_summary(box_id, summary){
  var users_div = $("#" + box_id);
  //alert(summary.user.full_name);
  var html = '<div class="main_users_single_user" >' +
                '<img src="' + summary.user.photo + '" width=50 title="' + summary.user.full_name + '"/>' +
                '<div id="summary_box_' + summary.id + '" class="main_summary_box" >' +
                '</div>' +
             '</div>';

  users_div.append(html);

  //create_and_add_summary($('#summary_box_' + summary.id),summary, "no_hide"); 
  create_and_add_mainpage_summary($('#summary_box_' + summary.id),summary);
}

function get_latest_summary(){
   $.ajax({

            url: '/home/get_latest_summary.json',
            type: 'GET',
            data: {},
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              // if rails demands a redirect because of log in missing 
            $.each(data, function(i,summary){
              // restricting number of users on main page summary section to 20
              if(i<20){
                append_summary("latest_summary_box", summary);
              } else {
                return;
              }
            });


        },
        error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
        }
    });
}

function main_page_sign_in_initializer(){
  get_latest_summary();
}


$(document).ready(function(){
    $("#signupbutton").live('click', function() {
      var auth_key = $('#user_key').val();
      var auth_uid =  $('#user_uid').val();
      var auth_provider = $('#user_provider').val();
      $('input[name="user[provider]"]').val(auth_provider);
      $('input[name="user[key]"]').val(auth_key);
      $('input[name="user[uid]"]').val(auth_uid);

      $.ajax({
        url: "/users",
        type: 'POST',
        dataType:"script",
        data: $(this).closest('form').serialize() ,
        beforeSend: function(){
          $('#LoadingDiv').css('display','block'); 
        },
        success: function(data){
          $('#LoadingDiv').css('display','none');
        },
      });
      return false;
  });


  $("#signinbutton").live('click', function() {
      var auth_key = $('#user_key').val();
      var auth_uid =  $('#user_provider').val();
      var auth_provider =$('#user_uid').val();
      $('input[name="user[provider]"]').val(auth_provider);
      $('input[name="user[key]"]').val(auth_key);
      $('input[name="user[uid]"]').val(auth_uid);

      $.ajax({
        url: "/users/sign_in",
        type: 'POST',
        dataType:"script",
        data: $(this).closest('form').serialize() ,
        beforeSend: function(){
          $('#LoadingDiv').css('display','block'); 
        },
        success: function(data){
          $('#LoadingDiv').css('display','none');
        },
      });
      return false;
    });
   

  });


