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

function aw_publish_drafted_stream(post_id){
  var stream_render_id = get_stream_ele_id(post_id);
  $.ajax({
    url: '/home/publish_activity.json',
    type: 'POST',
    data: {activity_id:post_id},
    dataType: 'json',
    success: function (data) {
      if(data && data.post && data.post.status == 2){
        $("#" + stream_render_id).empty().remove();
      }
    },
    error:function(XMLHttpRequest,textStatus, errorThrown) {
      alert('There has been a problem in publishing the stream. \n ActWitty is trying to solve.');
    }
  });
}

function aw_edit_drafted_stream(post_id){
  /* Go into edit mode */
  var stream_render_id = get_stream_ele_id(post_id);
  $("#" + stream_render_id).empty().remove();
  window.open("/home/edit_box?post_id=" + post_id, 'Actwitty Edit Post');
}

/*
 * Execute on load
 */
$(document).ready(function(){
  $(' #cont-typ-fltr-drafts').click(function(){
    window.location = "/home/drafts";
  });

});
