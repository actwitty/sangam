/**********************************/
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
	  output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+youtubeUrl[1]+'?wmode=transparent"></iframe>';
    
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
function handle_stream_docs(type, box_id, stream,view_all_id){
  aw_lib_console_log("debug", "stream html handle docs called");
  docs_box= $("#" + box_id);
  docs_view_all = $("#" + box_id + " div.p-awp-view-all-images-div");
  if ( stream.documents &&  stream.documents.count ){
    var ul_box = $("#" + box_id);
    

    if(stream.documents.array.length < 7){
      docs_view_all.hide();
    }else{
      if(view_all_id != ""){
        $("#"+view_all_id).html('View All ' + stream.documents.array.length + ' Images');
      }
    }

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

        var inner_box_id = box_id + "_" + attachment.id;
        /* currently 6 is the max number of images shown as icon-attachment */
        if(i>6){
          var box_html = '<div class="p-awp-view-attachment-inner-box hide_it" id="' + inner_box_id + '">' +
                   '</div>';
        }else{
          var box_html = '<div class="p-awp-view-attachment-inner-box" id="' + inner_box_id + '">' +
                   '</div>';
        }
        ul_box.append(box_html);
        var attachment_box = $("#" + inner_box_id);
      
        var image_theme_selector = "";
        if( stream.post.user.id == aw_lib_get_session_owner_id()){
          image_theme_selector = '<input type="hidden" class="js_theme_doc_id" value="' + attachment.id + '" />' +
                                 '<input type="hidden" class="js_theme_user_id" value="' + stream.post.user.id + '" />';
        }

        var html='<a rel="fnc_group_'+ box_id +'" href="' + attachment.url + '" title="' + caption  + '" >' + 
                  '<img alt="" src="'+ thumb_nail + '"   width="60" alt="" />' +
                  image_theme_selector +
                '</a>'; 
        if(aw_lib_get_session_owner_id() == stream.post.user.id){
          var close_html = '<div class="delete-image-box">' +
                            '<div class="delete-image-cntrl js_remove_attached_doc" id="' + attachment.id + '" />' +
                           '</div>';
          attachment_box.append(close_html);
        }
        attachment_box.append(html);
      }
     
    });
    /* activate fancy box  */
    activate_fancybox_group(box_id);   

    $.each(stream.documents.array, function(i, attachment){
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }
      if( attachment.category == type && type == "video" ){
        aw_lib_console_log ("debug", "stream attaching video url:" + thumb_nail);
        var html=getEmbeddedPlayer( attachment.url, 180, 240);
        
        var inner_box_id = box_id + "_" + attachment.id;
        var box_html = '<div class="p-awp-video-view-attachment-inner-box" id="' + inner_box_id + '">' +
                   '</div>';
        ul_box.append(box_html);
        var attachment_box = $("#" + inner_box_id);
        if(aw_lib_get_session_owner_id() == stream.post.user.id){
          var close_html = '<div class="delete-video-box">' +
                            '<div class="delete-image-cntrl js_remove_attached_doc" id="' + attachment.id + '" />' +
                           '</div>';
          attachment_box.append(close_html);
        }
        attachment_box.append(html);
       
      }
     
    });
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
    return '<center>' + count + '</center><center>Likes</center>';
  }else{
    return '<center>' + count + '</center><center>Like</center>';
  }
}

function get_pluralize_form(count){
  if(count>1){
    return 's';
  }else{
    return '';
  }
}


function handle_like_campaign(div_id, stream){
  var div = $("#" + div_id);
  var link = div_id + "_link";
  var text_id = div_id + "_span";
  var user_status = false;
  var total_count = 0;
  var img_src = '/images/alpha/like.png';
  var like_text = "Like";
  var like_count_div = $("#" + text_id);
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
   like_text = "Unlike";
 }

  var html = '<div class="p-awp-view-campaign_all ">' +
              
             '<a id="' + link + '" value="' + div_id + '" class="js_like_user_action">' +
                  like_text +
             '</a>' +
             '</div>' +
            '<div class="p-awp-campaigns-section">' +
            '</div>';

  var like_count_html = get_campaign_likes_label(total_count);
  /* Pramod
  var like_count_html = '<center>'+total_count+'</center><center>Like'+get_pluralize_form(total_count)+'</center>';
  var html2 = '<div class="p-awp-view-campaign_all ">' +
                
                '<span class="js_campaign_show_all" id="' + text_id + '" value="' + div_id + '" >' +
                    get_campaign_likes_label(total_count) + 
                '</span>' +

                '<a id="' + link + '" value="' + div_id + '" class="js_like_user_action">' +
                  '<img src="' + img_src + '" />' +
                '</a>' + 
            '</div>' +
            '<div class="p-awp-campaigns-section">' +
            '</div>';
    
  */
               
  
  div.append(html);
  like_count_div.append(get_campaign_likes_label(total_count));
}
/*
 * Show all users in a campaign
 */
