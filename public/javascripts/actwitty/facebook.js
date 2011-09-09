
/*
 * Render friends on the main facebook friends page *
 * 
 */
function renderFriends(json){
   $.each(json, function(i,contact){
     if ($.trim(contact.status) == 'friend'){
          var html ='<li id=' + contact.uid  +  '>' +
            '<img src="' + contact.image + '" alt="" ><br>' + contact.name + '</img>'+
            
            '</li>';
        $('#fb_friends').append(html);
      }
      else{
        if ($.trim(contact.status) == 'request'){
           var html ='<li id=' + contact.uid  +  '>' +
            '<img src="' + contact.image + '" alt="" ><br>' + contact.name + '</img>'+
            '<p>' +
              '<input type="button" class="fb_request" value="Request" id="' + contact.uid + '"/>' +    
            '</p>' +
            '</li>';
          $('#fb_friend_suggests').append(html);
        }else{
          if ($.trim(contact.status) == 'invite'){
           var html ='<li id=' + contact.uid  +  '>' +
            '<img src="' + contact.image + '" alt="" ><br>' + contact.name + '</img>'+
            '<p>' +
              '<input type="button" value="Invite" class="fb_invite" id="' + contact.uid + '"/>' +    
            '</p>' +
            '</li>';
            $('#fb_invites').append(html);
          }
        }
      }

    }); 

}

/*
 ****************************************
 */
function aw_facebook_initialize_page(){
    /*
     * Get data on ready
     */
    alert("into init");
    /*$.ajax({
        url: '/facebook/facebook_friends_list',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderFriends(data);
          }
        },
        error: function (error) {

        }
    });*/
}

/*
 * Invoke on page load
 */
$(document).ready(function(){

  /****************************************/
  /*
  * Request a friend from facebook to join in to actwitty
  */
  $('.fb_request').live('click', function () { 
      var dataString = 'provider=facebook&uid=' + $(this).attr('id');
      $.ajax({
        url:  '/contacts/provider_add',
        type: 'POST',
        data: dataString,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
          }
        },
        error: function (error) {

        }
      });
      $(this).closest('li').remove();
  });

  
  /****************************************/
  /*
  * Invoke on FB invitation to a friend from facebook
  */
  $('.fb_invite').live('click', function () {
    var dataString = 'provider=facebook&uid=' + $(this).attr('id');
    $.ajax({
        url:  '/facebook/invite',
        type: 'POST',
        data: dataString
      });
    $(this).closest('li').remove();
  });
  
  /****************************************/
  $('.fb_visit').live('click', function () { 
    alert($(this).attr('id')+ "VISIT"); 
    $(this).closest('li').remove();
  });

});


