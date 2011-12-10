function aw_notify_profile_image(main, thumb){

  // TODO : get the summary category from category.yml
  var post_json = { 
                    word : 'ProfileUpdate',
                    summary_category: 'stories',
                    text : aw_lib_get_page_owner_name() + ' has updated profile picture',
                    enrich : true,
                    //location:get_location_json(),
                    documents:[{url:main, thumb_url:thumb, caption:"Profile Picture"}],
                    campaign_types:get_campaigns(),
                    source_name:"actwitty",
                    fb: "false",
                    tw: "false"
                  };

   
  //alert(JSON.stringify(post_json));
  post_activity_to_server(post_json);

  
  $("#awppm_js_user_img_settings").attr("src", thumb);
  $("#awppm_js_user_profile_settings_profile_pic_url").val(thumb);
 
  $('#awppm_user_profile_change_profile_pic_submit').trigger('click'); 


  $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").hide();
  return true;
}













/*
 *
 *
 *
 */

function aw_api_spm_initialize_user_settings_page(){
  
  
  awppm_settings_page_elem_init();
  aw_api_spm_input_geo_location_initialize();
  if($("#awppm_user_settings_dob_input").length){
    $("#awppm_user_settings_dob_input").datepicker();
    $("#awppm_user_settings_dob_input").datepicker({ dateFormat: 'mm/dd/yyyy' });
  }


}








/*
 *  Do all sanity checks for password fields
 *
 */


function sanity_check_password()
{
  var new_pswd = $(".awppm_user_profile_settings_newpswd").val();
  var cnf_pswd = $(".awppm_user_profile_settings_cnfrmpswd").val();
  if(new_pswd == '' || cnf_pswd == '' || new_pswd != cnf_pswd)
    return false;
  if(new_pswd.length < 5)
    return false;
  if(new_pswd.match(/[0-9]/))
    return true;
  return false;
}

function pswd_mismatch()
{

}





/*
 *
 */
function awppm_settings_page_elem_init()
{
    $("#awppm_user_profile_settings_curpswd_error").hide();
    $("#awppm_user_profile_settings_newpswd_error").hide();
    $("#awppm_user_profile_settings_mismatchpswd_error").hide();

    $("#js_awppm_user_setting_oldpswd").val("");
    $("#js_awppm_user_setting_newpswd").val("");
    $("#js_awppm_user_setting_cnfrmpswd").val("");

    $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").hide();

    $("#awppm_user_profile_settings_user_name").attr("disabled", true); 
}




/*
 *
 *
 */
$(document).ready(function(){


    $("#awppm_user_profile_settings_save").live('click',function() {
      $('#aw_spm_user_settings_box').find(".aw_js_ppm_loading_animation").show();
      $("#settings_dob_str").val($("#awppm_user_settings_dob_input").val());
      return true;
    });

  


    // to first get the confirmation from the user
    $("#js_awppm_user_deactivate").live('click',function(){
      var answer = confirm("Are you sure, you want to deactivate your ActWitty account??");
      return answer;
    });  





    $("#js_awppm_profile_setting_pswd_chng").live('click',function(){
      var new_pswd = $(".awppm_user_profile_settings_newpswd").val();
      var cnf_pswd = $(".awppm_user_profile_settings_cnfrmpswd").val();
      if(new_pswd != cnf_pswd)
      {

        $("#awppm_user_profile_settings_mismatchpswd_error").show();
        return false;
      }
      if(sanity_check_password())
      {
        return true;
      }
      else
      {
        $("#awppm_user_profile_settings_newpswd_error").show();
        return false;
      }
    });
   

    
  
    
  
});


