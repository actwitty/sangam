/*
 * 
 *
 */
var the_big_modal_subscriber_json = {};
/* Global data */
var ignore_subscriber_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  function subscriber_format(user) {
    return '<img alt="" class="p-st-fltr-search-img" src="'+ user.photo + '">   ' + user.name + "</img>";
  }

  function subscriber_get_id(user){
    return user.id;
  }

  $(".js_search_subscriber").live('keyup.autocomplete', function() {
    var json_data = get_subscriber_json_data();
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(subscriber) {
        return subscriber_format(subscriber);
      }

    }).result(function(e, subscriber) {
      if (ignore_subscriber_auto_complete == false){
          window.location="/home/show?id=" + subscriber.id;
          aw_modal_close("JS_AW_MODAL_subscriber");
          ignore_subscriber_auto_complete=true;
        }
    });
  });



  $('.js_modal_subscriber').live('click', function(){

    //the_big_comment_count_json
    var user_json = the_big_modal_subscriber_json[$(this).attr("id")];
    if(user_json){
      window.location="/home/show?id=" + user_json.user_id;
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_subscriber_json_data(){
    return aw_modal_get_data("JS_AW_MODAL_subscriber").data;
}


function aw_subscriber_modal_data(json_data){
  var modal_data = {
                      type:"subscriber",
                      class:"subscriber_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_subscriber", modal_data);
}



function aw_render_subscriber_internal(subscriber, div_id){
     var link_id = "subscriber_modal_" + subscriber.id;
     var str = aw_lib_get_trim_name(subscriber.name, 10);
     var html='<div class="subscriber_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_subscriber" id="' + link_id + '">' +
                  '<img class="subscriber_box_images" title="' + subscriber.name + '" src="' + subscriber.photo +  '"/>' +
                   '<p class="master_trimmed_text" >' + str + '</p>' + 
                '</a>'+
              '</div>';
     the_big_modal_subscriber_json[link_id] = {user_id: subscriber.id};
     return html;
}

function aw_subscriber_modal(win_id, trigger_id){
  the_big_modal_subscriber_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Subscribers</label></li>' +
                        '<li><input type="text" id="js_input_subscriber" class="js_search_subscriber" placeholder="Subscribers to your channels"/></li>' +
                       '</ul>' +  
                    '</div>';

  div.append(search_html);
  ignore_subscriber_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_subscriber");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}









