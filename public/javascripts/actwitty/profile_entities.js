/*
 * Home page things related jqueries
 *
 */
var the_big_modal_entities_json = {};




/* Global data */
var ignore_entity_auto_complete = false;
function get_all_entities(userid, render_div_id){
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/home/get_entities.json',
        type: 'GET',
        data: {user_id:userid, sort_order:1},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* set context for the modal dialog */
          aw_entities_set_all_entities_modal_data(data);
          var tabs_data = aw_modal_get_data("JS_AW_MODAL_all_entities");
          aw_boxer_render_tabs(render_div_id, tabs_data);
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
        return '<img alt="" class="p-st-fltr-search-img" src="'+ entity.image + '?maxwidth=40&maxheight=40">   ' + entity.name + '</img>';
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

    var modal_win_id = $(this).parents('.modal_window:first').attr("id");
    aw_modal_close(modal_win_id);
    return false;
  });

});


function get_entities_json_data(id){
  if(id == "js_entities_modal_related"){
    var aw_modal_data = aw_modal_get_data("JS_AW_MODAL_related_entities");
    return aw_modal_data.data;
  }else{
    return aw_modal_get_data("JS_AW_MODAL_all_entities").data;
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

function aw_entities_set_all_entities_modal_data(json_data){
  
  var modal_data = {
                      type:"entities",
                      class:"entities_box",
                      data:json_data
                   };
  aw_modal_set_data("JS_AW_MODAL_all_entities", modal_data);

}

function aw_render_entities_internal(entity, div_id, new_tab_id){
     var link_id = "stream_related_modal_" + entity.id;
     //var main_div = $('.entities_box_internal').parent().attr("id");
     //var main_id = $('#main_div');
     //alert(main_id + entity.image);
     //alert("cool");
     //alert($('.entities_box_internal').parent().attr("id"));
     //main_div.css({'background-image': url( entity.image )});

     var html='<div class="entities_box_internal" id="' + div_id + '">' +
                '<a href="#" class="js_modal_entities" id="' + link_id + '">' +
                  '<img  src="' + entity.image +  '?maxwidth=120"/>' +
                  '<p> '+  entity.name + '</p>'+
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
                      '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Related Entities</label></li>' +
                        '<li><input type="text" id="js_entities_modal_related" class="js_search_entities " placeholder="Entities"/></li>' +
                      '</ul>' +
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


function aw_entities_render_all_modal(win_id, trigger_id){
  the_big_modal_entities_json={};
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  var search_html = '<div class="search_box">' +
                       '<ul class="modal_ul">' +
                        '<li><label class="lab_search_box">Search by Entities</label></li>' +
                        '<li><input type="text" id="js_entities_modal_all" class="js_search_entities " placeholder="Entities"/></li>' +
                        '</ul>' +
                    '</div>';

  div.append(search_html);
  ignore_entity_auto_complete=false;
  var html = '<div  id="' + id + '">' +
             '</div>';
  div.append(html);
  
  var page_owner_id=$('#page_owner_id').attr("value");
  get_all_entities( page_owner_id, id); 
  return true;
}




