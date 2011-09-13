/************************************/
var the_big_related_friend_json = {};
var the_big_related_entities_json = {};
var the_big_related_locations_json = {};
var the_big_related_channels_json = {};
/************************************/

/*
 * Populate filtered related friends
 */
function populate_filtered_friends(ele, friends){
  if( !friends && friends.length <= 0 ){
    return;
  }
  var div = ele;

  //alert(JSON.stringify(friends));

  $.each(friends, function(i, friend){
     var link_id = "stream_friend_id_" + friend.id;
     var html='<div class="p-fltr-tag-list">' +
                '<a href="#" class="js_related_friends" id="' + link_id + '">' +
                  '<img src="'+ friend.image + '"  width="40"  title="'+ friend.name + '" />' +
                  
                '</a>' +
              '</div>';
      
     div.append(html);
     the_big_related_friend_json[link_id] = friend.id;
     if(i>3){
       return false;
     }

    });
  
  var related_friends_div=$("#stream_related_friends");
  related_friends_div.show();
}
/************************************/
/*
 * Populate filtered related entities
 */
function populate_filtered_entities(ele, entities){
  if( !entities && entities.length <= 0 ){
    return;
  }
  var div = ele;
  $.each(entities, function(i, entity){
     var link_id = "stream_related_entity_fltr_" + entity.id;
     var entity_name = get_trim_text(entity.name,18,"..."); // a helper to trim the text
     var html='<div class="p-fltr-tag-list-entity disp-full-name-parent">' +
                '<span id="'+ link_id + '" class="js_related_entities disp-full-name">' +
                      entity.name +
                      '<span class="disp-full-name-span">'+entity.name+'</span>'+
                '</span>' +
              '</div>';
     div.append(html);
     the_big_related_entities_json[link_id] = {id:entity.id, name:entity.name};

     if(i>2){
       return false;
     }

    });
  
}
/************************************/
/*
 * Populate filtered related locations
 */
function populate_filtered_locations(ele, locations){
  if( !locations && locations.length <= 0 ){
    return;
  }
  var div = ele;
  
  
 
  $.each(locations, function(i, location){
     var link_id = "stream_location_id_" + location.id;
     var location_name = get_trim_text(location.name,18,"..."); // a helper to trim the text
     var html='<div class="p-fltr-tag-list-location disp-full-name-parent">' +
                  '<span class="js_related_locations disp-full-name" id="' + link_id + '">' +
                    location_name +
                     '<span class="disp-full-name-span">'+location.name+'</span>'+
                  '</span>' +
              '</div>';
      
     div.append(html);
     the_big_related_locations_json[link_id] = {id:location.id, name:location.name};
     if(i>2){
       return false;
     }
    });
  
}
/************************************/

/*
 * Populate related channels
 */


function populate_filtered_channels(box_id, channels){
  if( !channels && locatchannelsions.length <= 0 ){
    return;
  }

  var div = $("#" + box_id);
  var ul_id = "FILTERED_STREAM_CHANNELSS_UL";
  var title_html = '<div class="stream_related_channels_title_box">' +
                    '<span>' +
                      'Related Channels' +
                    '</span>' +
                   '</div>';
  var html = '<ul class="streams_side_ul_channels" id="' + ul_id +'">' +
             '</ul>';
  div.append(title_html);
  div.append(html);


  var ul = $("#" + ul_id);
  $.each(channels, function(i, channel){
     var link_id = "stream_location_id_" + channel.id;
     var html='<li class="streams_side_li_locations">' +
                '<a href="#" class="js_related_locations stream_channels_a" id="' + link_id + '">' +
                  '<span class="stream_locations_span">' +
                    channel.name +
                  '</span>' +
                '</a>' +
              '</li>';
      
     ul.append(html);
     the_big_related_channels_json[link_id] = {id:channel.id, name:channel.name};

    });
  
  var related_channels_div=$("#stream_channels_box");
  related_channels_div.show();
}


