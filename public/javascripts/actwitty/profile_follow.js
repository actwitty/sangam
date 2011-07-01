

$(document).ready(function(){
  var owner_id=$('#page_owner_id').attr("value");

   $('#follow_button').live("click",function(){
      btn = $(this);
      if( $(this).val() == 'Follow' ) {
       post_url="/contacts/follow";
      }else{
       post_url="/contacts/unfollow";
      }
      $.ajax({
        url: post_url,
        type: 'POST',
        data: { "friend_id" :  owner_id },
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


  

