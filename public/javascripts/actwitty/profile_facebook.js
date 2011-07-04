/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */
function renderFacebookers(json){

  var invite_html = '<ul id="invite_list" class="modal_fb_ul">' +
                    '</ul>';
  
  var follow_html = '<ul id="follow_list" class="modal_fb_ul">' +
                    '</ul>';

  var unfollow_html = '<ul id="unfollow_list" class="modal_fb_ul">' +
                    '</ul>';

  $("#facebook-dialog-modal").append(invite_html);  
  $("#facebook-dialog-modal").append(follow_html);  
  $("#facebook-dialog-modal").append(unfollow_html);  

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
        var html="";
        if (!data.user_id){
          html ='<li id="' + li_id  +  '" class="user_stamp">' +
                    '<img src="' + data.image + '" alt="" >' + 
                      data.name +
                    '</img>'+
                    '<input type="button" value="Invite" class="fb_invite" id="' + data.uid + '"/>' +    
                '</li>';   

          $('#invite_list').append(html);
        }else{
          html ='<li id="' + li_id  +  '" class="user_stamp">' +
                  '<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
                    '<img src="' + data.image + '" alt="" class="img_stamp user_stamp" >' +
                      data.name + 
                    '</img>'+
                  '</a>'+ 
                  '<input type="hidden" id="user_nav_' +  data.user_id + '_hidden" value="' +  data.user_id + '"/>'; 
                '</li>';
          if (data.status == "Follow"){
            $('#follow_list').append(html);
            var html = '<input type="button" class="follow_button" value="Un-Follow" id="follow_btn_' + data.user_id + '" />';
            $('#' + li_id).append(html);

          }else{
            $('#unfollow_list').append(html);
            var html = '<input type="button" class="follow_button" value="Follow" id="follow_btn_' + data.user_id + '" />';
            $('#' + li_id).append(html);
          }
        }


      
        var html = '<input type="hidden" value="' + data.user_id + '" id="follow_btn_' + data.user_id + '_user_id" />';
        $("#" + li_id).append(html);
          
      }
  });

}


/* Global data */
/*
 * Invoke on page load
 */
function get_all_facebookers(){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/facebook/facebook_friends_list',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderFacebookers(data);
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });
}

  
/********************************************************************************************/
$(document).ready(function(){
 
  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    modify_filter({});

    $("#facebook-dialog-modal").dialog('close');
    window.location.href = "/home/show?id=" + user_id;
  });


  $('.fb_invite').live('click', function () {
    var dataString = 'provider=facebook&uid=' + $(this).attr('id');
    $.ajax({
      url:  '/facebook/invite',
      type: 'POST',
      data: dataString
    });
    $(this).closest('li').remove();
  });
 

});


/********************************* READY ENDS HERE ******************************************/



