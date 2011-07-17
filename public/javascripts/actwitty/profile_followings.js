/*
 * Home page friends related jqueries
 *
 */

/*
 * Render friends 
 */
function renderFollowings(json){
  var search_html = '<input type="text" id="search_followings" placeholder="Followings"/>';
  $("#following-dialog-modal").append(search_html);
  var html = '<ul id="followings_list" class="modal_friends_ul">' +
             '</ul>';
  
  $("#following-dialog-modal").append(html);

  $.each(json, function(i,user_data){
      if( user_data && user_data.user){
        var li_id = "followings_li_" + user_data.user.id;
        var html ='<li id="' + li_id  +  '" class="user_stamp">' +
                    '<a href="#" id="user_nav_' +  user_data.user.id + '" class="link_user_stamp user_stamp user_nav">' +
                      '<img src="' + user_data.user.photo_small_url + '" alt="" class="img_stamp user_stamp" >' +
                           user_data.user.full_name + 
                      '</img>'+
                    '</a>'+ 
                    '<input type="hidden" id="user_nav_' +  user_data.user.id + '_hidden" value="' +  user_data.user.id + '"/>'; 
                  '</li>'; 


        $('#followings_list').append(html);

        var html = '<input type="button" class="follow_button" value="Un-Follow" id="follow_btn_' + user_data.user.id + '" />';

          $("#" + li_id).append(html);

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
 $("#search_followings").live('keyup.autocomplete', function() {
   //alert(json_followings_data);
    $(this).autocomplete('/contacts/followings', {
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
      if (ignore_following_auto_complete == false){
          /* filter change transaction */
          reset_filter();

          $("#following-dialog-modal").dialog('close');
          ignore_following_auto_complete = true;
          window.location.href = "/home/show?id=" + getID(item);
        }
    });
  });

  $(".user_nav").live('click', function(){
    var click_id = $(this).attr("id");
    var user_id = $("#" + click_id + "_hidden").attr("value");
    reset_filter();

    $("#following-dialog-modal").dialog('close');
    window.location.href = "/home/show?id=" + user_id;
  });
 

});


/********************************* READY ENDS HERE ******************************************/



