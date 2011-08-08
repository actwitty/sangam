/*
 * Home page things related jqueries
 *
 */
var the_big_modal_locations_json = {};



var ignore_location_auto_complete = false;
function get_all_locations(userid, render_div_id){
    $.ajax({
        url: '/home/get_locations.json',
        type: 'GET',
        data: {user_id:userid, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          aw_locations_set_all_locations_modal_data(data);
          var tabs_data = aw_modal_get_data("JS_AW_MODAL_all_locations");
          aw_boxer_render_tabs(render_div_id, tabs_data);
        },
        error: function (error) {

        }
    });
   ignore_location_auto_complete = false; 
    
}





$(document).ready(function(){
  
  $(".js_search_locations").live('keyup.autocomplete', function() {
    var json_data = get_locations_json_data($(this).attr("id"));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(location) {
        return '<img alt="" class="p-st-fltr-search-img" src="'+ get_location_image_for_type(location.type) + '">   ' 
                  + location.name + 
                '</img>';
      }

    }).result(function(e, location) {
      if (ignore_location_auto_complete == false){
          var new_filter = {
                            location_id:location.id,
                            location_name:location.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_locations_modal_id($(this).attr("id")));
          ignore_location_auto_complete=true;
        }
    });
  });



  $('.js_modal_locations').live('click', function(){

    //the_big_comment_count_json
    var location = the_big_modal_locations_json[$(this).attr("id")];
    if(location){
      var new_filter = {
                         location_id:location.id,
                         location_name:location.name
                       }; 
      modify_filter(new_filter);
    }

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_locations_json_data(id){
  if(id == "js_locations_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_locations");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_locations").data;
  }
}

function get_locations_modal_id(id){
  if(id == "js_locations_modal_related"){
    return "JS_AW_MODAL_related_locations";
  }else{
    return "JS_AW_MODAL_all_locations";
  }
}

function aw_locations_set_related_modal_data(json_data){
  var modal_data = {
                      type:"locations",
                      class:"locations_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_locations", modal_data);
}

function aw_locations_set_all_locations_modal_data(json_data){
  
  var modal_data = {
                      type:"locations",
                      class:"locations_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_locations", modal_data);

}


function get_location_image_for_type(type){
  var location_type_image = "/images/actwitty/unknown_location.png"; 
  if(type == 1) {
    location_type_image = "/images/actwitty/web_location.png";
  }else if (type == 2){
    location_type_image = "/images/actwitty/geo_location.png";
  }

  return location_type_image;
}

function aw_render_locations_internal(location, div_id){
     var link_id = "stream_related_modal_" + location.id;
     
     var html='<div class="locations_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_locations" id="' + link_id + '">' +
                  '<img class="locations_box_images" src="' + get_location_image_for_type(location.type) +  '"/>' +
                    location.name +
                '</a>'+
               
              '</div>';
     the_big_modal_locations_json[link_id] = {id:location.id, name:location.name};
     return html;
}

function aw_locations_render_related_modal(win_id, trigger_id){
  the_big_modal_locations_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_locations_modal_related" class="js_search_locations " placeholder="Locations"/>' +
                    '</div>';

  div.append(search_html);
  ignore_location_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_locations");
  
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}


function aw_locations_render_all_modal(win_id, trigger_id){
  the_big_modal_locations_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_locations_modal_all" class="js_search_locations " placeholder="Locations"/>' +
                    '</div>';

  div.append(search_html);
  ignore_location_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_locations( page_owner_id, id); 
  return true;
}






