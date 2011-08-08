// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults




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