function show_all_stream_campaigns(likes, div){
  var likes_html="";
  alert(JSON.stringify(likes));
  //alert("show_all_stream_campaigns" + div);
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
  //div.append(likes_html);
}

/*
 * Render stream campaign
 */
function handle_stream_campaign(box_id, like_count_box_id,stream){
  var div=$("#" + box_id);
  var like_count_div=$("#" + like_count_box_id);
  if(stream.post.campaign_types == 1){
    handle_like_campaign(box_id, stream);
    //div.hide();
  }else{
    div.hide();
    like_count_div.hide();
  }
}

function append_entity_delete(post_id){
    /*handle entity delete*/
   var entity_del_json = the_big_stream_post_text[post_id];
    if ( entity_del_json ){
      var box_id = entity_del_json.text_box;
      var user_id = entity_del_json.user;
      var current_user_id=aw_lib_get_page_owner_id();  

      if(current_user_id == user_id){
        $("#" + box_id).find(".js_activity_entity").each(function(){
          $(this).addClass("js_handle_stream_entity_mention");
          var entity_id = $(this).attr("value");
          $(this).attr("href","/entity_page?entity_id=" +  entity_id);
          var remove_val = {post_id:post_id , entity:entity_id };
          
          var remove_id = post_id + '_' + entity_id + "_rem";
          the_big_stream_entity_deletes[remove_id] = remove_val;
          var hover_html = '<span>' +
                              '<a id="' + remove_id + '" value="' + remove_val + '" class="js_entity_delete"> unmark </a>' +
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
           var html = '<a href="/location_page?location_id=' + location.id + '">' +
                     '<span class="p-awp-location-name" > @ ' + 
                        location.name +
                     '</span>' +
                 '</a>' ;
      div.append(html);
      
     }else{
       div.hide();
     }
               
}


/*
 * Render stream close button
 */
function handle_stream_actions(box_id, stream, current_user_id,post_operations_id,like_text_id){
  var div=$("#" + box_id);
  var like_count_div = $("#" + like_text_id);
  var post_op = $("#" + post_operations_id);
  /* set context on parent div  */
  var action_btn_json = {
                          stream_id : stream.post.id 
                       };
 
  the_big_stream_actions_json[box_id] = action_btn_json;
  if( stream.post.status == 1){
    /* basically now handling all operational buttons (mentions/comments/like etc) for drafts vs posts here itself . */
    if(current_user_id == stream.post.user.id){
      post_op.next().find(".p-awp-post-edit").show();
      post_op.next().find(".p-awp-post-publish").show();
      post_op.next().find(".p-awp-post-mentions").hide();
      post_op.next().find(".p-awp-post-like").hide();
      post_op.next().find(".p-awp-post-comments").hide();
      like_count_div.hide();
      /*var html = '<input type="button" value="Edit" class="js_stream_edit_btn p-awp-edit"/>' +
                '<input type="button" value="Publish" class="js_stream_publish_btn p-awp-publish"/>' ;
      div.append(html);
      */
    }
  }else{
    post_op.next().find(".p-awp-post-edit").hide();
    post_op.next().find(".p-awp-post-publish").hide();
    post_op.next().find(".p-awp-post-mentions").show();
    post_op.next().find(".p-awp-post-like").show();
    post_op.next().find(".p-awp-post-comments").show();
    like_count_div.show();
    /*var html = 'input type="button" value="Mentions" class="js_stream_enrich_btn p-awp-mention"/>' ;
    div.append(html);
    */
  }
  /* 
  if(current_user_id == stream.post.user.id) {
    alert("adding close");
    var html = '<input type="button" value="x" class="js_stream_delete_btn p-awp-close"/>';
    div.append(html);
  }*/
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


  var html2 = '<input type="button" value="Remove" id="' + comment_close_id + '"' + 
                    'class="js_comment_delete_btn p-st-comment-close-btn"/>';
  var html = '<div class="p-st-comment-close js_comment_delete_btn" id="' + comment_close_id + '">' +
             '</div>' ;
  div.append(html);
}


function handle_stream_single_comment(comment, div_id, comment_post_id, current_user_id, show_all_id){

  var div = $("#" + div_id);
  var comment_box_id =  div_id + "_" + comment.id;
  var close_box_id =  comment_box_id + '_close'; 
  var comment_id = 'comment_list_' + comment.id;


  var html = '<div class="p-awp-comment" id="' + comment_id + '">' +
                    /* close box */
                  '<div class="p-st-comment-close-section" id="'+ close_box_id +'">' +
                  '</div>' +

                  /*'<div class="p-awp-close-section" id="'+ close_box_id +'">' +
                      '<div class="p-awp-close js_stream_delete_btn">' +
                      '</div>' +
                   '</div>'+
                  */
                  '<div class="author">'+
                    '<div class="p-st-comment-actor-desc">'+
                        '<div class="p-st-comment-submitdate">'+
                        //'<center>' +  comment.time + '</center>'+
                            '<center>' +  '<abbr class="timeago" title="' + comment.time + '"></abbr>' + '</center>'+
                        '</div>'+
                        '<div class="p-st-comment-actor">'+
                            '<center><a href="/home/show?id=' +  comment.user.id + '">' +
                              comment.user.full_name +
                            '</a></center>'+
                        '</div>'+
                    '</div>'+
                    '<div class="p-st-comment-actor-image">'+
                      //'<a href="/home/show?id=' +  comment.user.id + '">' +
                        '<img class="avatar" src="' + comment.user.photo + '" alt="" />' +
                      //'</a>' +
                    '</div>'+
                  '</div>'+
                  '<div class="p-st-comment-content">'+
                      '<p>' + comment.text +'</p>'+
                  '</div>'+
                  '<div class="clearing"></div>'+
                '</div>';
                
      div.append(html);
      handle_comment_close_box(close_box_id, 
                               comment, 
                               comment_post_id, 
                               current_user_id, 
                               comment_id, 
                               show_all_id);
      /* convert time stamp to time ago */
      $("abbr.timeago").timeago();

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
 
  //alert("show_all_stream_comments");
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


  
    var html = '<div class="post-comment">'+
                  '<input type="text" name="comment" class="add-comment" placeholder="Add Comment...">'+
                    '<div class="submit-comment" >'+
                      '<input type="text" name="comment" class="add-comment-text p-st-comment-text-box" id="' + add_new_textarea_id + '" >'+
                      '<input type="submit" value="Post Comment" class="js_add_new_comment post-comment-btn btn-comments" id="' + add_new_btn_id + '"/>' +
                      '<input type="submit" value="Cancel" class="cancel-comment-btn btn-comments">'+
                      '<span class="comment-limit">12</span>'+
                    '</div>'+
                '</div> ';

   /* add new comments */
    var html2 = 
               '<div class="p-st-comment-new">' +
                  '<div class="stream_comment_text_area_box">' +
                    '<textarea class="p-st-comment-text-box" rows="2" cols="20" maxlength="200" placeholder="New Comment" id="' + add_new_textarea_id + '" >' +
                    '</textarea>' +
                  '</div>' +
                  '<div class="stream_comment_text_area_box_btn_box">' +
                    '<input type="button"  value="Post" class="js_add_new_comment p-st-comment-add-btn" id="' + add_new_btn_id + '"/>' +
                  '</div>' +
               '</div>'; 
    //div.append(html);
    div.html(html);


  /* context is set, go ahead */
  
  $.each(comments, function(i,data){
    if( data && data.comment ){
      handle_stream_single_comment(data.comment, comments_div_id, post_id, current_user_id, comment_show_all_id); 
    }

  });

    //div.show();
    div.slideToggle();
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
                                                              user : stream.post.user.id,
                                                              mentions_state:false
                                                           };
                append_entity_delete(stream.post.id);
                // remove the element from the list of un enriched streams 
                delete the_big_stream_enriched_state[stream.post.id];
              }
            });

           setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
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






