
function append_channel_streams(){
   var current_user_id=$('#session_owner_id').attr("value");
   var channel_id=$('#channel_id').attr("value");
   var more_channel_streams_cookie = $("#more_channel_streams_cookie").val();
   $.ajax({
        url: '/home/get_activity_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: { word_id:channel_id, updated_at:more_channel_streams_cookie},
        success: function (data) {
          // if rails demands a redirect because of log in missing
           var header_html = '<div class="p-awp-channel">' +
                              '<div class="p-awp-channel-desc">' +
                                '<label class="p-awp-channel-label">'  +
                                  'Channel:' +
                                '</label>' +
                                '<span class="p-awp-channel-name">' +
                                  data.name +
                                '</span>' +
                              '</div>' +
                            '</div>';
           $('#channel_stream_header').html(header_html);
           $.each(data.stream, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_channel_streams_cookie").val(stream.post.time);
            } 
          });
          
          $(".js_channel_div_show").hide();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


function show_all_on_channel(){
  $("#channels_left_side_bar").fadeIn();
  append_channel_streams();
  
}


$(document).ready(function(){

  $("#more_channel_streams").click(function(){
    append_channel_streams();
  });

});
