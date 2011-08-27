// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function append_summary(box_id, summary){
  var users_div = $("#" + box_id);

  var html = '<div class="main_users_single_user" >' +
                '<img src="' + summary.user.photo + '" width=40 height=40 />' +
                '<div id="summary_box_' + summary.id + '" class="main_summary_box" >' +
                '</div>' +
             '</div>';

  users_div.append(html);

  create_and_add_summary($('#summary_box_' + summary.id),summary, "no_hide"); 
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
              append_summary("latest_summary_box", summary);
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
    $(".actwittysignup").live('click', function() {
      var auth_key = $('#foreign_auths').find('input[name="auth_key"]').val();
      var auth_uid =  $('#foreign_auths').find('input[name="auth_uid"]').val();
      var auth_provider =$('#foreign_auths').find('input[name="auth_provider"]').val();
      $(this).closest('form').find('input[name="user[provider]"]').val(auth_provider);
      $(this).closest('form').find('input[name="user[key]"]').val(auth_key);
      $(this).closest('form').find('input[name="user[uid]"]').val(auth_uid);

      $.ajax({
        url: "/users",
        type: 'POST',
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


  $(".actwittysignin").live('click', function() {
      var auth_key = $('#foreign_auths').find('input[name="auth_key"]').val();
      var auth_uid =  $('#foreign_auths').find('input[name="auth_uid"]').val();
      var auth_provider =$('#foreign_auths').find('input[name="auth_provider"]').val();
      $(this).closest('form').find('input[name="user[provider]"]').val(auth_provider);
      $(this).closest('form').find('input[name="user[key]"]').val(auth_key);
      $(this).closest('form').find('input[name="user[uid]"]').val(auth_uid);

      $.ajax({
        url: "/users/sign_in",
        type: 'POST',
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


