/*
 * Home page channels related jqueries
 *
 */

/*
 * Render channels 
 */
function renderChannels(json){
  var search_html = '<input type="text" id="search_channels" placeholder="Channels"/>';
  $("#channel-dialog-modal").append(search_html);
  var html = '<ul id="channels_list" class="modal_channels_ul">' +
             '</ul>';
  
  $("#channel-dialog-modal").append(html);

  $.each(json, function(i,activity){
      if( activity){
        var html ='<li id=channels_li_' + activity.id  +  ' class="channels_dialog_list">' +
                    '<a href="#" class="channels_title" id="channel_id_' + activity.id + '">' +
                      activity.name +
                    '</a>'+
                  '<input type="hidden"  id="channel_id_' + activity.id + '_id" value="' +  activity.id + '"/>' +
                  '<input type="hidden"  id="channel_id_' + activity.id + '_name" value="' +  activity.name + '"/>' +
                      
                  '</li>';

        $('#channels_list').append(html);
        
          
      }
  });



}

/* Global data */
var json_channel_data;
var ignore_channel_auto_complete = false;
function get_all_channels(){

    /*
     * Get data on ready
     */
    $.ajax({
        url: '/activities/top_activities',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderChannels(data);
            json_channel_data=data;
          }
        },
        error: function (error) {

        }
    });
   ignore_channel_auto_complete = false; 
    
}

/********************************************************************************************/
function format(channel) {
		return channel.name;
}

function getID(channel){
  return channel.id;
}


/********************************************************************************************/
$(document).ready(function(){
  //alert("Inside profile_channels.js ready");

  $("#search_channels").live('keyup.autocomplete', function() {
    $(this).autocomplete(json_channel_data, {
      multiple: false,
      delay: 0,
      //cacheLength:1000,
		  dataType: "json",
      parse: function(data) {
        return $.map(data, function(row) {
            return {
              data: row,
              value: row.name,
              result: row.name
            }
        });
      },
      formatItem: function(item) {
        return format(item);
      },

    }).result(function(e, item) {
        if (ignore_channel_auto_complete == false){
          /* filter change transaction */
          var new_filter = {};
          new_filter["channel"] = [getID(item) , format(item)];
          modify_filter(new_filter);

          $("#channel-dialog-modal").dialog('close');
          ignore_channel_auto_complete = true;
        }
    });
  });


  $('.channels_title').live('click', function () { 
    var base_id = $(this).attr('id');
    var channel_id = $("#" + base_id + "_id").attr('value');
    var channel_name = $("#" + base_id + "_name").attr('value');
    
    /* filter change transaction */
    var new_filter = {};
    new_filter["channel"] = [channel_id , channel_name];
    modify_filter(new_filter);
    $( "#channel-dialog-modal" ).dialog('close');
  });

});
