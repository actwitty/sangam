/*
 * NOTE :: There are certain sections where html code has been commented.
 * plz keep it for a while to have a ref.
 */


var the_big_filter_JSON={dummy:"dummy"};
/* handle text box */
function create_and_add_text_box(box_id, summary){
  var text_box= $("#" + box_id);
  if ( summary.recent_text && summary.recent_text.length  ){

    $.each(summary.recent_text, function(i, text){
     shortText = text.trim().substring(0, 160).split(" ").slice(0, -1).join(" ") + "..."; 
     var html = '<div class="p-channelp-post-lup">' +
                    '<div class="p-channelp-post-lup-time">' +
                      '<span> 2 mins ago </span>' +
                    '</div>' +
                    '<div class="p-channelp-post-lup-text">' +
                      '<p>' + shortText + '</p>' +
                    '</div>'+
                  '</div>';
     /*var html='<li>' +
                '<span>' +
                    text +
                '</span>' +
              '</li>';
     */

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
      
      if(attachment.category == "image"){
        var thumb_url = attachment.url;
       
       if( attachment.thumb_url ) {
          thumb_url = attachment.thumb_url;
        }
       
       var html='<a rel="fnc_group_'+box_id+'" href="'+ attachment.url + '" title="">' +
                  '<img alt="" src="'+ thumb_url + '"  width="50"  alt="" />' +
                '</a>'; 
        ul_box.append(html);
      }
    });
    /* activate fancy box  */
    activate_fancybox_group(box_id);
  }else{
    /* hide if there is nothing to show */
    var html = '<span> No attachments found </span>';
    docs_box.append(html);
    //docs_box.hide();
  }
  
}