/*********************************************/

function get_stream_ele_id(post_id, prefix){
  if( prefix == undefined){
    prefix="aw";
  }
  return prefix + 'stream_render_id_' + post_id;
}

/*
 * Create div
 *
 * Post Status : 1 -> 
 *
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
  var view_all_image_id = doc_box_id + '_all';
  var post_operations_id = stream_render_id + '_operations';


  var comment_box_id  = stream_render_id + '_comments';
  var comment_box_show_all_div_id  = stream_render_id + '_show_all';
  var comment_show_all_id = comment_box_id + '_show_all';
 
  var like_text_id = campaign_box_id + "_span";

  var date_js = Date.parse('t');
  var time_js = new Date().toString('HH:mm tt');
  var external_shares="";
  var external_icon_shares="";
  var subtitle = "";
  var location_id = "";
  var location_name = " ";

  if ( post.status == 2){
    var external_shares = get_socialize_html(stream); 
    var external_icon_shares = get_socialize_icon_html(stream); 
  }
  if(post.sub_title)
  {
    subtitle=post.sub_title;
  }
  if( stream.location && stream.location.id )
  {
    location_id = stream.location.id;
  }
  if( stream.location && stream.location.name )
  {
    location_name = "@" + stream.location.name;
  }


  /* Main stream div definition 
   * */
  var stream_ele_id = get_stream_ele_id(post.id);
  aw_lib_console_log("debug", "rendering the stream");
  var html = '<div id="' + stream_ele_id + '" class="p-aw-post" value="' + post.id + '">' +
                   '<div class="p-awp-close-section">'+
                      '<div class="p-awp-close js_stream_delete_btn">' +
                      '</div>' +
                   '</div>'+
                   '<div class="p-awp-stream-post-info">' +
                      '<div class="p-awp-channel">'+
                        '<div class="p-awp-channel-desc">'+
                          '<label class="p-awp-channel-label">CHANNEL : </label>'+
                          '<a href="/channel_page?channel_id=' +  post.word.id + '">' +
                          '<span class="p-awp-channel-name">' + post.word.name + '</span>'+
                          '</a>' +
                        '</div>'+
                        '<div id="'+ location_box_id +'">' +
                        '</div>'+
                      '</div>'+
                      '<div class="p-awp-stream-post-author-section">'+
                        '<a href="/home/show?id=' +  post.user.id + '" >' +
                        '<div class="p-awp-post-author">'+
                          '<div class="p-awp-post-author-img">'+
                            '<img src="' + post.user.photo + '" alt="" />' +
                          '</div>'+
                          '<div class="p-awp-post-author-name">'+
                            '<span>' + post.user.full_name + '</span>'+
                          '</div>'+
                        '</div>'+
                        '</a>'+
                      '</div>'+
                   '</div>'+
                    
                   '<div class="p-awp-post-info">' +
                      '<div class="p-awp-post-contents">'+
                      '<div class="p-awp-subtitle">'+
                        /*
                        '<a href="/location_page?location_id=' + stream.location.id + '">' +
                          '<span class="p-awp-location-name" >' + 
                            '@' + stream.location.name +
                          '</span>' +
                        '</a>' +
                        */
                        '<a href="/view?id=' + post.id + '">' +
                          '<span class="p-awp-subtitle-name">' + subtitle +'</span>' +
                        '</a>' +
                      '</div>'+
                      '<div class="p-awp-date">'+
                        '<span class="p-awp-date-content">' + time_js + ' '+date_js.toString("dddd, dd MMMM yyyy") + '</span>' +
                      '</div>'+
                      '<div class="p-awp-content">'+
                        '<div class="quote">'+
                          '<span>&#8220;</span>'+
                        '</div>'+
                        '<div class="p-awp-text" id="' + text_box_id + '" >' +
                          '<p align="justify">' + +
                          '</p>' +
                        '</div>'+
                      '</div>'+
                      '</div>'+
                      '<div class="p-awp-post-like-info js_campaign_show_all" id="'+ like_text_id + '">'+
                      '</div>'+
                   '</div>'+
 
                   
                   
                    
                    /* Post attachment */
                    '<div style="z-index:1;" class="p-awp-view-attachment" id="' + doc_box_id + '" >' +
                      '<div class="p-awp-view-all-images-div">' +
                        '<span id="'+ view_all_image_id +'">View All Images</span>'+
                      '</div>' +
                    '</div>' +

                    /* Post video attachment */
                    '<div style="z-index:1;" class="p-awp-view-video-attachment" id="' + video_doc_box_id + '" >' +
                    '</div>' +
                    
                    external_shares +
                    
                    /* general operation on a post - mention/likes/comments */
                    '<div class="p-awp-post-opt" >' +
                     '<input id="'+post_operations_id+'" type="hidden" value="'+ action_box_id + '">'+
                     '<div class="p-awp-post-const-opt">' +
                        '<div class="js_stream_enrich_btn p-awp-post-mentions hover_point"> Mentions </div> '+
                        '<div class="js_stream_edit_btn p-awp-post-edit hover_point"> Edit </div> '+
                        '<div class="js_stream_publish_btn p-awp-post-publish hover_point"> Publish </div> '+
                        '<div class="p-awp-post-like hover_point" id="' + campaign_box_id + '">'+'</div>' +
                        //'<div class="js_socialize_minimize p-awp-post-mentions hover_point"> Share </div> '+ 

                        '<div class="p-awp-post-comments hover_point js_show_all_comment_btn" id="' + comment_show_all_id + '">' 
                        + get_comment_head_label(stream.comments.count)+ '</div> ' +
                     '</div>'+
                     /*
                     '<div class="p-awp-post-vol-opt">' +
                        '<input type="button" value="Edit" class="js_stream_edit_btn p-awp-edit"/>' +
                        '<input type="button" value="Publish" class="js_stream_publish_btn p-awp-publish"/>' +
                     '</div>' +
                     */
                    '</div>' +
                   
                    

                    //external_icon_shares +

                    /* Post campaigns */
                    '<div class="p-awp-view-campaign" id="' + campaign_box_id + '" >' +
                    '</div>' +
                    '<div class="p-awp-view-campaign-comments" id="' + campaign_box_id + '_comment" >' +
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
  aw_lib_console_log("debug", "stream html added");
  handle_stream_actions(action_box_id, stream, current_user_id,post_operations_id,like_text_id);
  handle_stream_text(text_box_id, stream.post.text);

  handle_stream_location(location_box_id, stream.location);
  handle_stream_docs("image", doc_box_id, stream,view_all_image_id);
  handle_stream_docs("video", video_doc_box_id, stream,"");
  
  if( post.status == 2){
    setup_comment_handling(comment_box_show_all_div_id,
                           comment_box_id,  
                           post.id,
                           stream.comments.count);
    handle_stream_campaign(campaign_box_id, like_text_id,stream);
  }
  setup_readmore("div#"+ text_box_id + " p",250); /* read more for content with character slice at 100 */

  


  if( stream.post.enriched == false ){
    the_big_stream_enriched_state[stream.post.id] = {text_box : text_box_id};
  }

  the_big_stream_post_text[post.id] = {
                                          text_box : text_box_id,
                                          user : post.user.id,
                                          mentions_state:false
                                        };
  append_entity_delete(post.id);

}





