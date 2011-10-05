
function aw_notify_profile_image(main, thumb){
  var post_json = { 
                      word : 'ProfilePic',
                      enrich : true,
                      source_name:"actwitty",
                      text : "changed the profile picture.",
                      status:2,
                      documents:[{url:main, thumb_url:thumb, caption:"Profile Picture"}]
                    };
  post_activity_to_server(post_json, false, true);

  $("#profile_profile_photo_l").val(main);   
  $("#profile_profile_photo_s").val(thumb);
  $("#user_settings_image").attr("src", thumb);
}


function preview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    
    var scaleX = 100 / selection.width;
    var scaleY = 100 / selection.height;

    $('#user_settings_image_snap img').css({
        width: Math.round(scaleX * 50),
        height: Math.round(scaleY * 50),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });

    $('#x1').val(selection.x1);
    $('#y1').val(selection.y1);
    $('#x2').val(selection.x2);
    $('#y2').val(selection.y2);
    $('#w').val(selection.width);
    $('#h').val(selection.height);    
}

aw_user_image_selector_init() {
    $('#user_settings_image').imgAreaSelect({ aspectRatio: '1:1', handles: true,
        fadeSpeed: 200, onSelectChange: preview });
};