/************************************/
function list_related_friends(){
    var ele = $("#stream_related_friends");
    $.ajax({
        url: '/home/get_related_friends.json',
        type: 'GET',
        data: { 
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_friends(ele, data);

           /* set context for the modal dialog */
           aw_friends_set_related_modal_data(data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related friends list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/
function list_related_entities(owner_id){
    var ele = $("#stream_related_entities");
    $.ajax({
        url: '/home/get_related_entities.json',
        type: 'GET',
        data: { 
                user_id : owner_id, 
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_entities(ele, data);

           /* set context for the modal dialog */
           aw_entities_set_related_modal_data(data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related entities list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/

function list_related_locations(owner_id){
    var ele = $("#stream_related_locations");
    $.ajax({
        url: '/home/get_related_locations.json',
        type: 'GET',
        data: { 
                user_id : owner_id, 
                filter : get_filter(),
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_locations( ele, data);
           
           /* set context for location */
           aw_locations_set_related_modal_data(data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related locations list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/
function list_related_channels(owner_id){
    $.ajax({
        url: '/home/get_activities.json',
        type: 'GET',
        data: { 
                user_id : owner_id, filter : get_filter(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_channels("stream_channels_box", data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related channels list. \n ActWitty is trying to solve.');
        }
    });

}


/************************************/
function clear_related_friends() {
  $("#stream_related_friends_parent").html('');
  $("#stream_related_friends_parent").html('<div class="p-rel-fltr-tags" id="stream_related_friends">' +
                                           '</div>');
  the_big_related_friend_json={};

}


/************************************/
function clear_related_entities() {
 $("#stream_related_entities_parent").html('');
 $("#stream_related_entities_parent").html('<div class="p-rel-fltr-tags" id="stream_related_entities">' +
                                           '</div>');
  the_big_related_friend_json={};
}

/************************************/
function clear_related_locations() {
  $("#stream_related_locations_parent").html('');
  $("#stream_related_locations_parent").html('<div class="p-rel-fltr-tags" id="stream_related_locations">' +
                                           '</div>');
  the_big_related_locations_json={};

}


/************************************/
function clear_related_channels() {
  var related_locations_div=$("#stream_channels_box");
  related_locations_div.html('');
  the_big_related_channels_json={};

}

/*
 * Add the live bindings
 */
$(document).ready(function(){
  /*
   * A related friend clicked
   */
  $('.js_related_friends').live('click', function(){
    //the_big_comment_count_json
    var friend = the_big_related_friend_json[$(this).attr("id")];
    if(friend){
      var new_filter = {
                         user:friend,
                       }; 
      modify_filter(new_filter);
    }
    return false;
  });


  /*
   * A related entity clicked
   */
  $('.js_related_entities').live('click', function(){

    //the_big_comment_count_json
    var entity = the_big_related_entities_json[$(this).attr("id")];
    if(entity){
      //alert("Entity id:" + entity.id);
      var new_filter = {
                         thing_id:entity.id,
                         thing_name:entity.name
                       }; 
      modify_filter(new_filter);
    }
    return false;
  });

  /*
   * A related channel clicked
   */
  $('.js_related_channels').live('click', function(){
    //the_big_comment_count_json
    var channel = the_big_related_channels_json[$(this).attr("id")];
    if(channel){
      //alert("Channel id:" + channel.id);
    }
    return false;
  });

  /*
   * A related location clicked
   */
  $('.js_related_locations').live('click', function(){
    //alert("RELATED LOCATION: STAY ON PAGE CHANGE FILTER");
    //the_big_comment_count_json
    var location = the_big_related_locations_json[$(this).attr("id")];
    if(location){
      //alert("Location id:" + location.id);
      var new_filter = {
                         location_id:location.id,
                         location_name:location.name                      
                      };
      modify_filter(new_filter);
    }
    return false;
  });
});
