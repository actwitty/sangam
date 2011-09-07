/*
 * Home page friends related jqueries
 *
 */

/*
 *
 * Render friends 
 */
/*
function renderFacebookers(json){
 
  var invite_html = '<div id="invite"  class="modal_fb_ul sc_menu1">' +  '</div><br/>';
  
  var follow_html = '<div id="follow" class="modal_fb_ul">' + '</div><br/>';

  var unfollow_html = '<div id="unfollow" class="modal_fb_ul">'+ '</div><br/>';

  $("#invite_friends").append(invite_html);  
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#invite').append(inv_html);
  
  
  $("#follow_friends").append(follow_html);  
  $("#unfollow_friends").append(unfollow_html); 

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
	      var html="";
        var str;
     
         //alert(data.name.length); 
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
        var html= '<li class="lk"><div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1">' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt1">' +  str  + '</div>'+
	'<div id="inner">'+
		'<input type="button"  height="25" width="25" value="Invite" class="fb_invite" id="' + data.uid + '"/>' +
	'</div>'+
	'</div>'+
	'</div></li>';


        $('#test').append(html);
        }else{
         html='<div id="' + li_id  +  '" class="user_stamp">' +
		'<div id="ex1">' +
			'<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
			       	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
				'<div id="txt1">' +  str + '</div>'+
			'</a>'+ 
			'<input type="hidden" id="user_nav_' +  data.user_id + '_hidden" value="' +  data.user_id + '"/>'+
     		'</div>'+
		'</div>';


          if (data.status == "Follow"){
            $('#follow').append(html);
      	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Unfollow" class="follow_button"   id="follow_btn_' + data.user_id + '" />' +
			'</div>';
	      $('#' + li_id + " " +  "#ex1").append(html);


          }else{
            $('#unfollow').append(html);
	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Follow" class="follow_button"  id="follow_btn_' + data.user_id + '" />' +
			'</div>';

            $('#' + li_id + " " + "#ex1").append(html);
	   
          }
        }


      
        var html = '<input type="hidden" value="' + data.user_id + '" id="follow_btn_' + data.user_id + '_user_id" />';
        $("#" + li_id).append(html);
	
    }
  });

}
*/
function renderFollowers(json){
  //var search_html = '<input type="text" id="search_followers" placeholder="Followers"/>';
  //$("#follower-dialog-modal").append(search_html);
   var html = '<div id="followers_list" class="modal_friends_ul sc_menu1">' +
             '</div>';

  
  $("#follower_friends").append(html);
  var inv_html = '<ul class="sc_menu1" id="test">' + '</ul>';
  $('#followers_list').append(inv_html);

  //var html = '<div id="profile_followers_list">' + '</div>';

  
  //$("#followers_list").append(html);
  

  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followers_li_" + user_data.user.id;
    	var html= '<li class="lk"><div id="' + li_id  +  '">' +
	'<div id="ex1" >' +
            '<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
		'<img class="img" src="'+  user_data.user.photo_small_url  +'" height="55" width="50" align="left">'+
		'<div id="txt1">' + user_data.user.full_name + '</div>'+
            '</a>'+ 
            '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>'+
	'</div>'+
	'</div></li>';



	//$('#profile_followers_list').append(html);
  $('#test').append(html);

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
    //alert("followers");

    $.ajax({
        url: '/contacts/followers',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            //alert("followers-if");
            window.location.href = data.location;
          }else{
            //alert("followers-else");
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

  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    reset_filter({});

    $("#follower-dialog-modal").dialog('close');
    window.location.href = "/home/show?id=" + user_id;
  });


  $('#flwr_friends').click(function(){
     //alert("flwr_friends");
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



