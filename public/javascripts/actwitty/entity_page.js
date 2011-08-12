
function append_entity_streams(){
   var current_user_id=$('#session_owner_id').attr("value");
   var entity_id=$('#entity_id').attr("value");
   var more_entity_streams_cookie = $("#more_entity_streams_cookie").val();
   $.ajax({
        url: '/home/get_entity_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: { entity_id:entity_id, updated_at:more_entity_streams_cookie},
        success: function (data) {
          // if rails demands a redirect because of log in missing
           var header_html = '<img class="locations_box_images" src="' + data.image +  '?maxwidth=150&maxheight=150" height="150" width="150" />';
           $('#entity_stream_header').html(header_html);
           $.each(data.stream, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_entity_streams_cookie").val(stream.post.time);
            } 
          });
          
          $(".js_entity_div_show").hide();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


function show_all_on_entity(){
  $("#entitys_left_side_bar").fadeIn();
  append_entity_streams();
  
}


$(document).ready(function(){

  $("#more_entity_streams").click(function(){
    append_entity_streams();
  });

});

