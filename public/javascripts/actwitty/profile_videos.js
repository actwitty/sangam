/****************************************************/
/*
 *
 *
 */
function get_or_create_a_video_box(box_id, stream){
  var small_box_id = 'video_box_' + stream.document.activity_id;
  var div =  $("#" + box_id);
  var small_div = $("#" + small_box_id);
  if( small_div.length == 0 ){
    var str = aw_lib_get_trim_name( stream.word.name, 45);
    var html = '<div class="p-st-docs-per-activity" id="' + small_box_id + '">' +
                   '<div class="p-awp-stream-post-info">' +
                      '<div class="p-awp-channel">'+
                        '<div class="p-awp-channel-desc">'+
                          '<label class="p-awp-channel-label">CHANNEL : </label>'+
                          '<a href="/channel_page?channel_id=' +  stream.word.id + '">' +
                          '<p class="p-awp-channel-name">' + str + '</p>'+
                          '</a>' +
                        '</div>'+
                      '</div>'+
                      '<div class="p-awp-stream-post-author-section">'+
                        '<a href="/home/show?id=' +  stream.user.id + '" >' +
                        '<div class="p-awp-post-author">'+
                          '<div class="p-awp-post-author-img">'+
                            '<img src="' + stream.user.photo + '" alt="" />' +
                          '</div>'+
                          '<div class="p-awp-post-author-name">'+
                            '<span>' + stream.user.full_name + '</span>'+
                          '</div>'+
                        '</div>'+
                        '</a>'+
                      '</div>'+
                   '</div>'+  
                   
                   '<div class="p-st-docs-list-view-post">' +
                    '<a href="/view?id=' + stream.document.activity_id + '">Goto Post</a>' +
                   '</div>' +

                   '<div style="z-index:1;" class="p-awp-view-video-attachment">' +
                   '</div>' +
            '</div>';
    
    
              
    div.append(html);
    small_div = $("#" + small_box_id);
  }

  return small_div;

}

function append_video_docs(box_id, stream){
  var div_internal = get_or_create_a_video_box(box_id, stream);
    var caption = "";
    if(stream.document.caption && stream.document.caption.length){
      caption = stream.document.caption;
    }
  
    var div_video = div_internal.find(".p-awp-view-video-attachment"); 
    var html=getEmbeddedPlayer( stream.document.url, 180, 240);
    div_video.append(html);

}

function show_all_videos(){
   var more_cookie = $("#more_streams_videos_cookie").val();
   var scroll = $(window).scrollTop();
   $.ajax({
        url: '/home/get_document_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {
                 user_id:aw_lib_get_page_owner_id(),
                 filter : get_filter(),
                 updated_at : more_cookie,
                 page_type:aw_get_stream_scope(),
                 category : "video",
                 cache_cookie:aw_lib_get_cache_cookie_id()
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing
          if (data.length){
             $.each(data, function(i,stream){
              if( stream ){
                  
                  append_video_docs("streams_videos_list", stream);
                  $("#more_streams_videos_cookie").val(stream.time);
              } 
            });
             $(window).scrollTop(scroll);
          }else{
            if( more_cookie.length == 0){
              $("#streams_videos_list").html("<br/> <br/> No videos to show");
            }
            aw_lib_alert('No videos to display');
          }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting videos. \n ActWitty is trying to solve.');
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
     $('#more_streams_videos').click(function() {
        aw_lib_console_log("debug", "more videos clicked on streams page");
        show_all_videos();
        return false;
    });
});
