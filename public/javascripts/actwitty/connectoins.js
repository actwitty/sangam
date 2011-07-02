/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */
function renderFriends(json){
  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var html ='<li id=' + user_data.user.id  +  ' class="user_stamp">' +
                    '<a href="/users/' +  user_data.user.id + '" class="link_user_stamp user_stamp">' +
                      '<img src="' + user_data.user.photo_small_url + '" alt="" class="img_stamp user_stamp" >' +
                           user_data.user.full_name + 
                      '</img>'+
                    '</a>'+ 
                  '</li>';
        $('#friends_list').append(html);
          
      }
  });

  $('#friends_side_title').text('All (' +  $('#friends_list li').size() + ') Friends' );
}

/*
 * Render pending friend requests
 */
function renderPendingRequests(json){
  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var html ='<li id=' + user_data.user.id  +  ' class="user_stamp">' +
                    '<a href="/users/' +  user_data.user.id + '" class="link_user_stamp user_stamp">' +
                      '<img src="' + user_data.user.photo_small_url + '" alt="" class="img_stamp user_stamp" >' +  
                        user_data.user.full_name + 
                      '</img>'+
                    '</a>'+ 
                    '<div>' +
                      '<input type="button" value="Accept" class="friend_accept" id="' + user_data.user.id  + '"/>' + 
                      '<input type="button" value="Reject" class="friend_accept" id="' + user_data.user.id  + '"/>' + 
                    '</div>'+
                  '</li>';
        $('#pending_request_list').append(html);
          
      }
  });
  $('#pending_side_title').text('All (' +  $('#pending_request_list li').size() + ') Pending Requests' );
}

/*
 * Invoke on page load
 */
$(document).ready(function(){

    var friends_json=null;
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
          //TODO: try to use this in search, why should search hit server, again and again
          friends_json=data;
        },
        error: function (error) {

        }
    });


    /********************************************************************************************/
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



    /********************************************************************************************/
    /** General functions to support auto complete based search **/
    function format(user) {
		  return '<img alt="" class="img_stamp user_stamp" src="'+ user.photo_small_url + '">   ' + user.full_name + "</img>";
	  }

    function getID(user){
      return user.id;
    }

    /********************************************************************************************/
    /*
     * Friends search
     */
	  $("#searchfriends").autocomplete('/contacts/friends', {
		  multiple: false,
      //cacheLength:1000,
		  dataType: "json",
        parse: function(data) {
        return $.map(data, function(row) {
          return {
            data: row.user,
            value: row.user.full_name,
            result: row.user.full_name
          }
        });
      },
      formatItem: function(item) {
        return format(item);
      }
    }).result(function(e, item) {
        //$("#content").append("<p>selected " + format(item) + "</p>");
        window.location.href = '/users/' +  getID(item);
    });

    /********************************************************************************************/
    /*
     * Search all
     */
    $("#searchall").autocomplete('/contacts/search', {
		  multiple: false,
      //cacheLength:1000,
		  dataType: "json",
        parse: function(data) {
        return $.map(data, function(row) {
          return {
            data: row.user,
            value: row.user.full_name,
            result: row.user.full_name
          }
        });
      },
      formatItem: function(item) {
        return format(item);
      }
    }).result(function(e, item) {
        //$("#content").append("<p>selected " + format(item) + "</p>");
        window.location.href = '/users/' +  getID(item);
    });

});


/********************************* READY ENDS HERE ******************************************/
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


