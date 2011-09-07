/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */
function renderFollowings(json){
  //var search_html = '<input type="text" id="search_followings" placeholder="Followings"/>';
  //$("#following-dialog-modal").append(search_html);
  var html = '<div id="followings_list" class="modal_friends_ul sc_menu1">' +
             '</div>';
  
  $("#following_friends").append(html);
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#followings_list').append(inv_html);

  $("#all_subscribed").append(html);  

  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followings_li_" + user_data.user.id;
	var html= '<li class="lk"><div id="ex1" >' +
	'<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
		'<img class="img" src="' + user_data.user.photo_small_url + '" height="55" width="50" align="left">'+
		'<div id="txt1">' + user_data.user.full_name + '</div>'+
	'</a>' +
 
        '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>' + 

	'<div id="inner">'+
			'<input type="button" class="follow_button" height="25" width="25" value="Unfollow" id="follow_btn_' + user_data.user.id + '" />' +
	'</div>'+

	'</div></li>';   


        //$('#followings_list').append(html);
        $('#test').append(html);

        var html = '<input type="hidden" value="' +user_data.user.id + '" id="follow_btn_' + user_data.user.id + '_user_id" />';
        $("#" + li_id).append(html);
      }
  });

}


/* Global data */
var json_followings_data;
var ignore_following_auto_complete = false;

/*
 * Invoke on page load
 */
function get_all_followings(){
    /*
     * Get data on ready
     */
    alert("get_all_followings");
    $.ajax({
        url: '/contacts/followings',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderFollowings(data);
            json_followings_data=data;
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });
}

  
/********************************************************************************************/
/** General functions to support auto complete based search **/
function format(user) {
  return '<img alt="" class="img_stamp user_stamp" src="'+ user.photo_small_url + '">   ' + user.full_name + "</img>";
}

function getID(user){
  return user.id;
}

/********************************************************************************************/
$(document).ready(function(){
//alert("Inside profile_followings.js ready");



  $('#flwg_friends').click(function(){
     alert("flwg_friends");
     get_all_followings();
     $('#empty_check').hide();
  });

  if ($('#following_friends').children().size() > 1)
  {
      $('#empty_check').hide();
  }
  else
  {
      $('#empty_check').show();
  }
 
 

});


/********************************* READY ENDS HERE ******************************************/



