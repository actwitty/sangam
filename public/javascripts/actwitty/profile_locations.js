/*
 * Home page locations related jqueries
 *
 */

/*
 * Render locations 
 */
function renderThings(json){
  var search_html = '<input type="text" id="search_locations" placeholder="Things"/>';
  $("#location-dialog-modal").append(search_html);
  var html = '<ul id="locations_list" class="modal_locations_ul">' +
             '</ul>';
  
  $("#location-dialog-modal").append(html);

  $.each(json, function(i,activity){
      if( activity){
        var html ='<li id=locations_li_' + activity.id  +  ' class="locations_dialog_list">' +
                    '<a href="#" class="locations_title" id="location_id_' + activity.id + '">' +
                      activity.name +
                    '</a>'+
                  '<input type="hidden"  id="location_id_' + activity.id + '_id" value="' +  activity.id + '"/>' +
                  '<input type="hidden"  id="location_id_' + activity.id + '_name" value="' +  activity.name + '"/>' +
                      
                  '</li>';

        $('#locations_list').append(html);
        
          
      }
  });



}

/* Global data */
var json_location_data;
var ignore_location_auto_complete = false;
function get_all_locations(){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/entities/top_entities',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderThings(data);
            json_location_data=data;
          }
        },
        error: function (error) {

        }
    });
   ignore_location_auto_complete = false; 
    
}

/********************************************************************************************/
function format(location) {
		return location.name;
}

function getID(location){
  return location.id;
}


/********************************************************************************************/
$(document).ready(function(){
  $("#search_locations").live('keyup.autocomplete', function() {
    $(this).autocomplete(json_location_data, {
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
        if (ignore_location_auto_complete == false){
          
          /* filter change transaction */
          var new_filter = {};
          new_filter["channel"] = [getID(item) , format(item)];
          modify_filter(new_filter);

          $("#location-dialog-modal").dialog('close');
          ignore_location_auto_complete = true;
        }
    });
  });


  $('.locations_title').live('click', function () { 
    var base_id = $(this).attr('id');
    var location_id = $("#" + base_id + "_id").attr('value');
    var location_name = $("#" + base_id + "_name").attr('value');
    
    /* filter change transaction */
    var new_filter = {};
    new_filter["location"] = [location_id , location_name];
    modify_filter(new_filter);
    $( "#location-dialog-modal" ).dialog('close');
  });

});


