/*
 * Home page friends related jqueries
 *
 */

/*
 *
 * Render friends 
 */
/*
 
function renderFollowers1(json){
  var search_html = '<input type="text" id="search_followers" placeholder="Followers"/>';
  $("#follower-dialog-modal").append(search_html);
   var html = '<div id="main" >' +
              '</div>';

  
  $("#follower-dialog-modal").append(html);
 
  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followers_li_" + user_data.user.id;
    	var html= '<div id="' + li_id  +  '">' +
	'<div id="ex1" >' +
            '<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
		'<div id="outer">' +
			'<img class="img" src="'+  user_data.user.photo_small_url  +'" height="55" width="50" align="left">'+
  		'</div>' +
		'<div id="txtdiv">' + 
			'<span id="txt">' +user_data.user.full_name + '</span>' +
		'</div>'+
            '</a>'+ 
        '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>'+
	'</div>'+
	'</div>';



        
	  $('#main').append(html);

      if (user_data.user.following){
   	    var html = '<div id="inner">'+
		'<input type="button" class="follow_button" value="UF1" id="follow_btn_' + user_data.user.id + '" />' +
		'</div>';
	
           $("#" + li_id + " " + "#ex1").append(html);

        }else{
           var html =  '<div id="inner">'+
		'<input type="button" class="follow_button" value="UF1" id="follow_btn_' + user_data.user.id + '" />' + 
		'</div>';
           $( "#" + li_id + " " + "#ex1" ).append(html);
        }

        var html = '<input type="hidden" value="' +user_data.user.id + '" id="follow_btn_' + user_data.user.id + '_user_id" />';
        $("#" + li_id).append(html);
          
      }
  });

}
 
 
 */
function renderFollowers(json){
  //var search_html = '<input type="text" id="search_followers" placeholder="Followers"/>';
  //$("#follower-dialog-modal").append(search_html);
   var html = '<ul id="followers_list" class="modal_friends_ul sc_menu1">' +
             '</ul>';

  
  $("#follower_friends").append(html);
  var html = '<div id="profile_followers_list">' + '</div>';

  
  $("#followers_list").append(html);
  

  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followers_li_" + user_data.user.id;
    	var html= '<div id="' + li_id  +  '">' +
	'<div id="ex1" >' +
            '<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
		'<img class="img" src="'+  user_data.user.photo_small_url  +'" height="55" width="50" align="left">'+
		'<div id="txt1">' + user_data.user.full_name + '</div>'+
            '</a>'+ 
            '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>'+
	'</div>'+
	'</div>';



	$('#profile_followers_list').append(html);

      if (user_data.user.following){
   	    var html = '<div id="inner">'+
		'<input type="button" class="follow_button" height="25" width="20" value="Unfollow" id="follow_btn_' + user_data.user.id + '" />' +
		'</div>';
	
           $("#" + li_id + " " + "#ex1").append(html);

        }else{
           var html =  '<div id="inner">'+
		'<input type="button" class="follow_button" height="25" width="20" value="Follow" id="follow_btn_' + user_data.user.id + '" />' + 
		'</div>';
           $( "#" + li_id + " " + "#ex1" ).append(html);
        }

        var html = '<input type="hidden" value="' +user_data.user.id + '" id="follow_btn_' + user_data.user.id + '_user_id" />';
        $("#" + li_id).append(html);
      }
  });
}



/* Global data */
var json_followers_data;
var ignore_follower_auto_complete = false;

/*
 * Invoke on page load
 */
function get_all_followers(){
    /*
     * Get data on ready
     */
    /*alert("followers");*/
    $.ajax({
        url: '/contacts/followers',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderFollowers(data);
            json_followers_data=data;
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
//alert("Inside profile_followers.js ready");
 $("#search_followers").live('keyup.autocomplete', function() {
   //TODO: check why JSON is not working here
    $(this).autocomplete('/contacts/followers', {
      multiple: false,
      delay: 0,
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
      },

    }).result(function(e, item) {
      if (ignore_follower_auto_complete == false){
          /* filter change transaction */
          reset_filter();

          $("#follower-dialog-modal").dialog('close');
          ignore_follower_auto_complete = true;
          window.location.href = "/home/show?id=" + getID(item);
        }
    });
  });

  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    reset_filter({});

    $("#follower-dialog-modal").dialog('close');
    window.location.href = "/home/show?id=" + user_id;
  });


  $('#flwr_friends').click(function(){
     alert("flwr_friends");
     get_all_followers();
     $('#empty_check').hide();
  });

  if ($('#follower_friends').children().size() > 1)
  {
      $('#empty_check').hide();
  }
  else
  {
      $('#empty_check').show();
  }
 

});


/********************************* READY ENDS HERE ******************************************/



