/*
 * Home page things related jqueries
 *
 */
var the_big_modal_channels_json = {};




/* Global data */
var ignore_channel_auto_complete = false;
function get_all_channels(userid, render_div_id){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/home/get_channels.json',
        type: 'GET',
        data: {user_id:userid, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* set context for the modal dialog */
          aw_channels_set_all_channels_modal_data(data);
          var tabs_data = aw_modal_get_data("JS_AW_MODAL_all_channels");
          aw_boxer_render_tabs(render_div_id, tabs_data);
        },
        error: function (error) {

        }
    });
   ignore_channel_auto_complete = false; 
    
}



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_channels").live('keyup.autocomplete', function() {
    var json_data = get_channels_json_data($(this).attr("id"));
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(channel) {
        return channel.name;
      }

    }).result(function(e, channel) {
      if (ignore_channel_auto_complete == false){
          var new_filter = {
                            channel_id:channel.id,
                            channel_name:channel.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_channels_modal_id($(this).attr("id")));
          ignore_channel_auto_complete=true;
        }
    });
  });



  $('.js_modal_channels').live('click', function(){

    //the_big_comment_count_json
    var channel = the_big_modal_channels_json[$(this).attr("id")];
    if(channel){
      //alert("Channel id:" + channel.id);
      var new_filter = {
                         channel_id:channel.id,
                         channel_name:channel.name
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_channels_json_data(id){
  if(id == "js_channels_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_channels");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_channels").data;
  }
}

function get_channels_modal_id(id){
  if(id == "js_channels_modal_related"){
    return "JS_AW_MODAL_related_channels";
  }else{
    return "JS_AW_MODAL_all_channels";
  }
}

function aw_channels_set_related_modal_data(json_data){
  var modal_data = {
                      type:"channels",
                      class:"channels_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_channels", modal_data);
}

function aw_channels_set_all_channels_modal_data(json_data){
  
  var modal_data = {
                      type:"channels",
                      class:"channels_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_channels", modal_data);

}

function aw_render_channels_internal(channel, div_id){
     var link_id = "stream_related_modal_" + channel.id;
     var html='<div class="channels_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_channels" id="' + link_id + '">' +
                    channel.name +
                '</a>'+
               
              '</div>';
     the_big_modal_channels_json[link_id] = {id:channel.id, name:channel.name};
     return html;
}

function aw_channels_render_related_modal(win_id, trigger_id){
  the_big_modal_channels_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_channels_modal_related" class="js_search_channels " placeholder="Channels"/>' +
                    '</div>';

  div.append(search_html);
  ignore_channel_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_channels");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}


function aw_channels_render_all_modal(win_id, trigger_id){
  the_big_modal_channels_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_channels_modal_all" class="js_search_channels " placeholder="Channels"/>' +
                    '</div>';

  div.append(search_html);
  ignore_channel_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_channels( page_owner_id, id); 
  return true;
}




