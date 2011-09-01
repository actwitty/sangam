/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */
function renderFacebookers1(json){
  var html1 = '<div id="wrapper">' +
    '<ul class="tabs">' +
        '<li><a class="defaulttab" rel="tabs1">Invite Friends</a></li>' +
        '<li><a rel="tabs2" class="">Follow Friends</a></li>' +
        '<li><a rel="tabs3" class="">Unfollow Friends</a></li>' +
    '</ul>' +
     '<div class="tab-content" id="tabs1" style="display: block;">#1</div>'+
     '<div class="tab-content" id="tabs2" style="display: none;">#2</div>'+
     '<div class="tab-content" id="tabs3" style="display: none;">#3</div>'+
'</div>';



 
  var invite_html = '<div id="invite_list" class="modal_fb_ul">' +  '<h3> </h3>' +
		    '</div><br/>';
  
  var follow_html = '<div id="follow_list" class="modal_fb_ul">' +  '<h3> </h3>' +
                    '</div><br/>';

  var unfollow_html = '<div id="unfollow_list" class="modal_fb_ul">'+ '<h3>  </h3>' +
                    '</div><br/>';

  $("#facebook-dialog-modal").append(html1);  
  $("#facebook-dialog-modal").append(invite_html);  
  $("#facebook-dialog-modal").append(follow_html);  
  $("#facebook-dialog-modal").append(unfollow_html); 
  $("#tabs3").append(unfollow_html); 
  $("#tabs2").append(follow_html); 
  $("#tabs1").append(invite_html); 
  
  //$("#test1").append(html1);  
/*
  $("#test1").append(invite_html);  
  $("#test2").append(follow_html);  
  $("#test3").append(unfollow_html); 
*/
  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
	var html="";
	$('.tabs a').click(function(){
		switch_tabs($(this));
		//alert("clicked");
	});
       function switch_tabs(obj)
  	{
		$('.tab-content').hide();
		$('.tabs a').removeClass("selected");
		var id = obj.attr("rel");
 
		$('#'+id).show();
		obj.addClass("selected");
  	}

        if (!data.user_id){
        var html= '<div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1">' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt1">' +  data.name + '</div>'+
	'<div id="inner">'+
		'<input type="button"  height="25" width="25" value="Invite" class="fb_invite" id="' + data.uid + '"/>' +
	'</div>'+
	'</div>'+
	'</div>';

	 $('#li_id').hover( function(){
      		$(this).css('background-color', '#F00');
		alert("1");	
   	 },
   	function(){
      		$(this).css('background-color', '#000');
                alert("2"); 
   	});

   
    

          $('#invite_list').append(html);
        }else{
         html='<div id="' + li_id  +  '" class="user_stamp">' +
		'<div id="ex1">' +
			'<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
			       	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
				'<div id="txt1">' +  data.name + '</div>'+
			'</a>'+ 
			'<input type="hidden" id="user_nav_' +  data.user_id + '_hidden" value="' +  data.user_id + '"/>'+
     		'</div>'+
		'</div>';


          if (data.status == "Follow"){
            $('#follow_list').append(html);
      	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Unfollow" class="follow_button"   id="follow_btn_' + data.user_id + '" />' +
			'</div>';
	      $('#' + li_id + " " +  "#ex1").append(html);


          }else{
            $('#unfollow_list').append(html);
	    var html = '<div id="inner">'+
		 	'<input type="button" height="25" width="25" value="Follow" class="follow_button"  id="follow_btn_' + data.user_id + '" />' +
			'</div>';

            $('#' + li_id + " " + "#ex1").append(html);
	   
          }
        }


      
        var html = '<input type="hidden" value="' + data.user_id + '" id="follow_btn_' + data.user_id + '_user_id" />';
        $("#" + li_id).append(html);
	/*
        if (!$('#follow_list').is(':empty'))
        {
          $('#follow_list').append('<h3>Follow Friends</h3>');
        }
       	if (!$('#unfollow_list').is(':empty'))
        {
          $('#unfollow_list').append('<h3>Unfollow Friends</h3>');
        }
	*/
	
    }
  });

}


/*


function renderFacebookers(json){
 
  var invite_html = '<div id="invite" class="modal_fb_ul">' +  '</div><br/>';
  
  var follow_html = '<div id="follow" class="modal_fb_ul">' + '</div><br/>';

  var unfollow_html = '<div id="unfollow" class="modal_fb_ul">'+ '</div><br/>';

  $("#invite_friends").append(invite_html);  
  $("#follow_friends").append(follow_html);  
  $("#unfollow_friends").append(unfollow_html); 

  $.each(json, function(i,data){
      if( data ){
        var li_id = "fb_li_" + data.uid;
	var html="";

        if (!data.user_id){
        var html= '<div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1">' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt1">' +  data.name + '</div>'+
	'<div id="inner">'+
		'<input type="button"  height="25" width="25" value="Invite" class="fb_invite" id="' + data.uid + '"/>' +
	'</div>'+
	'</div>'+
	'</div>';


        $('#invite').append(html);
        }else{
         html='<div id="' + li_id  +  '" class="user_stamp">' +
		'<div id="ex1">' +
			'<a href="#" id="user_nav_' +  data.user_id + '" class="link_user_stamp user_nav">' +
			       	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
				'<div id="txt1">' +  data.name + '</div>'+
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

        if (!data.user_id){
        var html= '<li class="lk"><div id="' + li_id  +  '" class="user_stamp">' +
	'<div id="ex1">' +
	'<img class="img" src="' + data.image + '" height="55" width="50" align="left">'+
       	'<div id="txt1">' +  data.name + '</div>'+
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
				'<div id="txt1">' +  data.name + '</div>'+
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


function append_invite_friends(){
 //alert("invite");
  if ($('#invite').is(':empty'))
  {
      $('#invite').append('<h3>No friends To invite.</h3>');
  }
}
function append_follow_friends(){
 //alert("follow");
  if ($('#follow').is(':empty'))
  {
      $('#follow').append('<h3>No friends To follow.</h3>');
  }
}
function append_unfollow_friends(){
 //alert("unfollow");
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
function get_all_facebookers(){
    /*
     * Get data on ready
     */
    //alert("get_all_facebooker"); 
    if(temp == 0){
    temp = 1;
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
            //renderFacebookers1(data);
      	    //append_invite_friends(data);
          }
          //TODO: try to use this in search, why should search hit server, again and again
          
        },
        error: function (error) {

        }
    });
   }
}

  
/********************************************************************************************/
$(document).ready(function(){
  //alert("Inside profile_facebook.js ready"); 
  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    modify_filter({});

    $("#facebook-dialog-modal").dialog('close');
    /*$("#test").dialog('close');*/
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
  $('#fb_friends').click(function(){
     get_all_facebookers();
     $('#empty_check').hide();
  });
  $('.js_add_facebook_friends').click(function(){
     get_all_facebookers();
     $('#empty_check').hide();
  });
  //get_all_facebookers();
  //if ($('#invite_friends').is(':empty'))
  //alert($('#invite_friends').children().size());
  if ($('#invite_friends').children().size() > 1)
  {
      //$('#invite_friends').append('<h3 id="empty_check">No Facebook friends In your Profile.Invite them.</h3>');
      $('#empty_check').hide();
  }
  else
  {
      $('#empty_check').show();
      //$('#empty_check').remove();
  }
 

});


/********************************* READY ENDS HERE ******************************************/



