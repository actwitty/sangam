1/**********************************/
/* Big global jsons which need to maintain context for dynamism*/
var the_big_comment_add_json={ };
var the_big_comment_show_all_json={ };
var the_big_comment_delete_json={ };


var the_big_stream_actions_json={ };

var the_big_stream_campaign_manager_json={ };
var the_big_stream_campaign_show_all={};
var the_big_stream_enriched_state={};
var the_big_stream_post_text={};

var the_big_stream_entity_deletes={};
/**********************************/

function getEmbeddedPlayer( url, height, width){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);
	if( youtubeUrl ){
	  output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+youtubeUrl[1]+'?wmode=transparent" frameborder="0" wmode="Opaque"></iframe>';
    
	}else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '<p>no video url found - only vimeo and youtube supported</p>';
	}
	return output;
}

/*
 * Render stream docs
 * Attaching the docs with rel attribute
 * This rel attribute will start iwth fnc_group (for fancy box group)
 * There are different version of fancy box which can also be used.
 * The current one in place is for image gallery
 */
function handle_stream_docs(type, box_id, stream){
  docs_box= $("#" + box_id);
  if ( stream.documents &&  stream.documents.count ){
    var ul_box = $("#" + box_id);
    $.each(stream.documents.array, function(i, attachment){
      var caption = "";
      if(attachment.caption && attachment.caption.length){
        caption = attachment.caption;
      }
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }
      if( attachment.category == type && type == "image" ){
        aw_lib_console_log ("debug", "stream attaching thumb url:" + thumb_nail);
        var html='<a rel="fnc_group_'+ box_id +'" href="' + attachment.url + '" title="' + caption  + '">' + 
                  '<img alt="" src="'+ thumb_nail + '"  width="50" height="50" alt="" />' +
                '</a>'; 
        ul_box.append(html);
      }
     
    });

    $.each(stream.documents.array, function(i, attachment){
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }
      if( attachment.category == type && type == "video" ){
        aw_lib_console_log ("debug", "stream attaching video url:" + thumb_nail);
        var html=getEmbeddedPlayer( attachment.url, 180, 240);
        
        ul_box.append(html);
      }
     
    });
    /* activate fancy box  */
    activate_fancybox_group(box_id);
  }else{
    /* hide if there is nothing to show */
    docs_box.hide();
  }
}



/*
 * Render stream campaign
 */

function get_campaign_likes_label(count){
  if(count>1){
    return '' + count + ' Likes >';
  }else{
    return '' + count + ' Like >';
  }
}

function handle_like_campaign(div_id, stream){
  var div = $("#" + div_id);
  var link = div_id + "_link";
  var text_id = div_id + "_span";
  var user_status = false;
  var total_count = 0;
  var img_src = '/images/alpha/like.png';

  $.each(stream.campaigns, function(i,campaign){
    if( campaign.name == "like" ){
       if(campaign.user ){
         user_status = campaign.user;
       }
       total_count = campaign.count;
    } 
  }); 
  var campaign_manager_json = {
                                  campaign_div_id:div_id,
                                  name:"like",
                                  user:user_status,
                                  post_id:stream.post.id,
                                  count: total_count
                              };

 the_big_stream_campaign_manager_json[div_id] = campaign_manager_json;
 if (user_status == true){
   img_src = '/images/alpha/unlike.png';
 }

  var html = '<div class="p-awp-view-campaign_all ">' +
                
                '<span class="js_campaign_show_all" id="' + text_id + '" value="' + div_id + '" >' +
                    get_campaign_likes_label(total_count) + 
                '</span>' +

                '<a id="' + link + '" value="' + div_id + '" class="js_like_user_action">' +
                  '<img src="' + img_src + '" />' +
                '</a>' + 
            '</div>' +
            '<div class="p-awp-campaigns-section">' +
            '</div>';
    
  
               
  
  div.append(html);

  
}
/*
 * Show all users in a campaign
 */
