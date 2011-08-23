/*
* Major jsons for handling events and data
*/
var the_big_json_tab_manager={};
var the_big_json_tab_close={};

  
var the_big_json_renderers={
                              "image" : function aw_boxer_render_image(data, internal_id, new_tab_id){
                                                 return render_image_internal( data, internal_id, new_tab_id);
                                                },
                               "video" : function aw_boxer_render_video(data, internal_id, new_tab_id){
                                                return render_video_internal( data, internal_id, new_tab_id);
                                                },
                               "related_friends" : function aw_boxer_render_friends( data, internal_id, new_tab_id){
                                                return aw_render_friends_related_internal(data, internal_id, new_tab_id);
                                               },
                              "entities" : function aw_boxer_render_entities(data, internal_id, new_tab_id){
                                                return aw_render_entities_internal(data, internal_id, new_tab_id);
                                               },
                              "locations" : function aw_boxer_render_locations(data, internal_id, new_tab_id){
                                                return aw_render_locations_internal(data, internal_id, new_tab_id);
                                               },
                               "channels" : function aw_boxer_render_channels(data, internal_id, new_tab_id){
                                                return aw_render_channels_internal(data, internal_id, new_tab_id);
                                               },

                              

                           };


/*
 *
 */
function  render_internal_html(data, internal_id, type, new_tab_id){
  var html = "";
    
  if( the_big_json_renderers[type] ){
    html = the_big_json_renderers[type]( data, internal_id, new_tab_id);
  }

  return html;
}
  
/*
 * Handle individual tab
 */
function addtab(box_id, position, data, type, boxer_class)
{
  var new_tab_id = box_id + '_aw_tab_' + position;
  var box = $("#" + box_id);

  /* add a new tab */
  var html = '<div id="' + new_tab_id + '" class="ntabs js_aw_ntabs ' + boxer_class +  '">' +
  //'style="height:100px;width:150px;">' + 
             '</div>';
  box.append(html);
  tab = $("#" + new_tab_id);

  var internal_id = new_tab_id + "_" + type;

  data.internal_html_id = internal_id;
  var close_btn_id = new_tab_id + '_close';
  data.close_html_id = close_btn_id;
  var content_html = render_internal_html( data, internal_id, type, new_tab_id);

  tab.append(content_html);

  the_big_json_tab_close[close_btn_id]={tab:new_tab_id, box:box_id};
  var close_html = '<div class="boxer_close">'+
                     '<a href="" id="' + close_btn_id + '" class="close js_aw_ntabs_close">' +
                        '<img src="/images/alpha/close.png">' +
                      '</a>'
                   '</div>';

 
  tab.append(close_html);		
  
  
  the_big_json_tab_manager[box_id][new_tab_id] = data;
  if(position == 0){
    $("#"+new_tab_id).addClass("ctab");
  }
  
}


/*
* Main api to render boxes
*/
function aw_boxer_render_tabs(box_id, data_json){
  the_big_json_tab_manager[box_id]={};
  $("#" + box_id).removeClass("ctab");
  $.each(data_json.data, function(i,data){
    addtab(box_id,i,data, data_json.type, data_json.class);					
	});
	
}

 

$(document).ready(function(){
  //render_tabs("tabul", get_base_json_unit_test());


 $(".js_aw_ntabs").live("click", function() {
    $(".js_aw_ntabs").removeClass("ctab");
    $(this).addClass("ctab");
    //$("#c"+count).fadeIn('slow');
  });
                
  $(".js_aw_ntabs_close").live("click", function() {
    $(".js_aw_ntabs").removeClass("ctab");
    var json_id = $(this).attr("id");
    var tab_id = the_big_json_tab_close[json_id].tab;
    $("#" + json_id).parent().prev().addClass("ctab");
    $("#" + json_id).parent().remove();   
    delete  the_big_json_tab_close[json_id];
    var box_id = the_big_json_tab_close[json_id].box;
    var internal_id = the_big_json_tab_manager[box_id][new_tab_id].internal_html_id;


    return false;
  });
  
 
 
});
