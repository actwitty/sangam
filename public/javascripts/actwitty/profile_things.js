/*
 * Home page things related jqueries
 *
 */

/*
 * Render things 
 */
function renderThings(json){
  var search_html = '<input type="text" id="search_things" placeholder="Things"/>';
  $("#thing-dialog-modal").append(search_html);
  var html = '<ul id="things_list" class="modal_things_ul">' +
             '</ul>';
  
  $("#thing-dialog-modal").append(html);

  $.each(json, function(i,thing){
      if( thing){
        var html ='<li id=things_li_' + thing.id  +  ' class="things_dialog_list">' +
                    '<a href="#" class="things_title" id="thing_id_' + thing.id + '">' +
                      '<img src="' + thing.image +  '">' +
                        thing.name +
                       '</img>' + 
                    '</a>'+
                  '<input type="hidden"  id="thing_id_' + thing.id + '_id" value="' +  thing.id + '"/>' +
                  '<input type="hidden"  id="thing_id_' + thing.id + '_name" value="' +  thing.name + '"/>' +
                      
                  '</li>';

        $('#things_list').append(html);
        
          
      }
  });



}

/* Global data */
var json_thing_data;
var ignore_thing_auto_complete = false;
function get_all_things(){
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
            json_thing_data=data;
          }
        },
        error: function (error) {

        }
    });
   ignore_thing_auto_complete = false; 
    
}

/********************************************************************************************/
function format(thing) {
		return thing.name;
}

function getID(thing){
  return thing.id;
}


/********************************************************************************************/
$(document).ready(function(){
  //alert("Inside profile_things.js ready");
  $("#search_things").live('keyup.autocomplete', function() {
    $(this).autocomplete(json_thing_data, {
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
        if (ignore_thing_auto_complete == false){
          
          /* filter change transaction */
          var new_filter = {
                            thing_id:getID(item),
                            thing_name:format(item)
                           };
          modify_filter(new_filter);


          $("#thing-dialog-modal").dialog('close');
          ignore_thing_auto_complete = true;
        }
    });
  });


  $('.things_title').live('click', function () { 
    var base_id = $(this).attr('id');
    var filter_thing_id = $("#" + base_id + "_id").attr('value');
    var filter_thing_name = $("#" + base_id + "_name").attr('value');
    
    /* filter change transaction */
    var new_filter = {
                            thing_id:filter_thing_id,
                            thing_name:filter_thing_name
                           };
          modify_filter(new_filter);
    $( "#thing-dialog-modal" ).dialog('close');
  });

});

