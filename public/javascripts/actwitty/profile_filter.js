/***********************************************************/

var others_filter_state=true;
/***********************************************************/

function modify_filter(filter_json, reload){
  if ( reload === undefined ){
    reload=true;
  }


  var page_owner_id=$('#page_owner_id').attr("value");
  var session_owner_id=$('#session_owner_id').attr("value");
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

  /* Channel */
  if ($("#filter_channel_id").attr("value").length > 0 && $("#filter_channel_name").attr("value").length>0){
    //var html = '<input type="button" id="channel_filter_drop" value="'+ $("#filter_channel_name").attr("value") +' X"/>'; 
    $("#fltr_channel_id").html($("#filter_channel_name").attr("value"));
    $("#fltr_channel_id").parent().addClass('p-st-flt-channel');
    $('#channel_filter_drop').show();
  }else{
    if ($("#fltr_channel_id").parent().is('.p-st-flt-channel')) {
      $("#fltr_channel_id").parent().removeClass('p-st-flt-channel');
    }
    $("#fltr_channel_id").html("all channels");
    $('#channel_filter_drop').hide();
  }

  /* Thing */
  if ($("#filter_thing_id").attr("value").length > 0 && $("#filter_thing_name").attr("value").length>0){
   //var html = '<input type="button" id="thing_filter_drop" value="'+ $("#filter_thing_name").attr("value") +' X"/>'; 
   $("#fltr_entity_id").html($("#filter_thing_name").attr("value"));
   $("#fltr_entity_id").parent().addClass('p-st-flt-entity');
    $('#thing_filter_drop').show();
  }else{
    if ($("#fltr_entity_id").parent().is('.p-st-flt-entity')) {
      $("#fltr_entity_id").parent().removeClass('p-st-flt-entity');
      $("#fltr_entity_id").html("all objects");
    $('#thing_filter_drop').hide();
    }
  }



  /* Location */
  if ($("#filter_location_id").attr("value").length > 0 && $("#filter_location_name").attr("value").length>0){
    //var html = '<input type="button" id="location_filter_drop" value="'+ $("#filter_location_name").attr("value") +' X"/>'; 
   $("#fltr_location_id").html($("#filter_location_name").attr("value"));
   $("#fltr_location_id").parent().addClass('p-st-flt-location');
    $('#location_filter_drop').show();
  }else{
    if ($("#fltr_location_id").parent().is('.p-st-flt-location')) {
      $("#fltr_location_id").parent().removeClass('p-st-flt-location');
    }
      $("#fltr_location_id").html("all locations");
    $('#location_filter_drop').hide();
  }
  if(reload==true){
      if ( need_redirect == true){
        /* simple case redirect to stream tab of new user */
        aw_redirect_to_streams_filtered_of_other_user();
      }else{
        /* stay on current user and apply the new filter */
        set_stream_to_focus_on_filter_change();
        aw_reload_streams_on_viewed_user();
      }
  }
  

}
/***********************************************************/

function reset_filter(reload){
  if ( reload === undefined ){
    reload=true;
  }
  $("#filter_channel_name").attr("value", "");
  $("#filter_channel_id").attr("value", "");
  $("#filter_thing_name").attr("value", "");
  $("#filter_thing_id").attr("value", "");
  $("#filter_location_name").attr("value", "");
  $("#filter_location_id").attr("value", "");
  modify_filter({}, reload);
}

/***********************************************************/

function get_filter(){
  return { 
           word_id:$("#filter_channel_id").attr("value"),
           entity_id:$("#filter_thing_id").attr("value"),
           location_id:$("#filter_location_id").attr("value")
         }; 
}
/***********************************************************/

function get_long_string_filter(){
  var filter= 'c_id=' + encodeURIComponent( $("#filter_channel_id").attr("value")) +
              '&c_name=' + encodeURIComponent( $("#filter_channel_name").attr("value")) +
              '&e_id=' + encodeURIComponent( $("#filter_thing_id").attr("value")) +
              '&e_name=' + encodeURIComponent( $("#filter_thing_name").attr("value")) +
              '&l_id=' + encodeURIComponent( $("#filter_location_id").attr("value")) +
              '&l_name=' + encodeURIComponent( $("#filter_location_name").attr("value"));
  return filter;

}

/***********************************************************/

function get_empty_filter(){
  return { 
           word_id:"",
           entity_id:"",
           location_id:""
         }; 
}

/***********************************************************/

function get_others_filter_state(){
  return others_filter_state;
}
/***********************************************************/
function enable_me_mode(){
  $("#channel_others").removeClass("p-r-fltr-others-active");
  $("#stream_others").removeClass("p-r-fltr-others-active");
  $("#channel_me").addClass("p-r-fltr-me-active");
  $("#stream_me").addClass("p-r-fltr-me-active");
}

/***********************************************************/
function enable_others_mode(){
  $("#channel_me").removeClass("p-r-fltr-me-active");
  $("#stream_me").removeClass("p-r-fltr-me-active");
  $("#channel_others").addClass("p-r-fltr-others-active");
  $("#stream_others").addClass("p-r-fltr-others-active");
}

/***********************************************************/
function profile_filter_init(){
    var page_owner_id=$('#page_owner_id').attr("value");
    var session_owner_id=$('#session_owner_id').attr("value");
    if( page_owner_id == session_owner_id){
      $("#channel_others").addClass("p-r-fltr-others-active");
      $("#stream_others").addClass("p-r-fltr-others-active");
    }else{
      others_filter_state=false;
    }
    modify_filter({},false);
}
/***********************************************************/
$(document).ready(function(){
    /* enable others mode */
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
    
    $('#channel_me').click(function () {
      if(others_filter_state == true){
        enable_me_mode();
        others_filter_state=false;
        reload_summary_page(page_owner_id);
      }
    });
    /***********************************************************/

    $('#stream_me').click(function () {
      if(others_filter_state == true){
        enable_me_mode();
        others_filter_state=false;
        modify_filter({},true);
      }
    });

    /***********************************************************/
    $('#channel_others').click(function () {
      if(others_filter_state == false){
        enable_others_mode();
        others_filter_state=true;
        reload_summary_page(page_owner_id);
      }
    });

    /***********************************************************/
    $('#stream_others').click(function () {
      if(others_filter_state == false){
        enable_others_mode();
        others_filter_state=true;
        modify_filter({},true);
      }
    });

    /***********************************************************/
    



});