function show_all_stream_campaigns(likes, div){
  var likes_html="";
  $.each(likes, function(i,like){
    var like_html = '<div class="author">' +
                        '<div class="p-st-comment-actor-image">' +
                          '<a href="/home/show?id=' +  like.id + '">' +
                            '<img class="avatar" src="' + like.photo + '" width="32" height="32" alt="" />' +
                          '</a>' +
                        '</div>' +
                        '<div class="p-st-comment-actor-desc">' +
                          '<span class="p-st-comment-actor">' +
                            '<a href="/home/show?id=' +  like.id + '">' +
                              like.full_name +
                            '</a>' +
                          '</span>' +
                        '</div>' +
                      '</div>';
    likes_html = likes_html + like_html;
  }); 
  div.html(likes_html);
      
      
}

/*
 * Render stream campaign
 */
function handle_stream_campaign(box_id, stream){
  var div=$("#" + box_id);
  if(stream.post.campaign_types == 1){
    handle_like_campaign(box_id, stream);
  }else{
    div.hide();
  }
}

function append_entity_delete(post_id){
    /*handle entity delete*/
   var entity_del_json = the_big_stream_post_text[post_id];
    if ( entity_del_json ){
      var box_id = entity_del_json.text_box;
      var user_id = entity_del_json.user;
      var current_user_id=$('#session_owner_id').attr("value");  

      if(current_user_id == user_id){
        $("#" + box_id).find(".js_activity_entity").each(function(){
          $(this).addClass("js_handle_stream_entity_mention");
          var entity_id = $(this).attr("value");
          $(this).attr("href","/entity_page?entity_id=" +  entity_id);
          var remove_val = {post_id:post_id , entity:entity_id };
          
          var remove_id = post_id + '_' + entity_id + "_rem";
          the_big_stream_entity_deletes[remove_id] = remove_val;
          var hover_html = '<span>' +
                              '<a id="' + remove_id + '" value="' + remove_val + '" class="js_entity_delete"> Remove </a>' +
                           '</span>';
          $(this).append(hover_html);
        });
      }
    }
    return;
}




/*
 * Render stream text
 */
function handle_stream_text( box_id, post_text){
  var div=$("#" + box_id);
  if(post_text && post_text.length){
        var html='<p>' +
                post_text +
             '</p>';

        div.html(html);
    
  }else{
    /* text not defined correctly */
    div.hide();
  }
}

/*
 * Render stream location
 */
function handle_stream_location(box_id, location){
     var div = $("#" + box_id);
     if ( location && location.name && location.name.length){
      var html='<img class="locations_box_images" src="' + get_location_image_for_type(location.type) +  '"/>' +
                '<div class="p-awp-location-name">' +
                  '<a href="/location_page?location_id=' + location.id + '">' +
                    '<span >' +
                      location.name +
                    '</span>' +
                  '</a>' +
                '</div>';
      div.html(html);
     }else{
       div.hide();
     }
               
}


/*
 * Render stream close button
 */
function handle_stream_actions(box_id, stream, current_user_id){
  var div=$("#" + box_id);
  if(current_user_id != stream.post.user.id){
    div.hide();
    return;
  }
  /* set context on parent div  */
  var action_btn_json = {
                          stream_id : stream.post.id 
                       };
 
  the_big_stream_actions_json[box_id] = action_btn_json;

  if( stream.post.status == 1){
    var html = '<input type="button" value="Edit" class="js_stream_edit_btn p-awp-edit"/>' +
               '<input type="button" value="Publish" class="js_stream_publish_btn p-awp-publish"/>' ;
    div.append(html);
  }

  var html = '<input type="button" value="x" class="js_stream_delete_btn p-awp-close"/>';
  div.append(html);
  
}

/*
 * Render comments close button
 */
