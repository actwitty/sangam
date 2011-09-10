/*
 * Home page things related jqueries
 *
 */
var the_big_modal_related_friends_json = {};
/* Global data */
var ignore_friend_related_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_related_friends").live('keyup.autocomplete', function() {
    var json_data = get_friends_json_data();
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(friend) {
        return '<img alt="" class="p-st-fltr-search-img" src="'+ friend.image + '?maxwidth=40&maxheight=40">   ' + friend.name + '</img>';
      }

    }).result(function(e, friend) {
      if (ignore_friend_related_auto_complete == false){
          var new_filter = {
                            user:friend.id,
                           };
          modify_filter(new_filter);
          aw_modal_close("JS_AW_MODAL_related_friends");
          ignore_friend_related_auto_complete=true;
        }
    });
  });



  $('.js_modal_related_friends').live('click', function(){

    //the_big_comment_count_json
    var user_json = the_big_modal_related_friends_json[$(this).attr("id")];
    if(user_json){
      var new_filter = {
                         user:user_json.user_id
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_friends_json_data(){
    return aw_modal_get_data("JS_AW_MODAL_related_friends").data;
}


function aw_friends_set_related_modal_data(json_data){
  var modal_data = {
                      type:"related_friends",
                      class:"related_friends_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_friends", modal_data);
}



function aw_render_friends_related_internal(friend, div_id){
     var link_id = "stream_related_modal_" + friend.id;
     var html='<div class="related_friends_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_related_friends" id="' + link_id + '">' +
                  '<img class="friends_box_images" src="' + friend.image +  '?maxwidth=40&maxheight=40"/>' +
                    friend.name +
                '</a>'+
               
              '</div>';
     the_big_modal_related_friends_json[link_id] = {user_id: friend.id};
     return html;
}

function aw_friends_render_related_modal(win_id, trigger_id){
  the_big_modal_related_friends_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Friends</label></li>' +
                        '<li><input type="text" id="js_friends_modal_related" class="js_search_related_friends" placeholder="People"/></li>' +
                       '</ul>' +  
                    '</div>';

  div.append(search_html);
  ignore_friend_related_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_friends");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}







