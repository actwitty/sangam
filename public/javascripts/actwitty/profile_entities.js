/*
 * Home page things related jqueries
 *
 */
var the_big_modal_entities_json = {};


/*
 * Render things 
 */
function render_entities(json){
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
var ignore_entity_auto_complete = false;
function get_all_things(userid){
    /*
     * Get data on ready
     */
    alert("reached here");
    $.ajax({
        url: '/home/get_entities.json',
        type: 'GET',
        data: {user_id:userid, filter:get_empty_filter()},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            render_entities(data);
            json_thing_data=data;
          }
        },
        error: function (error) {

        }
    });
   ignore_entity_auto_complete = false; 
    
}



/********************************************************************************************/


$(document).ready(function(){
  
  $(".js_search_entities").live('keyup.autocomplete', function() {
    var json_data = get_entities_json_data($(this).attr("id"));
    //alert(JSON.stringify(json_data));
   //TODO: check why JSON is not working here
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(entity) {
        return '<img alt="" class="img_stamp user_stamp" src="'+ entity.image + '">   ' + entity.name + '</img>';
      }

    }).result(function(e, entity) {
      if (ignore_entity_auto_complete == false){
          var new_filter = {
                            thing_id:entity.id,
                            thing_name:entity.name
                           };
          modify_filter(new_filter);
          aw_modal_close(get_entities_modal_id($(this).attr("id")));
          ignore_entity_auto_complete=true;
        }
    });
  });



  $('.js_modal_entities').live('click', function(){

    //the_big_comment_count_json
    var entity = the_big_modal_entities_json[$(this).attr("id")];
    if(entity){
      //alert("Entity id:" + entity.id);
      var new_filter = {
                         thing_id:entity.id,
                         thing_name:entity.name
                       }; 
      modify_filter(new_filter);
    }
    aw_modal_close("JS_AW_MODAL_related_entities");
    return false;
  });

});


function get_entities_json_data(id){
  if(id == "js_entities_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_entities");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_entities").data_json;
  }
}

function get_entities_modal_id(id){
  if(id == "js_entities_modal_related"){
    return "JS_AW_MODAL_related_entities";
  }else{
    return "JS_AW_MODAL_all_entities";
  }
}

function aw_entities_set_related_modal_data(json_data){
  var modal_data = {
                      type:"entities",
                      class:"entities_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_related_entities", modal_data);
}

function aw_entities_set_all_entities_modal_data(){

}

function aw_render_entities_internal(entity, div_id){
     var link_id = "stream_related_modal_" + entity.id;
     var html='<div class="entities_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_entities" id="' + link_id + '">' +
                  '<img src="' + entity.image +  '"/>' +
                    entity.name +
                  '</img>' + 
                '</a>'+
               
              '</div>';
     the_big_modal_entities_json[link_id] = {id:entity.id, name:entity.name};
     return html;
}

function aw_entities_render_related_modal(win_id, trigger_id){
  the_big_modal_entities_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                      '<input type="text" id="js_entities_modal_related" class="js_search_entities " placeholder="Entities"/>' +
                    '</div>';

  div.append(search_html);
  ignore_entity_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);

  var tabs_data = aw_modal_get_data("JS_AW_MODAL_related_entities");
  aw_boxer_render_tabs(id, tabs_data);
  return true;
}




