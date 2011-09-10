
function single_post_initializer(){
  var post_id=$('#post_id').attr("value");
  var current_user_id=$('#session_owner_id').attr("value");
  
  $.ajax({
        url: '/home/get_single_activity.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {
                activity_id:post_id
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           $.each(data, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
            } 
          });

            /* set up polling for checking enriching */
            setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}
