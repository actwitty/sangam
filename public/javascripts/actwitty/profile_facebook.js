/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */


function renderFacebookers(json){

  //alert(JSON.stringify(json));
  var invite_html = '<div id="invite"  class="fb_friends_lists">' +  '</div><br/>';
  var follow_html = '<div id="subscribe_new" class="fb_friends_lists">' + '</div><br/>';
  var unfollow_html = '<div id="existing_subscription" class="fb_friends_lists">'+ '</div><br/>';

  $("#invite_friends").append(invite_html);  
  $("#unsubscribed_friends").append(follow_html);  
  $("#subscribed_friends").append(unfollow_html); 

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
	      var html="";
        var str;
     
         if( data.name.length > 12 )
         {  
           var limit = 12;                
           str = data.name;        
           var strtemp = str.substr(0,limit); 
           str = strtemp+ '..' + '<span class="hide">' + str.substr(limit,str.length) + '</span>'; 
         }
         else
         {
           str = data.name;
         }

        if (!data.user_id){
          var html= '<div class="friends_box">' +
                      '<div id="' + li_id  +  '" class="user_stamp">' +
                          '<div class="fb_friend_image">' + 
	                          '<img class="img" src="' + data.image + '"  title="' + data.name + '" />'+
	                        '</div>'+
       	                  '<div class="fb_friend_text">' + 
                            '<p>' +  str  + '</p>'+
		                        '<a href="#" class="js_fb_invite fb_friend_action" id="' + data.uid + '"> Invite </a>' +
	                        '</div>'+
	                      '</div>' +
                      '</div>';

          $('#empty_check_invites').hide();
          $('#invite').append(html);
        }else{

          if (data.status == "Follow"){
             var html= '<div class="friends_box">' +
                        '<div id="' + li_id  +  '" class="user_stamp">' +
                          '<div class="fb_friend_image">' + 
	                          '<img class="img" src="' + data.image + '"  title="' + data.name + '" />'+
	                        '</div>'+
       	                  '<div class="fb_friend_text">' + 
                            '<p>' +  str  + '</p>'+
		                        '<a href="#" class="js_fb_subscribe fb_friend_action" id="' + data.user_id + '"> Subscribe </a>' +
	                        '</div>'+
	                       '</div>'+
                       '</div>';
            $('#empty_check_subscribes').hide();
            $('#subscribe_new').append(html);
          }else{
            var html= '<div class="friends_box">' +
                        '<div id="' + li_id  +  '" class="user_stamp">' +
                          '<div class="fb_friend_image">' + 
	                          '<img class="img" src="' + data.image + '"  title="' + data.name + '" />'+
	                        '</div>'+
       	                  '<div class="fb_friend_text">' + 
                            '<p>' +  str  + '</p>'+
		                        '<a href="#" class="js_fb_manage fb_friend_action" id="' + data.user_id + '"> Manage </a>' +
	                        '</div>'+
	                      '</div>' +
                      '</div>';
            $('#empty_check_subscribeds').hide();
            $('#existing_subscription').append(html);
	   
          }
        }
	
    }
  });

}


function append_invite_friends(){
  if ($('#invite').is(':empty'))
  {
      $('#invite').append('<h3>No friends To invite.</h3>');
  }
}
function append_follow_friends(){
  if ($('#follow').is(':empty'))
  {
      $('#follow').append('<h3>No friends To follow.</h3>');
  }
}
function append_unfollow_friends(){
  if ($('#unfollow').is(':empty'))
  {
     $('#unfollow').append('<h3>No friends To unfollow.</h3>');
  }
}


/* Global data */
/*
 * Invoke on page load
 */
var temp = 0;
function aw_fetch_facebook_friends(){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/facebook/facebook_friends_list',
        type: 'GET',
        data: { 'user_id' : aw_lib_get_page_owner_id()},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if( data && data.length){
            renderFacebookers(data);
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });
    return false;
   
}

  
/********************************************************************************************/
$(document).ready(function(){
  
  $(".js_fb_subscribe").live('click', function(){
     var user_id = $(this).attr('id'); 
     window.location.href = "/home/show?id=" + user_id;
  });


  $(".js_fb_manage").live('click', function(){
     var user_id = $(this).attr('id'); 
     window.location.href = "/home/show?id=" + user_id;
  });

  $('.js_fb_invite').live('click', function () {
    var dataString = 'provider=facebook&uid=' + $(this).attr('id');
    $.ajax({
      url:  '/facebook/invite',
      type: 'POST',
      data: dataString
    });
    $(this).closest('.friends_box').remove();
  });


  $('.js_add_facebook_friends').live('click',function(){
    window.location.href = "/home/facebook_friends";
  });
  
  return false;

});


/********************************* READY ENDS HERE ******************************************/




