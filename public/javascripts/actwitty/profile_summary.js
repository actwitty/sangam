/* handle docs box */
function create_and_docs_box(box_id, summary){
  docs_box= $("#" + box_id);
  if ( summary.documents && summary.documents.length  ){
    var ul_box_id = box_id + "_ul"; 
    var doc_box_id = box_id + "_slider";
    var html = '<div  class="aw_slider" id="' + doc_box_id + '">' +                  
                  '<ul id="' + ul_box_id +  '" class="aw_slider">' +
                  '</ul>' +
                '</div>' ;

    docs_box.append(html);
    var ul_box = $("#" + ul_box_id);  
    $.each(summary.documents, function(i, attachment){
     var html='<li>' +
                '<a href="#">' +
                  '<img src="'+ attachment.document_url + '"  width="40" height="40" alt="" />' +
                  '<span>' +
                      attachment.document_name +
                  '</span>' +
                '</a>' +
              '</li>';

     ul_box.append(html);
    });
  }else{
    /* hide if there is nothing to show */
    docs_box.hide();
  }
}
/******************************************************************/


/* handle friends box */
function create_and_add_friends_box(box_id, summary){
  friends_box = $("#" + box_id);
  if( summary.friends && summary.friends.length ){
    var ul_box_id = box_id + "_ul"; 
    var html = '<ul id="' + ul_box_id +  '" class="summary_main_box_friends">' +
                '</ul>';
    friends_box.append(html);
    var ul_box = $("#" + ul_box_id);
    $.each(summary.friends, function(i, friend){
      var html='<li>' +
                '<a href="/home/show?id=' + friend.friend_id +'">' +
                  '<img src="'+ friend.friend_image + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      friend.friend_name +
                  '</span>' +
                '</a>' +
              '</li>';

      ul_box.append(html);
    });

  }else{
    friends_box.hide();
  }
  
}

/*******************************************************************/


/* handle entities box */
function create_and_add_entities_box(box_id, summary){
  entities_box = $("#" + box_id);
  if( summary.entities && summary.entities.length ){
    var ul_box_id = box_id + "_ul"; 
    var html = '<ul id="' + ul_box_id +  '" class="summary_main_box_entities">' +
                '</ul>';
    entities_box.append(html);
    var ul_box = $("#" + ul_box_id);
    $.each(summary.entities, function(i, entity){
      var html='<li>' +
                '<a href="#">' +
                  '<img src="'+ entity.entity_image + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      entity.entity_name +
                  '</span>' +
                '</a>' +
              '</li>';

      ul_box.append(html);
    });

  }else{
    entities_box.hide();
  }
}


/*******************************************************************/

/* handle locations box */
function create_and_add_locations_box(box_id, summary){
  locations_box = $("#" + box_id);
  if( summary.location && summary.location.length ){
    var ul_box_id = box_id + "_ul"; 
    var html = '<ul id="' + ul_box_id +  '" class="summary_main_box_locations">' +
                '</ul>';
    locations_box.append(html);
    var ul_box = $("#" + ul_box_id);
    $.each(summary.location, function(i, place){
      if( place.geo_location ){
        var html='<li>' +
                  '<a href="#">' +
                    '<span>' +
                        'Geo: ' + place.geo_location.geo_name +
                    '</span>' +
                  '</a>' +
                '</li>';
      }else{
        //TODO:
      }

      ul_box.append(html);
    });

  }else{
    locations_box.hide();
  }
}


/*******************************************************************/

/* handle complete summary box */
function create_and_add_summary(ul, summary){
 var unique_id =  summary.activity_word.word_id + '' + summary.user.user_id;
 var docs_box_id = unique_id + '_attachments';
 var friends_box_id = unique_id + '_friends';
 var entities_box_id = unique_id + '_entities';
 var locations_box_id = unique_id + '_locations';
 var latest_text_box_id = unique_id + '_text';

 /* Fail safe, due to any reason this happens, reject the summary from being displayed again*/
 if ($("#" + unique_id ).length > 0){
   return;
 }
 var html ='<li class="summary_li">' +
              '<div id="' + unique_id + '" class="summary_box">' +

                /* summary user box */
                '<div id="' + summary.user.user_id + '" class="summary_user_box">' +
                  '<a href="/home/show?id=' +  summary.user.user_id + '" class="summary_user_box_a">' +
                    '<img src="' + summary.user.photo + '" alt="" class="summary_user_box_img" >' +
                      summary.user.full_name + 
                    '</img>'+
                  '</a>'+ 
                '</div>'+
                
                /* summary main box */
                '<div class="summary_main_box">' +

                  /* summary box header */
                  '<div class="summary_main_box_header">'  +
                    '<a href="/home/show?mode=album&id=' 
                            +  summary.user.user_id + '&activity_id=' + summary.activity_word.word_id 
                            + '" class="main_box_header_a" >' +
                      summary.activity_word.word_name +  ', total wits to see:' + summary.activity_count +
                    '</a>' +
                  '</div>'+

                  /* added last few friends active on this channel */
                  '<div  class="summary_main_box_friends" id="' + friends_box_id + '">' +
                    '<h4> Friends doing same thing </h4>' + 
                  '</div>' +


                  /* added last few entities on this channel */
                  '<div  class="summary_main_box_entities" id="' + entities_box_id  + '">' +
                    '<h4> Entities talked about </h4>' + 
                  '</div>' +

                  /* added last few locations on this channel */
                  '<div  class="summary_main_box_locations" id="' + locations_box_id  + '">' +
                    '<h4> Locations talked about </h4>' + 
                  '</div>' +


                  /* added recent update text */
                  '<div  class="summary_main_box_latest" id="' + latest_text_box_id  + '">' +
                    '<h4> Latest text update </h4>' +
                    '<p>' +
                      summary.recent_text +
                    '</p>' +
                  '</div>' +


                  /* added images box lets see if we have anything to add here */
                  '<div  class="summary_main_box_attachments" id="' + docs_box_id + '">' +
                    '<h4> Last few attachments </h4>' +                    
                  '</div>' +
                  
                '</div>'+
              '</div>' +
            '</li>';
        
        /* overall summary div is added */        
        ul.append(html);

        /* handle individual divs */
        create_and_docs_box(docs_box_id, summary);       
        create_and_add_friends_box(friends_box_id, summary);
        create_and_add_entities_box(entities_box_id, summary);
        create_and_add_locations_box(locations_box_id, summary)

}

function append_personal_summary(owner_id, summary_position){
  $.ajax({
        url: '/activities/get_snapshots',
        type: 'GET',
        data: {id : owner_id, position : summary_position },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          // if rails demands a redirect because of log in missing
           var count =0;
           $.each(data, function(i,summary){
            if( summary ){
                create_and_add_summary($("#personal_summary"),summary);          
                count = i + 1;
            } 
          });
          var current_count = parseInt($('#personal_count').val());
          current_count = current_count + count;
          $('#personal_count').val(current_count);

        },
        error: function (error) {

        }
    });

}

function append_friends_summary(owner_id, summary_position){
  $.ajax({
        url: '/activities/get_friends_snapshots',
        type: 'GET',
        data: {id : owner_id, position : summary_position },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          // if rails demands a redirect because of log in missing 
          var count = 0;
           $.each(data, function(i,summary){
            if( summary ){
                create_and_add_summary($("#friends_summary"),summary); 
                count = i + 1;
            } 
          });

          var current_count = parseInt($('#friend_count').val());
          current_count = current_count + count;
          $('#friend_count').val(current_count);
        },
        error: function (error) {

        }
    });
}
