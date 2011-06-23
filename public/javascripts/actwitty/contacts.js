

/*
 * Render friends 
 */
function renderFriends(json){
  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var html ='<li id=' + user_data.user.id  +  '>' +
            '<a href="/users/' +  user_data.user.id + '">' +
            '<img src="' + user_data.user.photo_small_url + '" alt="" ><br>' +  user_data.user.full_name + '</img>'+
            '</a>'+
            
            '</li>';
        $('#friends_list').append(html);
          
      }
  }); 
}

/*
 * Render pending friend requests
 */
function renderPendingRequests(json){
  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var html ='<li id=' + user_data.user.id  +  '>' +
            '<a href="/users/' +  user_data.user.id + '">' +
              '<img src="' + user_data.user.photo_small_url + '" alt="" ><br>' +  user_data.user.full_name + '</img>'+
            '</a>'+ 
            '<div>' +
              '<input type="button" value="Accept" class="friend_accept" id="' + user_data.user.id  + '"/>' + 
              '<input type="button" value="Reject" class="friend_accept" id="' + user_data.user.id  + '"/>' + 
            '</div>'+
            '</li>';
        $('#pending_request_list').append(html);
          
      }
  }); 
}

/*
 * Invoke on page load
 */
$(document).ready(function(){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/contacts/friends',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderFriends(data);
          }
        },
        error: function (error) {

        }
    });


    $.ajax({
        url: '/contacts/pending_friend_requests',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderPendingRequests(data);
          }
        },
        error: function (error) {

        }
    });
});




/*
 * Request a friend from facebook to join in to actwitty
 */
$('.friend_accept').live('click', function () { 
    var dataString = 'friend_id=' + $(this).attr('id') + '&friend_req=' + $(this).attr('value');
    closest_div = $(this).closest('div');
    closest_li =  $(this).closest('li');
    request_resp = $(this).attr('value')
    $.ajax({
      url:  '/contacts/accept',
      type: 'POST',
      data: dataString,
      success: function (data) {
      if (request_resp == 'Accept') {
         closest_div.remove();
         closest_li.appendTo('#friends_list');
       }else{
        closest_li.remove();

       }
      },
      error: function (error) {

      }
    });
   
});


