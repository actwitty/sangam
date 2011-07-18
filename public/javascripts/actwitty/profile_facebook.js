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
  $("#facebook-dialog-modal").append('<h3>Invite List</h3>'); 
  $("#facebook-dialog-modal").append(invite_html);  
  $("#facebook-dialog-modal").append('</br></br></br><h3>Followers List</h3>'); 
  $("#facebook-dialog-modal").append(follow_html);  
  $("#facebook-dialog-modal").append('</br></br></br><h3>Unfollowers List</h3>'); 
  $("#facebook-dialog-modal").append(unfollow_html);  

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
        var html="";
        if (!data.user_id){
        var html= '<div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1" >' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt">' +  data.name + '</div>'+
	'<div id="inner">'+
		'<input type="button" bottom="40" height="25" width="25" value="In" class="fb_invite" id="' + data.uid + '"/>' +
	'</div>'+
	'</div>'+
	'</div>';

   
    

          $('#invite_list').append(html);
        }else{
         html='<div id="' + li_id  +  '" >' +
		'<div id="ex1" >' +
			'<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
			       	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
				'<div id="txt">' +  data.name + '</div>'+
			'</a>'+ 
			'<input type="hidden" id="user_nav_' +  data.user_id + '_hidden" value="' +  data.user_id + '"/>'+
     		'</div>'+
		'</div>';


          if (data.status == "Follow"){
            $('#follow_list').append(html);
      	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="UF" class="follow_button"   id="follow_btn_' + data.user_id + '" />' +
			'</div>';
	      $('#' + li_id + " " +  "#ex1").append(html);


          }else{
            $('#unfollow_list').append(html);
	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="F" class="follow_button"  id="follow_btn_' + data.user_id + '" />' +
			'</div>';

            $('#' + li_id + " " + "#ex1").append(html);
	   
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
//  alert("Inside profile_facebook.js ready"); 
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



