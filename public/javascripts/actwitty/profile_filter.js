/***********************************************************/
var g_channel_scope = 1;
var g_stream_scope = 1;
/***********************************************************/

function modify_filter(filter_json, reload){
  if ( reload === undefined ){
    reload=true;
  }

  var page_owner_id=aw_lib_get_page_owner_id();
  var session_owner_id=aw_lib_get_session_owner_id();
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
    $("#activity_field").val(filter_json.channel_name);
  }else{
     $("#activity_field").val("");
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
    
    filter_name = get_trim_text($("#filter_channel_name").attr("value"),10,"..");
    $("#fltr_channel_id span:first-child").html(filter_name);
    $("#fltr_channel_id span:nth-child(2)").html($("#filter_channel_name").attr("value"));

    $("#fltr_channel_id").parent().addClass('p-st-flt-channel');
    $('#channel_filter_drop').show();
  }else{
    if ($("#fltr_channel_id").parent().is('.p-st-flt-channel')) {
      $("#fltr_channel_id").parent().removeClass('p-st-flt-channel');
    }
    $("#fltr_channel_id span:first-child").html("all channels");
    $("#fltr_channel_id span:nth-child(2)").html("all channels");
    $('#channel_filter_drop').hide();
  }



 
 /* Thing */
 if ($("#filter_thing_id").attr("value").length > 0 && $("#filter_thing_name").attr("value").length>0){
   
   filter_name = get_trim_text($("#filter_thing_name").attr("value"),10,".."); 
   $("#fltr_entity_id  span:first-child").html(filter_name);
   $("#fltr_entity_id  span:nth-child(2)").html($("#filter_thing_name").attr("value"));

   $("#fltr_entity_id").parent().addClass('p-st-flt-entity');
    $('#thing_filter_drop').show();
  }else{
    if ($("#fltr_entity_id").parent().is('.p-st-flt-entity')) {
      $("#fltr_entity_id").parent().removeClass('p-st-flt-entity');
      $("#fltr_entity_id span:first-child").html("all mentions");
      $("#fltr_entity_id  span:nth-child(2)").html("all mentions");
    $('#thing_filter_drop').hide();
    }
  }



  /* Location */
  if ($("#filter_location_id").attr("value").length > 0 && $("#filter_location_name").attr("value").length>0){
   
   filter_name = get_trim_text($("#filter_location_name").attr("value"),10,".."); 
   $("#fltr_location_id span:first-child").html(filter_name);
   $("#fltr_location_id span:nth-child(2)").html($("#filter_location_name").attr("value"));

   $("#fltr_location_id").parent().addClass('p-st-flt-location');
    $('#location_filter_drop').show();
  }else{
    if ($("#fltr_location_id").parent().is('.p-st-flt-location')) {
      $("#fltr_location_id").parent().removeClass('p-st-flt-location');
    }
      $("#fltr_location_id span:first-child").html("all locations");
      $("#fltr_location_id span:nth-child(2)").html("all locations");
    $('#location_filter_drop').hide();
  }
  
  
  if(reload==true){
      if ( need_redirect == true){
        /* simple case redirect to stream tab of new user */
        aw_redirect_to_streams_filtered_of_other_user(filter_json.user);
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
}
/***********************************************************/

/***********************************************************/
function aw_get_channel_scope(){
  return g_channel_scope;
}
/***********************************************************/
function aw_get_stream_scope(){
  return g_stream_scope;
}
/***********************************************************/
function profile_filter_init(){
    if(aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
      $("#p-channelp-tab-mine").addClass("p-channelp-selected");
      $("#channel_stream_mine").addClass("p-channelp-selected");

      $("#stream_mine").addClass("p-r-fltr-mine-active");
      g_channel_scope = 1;
      g_stream_scope = 1;
    }else{
      $("#p-channelp-tab-mine").addClass("p-channelp-selected");
      $("#channel_stream_mine").addClass("p-channelp-selected");

      $("#stream_mine").addClass("p-r-fltr-mine-active");
      g_channel_scope = 1;
      g_stream_scope = 1;
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
    
    $('.js_channel_scope').live("click",function(){
      $(".p-channelp-tab").removeClass("p-channelp-selected"); 
      //alert($(this).attr("id"));
      $(this).addClass("p-channelp-selected");
      /*  p-channelp-tab-all p-channelp-tab-subscribed p-channelp-tab-mine   */

      if( $(this).attr("id") == "channel_stream_all" ){
        //alert("all");
        g_channel_scope = 3;
      }else if ( $(this).attr("id") == "channel_stream_subscribed" ){
        //alert("subsscribed");
        g_channel_scope = 2;
      }else if ( $(this).attr("id") == "channel_stream_mine" ){
        //alert("mine");
        g_channel_scope = 1;
      }
      
      aw_summary_reload_tab(aw_lib_get_page_owner_id());
       
    });
    /***********************************************************/
    $('.js_stream_scope').click(function() {
      var stream_scope_select = $(this).attr("id");
       
      if( stream_scope_select == "stream_mine"){
        g_stream_scope = 1;
        $("#stream_all").removeClass("p-r-fltr-all-active");
        $("#stream_subscribed").removeClass("p-r-fltr-subscribed-active");
        $("#stream_mine").addClass("p-r-fltr-mine-active");

      }else if ( stream_scope_select == "stream_subscribed"){
        g_stream_scope = 2;
        $("#stream_all").removeClass("p-r-fltr-all-active");
        $("#stream_subscribed").addClass("p-r-fltr-subscribed-active");
        $("#stream_mine").removeClass("p-r-fltr-mine-active");

      }else if ( stream_scope_select == "stream_all"){
        g_stream_scope = 3;
        $("#stream_all").addClass("p-r-fltr-all-active");
        $("#stream_subscribed").removeClass("p-r-fltr-subscribed-active");
        $("#stream_mine").removeClass("p-r-fltr-mine-active");

      }
      aw_reload_streams_on_viewed_user();
    });

    

    /***********************************************************/
    



});
