*
 * Home page things related jqueries
 *
 */
var the_big_modal_friends_json = {};




/* Global data */
var ignore_friend_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_friends").live('keyup.autocomplete', function() {
    var json_data = get_friends_json_data($(this).attr("id"));
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(friend) {
        return friend.name;
      }

    }).result(function(e, friend) {
      if (ignore_friend_auto_complete == false){
          var new_filter = {
                            friend_id:friend.id,
                            friend_name:friend.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_friends_modal_id($(this).attr("id")));
          ignore_friend_auto_complete=true;
        }
    });
  });



  $('.js_modal_friends').live('click', function(){

    //the_big_comment_count_json
    var friend = the_big_modal_friends_json[$(this).attr("id")];
    if(friend){
      //alert("Channel id:" + friend.id);
      var new_filter = {
                         friend_id:friend.id,
                         friend_name:friend.name
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_friends_json_data(id){
  if(id == "js_friends_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_friends");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_friends").data;
  }
}

function get_friends_modal_id(id){
  if(id == "js_friends_modal_related"){
    return "JS_AW_MODAL_related_friends";
  }else{
    return "JS_AW_MODAL_all_friends";
  }
}

function aw_friends_set_related_modal_data(json_data){
  var modal_data = {
                      type:"friends",
                      class:"friends_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_friends", modal_data);
}

function aw_friends_set_all_friends_modal_data(json_data){
  
  var modal_data = {
                      type:"friends",
                      class:"friends_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_friends", modal_data);

}

function aw_render_friends_internal(friend, div_id){
     var link_id = "stream_related_modal_" + friend.id;
     var html='<div class="friends_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_friends" id="' + link_id + '">' +
                    friend.name +
                '</a>'+
               
              '</div>';
     the_big_modal_friends_json[link_id] = {id:friend.id, name:friend.name};
     return html;
}

function aw_friends_render_related_modal(win_id, trigger_id){
  the_big_modal_friends_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_friends_modal_related" class="js_search_friends " placeholder="Channels"/>' +
                    '</div>';

  div.append(search_html);
  ignore_friend_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_friends");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}


function aw_friends_render_all_modal(win_id, trigger_id){
  the_big_modal_friends_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_friends_modal_all" class="js_search_friends " placeholder="Channels"/>' +
                    '</div>';

  div.append(search_html);
  ignore_friend_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_friends( page_owner_id, id); 
  return true;
}




