/*
 * Home page channels related jqueries
 *
 */

/*
 * Render channels 
 */
function renderChannels(json){
  var html = '<ul id="channels_list" class="modal_channels_ul">' +
             '</ul>';
  
  $("#channel-dialog-modal").append(html);

  $.each(json, function(i,activity){
      if( activity){
        var html ='<li id=' + activity.id  +  ' class="channels_dialog_list">' +
                    '<label  class="channels_title" id="' + activity.id + '">' +
                      activity.name
                    '</label>'+ 
                  '</li>';
        $('#channels_list').append(html);
        $('#channels_list').append(html);
        $('#channels_list').append(html);
        $('#channels_list').append(html);
        
          
      }
  });


  $('.modal_channels_ul').easyListSplitter({ 
   colNumber: 5 
  }); 

}



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
          }
        },
        error: function (error) {

        }
    });
}

/********************************************************************************************/
function format(channel) {
		return channel.name;
}

function getID(activity){
  return channel.id;
}


/********************************************************************************************/
$(document).ready(function(){
  $("#search_channels").live('keyup.autocomplete', function()
  {
    $("#search_channels").autocomplete('/activities/top_activities', {
      multiple: false,
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
      }
    }).result(function(e, item) {
        alert( 'Channel ID seen is ' +  getID(item));
    });
  });
  


  $('.activities_dialog').live('click', function () { 
    alert('clicked ' + $(this).attr('id'));   
  });

});