function handle_comment_close_box(box_id, comment, comment_post_id, current_user_id, comment_id, show_all_id){
  var div=$("#" + box_id);
  if(current_user_id != comment.user.id){
    div.hide();
    return;
  }


  /* Set context to handle close button 
   * Don't mess with this structure
   */
  var comment_close_json = {
                            comment_id : comment.id,
                            comment_del_id : comment_id,
                            post_id : comment_post_id,
                            all_id: show_all_id
                           };
  var comment_close_id = 'COMMENT_CLOSE_BTN_' + comment.id;
  the_big_comment_delete_json[comment_close_id] = comment_close_json;
  /******************************/


  var html = '<input type="button" value="Remove" id="' + comment_close_id + '"' + 
                    'class="js_comment_delete_btn p-st-comment-close-btn"/>';
  div.append(html);
}


function handle_stream_single_comment(comment, div_id, comment_post_id, current_user_id, show_all_id){

  var div = $("#" + div_id);
  var comment_box_id =  div_id + "_" + comment.id;
  var close_box_id =  comment_box_id + '_close'; 
  var comment_id = 'comment_list_' + comment.id;

  var html = '<div class="p-awp-comment" id="' + comment_id + '">' +
                    /* close box */
                  '<div class="p-st-comment-close" id="'+ close_box_id +'">' +
                  '</div>' +

                '<div class="author">' +
                    '<div class="p-st-comment-actor-image">' +
                      '<a href="/home/show?id=' +  comment.user.id + '">' +
                        '<img class="avatar" src="' + comment.user.photo + '" width="32" height="32" alt="" />' +
                      '</a>' +
                    '</div>' +
                    '<div class="p-st-comment-actor-desc">' +
                        '<span class="p-st-comment-actor">' +
                          '<a href="/home/show?id=' +  comment.user.id + '">' +
                            comment.user.full_name +
                          '</a>' +
                        '</span>' +
                        '<span class="wrote">wrote:</span>' +
                        '<span class="p-st-comment-submitdate">' + comment.time + '</span>' +
                    '</div>' +
                    '<div class="p-st-comment-content">' +
                      '<p class="comment-text">' + comment.text  + '</p>' +
                    '</div>' +
                 '</div>' +
              '</div>';
      div.append(html);
      handle_comment_close_box(close_box_id, 
                               comment, 
                               comment_post_id, 
                               current_user_id, 
                               comment_id, 
                               show_all_id);

}

/*
 * Render stream comments
 */
function setup_comment_handling(all_box_id, box_id, postid, comment_count){
  var comment_show_all_id = box_id + '_show_all';
  var html = '<span class="view-comments js_show_all_comment_btn" id=' + comment_show_all_id + '>' +
                get_comment_head_label(comment_count) +
             '</span>';
  $("#" + all_box_id).html(html);  

  var show_all_json = {post_id:postid,
                      div_id:box_id,
                      all_id:comment_show_all_id,
                      count:comment_count};


  the_big_comment_show_all_json[comment_show_all_id] = show_all_json;
}

function show_all_stream_comments(comments, post_id, current_user_id, comment_show_all_id){

  var comments_count=0;
  var comments_div_id = the_big_comment_show_all_json[comment_show_all_id].div_id;
  var div = $("#" + comments_div_id);
  div.html("");
  var add_new_btn_id = 'COMMENT_ADD_NEW_BTN_' + post_id;
  var add_new_textarea_id = 'COMMENT_ADD_NEW_TEXT_' + post_id;
  var count_display_span_id = 'COUNT_DISPLAY_SPAN_' + post_id;


  var add_new_comment_json = {
                                post_id:post_id,
                                text_id:add_new_textarea_id,
                                div_id:comments_div_id,
                                all_id:comment_show_all_id
                             };
  the_big_comment_add_json[add_new_btn_id] = add_new_comment_json;


  if( comments && comments.length){
    comments_count = comments.length;
  }


   /* add new comments */
    var html = 
               '<div class="p-st-comment-new">' +
                  '<div class="stream_comment_text_area_box">' +
                    '<textarea class="p-st-comment-text-box" rows="2" cols="20" maxlength="200" placeholder="New Comment" id="' + add_new_textarea_id + '" >' +
                    '</textarea>' +
                  '</div>' +
                  '<div class="stream_comment_text_area_box_btn_box">' +
                    '<input type="button"  value="Post" class="js_add_new_comment p-st-comment-add-btn" id="' + add_new_btn_id + '"/>' +
                  '</div>' +
               '</div>'; 
    div.append(html);


  /* context is set, go ahead */
  
  $.each(comments, function(i,data){
    if( data && data.comment ){
      handle_stream_single_comment(data.comment, comments_div_id, post_id, current_user_id, comment_show_all_id); 
    }

  });

   
    div.show();
}


