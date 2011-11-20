/*
 * 
 *
 */
var the_big_modal_subscription_json = {};
/* Global data */
var ignore_subscription_auto_complete = false;



/********************************************************************************************/


$(document).ready(function(){
  function subscription_format(user) {
    return '<img alt="" class="p-st-fltr-search-img" src="'+ user.photo + '">   ' + user.name + "</img>";
  }

  function subscription_get_id(user){
    return user.id;
  }

  $(".js_search_subscription").live('keyup.autocomplete', function() {
    var json_data = get_subscription_json_data();
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(subscription) {
        return subscription_format(subscription);
      }

    }).result(function(e, subscription) {
      if (ignore_subscription_auto_complete == false){
          window.location="/home/show?id=" + subscription.id;
          aw_modal_close("JS_AW_MODAL_subscription");
          ignore_subscription_auto_complete=true;
        }
    });
  });



  $('.js_modal_subscription').live('click', function(){

    //the_big_comment_count_json
    var user_json = the_big_modal_subscription_json[$(this).attr("id")];
    if(user_json){
      window.location="/home/show?id=" + user_json.user_id;
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_subscription_json_data(){
    return aw_modal_get_data("JS_AW_MODAL_subscription").data;
}


function aw_subscription_modal_data(json_data){
  var modal_data = {
                      type:"subscription",
                      css_class:"subscription_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_subscription", modal_data);
}



function aw_render_subscription_internal(subscription, div_id){
  var link_id = "subscription_modal_" + subscription.id;
  var str = aw_lib_get_trim_name(subscription.name, 10);
  var html='<div class="subscription_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_subscription" id="' + link_id + '">' +
                  '<img class="subscription_box_images" title="' + subscription.name + '" src="' + subscription.photo +  '"/>' +
                  '<p class="master_trimmed_text" >' + str + '</p>' + 
                '</a>'+
               
              '</div>';
  the_big_modal_subscription_json[link_id] = {user_id: subscription.id};
  return html;
}

function aw_subscription_modal(win_id, trigger_id){
  the_big_modal_subscription_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Subscriptions</label></li>' +
                        '<li><input type="text" id="js_input_subscription" class="js_search_subscription" placeholder="Subscriptions from people"/></li>' +
                       '</ul>' +  
                    '</div>';

  div.append(search_html);
  ignore_subscription_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_subscription");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}








