function populate_filtered_friends(box_id, friends){
  if( !friends && friends.length <= 0 ){
    return;
  }
  var div = $("#" + box_id);

  /* title and ul is ready */
  var title_html = '<h4> Friends </h4>';
  div.append(title_html);
  var html = '<ul class="streams_side_ul_friends">' +
             '</ul>';
  div.append(html);




}

function populate_filtered_entities(box_id, entities){
  if( !entities && entities.length <= 0 ){
    return;
  }
  var div = $("#" + box_id);

  /* title and ul is ready */
  var title_html = '<h4> Entities </h4>';
  div.append(title_html);
  var html = '<ul class="streams_side_ul_entities">' +
             '</ul>';
  div.append(html);

}

function populated_filtered_locations(box_id, locations){
  if( !locations && locations.length <= 0 ){
    return;
  }
  var div = $("#" + box_id);

  /* title and ul is ready */
  var title_html = '<h4> Locations </h4>';
  div.append(title_html);
  var html = '<ul class="streams_side_ul_locations">' +
             '</ul>';
  div.append(html);

}

function list_related_friends(){
    $.ajax({
        url: '/home/related_friends',
        type: 'GET',
        data: { filter : get_filter() },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_friends("stream_related_friends", data);
        },
        error: function (error) {

        }
    });

}

function list_related_entities(owner_id){
    $.ajax({
        url: '/home/related_friends',
        type: 'GET',
        data: { user_id : owner_id, filter : get_filter() },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_friends("stream_related_entities", data);
        },
        error: function (error) {

        }
    });

}

function list_related_locations(){
    $.ajax({
        url: '/home/related_locations',
        type: 'GET',
        data: { user_id : owner_id, filter : get_filter() },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           populate_filtered_friends("stream_related_locations", data);
        },
        error: function (error) {

        }
    });

}

function clear_related_friends(){
  $("stream_related_friends").empty();

}

function clear_related_entities(){
  $("stream_related_entities").empty();

}

function clear_related_locations(){
  $("stream_related_locations").empty();

}