function get_comment_head_label(count){
  if (count > 1){
    return '' + count + ' Comments >';
  }else{
    return '' + count + ' Comment >';
  }
}


/************************************/
/*
 * Handling enrich updates through polling
 */
/************************************/
function setup_polling_for_enrich(){
  var check_data=0;
  for(var i in the_big_stream_enriched_state) { 
    check_data++;
    break;
  }
  if (check_data == 1) {
    setTimeout(update_enriched_streams, 60000);
  }
}

/************************************/

function get_enriched_streams(post_ids_arr){
   $.ajax({

            url: '/home/get_enriched_activities.json',
            type: 'GET',
            data: {
                    "post_ids" : post_ids_arr
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              // if rails demands a redirect because of log in missing 
            $.each(data, function(i,stream){
              var box_id = the_big_stream_enriched_state[stream.post.id].text_box;
              if( stream.post.enriched == true ){
                handle_stream_text(box_id, 
                                stream.post.text);
                the_big_stream_post_text[stream.post.id] = {
                                                          text_box : box_id,
                                                          user : stream.post.user.id
                                                         };
                append_entity_delete(stream.post.id);
                // remove the element from the list of un enriched streams 
                delete the_big_stream_enriched_state[stream.post.id];
              }
            });

           setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown){ 
            alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
        }
    });
   
}



/************************************/
function update_enriched_streams () {

  var post_ids_arr = [];
  var i=0;
  for(var key in the_big_stream_enriched_state) {
    post_ids_arr[i] = key;
    i++;
  }
  get_enriched_streams(post_ids_arr);
}
/*********************************************/



/*
 *
 */
function redirect_to_streams_filtered_of_other_user(page_owner_id, session_owner_id){
    params='id=' + page_owner_id +'&mode=filtered&' + get_long_string_filter();
    //alert('/home/show?' + params);
    window.location.href ='/home/show?' + params;
}



/*
 * On change of filter we need to do all these
 * On load of page as well we need to do all these
 */
function reload_streams_on_viewed_user(page_owner_id, session_owner_id){
  aw_lib_console_log("debug", "reload_streams_on_viewed_user: page:" + page_owner_id + ' session:' + session_owner_id);
  clear_streams();
  append_stream(page_owner_id, session_owner_id);

  clear_related_entities();
  list_related_entities(page_owner_id);

  clear_related_locations();
  list_related_locations(page_owner_id);

  clear_related_friends();
  if( session_owner_id){ 
    list_related_friends();
  }
  

  //clear_related_channels();
  //list_related_channels(page_owner_id);
  

}


/*********************************************/

function get_stream_ele_id(post_id, prefix){
  if( prefix == undefined){
    prefix="aw";
  }
  return prefix + 'stream_render_id_' + post_id;
}

/*
 * Create div
 */
