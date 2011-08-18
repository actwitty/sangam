

function show_all_drafts(){
   var more_cookie = $("#more_streams_drafts_cookie").val();
   $.ajax({
        url: '/home/get_draft_activities.json',
        type: 'GET',
        dataType:"json",
        cache: false,
        data: {
                 filter : get_filter(),
                 updated_at : more_cookie,
                 cache_cookie:aw_lib_get_cache_cookie_id()
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing
          if (data.length){
             $.each(data, function(i,stream){
              if( stream ){
                  
                  create_and_add_stream($("#streams_drafts_list"), stream, aw_lib_get_session_owner_id());
                  $("#more_streams_drafts_cookie").val(stream.post.time);
              } 
            });
             $(window).scrollTop(scroll);
          }else{
            if( more_cookie.length == 0){
              $("#streams_drafts_list").html("<br/> <br/> No drafts to show");
            }
            aw_lib_alert('No drafts to show');
          }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });

}
var g_aw_reedit_mode = 0;
function aw_get_reedit_mode(){
  return g_aw_reedit_mode;
}

function aw_edit_drafted_stream(post_id){
  /* Go into edit mode */
  var stream_render_id = get_stream_ele_id(post_id);
  $("#" + stream_render_id).empty().remove();
  g_aw_reedit_mode = 1;
  init_edit_box(post_id);
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
      aw_lib_alert('There has been a problem in publishing the stream. \n ActWitty is trying to solve.');
    }
  });
}



/*
 * Add the live bindings
 */
$(document).ready(function(){
    /*
     * Bind click to more on streams tab
     */
     $('#more_streams_drafts').click(function() {
        aw_lib_console_log("debug", "more drafts clicked on streams page");
        show_all_drafts();
        return false;
    });
});
