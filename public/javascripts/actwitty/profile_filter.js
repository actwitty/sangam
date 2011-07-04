

function modify_filter(filter_hash){
  $.each(filter_hash, function(key, filter_val_array){
    $("#filter_" + key +"_id").attr("value", filter_val_array[0]); 
    $("#filter_" + key + "_name").attr("value", filter_val_array[1]);  
  });

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
    var html = '<input type="button" id="location_filter_drop " value="'+ $("#filter_location_name").attr("value") +' X"/>'; 
    $("#stream_filters").append(html);
  }
}

function reset_filter(){
  $("#filter_channel_name").attr("value", "");
  $("#filter_channel_id").attr("value", "");
  $("#filter_thing_name").attr("value", "");
  $("#filter_thing_id").attr("value", "");
  $("#filter_location_name").attr("value", "");
  $("#filter_location_id").attr("value", "");
}

function load_filter(){
   modify_filter({});
}

function apply_filter(){

}

$(document).ready(function(){
    $('#channel_filter_drop').live("click",function(){
      $("#filter_channel_name").attr("value", "");
      $("#filter_channel_id").attr("value", "");
      modify_filter({});
    });

    $('#thing_filter_drop').live("click",function(){
      $("#filter_thing_name").attr("value", "");
      $("#filter_thing_id").attr("value", "");
      modify_filter({});
    });

    $('#location_filter_drop').live("click",function(){
      $("#filter_location_name").attr("value", "");
      $("#filter_location_id").attr("value", "");
      modify_filter({});
    });
});