function create_and_add_stream(streams_box, stream, current_user_id, prepend){
  var post = stream.post;
  var comments = stream.comment;
  if(prepend===undefined){
    prepend=false;
  }
  
  
  var stream_render_id= get_stream_ele_id(post.id);

  /* Fail safe, due to any reason this happens, reject the stream from being displayed again*/
  if ($("#" + stream_render_id ).length > 0){
   return;
  }

  var doc_box_id      =  stream_render_id + '_docs';
  var video_doc_box_id = stream_render_id + '_videos';
  var campaign_box_id =  stream_render_id + '_campaigns';
  var text_box_id     =  stream_render_id + '_text';
  var location_box_id =  stream_render_id + '_location';
  var action_box_id   = stream_render_id + '_action';
  var comment_box_id  = stream_render_id + '_comments';
  var comment_box_show_all_div_id  = stream_render_id + '_show_all';
  var date_js = Date.parse('t');

  var external_shares="";
  if ( post.status == 2){
    /* Share FB */
    external_shares= '<div class="p-awp-share"  >' +
                      '<div class="fb_share_div" >' +
                        '<a name="fb_share" type="box_count" expr:share_url="' +'http://localhost:3000/view?id=' + post.id + '" ' + 
                          'href="http://www.facebook.com/sharer.php" id="fb_share">Share</a>' + 
                        '<script src="http://static.ak.fbcdn.net/connect.php/js/FB.Share" type="text/javascript">' +
                        '</script>' +
                      '</div>' +
                    '</div>';

  }
  /* Main stream div definition */
  var stream_ele_id = get_stream_ele_id(post.id);
  var html = '<div id="' + stream_ele_id + '" class="p-aw-post" value="' + post.id + '">' +

                    /* Post originator user */
                    '<div class="p-awp-user">' +

                        '<a href="/home/show?id=' +  post.user.id + '" >' +
                          '<img src="' + post.user.photo + '" alt="" />' +
                            '<br/>'  +
                            post.user.full_name + 
                        '</a>'+  
                    '</div>' +
                     /* post close */
                     '<div class="p-awp-actions" id="' + action_box_id + '" >' +
                     '</div>' +


                    /*************************** Title box ****************************/ 
                      /* Post channel user */
                      '<div class="p-awp-channel js_channel_div_show">' +
                        '<div class="p-awp-channel-desc">' +
                          '<label class="p-awp-channel-label">'  +
                            'Channel:' +
                          '</label>' +
                          '<a href="/channel_page?channel_id=' +  post.word.id + '">' +
                            '<span class="p-awp-channel-name">' +
                              post.word.name +
                            '</span>' +
                          '</a>' +
                        '</div>' +
                      '</div>' +

                      '<div class="p-awp-subtitle">' +
                        '<a href="/view?id=' + post.id + '">' +
                          '<span class="p-awp-subtitle-name">' + post.sub_title +'</span>' +
                        '</a>' +
                      '</div>' +

                      '<div class="p-awp-time">' +
                        '<span class="p-awp-time-content">' + date_js.toString("hh:mm tt") + '</span>' +
                      '</div>' +

                      '<div class="p-awp-date">' +
                        '<span class="p-awp-date-content">' + date_js.toString("dddd, dd MMMM yyyy") + '</span>' +
                      '</div>' +



                    /* Post text*/
                    '<div class="p-awp-content" id="' + text_box_id + '" >' +
                    '</div>' +
                  
                    /* Post text*/
                    '<div class="p-awp-location js_location_hide" id="' + location_box_id + '" >' +
                    '</div>' +
                    /* Post attachment */
                    '<div style="z-index:1;" class="p-awp-view-attachment" id="' + doc_box_id + '" >' +
                    '</div>' +

                    /* Post video attachment */
                    '<div style="z-index:1;" class="p-awp-view-video-attachment" id="' + video_doc_box_id + '" >' +
                    '</div>' +
                    
                    external_shares +
                    

                    /* Post campaigns */
                    '<div class="p-awp-view-campaign" id="' + campaign_box_id + '" >' +
                    '</div>' +
       

                    '<div class="p-awp-view-comment" id="' + comment_box_show_all_div_id + '">' +
                    '</div>' +              
                    
                    /* Post comments */
                    '<div class="p-awp-comments-section" id="' + comment_box_id + '" >' +
                    '</div>' +

              '</div>'; /* div class: p-aw-post*/
  if(prepend == true){
    streams_box.prepend(html);
  }else{
    streams_box.append(html);
  }
  handle_stream_actions(action_box_id, stream, current_user_id);
  handle_stream_text(text_box_id, stream.post.text);

  handle_stream_location(location_box_id, stream.location);
  handle_stream_docs("image", doc_box_id, stream);
  handle_stream_docs("video", video_doc_box_id, stream);

  if( post.status == 2){
    setup_comment_handling(comment_box_show_all_div_id,
                           comment_box_id,  
                           post.id,
                           stream.comments.count);
    handle_stream_campaign(campaign_box_id, stream);
  }
  setup_readmore("div#"+ text_box_id + " p",250); /* read more for content with character slice at 100 */

  


  if( stream.post.enriched == false ){
    the_big_stream_enriched_state[stream.post.id] = {text_box : text_box_id};
  }

  the_big_stream_post_text[post.id] = {
                                          text_box : text_box_id,
                                          user : post.user.id
                                        };
  append_entity_delete(post.id);

  if(!get_others_filter_state()){
    $(".p-awp-user").hide();
  }
}





