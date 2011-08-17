
var the_big_filter_JSON={dummy:"dummy"};
/* handle text box */
function create_and_add_text_box(box_id, summary){
  var text_box= $("#" + box_id);
  if ( summary.recent_text && summary.recent_text.length  ){

    $.each(summary.recent_text, function(i, text){
     var html='<li>' +
                '<span>' +
                    text +
                '</span>' +
              '</li>';

     text_box.append(html);
    });
      
  }else{
    /* hide if there is nothing to show */
    text_box.hide();
  }
}



/* handle docs box 
 * fancy box activated
 * */
function create_and_docs_box(box_id, summary){
  docs_box= $("#" + box_id);
  if ( summary.documents &&  summary.documents.length ){
    var ul_box = $("#" + box_id);
    $.each(summary.documents, function(i, attachment){
     var html='<a rel="fnc_group_'+box_id+'" href="'+ attachment.url + '" title=""><img alt="" src="'+ attachment.thumb_url + '"  width="50" height="50" alt="" /></a>'; 
     ul_box.append(html);
    });
    /* activate fancy box  */
    activate_fancybox_group(box_id);
  }else{
    /* hide if there is nothing to show */
    docs_box.hide();
  }
  
}





/******************************************************************/


/* handle friends box */
function create_and_add_friends_box(box_id, summary){
  var friends_box = $("#" + box_id);
  if( summary.friends && summary.friends.length ){
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
                '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id +'" >' +
                  '<img src="'+ friend.photo + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      friend.full_name +
                  '</span>' +
                '</a>' +
              '</li>';

      friends_box.append(html);
    });

  }else{
    friends_box.hide();
  }
  
}

/*******************************************************************/


/* handle entities box */
function create_and_add_entities_box(box_id, summary){
  var entities_box = $("#" + box_id);
  if( summary.entities && summary.entities.length ){
    $.each(summary.entities, function(i, entity){
      /* This filter id uniquely identifies filter */
      var filter_id =  'FS_' + summary.word.id + '_' + summary.user.id + '_' + entity.id;
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
                '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id +'" >' +
                  '<img src="'+ entity.image  + '?maxwidth=40&maxheight=40"  width="40" height="40" alt="" />' +
                  '<span>' +
                      '<br/>' +
                      entity.name +
                  '</span>' +
                '</a>' +
              '</li>';

      entities_box.append(html);
    });

  }else{
    entities_box.hide();
  }
}


/*******************************************************************/

/* handle locations box */
function create_and_add_locations_box(box_id, summary){
  var locations_box = $("#" + box_id);
  if( summary.locations && summary.locations.length ){
  
    $.each(summary.locations, function(i, place){
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
                  '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id + '"  >' +
                    '<span>' +
                         place.name +
                    '</span>' +
                  '</a>' +
                '</li>';

      locations_box.append(html);
    });

  }else{
    locations_box.hide();
  }
}


/*******************************************************************/

/* handle complete summary box */
function create_and_add_summary(summary_box, summary){
 /* Fail safe, due to any reason this happens, reject the summary from being displayed again */
 var unique_id =  'SUMMARY_' + summary.word.id + '_' + summary.user.id;
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


 var html =  '<div id="' + unique_id + '" class="summary_box" >' +
                /* summary user box */
                '<div class="summary_user_box">' +
                  '<a href="/home/show?id=' +  summary.user.id + '" >' +
                    '<img src="' + summary.user.photo + '" alt="" />' +
                    '<br/>' + summary.user.full_name + 
                  '</a>'+ 
                '</div>'+

                '<div class="summary_channel_box js_summary_filter_setter" id="'+ filter_id +'" >' +
                  '<span>'  +
                     summary.word.name + 
                  '</span>' +
                '</div>' +

                '<div class="summary_update_time_box" >' +
                    '<span>'  +
                      'Last updated: ' +
                    '</span>' +
                    '<abbr class="timeago" title="' + summary.time + '"></abbr>' +
                '</div>' +

                '<div class="summary_total_posts_box" >' +
                    '<span>'  +
                      'Total updates: ' + summary.count +
                    '</span>' +
                '</div>' +

                
                
                /* summary main box */
                '<div class="summary_main_box">' +


                  /* added last few friends active on this channel */
                  '<div  class="summary_main_box_friends" id="' + friends_box_id + '">' +
                    '<span> Friends doing same thing <br/></span>' + 
                  '</div>' +


                  /* added last few entities on this channel */
                  '<div  class="summary_main_box_entities" id="' + entities_box_id  + '">' +
                    '<span> Latest objects: <br/></span>' + 
                  '</div>' +

                  /* added last few locations on this channel */
                  '<div  class="summary_main_box_locations" id="' + locations_box_id  + '">' +
                    '<span> Latest locations: <br/></span>' + 
                  '</div>' +


                  /* added recent update text */
                  '<div  class="summary_main_box_latest" id="' + latest_text_box_id  + '">' +
                    '<span> Latest updates: <br/></span>' + 
                  '</div>' +


                  /* added images box lets see if we have anything to add here */
                  '<div  class="summary_main_box_attachments" id="' + docs_box_id + '">' +
                    '<span> Latest attachments: <br/></span>' + 
                  '</div>' +

                '</div>' +
                  
              '</div>';
        /* overall summary div is added */        
        summary_box.append(html);
        /* handle individual divs */
        create_and_docs_box(docs_box_id, summary);  
        create_and_add_text_box(latest_text_box_id, summary);
        create_and_add_friends_box(friends_box_id, summary);
        create_and_add_entities_box(entities_box_id, summary);
        create_and_add_locations_box(locations_box_id, summary)

}


function append_personal_summary(owner_id){
  var scroll = $(window).scrollTop();
  var more_cookie =  $("#more_channels_cookie").val();
  $.ajax({
        url: '/home/get_summary.json',
        type: 'GET',
        data: {
                user_id : owner_id, 
                updated_at:more_cookie, 
                friend:get_others_filter_state(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',  
        success: function (data) {
          // if rails demands a redirect because of log in missing
           $.each(data, function(i,summary){
            if( summary ){
                //alert(JSON.stringify(summary));
                create_and_add_summary($('#channels_display_list'),summary);
                $("#more_channels_cookie").val(summary.time);
            } 
          });
          $(window).scrollTop(scroll);

          /* convert time stamp to time ago */
          $("abbr.timeago").timeago();


        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {  
          aw_lib_alert('There has been a problem generating summary. \n ActWitty is trying to solve.');
        }
    });

}

function reload_summary_page(owner_id){
  $('#channels_display_list').html("");
  $("#more_channels_cookie").val("");
  append_personal_summary(owner_id);

}

$(document).ready(function(){
  /* Manage summary filters */
    $('.js_summary_filter_setter').live('click', function(){
      var filters_base_id = $(this).attr("id");
      if (filters_base_id.length > 0){
          var page_owner_id=$('#page_owner_id').attr("value");
          var filter = the_big_filter_JSON[filters_base_id];
          if(filter){
            /* do not cause reload */
            reset_filter(false);
            modify_filter(filter);
          }

          return false;
        }
      aw_lib_alert("ActWitty will fix the problem with the filter");
    });

    /*
     * Bind click to more on personal summary
     */
    $('#more_personal').click(function() {
      aw_lib_console_log("debug", "profile.js:more personal summary clicked");
      append_personal_summary(page_owner_id);
      return false;
    });
});
