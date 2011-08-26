
function aw_notify_profile_image(main, thumb){
  var post_json = { 
                      word : 'ProfilePic',
                      enrich : true,
                      source_name:"actwitty",
                      text : "changed the profile picture.",
                      documents:[{url:main, thumb_url:thumb, caption:"Profile Picture"}]
                    };
  post_activity_to_server(post_json, false, true);

  $("#profile_profile_photo_l").val(main);   
  $("#profile_profile_photo_s").val(thumb);
  $("#user_settings_image").attr("src", main);
}