/*
 * Re Render the attachment box after some attachment is deleted.
 */


function rerender_attachements_after_delete(view_attach_box) {
  var count = view_attach_box.children().size() - 1;
  var image_count_div = view_attach_box.find(".p-awp-view-all-images-div span");
  if(count > 7 ){
    image_count_div.text("View all " + count + " images");
  } else {
    image_count_div.hide();
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
                page_type:aw_get_stream_scope(),
                cache_cookie:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
       success: function (data) {
          // if rails demands a redirect because of log in missing
          if(data.length){
            $.each(data, function(i,stream){
              if( stream ){
                create_and_add_stream($("#streams_list"),stream , current_user_id);
                $("#more_streams_cookie").val(stream.post.time);
              } 

           
            });
            /* set up polling for checking enriching */
            setup_polling_for_enrich();
          }else{
            if( more_cookie.length == 0){
              $("#streams_list").html("<br/> <br/> No streams to show");
            }
            aw_lib_alert('No streams to show');
          }

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting streams. \n ActWitty is trying to solve.');
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
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
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
          $("#" + del_id).html('');
          $("#" + del_id).remove();
          var comment_count = the_big_comment_show_all_json[all_id].count - 1;
          the_big_comment_show_all_json[all_id].count = comment_count;
          $("#" + all_id).html(get_comment_head_label(comment_count));

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
        }
    });
}


