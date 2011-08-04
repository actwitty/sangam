/*
 * Home page locations related jqueries
 *
 */

/*
 * Render locations 
 */
function renderLocations(json){
  var search_html = '<input type="text" id="search_locations" placeholder="Locations"/>';
  $("#location-dialog-modal").append(search_html);
  var html = '<ul id="locations_list" class="modal_locations_ul">' +
             '</ul>';
  
  $("#location-dialog-modal").append(html);

  $.each(json, function(i,location){
      if( location){
        var html ='<li id=locations_li_' + location.id  +  ' class="locations_dialog_list">' +
                    '<a href="#" class="locations_title" id="location_id_' + location.id + '">' +
                      location.name +
                    '</a>'+
                  '<input type="hidden"  id="location_id_' + location.id + '_id" value="' +  location.id + '"/>' +
                  '<input type="hidden"  id="location_id_' + location.id + '_name" value="' +  location.name + '"/>' +
                      
                  '</li>';

        $('#locations_list').append(html);
        
          
      }
  });



}

/* Global data */
var json_location_data;
var ignore_location_auto_complete = false;
function get_all_locations(userid){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/home/get_related_locations.json',
        type: 'GET',
        data: {user_id:userid, filter:get_empty_filter()},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderLocations(data);
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
  //alert("Inside profile_locations.js ready");
  $("#search_locations").live('keyup.autocomplete', function() {

    $(this).autocomplete("/home/get_related_locations.json", {
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
            };
        });
      },
      formatItem: function(item) {
        return format(item);
      },

    }).result(function(e, item) {
        if (ignore_location_auto_complete == false){
          
          /* filter change transaction */
          var new_filter = {
                            location_id:getID(item),
                            location_name:format(item)
                           };
          modify_filter(new_filter);


          $("#location-dialog-modal").dialog('close');
          ignore_location_auto_complete = true;
        }
    });
  });


  $('.locations_title').live('click', function () { 
    var base_id = $(this).attr('id');
    var filter_location_id = $("#" + base_id + "_id").attr('value');
    var filter_location_name = $("#" + base_id + "_name").attr('value');
    
    /* filter change transaction */
    var new_filter = {
                      location_id:filter_location_id,
                      location_name:filter_location_name
                    };
    modify_filter(new_filter);
    $( "#location-dialog-modal" ).dialog('close');
  });

});