/* handle subscribe box */
function create_add_add_subscribe_box(box_id, summary){
  var subsc_box = $("#" + box_id);
  if(aw_lib_get_session_owner_id() != -1 &&
     summary.user.id != aw_lib_get_session_owner_id() ){
    var html="";
    if(aw_get_channel_scope() == 2 &&
        aw_lib_get_session_owner_id() == aw_lib_get_page_owner_id()){
        html='<a class="p-channel-subscribe-btn js_subscribe_summary" >UNSUBSCRIBE</a>';
    }else{
      if(summary.subscribed && summary.subscribed == true){
        html='<a class="p-channel-subscribe-btn js_subscribe_summary" >UNSUBSCRIBE</a>';
      }else{
        html='<a class="p-channel-subscribe-btn js_subscribe_summary" >SUBSCRIBE</a>';
      }
    }
    subsc_box.append(html);
  }else{
    subsc_box.hide();
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
      //var html='<li>' +
      var html =  '<a href="#" class="js_summary_filter_setter summary_links_styling" id="' + filter_id +'" >' +
                  '<img src="'+ friend.photo + '"  width="25" height="25" alt="" />' +
                  '<span>' +
                      friend.full_name +
                  '</span>' +
                '</a>';
              //'</li>';

      friends_box.append(html);
    });

  }else{
    var html='<span> No records Found </span>';
    friends_box.append(html);              
    //friends_box.hide();
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
                  /*'<img src="'+ entity.image  + '?maxwidth=40&maxheight=40"  width="40" height="40" alt="" />' +*/
                  '<span>' +
                      entity.name +
                  '</span>' +
                '</a>' +
              '</li>';

      entities_box.append(html);
    });

  }else{
    var html='<li>' +
                  '<span> No records found</span>' +
              '</li>';
    entities_box.append(html);
    //entities_box.hide();
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
function populate_people_list_on_summary(box_id, data){
  var div = $("#" + box_id);


  $.each(data.user, function(i, user){
     var html='<div class="p-channel-people-box">' +
                '<a href="/home/show?id=' + user.id + '">' +
                  '<img src="'+ user.photo + '"  width="30" height="30" alt="" />' +
                '</a>' +
              '</div>';
      
     div.append(html);
     if(i>5){
       return false;
     }

    });
  
  div.show();
}

/*******************************************************************/
function create_and_add_subscriptions_in_auth_sect()
{
   $("#" + "owners_subscription_list").empty();

   $.ajax({
        url: '/home/get_subscriptions.json',
        type: 'GET',
        data: { 
                user_id:aw_lib_get_page_owner_id(),
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           if(data && data.user && data.user.length != 0) {
             var html = '<span class="p-channel-people-head  JS_AW_MODAL_subscription js_modal_dialog_link">' +
                          data.user.length +' Subscriptions from  >' +
                        '</span>' +
                        '<div class="p-channel-people-list" id="subscriptions_list_box">' +
                        '</div>';
             $("#" + "owners_subscription_list").append(html);
             populate_people_list_on_summary("subscriptions_list_box", data);
             /* set context for the modal dialog */
             aw_subscription_modal_data(data.user);
           }else{
             $("#" + "owners_subscription_list").html('<span>No subscribers to the channels.</span>');
           }

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting subscribers list. \n ActWitty is trying to solve.');
        }
    });

  

}

/*******************************************************************/
function create_and_add_subscribers_in_auth_sect()
{
  $("#" + "owners_subscribers_list").empty();
  
   $.ajax({
        url: '/home/get_subscribers.json',
        type: 'GET',
        data: { 
                user_id:aw_lib_get_page_owner_id(),
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
           if(data && data.user && data.user.length != 0) {
             var html = '<span class="p-channel-people-head  JS_AW_MODAL_subscriber js_modal_dialog_link">' +
                          data.user.length + ' Subscribers of channels >' +
                        '</span>' +
                        '<div class="p-channel-people-list" id="subscribers_list_box">' +
                        '</div>';
             $("#" + "owners_subscribers_list").append(html);
             populate_people_list_on_summary("subscribers_list_box", data);
             /* set context for the modal dialog */
             aw_subscriber_modal_data(data.user);
           }else{
             $("#" + "owners_subscribers_list").html('<span>No subscribers to the channels.</span>');
           }

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting subscribers list. \n ActWitty is trying to solve.');
        }
    });

}


function create_and_add_last_updates_in_auth_sect(box_id)
{
  var latest_update_box = $("#" + box_id);
  var html = '<div class="p-channelp-auth-last-upd-post">'+
                '<div class="p-channelp-auth-last-upd-post-time">'+
                    '<span>2 mins ago</span>'+
                '</div>' +
                '<div class="p-channelp-auth-last-upd-post-text">' +
                    '<p>alok purchased and repaired by some the of the most known persons...</p>' +
                '</div>' +
             '</div>' +
             '<div class="p-channelp-auth-subscriptions" id="owners_subscription_list">' +
             '</div>' +
             '<div class="p-channelp-auth-subscribers" id="owners_subscribers_list" >' +
             '</div>';
  latest_update_box.append(html);

}




/*******************************************************************/


function create_and_add_summary_author(author_box, owner_id)
{
  /*
   */
   var unique_id =  'SUMMARY_AUTHOR_' + owner_id;
   if ($("#" + unique_id ).length > 0){
     return;
   }
   var latest_update_id = unique_id + '_latest_update'; 
   
   var html =   '<div class="p-channelp-author-img-sect">' +
                  '<img src="/images/profile/default.png">' +
                '</div>' +
                '<div class="p-channelp-author-name">' +
                   '<span>Samarth Deo</span>' +
                '</div>' +
                '<div class="p-channelp-auth-last-upd-sect" id="' + latest_update_id + '">' +
                   '<div class="p-channelp-auth-last-upd-hd">' +
                      '<span>Last Updates :</span>' +
                   '</div>' +
                '</div>';
    
    $("#p-channelp-author-section").html(html);
    create_and_add_last_updates_in_auth_sect(latest_update_id);
    
}


/* handle complete summary box */
function create_and_add_summary(summary_box, summary){
 /* Fail safe, due to any reason this happens, reject the summary from being displayed again */
 var unique_id =  'SUMMARY_' + summary.word.id + '_' + summary.user.id;
 if ($("#" + unique_id ).length > 0){
   return;
 }
 aw_lib_console_log("profile_summary.js:create_and_add_summary called");
 var docs_box_id = unique_id + '_attachments';
 var friends_box_id = unique_id + '_friends';
 var subscribe_box_id = unique_id + '_subscribe';
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


 var html = '<div class="p-channelp-post js_summary_base_div">' +
              '<input type="hidden" class="js_summary_id_hidden" value="' + summary.id + '"/>' +
              '<div class="p-channelp-post-header">' +
                '<div class="p-channelp-post-tab">' +
                '</div>' +
                '<div class="p-channelp-post-author">' +
                  '<div class="p-channelp-post-author-img">' +
                    '<a href="/home/show?id=' +  summary.user.id + '" >' +  
                      '<img src="' + summary.user.photo + '" alt="">' +
                    '</a>'+ 
                  '</div>' +
                  '<div class="p-channelp-post-author-name">' +
                    '<span>' + summary.user.full_name+ '</span>' +
                  '</div>' +
                '</div>' +
              '</div> ' +
              

              '<div class="p-channelp-post-info">' +
                '<div class="p-channelp-post-lu" id="' + latest_text_box_id  + '">' +
                  '<div class="p-channelp-post-lu-header">' +
                    '<span>Last Updates</span>' +
                  '</div>' +
                '</div>' +
            
                '<div class="p-channelp-post-cu">' +
                  '<span>'  +
                     summary.word.name + 
                  '</span>' +
                  '<div class="p-channelp-post-subscribe" id="' + subscribe_box_id + '">'
                  '</div>' +
                '</div>' +
                '<div class="p-channelp-post-analytic">' +
                  '<div class="p-channelp-post-like">' +
                    '<p><center>' + summary.count + '</center></p> <p> <center>Likes</center></p>' +
                  '</div>' +
                  '<div class="p-channelp-post-post">' +
                    '<p><center>' + summary.count + '</center></p> <p> <center>posts</center></p>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              '<div class="p-channelp-related-info">' +
                '<div class="p-channelp-rel-frnd" >' +
                  '<div class="p-channelp-post-rel-friend-header">' +
                    '<span>Related Friends :</span>'+
                  '</div>' +
                  '<div id="' + friends_box_id + '">' +
                  '</div>' +
                '</div>' +
                '<div class="p-channelp-post-rel-elem" >' +
                  '<div class="p-channelp-post-rel-elem-header">' +
                    '<span>Related Elements :</span>'+
                  '</div>' +
                  '<div class="p-channelp-post-relelem-sect">' +
                    '<ul class="p-channelp-post-relelem" id="' + entities_box_id  + '">' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
                '<div class="p-channelp-post-rel-loc" >' +
                  '<div class="p-channelp-post-rel-loc-header">' +
                    '<span>Related Locations :</span>'+
                  '</div>' +
                  '<div class="p-channelp-post-relloc-sect">' +
                    '<ul class="p-channelp-post-relelem" id="' + locations_box_id  + '">' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              '<div class="p-channelp-post-rel-img" >' +
                '<div class="p-channelp-post-rel-img-header">' +
                    '<span>Related Images :</span>'+
                '</div>' +
                '<div class="p-channelp-rel-img">' +
                  '<div id="' + docs_box_id + '">' +
                  '</div>' +
                '</div>' +
              '</div>' +

            '</div>';


        /* overall summary div is added */        
        summary_box.append(html);
        aw_lib_console_log("profile_summary.js:create_and_add_summary html appended");
        /* handle individual divs */
        //create_and_add_post_author_box(post_author_box_id, summary);
        create_and_docs_box(docs_box_id, summary); 
        create_add_add_subscribe_box(subscribe_box_id, summary);
        create_and_add_text_box(latest_text_box_id, summary);
        create_and_add_friends_box(friends_box_id, summary);
        create_and_add_entities_box(entities_box_id, summary);
        create_and_add_locations_box(locations_box_id, summary);

}
/*
 *
 */
function append_personal_summary(owner_id){
  var scroll = $(window).scrollTop();
  var more_cookie =  $("#more_channels_cookie").val();
  aw_lib_console_log("profile_summary.js:append_personal_summary");
  $.ajax({
        url: '/home/get_summary.json',
        type: 'GET',
        data: {
                user_id : owner_id, 
                updated_at:more_cookie, 
                page_type:aw_get_channel_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',  
        success: function (data) {
          // if rails demands a redirect because of log in missing
           $.each(data, function(i,summary){
            if( summary ){
                //alert(JSON.stringify(summary));
                //create_and_add_summary($('#channels_display_list'),summary);
                create_and_add_summary($('#p-channelp-posts'),summary);
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


/*
 * To fetch and create the author section (on right side) of channel page
 */
function attach_channel_author_section(owner_id){
  /* 
   * I am not sure of api to call hence leaving it blank...
   */
   create_and_add_summary_author($('#p-channelp-author-section'),owner_id);
   create_and_add_subscribers_in_auth_sect();
   create_and_add_subscriptions_in_auth_sect();
}


function aw_summary_reload_tab(owner_id){
  $('#p-channelp-posts').html('');
  $("#more_channels_cookie").val("");
  append_personal_summary(owner_id);

}

function subscribe_summary(trigger_ele, sub_summary_id, action ){
    var post_url="";
    aw_lib_console_log("profile_summary.js:called subscribe/unsubscribe summary");
    if( action == true ){
      post_url = '/home/subscribe_summary.json';
    }else{
      post_url = '/home/unsubscribe_summary.json';
    }
    $.ajax({
        url: post_url,
        type: 'POST',
        data: {summary_id:sub_summary_id},
        dataType: 'json',
        success: function (data) {
          if(action == true){
            trigger_ele.html('UNSUBSCRIBE');
          }else{
            trigger_ele.html('SUBSCRIBE');
            if(aw_lib_get_session_owner_id() == aw_lib_get_page_owner_id() &&
              aw_get_channel_scope() == 2 ){
              trigger_ele.closest('.js_summary_base_div').hide();
            }
          }
         
        return false;
         
         
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
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
            /* do not cause reload */
            reset_filter(false);
            modify_filter(filter);
          }

          return false;
        }
      aw_lib_alert("ActWitty will fix the problem with the filter");
    });
    /**********************/
    $(".js_subscribe_summary").live('click', function(){
      aw_lib_console_log("profile_summary.js:clicked subscribe/unsubscribe summary");
      var summary_id =$(this).closest('.js_summary_base_div').find('.js_summary_id_hidden').val();
      var action = $(this).html();
      if (action == 'SUBSCRIBE'){
        subscribe_summary($(this), summary_id, true);
      }else{
        subscribe_summary($(this), summary_id, false);
      }
      
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