function delete_entity_from_post(post_id, entity_id){
    alert("post id : " + post_id);
    alert("entity_id : " + entity_id);
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
        error:function(XMLHttpRequest,textStatus, errorThrown,data) {
            alert("data.post.text");

            aw_lib_alert('There has been a problem in deleting entity from post. \n ActWitty is trying to solve.');
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
          /*****************************************Error On Slidetoggle****************************/
          $(this).parent().next().slideToggle();
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}

/*
* Delete stream
*/
function delete_stream(post_id){
 
  var stream_render_id = get_stream_ele_id(post_id);
  //alert("in delete... post_id  " +post_id);
  //alert("after success we will close " + stream_render_id);
  $.ajax({
    url: '/home/delete_stream.json',
    type: 'POST',
    data: "post_id=" + post_id,
    dataType: 'json',
    success: function (data) {
      $("#" + stream_render_id).html('');
      $("#" + stream_render_id).remove();
    },
    error:function(XMLHttpRequest,textStatus, errorThrown) {
      aw_lib_alert('There has been a problem in deleting the stream. \n ActWitty is trying to solve.');
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
              //alert("i have already liked it");
              //alert(data.count);
              campaign_manager_json.user= true;
              var link_id = campaign_manager_json.campaign_div_id + '_link'; 
              var span_id = campaign_manager_json.campaign_div_id + '_span';
              campaign_manager_json.count = data.count;
              $("#" + span_id).html(get_campaign_likes_label(campaign_manager_json.count));
              /*$("#" + link_id).html('<img src="/images/alpha/unlike.png" />');*/
              $("#" + link_id).html('Unlike');
            }
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert("like error");
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
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
              /*$("#" + link_id).html('<img src="/images/alpha/like.png" />');*/
              $("#" + link_id).html('Like');
            } 
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
    }
}
  /**********Like*********Pramod***/
  
function aw_channels_render_like(win_id, trigger_id){
  //alert("aw_channels_render_like");
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  //var div_id = $("#" + trigger_id).attr("id");
  var div_id = $("#" + trigger_id).parent().next().next().next().next().children("div.p-awp-post-const-opt").children("div.p-awp-post-like").attr("id");
  //alert(div_id);
  campaign_manager = the_big_stream_campaign_manager_json[div_id];
  alert(JSON.stringify(campaign_manager));
  $.ajax({
          url: '/home/get_users_of_campaign.json',
          type: 'GET',
         data: { 
                  name:campaign_manager.name, 
                  activity_id:campaign_manager.post_id
                },
          dataType: 'json',
          success: function (data) {
            show_all_stream_campaigns(data, div);
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
  return true;
}
/**************************/
/*
 *  Show all campaigns Like
 */
function show_all_campaigns(campaign_manager_json){
  //alert(JSON.stringify(campaign_manager_json));
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
            /*****************************************Error On Slidetoggle****************************/
            $("#" + campaign_manager_json.campaign_div_id).next().slideToggle();
            //alert("show_all_campaigns");
          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
}
/**************************/
/*
 *  Remove document from post
 */
function remove_document_from_post(document_id, close_box){
   $.ajax({
          url: '/home/remove_document.json',
          type: 'POST',
          data: { 
                  doc_id:document_id, 
                },
          dataType: 'json',
          success: function (data) {
            /*remove that document*/
           var main_parent = close_box.closest(".p-awp-view-attachment");
           var parent_box = close_box.closest(".p-awp-view-attachment-inner-box");
           parent_box.html('');
           parent_box.remove();
           rerender_attachements_after_delete(main_parent);

          },
          error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
          }
      });
}
/**************************/


/*
 * Bring stream on focus whenever there is a change in filter
 */
function set_stream_to_focus_on_filter_change(){
    $("ul.p-cstab li").removeClass("active");
    $("ul.p-cstab li:last").addClass("active").show();

    //$("#channels_left_side_bar").hide();
    //$("#channels_main_bar").hide();
    //$("#channels_right_side_bar").hide();
    $("#p-channelp-sect").hide();

    $("#streams_left_side_bar").fadeIn();
    $("#streams_main_bar").fadeIn();
    $("#streams_right_side_bar").fadeIn();


}


/*
 * Clear stream div completely
 */
function aw_stream_clear_stream_jsons(){
  
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
        aw_lib_alert("Nothing written on comment");
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
    alert("closing " + $(this).parent().parent().attr("value"));
    var del_json = the_big_stream_actions_json[$(this).parent().parent().attr("value")];
    //if(del_json){
      //delete_stream(del_json.stream_id);
      delete_stream($(this).parent().parent().attr("value"));
    //}
    return false;
  });
  /********************************/
  /*
   * Stream edit button clicked
   */
  $('.js_stream_edit_btn').live('click', function(){
    //var edit_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    var edit_json = the_big_stream_actions_json[$(this).parent().prev().val()];
    if(edit_json){
      //aw_lib_alert("edit:" + edit_json.stream_id);
      var stream_render_id = get_stream_ele_id(edit_json.stream_id);
      $("#" + stream_render_id).html('');
      $("#" + stream_render_id).remove();
      aw_edit_drafted_stream(edit_json.stream_id);
    }
    return false;
  });
  /********************************/
  /*
   * Stream publish button clicked
   */
  $('.js_stream_publish_btn').live('click', function(){
    //var publish_json = the_big_stream_actions_json[$(this).parent().attr("id")];
    var publish_json = the_big_stream_actions_json[$(this).parent().prev().val()];
    if(publish_json){
      var stream_render_id = get_stream_ele_id(publish_json.stream_id);
      $("#" + stream_render_id).html('');
      $("#" + stream_render_id).remove();
      aw_publish_drafted_stream( publish_json.stream_id);
    }
    return false;
  });
 /********************************/
  /*
   * Stream enrich button clicked
   */
  $('.js_stream_enrich_btn').live('click', function(){
    var enrich_json = the_big_stream_actions_json[$(this).parent().prev().val()];
    var post_id = enrich_json.stream_id;

     
    var text_box_id = the_big_stream_post_text[post_id].text_box;
    var text_box = $("#" + text_box_id);
    var mentions_state = the_big_stream_post_text[post_id].mentions_state;
    if(!mentions_state){
      text_box.find(".js_activity_entity").addClass("js_mention_highlight");
      the_big_stream_post_text[post_id].mentions_state=true;
    }else{
      text_box.find(".js_activity_entity").removeClass("js_mention_highlight");
      the_big_stream_post_text[post_id].mentions_state=false;
    }

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
    //alert("js_like_user_action");
    var div_id = $(this).attr("value");
    campaign_manager = the_big_stream_campaign_manager_json[div_id];
    process_user_campaign_action(campaign_manager);
    return false;
  });
  /********************************/

  /*
   * User action show all  Pramod
   */
  $('.js_campaign_show_all').live('click', function(){
    //var cls = $(this).attr("class");
    //alert("on click like");
    //var div_id = $(this).attr("id");
    //alert(div_id);
    //campaign_manager = the_big_stream_campaign_manager_json[div_id];
    $(this).addClass("js_modal_dialog_link");  
    $(this).addClass("JS_AW_MODAL_like"); 
    return false;
  });
  /********************************/
  /*
    //alert("likes");
    //var cls = $(this).attr("class");
    //var nxt = $(this).next().children().attr("src");
    //alert(nxt);
    /****************************Changed For the Like SlideToggle***div_id*********************************/
    //var div_id = $(this).parent().parent().attr("id");
    //if(nxt == "/images/alpha/unlike.png")
    //{
    //alert("1"); 
    //}
    //campaign_manager = the_big_stream_campaign_manager_json[div_id];
    //show_all_campaigns(campaign_manager); 

  /*
   * Delete entity mentioned in text
   */
  $('.js_entity_delete').live('click' , function(){
    alert("del 1");
    delete_entity_from_post(the_big_stream_entity_deletes[$(this).attr("id")]["post_id"], 
                            the_big_stream_entity_deletes[$(this).attr("id")]["entity"]);
  });

  /*
   * Remove an attached document
   */
  $('.js_remove_attached_doc').live('click', function(){
    alert($(this).attr("id"));
    remove_document_from_post($(this).attr("id"), $(this));
  });

  /*
   * Bind click to more on streams tab
   */
  $('#more_streams').click(function() {
     aw_lib_console_log("debug", "profile.js:more personal streams clicked");
     append_stream(aw_lib_get_page_owner_id(), 
               aw_lib_get_session_owner_id());
     return false;
  });
    
  /*
   *
   */
  $(".p-awp-view-all-images-div span").live('click',function() {
    $(this).parent().next().children("a").trigger("click");
  });
  
  /*
   *
   */

  $("div.p-awp-content p").expander({
      slicePoint:       300,  // default is 100
      expandText:         'read more', // default is 'read more...'
      userCollapseText: '...less'  // default is '[collapse expanded text]'
    });


});
/************************************/
