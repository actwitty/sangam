

function modify_filter(filter_json){
  var page_owner_id=$('#page_owner_id').attr("value");
  var need_redirect = false;
  /* Decide on which user to go to */
  if (filter_json.user){
    if( filter_json.user != page_owner_id){
      need_redirect=true;
      page_owner_id = filter_json.user;
    }
  }

  if( filter_json.channel_id && filter_json.channel_name ){
    $("#filter_channel_id").attr("value", filter_json.channel_id); 
    $("#filter_channel_name").attr("value", filter_json.channel_name);  
  }

  if( filter_json.location_id && filter_json.location_name){
    $("#filter_location_id").attr("value", filter_json.location_id); 
    $("#filter_location_name").attr("value", filter_json.location_name);  
  }

  if( filter_json.thing_id && filter_json.thing_name){
    $("#filter_thing_id").attr("value", filter_json.thing_id); 
    $("#filter_thing_name").attr("value", filter_json.thing_name);  
  }

  /* remove display of all filter disengage buttons */
  $("#stream_filters").empty();

  /* Channel */
  if ($("#filter_channel_id").attr("value").length > 0 && $("#filter_channel_name").attr("value").length>0){
    var html = '<input type="button" id="channel_filter_drop" value="'+ $("#filter_channel_name").attr("value") +' X"/>'; 
    $("#stream_filters").append(html);
  }

  /* Thing */
  if ($("#filter_thing_id").attr("value").length > 0 && $("#filter_thing_name").attr("value").length>0){
   var html = '<input type="button" id="thing_filter_drop" value="'+ $("#filter_thing_name").attr("value") +' X"/>'; 
   $("#stream_filters").append(html);
  }


  /* Location */
  if ($("#filter_location_id").attr("value").length > 0 && $("#filter_location_name").attr("value").length>0){
    var html = '<input type="button" id="location_filter_drop" value="'+ $("#filter_location_name").attr("value") +' X"/>'; 
    $("#stream_filters").append(html);
  }


  //reload_streams_on_viewed_user();
}

function reset_filter(){
  $("#filter_channel_name").attr("value", "");
  $("#filter_channel_id").attr("value", "");
  $("#filter_thing_name").attr("value", "");
  $("#filter_thing_id").attr("value", "");
  $("#filter_location_name").attr("value", "");
  $("#filter_location_id").attr("value", "");
  modify_filter({});
}


function get_filter(){
  return { 
           channel : $("#filter_channel_id").attr("value", ""),
           thing : $("#filter_thing_id").attr("value", ""),
           place : $("#filter_thing_id").attr("value", "")
         }; 
}

$(document).ready(function(){
    $('#channel_filter_drop').live("click",function(){
      $("#filter_channel_name").attr("value", "");
      $("#filter_channel_id").attr("value", "");
      modify_filter({});
    });
    /***********************************************************/

    $('#thing_filter_drop').live("click",function(){
      $("#filter_thing_name").attr("value", "");
      $("#filter_thing_id").attr("value", "");
      modify_filter({});
    });
    /***********************************************************/

    $('#location_filter_drop').live("click",function(){
      $("#filter_location_name").attr("value", "");
      $("#filter_location_id").attr("value", "");
      modify_filter({});
    });
    /***********************************************************/

   
    /***********************************************************/
});
