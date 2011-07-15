
var the_big_filter_JSON={dummy:"dummy"};

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
                  '<img src="'+ attachment.url + '"  width="40" height="40" alt="" />' +
                  '<span>' +
                      attachment.name +
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

      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + friend.id;
      /* create a JSON of filter */
      var filter_value = {
                          user:friend.id ,
                          channel_id:summary.word.id, 
                          channel_name:summary.word.name  
                    };
      the_big_filter_JSON[filter_id] = filter_value;
      var html='<li>' +
                '<a href="#" class="js_summary_filter_setter" id="' + filter_id +'" >' +
                  '<img src="'+ friend.image + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      friend.name +
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
      /* This filter id uniquely identifies filter */
      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + entity.id;
      var filter_hidden_id = filter_id + '_hidden';
      /* create a JSON of filter */
      var filter_value = {
                            user:summary.user.id ,
                            thing_id:entity.id,
                            thing_name:entity.name,
                            channel_id:summary.word.id, 
                            channel_name:summary.word.name  
                          };
      the_big_filter_JSON[filter_id] = filter_value;


      var html='<li>' +
                '<a href="#" class="js_summary_filter_setter" id="' + filter_id +'" >' +
                  '<img src="'+ entity.image + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      entity.name +
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
      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + place.id;
      /* create a JSON of filter */
      var filter_value = {
                            user:summary.user.id ,
                            location_id:place.id,
                            location_name:place.name,
                            channel_id:summary.word.id, 
                            channel_name:summary.word.name  
                          };
      the_big_filter_JSON[filter_id] = filter_value;


      var html='<li>' +
                  '<a href="#" class="js_summary_filter_setter" id="' + filter_id + '"  >' +
                    '<span>' +
                         place.name +
                    '</span>' +
                  '</a>' +
                '</li>';

      ul_box.append(html);
    });

  }else{
    locations_box.hide();
  }
}


/*******************************************************************/

/* handle complete summary box */
function create_and_add_summary(ul, summary){

 /* Fail safe, due to any reason this happens, reject the summary from being displayed again */
 var unique_id =  summary.word.id + '' + summary.user.id;
 if ($("#" + unique_id ).length > 0){
   return;
 }

 var docs_box_id = unique_id + '_attachments';
 var friends_box_id = unique_id + '_friends';
 var entities_box_id = unique_id + '_entities';
 var locations_box_id = unique_id + '_locations';
 var latest_text_box_id = unique_id + '_text';
 
 var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id;
  /* create a JSON of filter */
 var filter_value = {
                      user:summary.user.id ,
                      channel_id:summary.word.id, 
                      channel_name:summary.word.name  
                    };
 the_big_filter_JSON[filter_id] = filter_value;


 var html ='<li class="summary_li">' +
              
              '<div id="' + unique_id + '" class="summary_box">' +
                /* summary user box */
                '<div id="' + summary.user.user_id + '" class="summary_user_box">' +
                  '<a href="/home/show?id=' +  summary.user.id + '" class="summary_user_box_a">' +
                    '<img src="' + summary.user.photo + '" alt="" class="summary_user_box_img" >' +
                      summary.user.full_name + 
                    '</img>'+
                  '</a>'+ 
                '</div>'+
                
                /* summary main box */
                '<div class="summary_main_box">' +

                  /* summary box header */
                  '<div class="summary_main_box_header">'  +
                    '<a href="#" class="main_box_header_a js_summary_filter_setter" id="'+ filter_id +'">' +
                      summary.word.name +  
                      ', total wits to see:' + summary.count + 
                      ', Updated at ' + summary.time +
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


function append_personal_summary(owner_id){
  var scroll = $(window).scrollTop();
  var more_cookie =  $("#more_personal_cookie").val();
  $.ajax({
        url: '/activities/get_snapshots.json',
        type: 'GET',
        data: {id : owner_id, last_id : more_cookie },
        dataType: 'json',
        contentType: 'application/json',  
        success: function (data) {
          // if rails demands a redirect because of log in missing
           $.each(data, function(i,summary){
            if( summary ){
                create_and_add_summary($('#personal_summary'),summary);     
                $("#more_personal_cookie").val(summary.id);
                $(window).scrollTop(scroll);
            } 
          });

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {  
          alert('There has been a problem generating summary. \n ActWitty is trying to solve.');
        }
    });

}

function append_friends_summary(owner_id){
  var scroll = $(window).scrollTop();
  var more_cookie = $("#more_friends_cookie").val();
  $.ajax({
        url: '/activities/get_friends_snapshots.json',
        type: 'GET',
        data: {id : owner_id, last_id : more_cookie },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           $.each(data, function(i,summary){
            if( summary ){
                create_and_add_summary($('#friends_summary'),summary);     
                $("#more_friends_cookie").val(summary.id);
                $(window).scrollTop(scroll);
            } 
          });

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem generating summaries of followings. \n ActWitty is trying to solve.');
        }
    });
}

$(document).ready(function(){
  /* Manage summary filters */
    $('.js_summary_filter_setter').live('click', function(){
      var filters_base_id = $(this).attr("id");
      if (filters_base_id.length > 0){
          var page_owner_id=$('#page_owner_id').attr("value");
          var filter = the_big_filter_JSON[filters_base_id];
          if(filter){
            reset_filter();
            modify_filter(filter);
          }

          return;
        }
      alert("ActWitty will fix the problem with the filter");
    });
});