/*
 * Add streams to the page
 */
function append_stream(owner_id, current_user_id){
  var scroll = $(window).scrollTop();
  var more_cookie = $("#more_streams_cookie").val();


  $.ajax({
        url: '/home/get_streams.json',
        type: 'GET',
        data: {
                user_id : owner_id,
                updated_at : more_cookie,
                filter : get_filter(),
                friend:get_others_filter_state()
              },
        dataType: 'json',
        contentType: 'application/json',
       success: function (data) {
          // if rails demands a redirect because of log in missing 
           $.each(data, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_streams_cookie").val(stream.post.time);
            } 

           
          });

            /* set up polling for checking enriching */
            setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting streams. \n ActWitty is trying to solve.');
        }
    });
    $(window).scrollTop(scroll);

  
}

/*comment related apis*/
//INPUT => activity_id = 123, :author_id => 234, :text => "helllo"
function add_comment(add_json){
    var comment_data={
                        activity_id:add_json.post_id,
                        text:$("#" + add_json.text_id).val()
                      };
    var current_user_id=$('#session_owner_id').attr("value");
    $.ajax({
        url: '/home/create_comment.json',
        type: 'POST',
        data: comment_data,
        dataType: 'json',
        success: function (data) {
          handle_stream_single_comment( data.comment, 
                                        add_json.div_id, 
                                        add_json.post_id, 
                                        current_user_id,
                                        add_json.all_id);
          $("#" + add_json.text_id).val("");
          var comment_count = the_big_comment_show_all_json[add_json.all_id].count + 1;
          the_big_comment_show_all_json[add_json.all_id].count = comment_count;
          var all_id = add_json.all_id;
          //alert(all_id);
          //alert(get_comment_head_label(comment_count));
          $("#" + all_id).html(get_comment_head_label(comment_count));
         
         
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}

//#INPUT => comment_id = 1234
function delete_comment(post_id, comment_id, del_id, all_id){
    $.ajax({
        url: '/home/delete_comment.json',
        type: 'POST',
        data: {"comment_id":comment_id},
        dataType: 'json',
        success: function (data) {
          $("#" + del_id).empty().remove();
          var comment_count = the_big_comment_show_all_json[all_id].count - 1;
          the_big_comment_show_all_json[all_id].count = comment_count;
          $("#" + all_id).html(get_comment_head_label(comment_count));

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
        }
    });
}


function delete_entity_from_post(post_id, entity_id){
    $.ajax({
        url: '/home/delete_entities_from_post.json',
        type: 'POST',
        data: {post_id:post_id, entity_id:entity_id},
        dataType: 'json',
        success: function (data) {
           var box_id = the_big_stream_post_text[data.post.id].text_box;
           handle_stream_text( box_id, data.post.text);
           append_entity_delete(data.post.id); 
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting entity from post. \n ActWitty is trying to solve.');
        }
    });
}

//#INPUT => activity_id => 123
function show_all_comments(post_id, all_id){
    var current_user_id=$('#session_owner_id').attr("value");
    $.ajax({
        url: '/home/get_all_comments.json',
        type: 'POST',
        data: {activity_id:post_id},
        dataType: 'json',
        success: function (data) {

          show_all_stream_comments(data, post_id, current_user_id, all_id);
          $(this).parent().next().slideToggle();
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}

/*
* Delete stream
*/
function delete_stream(post_id){
  var stream_render_id = get_stream_ele_id(post_id);
  $.ajax({
    url: '/home/delete_stream.json',
    type: 'POST',
    data: "post_id=" + post_id,
    dataType: 'json',
    success: function (data) {
      $("#" + stream_render_id).empty().remove();
    },
    error:function(XMLHttpRequest,textStatus, errorThrown) {
      alert('There has been a problem in deleting the stream. \n ActWitty is trying to solve.');
    }
  });
}


/*
 * process user campaign action
 */
function process_user_campaign_action(campaign_manager_json){
 
    if( campaign_manager_json.user == false){
      $.ajax({
          url: '/home/create_campaign.json',
          type: 'POST',
          data: { 
                  name:campaign_manager_json.name, 
                  value:1, 
                  activity_id:campaign_manager_json.post_id
                },
          dataType: 'json',
          success: function (data) {
            if( data.name == "like" && data.user==true ){
              campaign_manager_json.user= true;
              var link_id = campaign_manager_json.campaign_div_id + '_link'; 
              var span_id = campaign_manager_json.campaign_div_id + '_span';
              campaign_manager_json.count = data.count;
              $("#" + span_id).html(get_campaign_likes_label(campaign_manager_json.count));
              $("#" + link_id).html('<img src="/images/alpha/unlike.png" />');
            }
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
    }else{
       $.ajax({
          url: '/home/delete_campaign.json',
          type: 'POST',
          data: { 
                  name:campaign_manager_json.name, 
                  activity_id:campaign_manager_json.post_id
                },
          dataType: 'json',
          success: function (data) {
            if( data.name == "like" && data.user==false ){
              campaign_manager_json.user= false;
              var link_id = campaign_manager_json.campaign_div_id + '_link'; 
              var span_id = campaign_manager_json.campaign_div_id + '_span';
              campaign_manager_json.count = data.count;
              $("#" + span_id).html(get_campaign_likes_label(campaign_manager_json.count));
              $("#" + link_id).html('<img src="/images/alpha/like.png" />');
            } 
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
    }
}

/**************************/
/*
 *  Show all campaigns
 */
function show_all_campaigns(campaign_manager_json){
  $.ajax({
          url: '/home/get_users_of_campaign.json',
          type: 'GET',
         data: { 
                  name:campaign_manager_json.name, 
                  activity_id:campaign_manager_json.post_id
                },
          dataType: 'json',
          success: function (data) {
            show_all_stream_campaigns(data, $("#" + campaign_manager_json.campaign_div_id).next());
            $("#" + campaign_manager_json.campaign_div_id).next().slideToggle();
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
}
/**************************/
/*
 *  Remove document from post
 */
function remove_document_from_post(document_id){
   $.ajax({
          url: '/home/remove_document.json',
          type: 'POST',
          data: { 
                  doc_id:document_id, 
                },
          dataType: 'json',
          success: function (data) {
            /*remove that document*/
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
}
/**************************/


/*
 * Bring stream on focus whenever there is a change in filter
 */
function set_stream_to_focus_on_filter_change(){
    $(".tab_content").hide();
    $("ul.p-cstab li").removeClass("active");
    $("ul.p-cstab li:last").addClass("active").show();
    $(".tab_content:last").show();


    $("#channels_left_side_bar").hide();
    $("#channels_main_bar").hide();
    $("#channels_right_side_bar").hide();
    $("#streams_left_side_bar").fadeIn();
    $("#streams_main_bar").fadeIn();
    $("#streams_right_side_bar").fadeIn();
}


/*
 * Clear stream div completely
 */
function clear_streams(){
  $("#streams_list").empty();
  $("#more_streams_cookie").val("");
  /* reset all big jsons */
  the_big_comment_add_json={ };
  the_big_comment_show_all_json={ };
  the_big_comment_delete_json={ };
  the_big_stream_actions_json={ };
  the_big_stream_campaign_manager_json={};
  the_big_stream_campaign_show_all={};
  the_big_stream_enriched_state={};
  the_big_stream_post_text={};
  the_big_stream_entity_deletes={};
  /***********************/
}





/*
 * Add the live bindings
 */
$(document).ready(function(){

  /*
   * Comment add button clicked
   */
  $('.js_add_new_comment').live('click', function(){
    //the_big_comment_count_json
    var add_json = the_big_comment_add_json[$(this).attr("id")];
    if(add_json){
      if( !$("#" + add_json.text_id).val() || jQuery.trim($("#" + add_json.text_id).val()) == "" ){
        alert("Nothing written on comment");
        return;
      }
      add_comment( add_json);
    }
    return false;
  });

  /*
   * Comment delete button clicked
   */
  $('.js_comment_delete_btn').live('click', function(){
    //the_big_comment_count_json
    var del_json = the_big_comment_delete_json[$(this).attr("id")];
    if(del_json){
      delete_comment(del_json.post_id, 
                    del_json.comment_id, 
                    del_json.comment_del_id,
                    del_json.all_id);

    }
    return false;
  });
  /********************************/

  /*
   * Stream delete button clicked
   */
  $('.js_stream_delete_btn').live('click', function(){
    var del_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    if(del_json){
      delete_stream(del_json.stream_id);
    }
    return false;
  });
  /********************************/
  /*
   * Stream edit button clicked
   */
  $('.js_stream_edit_btn').live('click', function(){
    var edit_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    if(edit_json){
      //alert("edit:" + edit_json.stream_id);
      aw_edit_drafted_stream(edit_json.stream_id);
    }
    return false;
  });
  /********************************/
  /*
   * Stream publish button clicked
   */
  $('.js_stream_publish_btn').live('click', function(){
    var publish_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    if(publish_json){
      aw_publish_drafted_stream( publish_json.stream_id);
    }
    return false;
  });
  /********************************/

  /*
   * Stream show all button clicked
   */
  $('.js_show_all_comment_btn').live('click', function(){
    var all_json = the_big_comment_show_all_json[$(this).attr("id")];
    if(all_json){
      show_all_comments(all_json.post_id, $(this).attr("id"));
    }
    return false;
  });

  /*
   * User action on campaign
   */
  $('.js_like_user_action').live('click', function(){
    var div_id = $(this).attr("value");
    campaign_manager = the_big_stream_campaign_manager_json[div_id];
    process_user_campaign_action(campaign_manager);
    return false;
  });
  /********************************/

  /*
   * User action show all
   */
  $('.js_campaign_show_all').live('click', function(){
    var div_id = $(this).attr("value");
    campaign_manager = the_big_stream_campaign_manager_json[div_id];
    show_all_campaigns(campaign_manager); 
    return false;
  });
  /********************************/

  /*
   * Delete entity mentioned in text
   */
  $('.js_entity_delete').live('click' , function(){

    delete_entity_from_post(the_big_stream_entity_deletes[$(this).attr("id")]["post_id"], 
                            the_big_stream_entity_deletes[$(this).attr("id")]["entity"]);
  });

  /*
   * Remove an attached document
   */
  $('.js_remove_attached_doc').live('click', function(){
    remove_document_from_post();
  });

});
/************************************/
