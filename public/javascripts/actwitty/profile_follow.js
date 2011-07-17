

$(document).ready(function(){
   //alert("Inside profile_follow.js ready");
   $('.follow_button').live("click",function(){
      btn = $(this);
      friend_id = $("#" + btn.attr("id") + "_user_id").attr("value");
      if( $(this).val() == 'Follow' ) {
       post_url="/contacts/follow";
      }else{
       post_url="/contacts/unfollow";
      }
      $.ajax({
        url: post_url,
        type: 'POST',
        data: { "friend_id" :  friend_id },
        dataType: "json",
        success: function (data) {

            if(data && data.change_action){
             btn.val(data.change_action);
            }
            
        },
        error: function (error) {

        }
      });
    });


  }); /* ready ends here */


  

