
function append_location_streams(){
   var current_user_id=$('#session_owner_id').attr("value");
   var location_id=$('#location_id').attr("value");
   var more_location_streams_cookie = $("#more_location_streams_cookie").val();
   $.ajax({
        url: '/home/get_location_stream.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: { location_id:location_id, updated_at:more_location_streams_cookie},
        success: function (data) {
        //alert(JSON.stringify(data));
        // if rails demands a redirect because of log in missing
        /******************************************************/
          
        var url;
        if (data.type == 2){
            url = "http://maps.googleapis.com/maps/api/staticmap?center="+data.lat+","+data.long+"&zoom=12&size=400x400&sensor=false";
        }
        else if(data.type == 3){
            url = get_location_image_for_type(data.type);
        }
        else{
            url = "/images/rails.png";
        }
        
        /******************************************************/
          var header_html=   '<div class="p-awp-location-name">' +
                                '<span >' +
                                  data.name +
                                '</span>' +
                             '</div>' +
                            //'<img class="locations_box_images" src="' + get_location_image_for_type(data.type) +  '" height="40" width="40" />'
                            '<img class="locations_box_images" id="loc_page_img" src="' +url+  '" style="width:250px;height:200px;"/>'
                            ;
           $('#location_stream_header').html(header_html);
           $.each(data.stream, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_location_streams_cookie").val(stream.post.time);
            } 
          });
          
          $(".js_location_hide").hide();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });
}


function show_all_on_location(){
  $("#channels_left_side_bar").fadeIn();
  append_location_streams();
  
}


$(document).ready(function(){

  $("#more_location_streams").click(function(){
    append_location_streams();
  });

});

