function show_all_drafts(){
   var current_user_id=$('#session_owner_id').attr("value");
   $.ajax({
        url: '/home/get_draft_activities.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {},
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           $.each(data, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
            } 
          });
            
          ("#channels_left_side_bar").fadeIn();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}

/*
 * Execute on load
 */
$(document).ready(function(){
  $(' #cont-typ-fltr-drafts').click(function(){
    alert("i m in");
    window.location = "/home/drafts";
  });

});
