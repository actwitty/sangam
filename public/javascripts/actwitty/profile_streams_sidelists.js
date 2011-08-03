/************************************/
var the_big_related_friend_json = {};
var the_big_related_entities_json = {};
var the_big_related_locations_json = {};
var the_big_related_channels_json = {};
/************************************/

/*
 * Populate filtered related friends
 */
function populate_filtered_friends(box_id, friends){
  if( !friends && friends.length <= 0 ){
    return;
  }
  var div = $("#" + box_id);


  $.each(friends, function(i, friend){
     var link_id = "stream_friend_id_" + friend.id;
     var html='<div class="p-fltr-tag-list">' +
                '<a href="#" class="js_related_friends" id="' + link_id + '">' +
                  '<img src="'+ friend.image + '"  width="30" height="30" alt="" />' +
                '</a>' +
              '</div>';
      
     div.append(html);
     the_big_related_friend_json[link_id] = friend.id;

    });
  
  var related_friends_div=$("#stream_related_friends");
  related_friends_div.show();
}
/************************************/
/*
 * Populate filtered related entities
 */
function populate_filtered_entities(box_id, entities){
  if( !entities && entities.length <= 0 ){
    return;
  }
  var div = $("#" + box_id);
  $.each(entities, function(i, entity){
     var link_id = "stream_related_entity_fltr_" + entity.id;
     var html='<div class="p-fltr-tag-list-entity">' +
                '<span id="'+ link_id + '" class="js_related_entities">' +
                      entity.name +
                '</span>' +
              '</div>';
     div.append(html);
     the_big_related_entities_json[link_id] = {id:entity.id, name:entity.name};

    });
  
}
/************************************/
/*
 * Populate filtered related locations
 */
function populate_filtered_locations(box_id, locations){
  if( !locations && locations.length <= 0 ){
    return;
  }
  var div = $("#" + box_id);
  
  $.each(locations, function(i, location){
     var link_id = "stream_location_id_" + location.id;
     var html='<div class="p-fltr-tag-list-location">' +
                  '<span class="js_related_locations" id="' + link_id + '">' +
                    location.name +
                  '</span>' +
              '</div>';
      
     div.append(html);
     the_big_related_locations_json[link_id] = {id:location.id, name:location.name};

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
    $.ajax({
        url: '/home/get_related_friends.json',
        type: 'GET',
        data: { filter : get_filter() },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_friends("stream_related_friends", data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related friends list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/
function list_related_entities(owner_id){
    $.ajax({
        url: '/home/get_entities.json',
        type: 'GET',
        data: { user_id : owner_id, filter : get_filter() },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_entities("stream_related_entities", data);
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting related entities list. \n ActWitty is trying to solve.');
        }
    });

}

/************************************/

function list_related_locations(owner_id){
    $.ajax({
        url: '/home/get_related_locations.json',
        type: 'GET',
        data: { user_id : owner_id, filter : get_filter() },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_locations("stream_related_locations", data);
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
        data: { user_id : owner_id, filter : get_filter() },
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
  var related_friends_div=$("#stream_related_friends");
  if( related_friends_div.length > 0 ){
    related_friends_div.empty();
  }
  the_big_related_friend_json={};

}


/************************************/
function clear_related_entities() {
  var related_entities_div=$("#stream_related_entities");
  related_entities_div.html("");
  the_big_related_entities_json={};
}

/************************************/
function clear_related_locations() {
  var related_locations_div=$("#stream_related_locations");
  related_locations_div.html("");
  the_big_related_locations_json={};

}


/************************************/
function clear_related_channels() {
  var related_locations_div=$("#stream_channels_box");
  related_locations_div.html("");
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
      alert("Friend id:" + friend);
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
      alert("Channel id:" + channel.id);
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
