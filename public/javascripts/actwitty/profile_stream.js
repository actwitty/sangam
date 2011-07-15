


/*
 * Render stream docs
 */
function handle_stream_docs(box_id, stream){
  docs_box= $("#" + box_id);
  if ( stream.documents &&  stream.documents.length ){
    var ul_box_id = box_id + "_ul"; 
    var doc_box_id = box_id + "_slider";
    var html = '<div  class="aw_slider" id="' + doc_box_id + '">' +                  
                  '<ul id="' + ul_box_id +  '" class="aw_slider">' +
                  '</ul>' +
                '</div>' ;

    docs_box.append(html);
    var ul_box = $("#" + ul_box_id);  
    $.each(stream.documents, function(i, attachment){
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


/*
 * Render stream location
 */
function handle_stream_location(box_id, stream){
  var div=$("#" + box_id);
  if(stream.location && stream.location.name.length > 0){
    var html='<span>' +
                '@' + stream.location.name  + 
            '</span>';

    div.append(html); 
  }else{
    /* location not defined correctly  */
    div.hide();
  }
}

/*
 * Render stream campaign
 */
function handle_a_campaign(box_id, stream, current_user_id, post_id){
/*
  var div = $("#" + box_id);
  campaign = stream.campaign;
  var campaign_box_id = box_id + campaign.id;
  var html = '<div class="campaign_box" ' + + '  >' +               
                  '<span>' +
                    campaign.count + ' people ' + campaign.name + ' this'  +
                  '</span>' +
               '</div>';

  div.append(html); 

  var campaign_btn_id =  "campaign_btn_" + campaign.id + "_" + post_id; 
  var campaign_btn_val =  "campaign_btn_" + campaign.id + "_" + post_id + "_hidden"; 
  if(campaign.user == true){
    var html = '<input type="button" value="Un-' + campaign.name + '" class="campaign_btn" id="campaign_btn_' + campaign_btn_id + '/>' +
               '<input type="hidden" id="' + campaign_btn_val + '" value ="' + campaign.id + '" />';

    div.append(html);
  }else

    var html = '<input type="button" value="' + campaign.name + '" class="campaign_btn" id="campaign_btn_' + campaign_btn_id + '/>' +
               '<input type="hidden" id="' + campaign_btn_val + '" value ="' + campaign.id + '" />';

    div.append(html);
*/
}

/*
 * Render stream campaign
 */
function handle_stream_campaign(box_id, post, current_user_id){
  campaigns = post.campaign;
  var div=$("#" + box_id);
  if(campaigns && campaigns.length){
    $.each(campaigns, function(i,campaign){
      if( campaign ){
          handle_a_campaign(box_id, campaign, current_user_id, post.id);
      } 
    }); 
    
  }else{
    /* campaigns not defined correctly */
    div.hide();
  }
}


/*
 * Render stream text
 */
function handle_stream_text(box_id, stream){
  var div=$("#" + box_id);
  post = stream.post;
  if(post.text && post.text.length){
        var html='<span>' +
                post.text +
             '</span>';

        div.append(html);
    
  }else{
    /* text not defined correctly */
    div.hide();
  }
}

/*
 * Render stream close button
 */
function handle_stream_close(box_id, stream, current_user_id){
  var div=$("#" + box_id);
  if(current_user_id != stream.post.user.id){
    div.hide();
    return;
  }
  var html = '<input type="button" value="x" id="close_stream_btn_' + stream.id + '" class="delete_stream_btn"/>';
  div.append(html);
}

/*
 * Render comments close button
 */
function handle_comment_close_box(box_id, comment, current_user_id){
  var div=$("#" + box_id);
  if(current_user_id != comment.user.id){
    div.hide();
    return;
  }
  var html = '<input type="button" value="close" id="close_comment_btn_' + comment.id + '" class="delete_comment_btn"/>';
  div.append(html);
}


/*
 * Render stream comments
 */
function handle_stream_comments(box_id, stream, current_user_id){
  var div=$("#" + box_id);

  if( stream.comment && parseInt(stream.comment.count) ){
    var html = '<span>' +
                'Total Comments :' + stream.comment.count +
               '</span>'; 
    div.append(html);
  }
  
  var html = '<ul class="comments_ul">' +
              '</ul>';
  
  div.append(html);
  ul = $("#" + box_id + " ul");
  $.each(stream.comment.array, function(i,comment){
    if( comment ){
      comment_box_id =  box_id + "_" + comment.id;
      var html = '<li class="stream_comment_li">' +
                  '<div class="stream_single_comment_box" id="' + comment_box_id + '">' +

                    /* user box */
                    '<div class="user_box">' +
                      '<a href="/home/show?id=' +  comment.user.id + '" class="summary_user_box_a">' +
                        '<img src="' + comment.user.photo + '" alt="" class="summary_user_box_img" >' +
                          comment.user.full_name + 
                        '</img>'+
                      '</a>'+  
                    '</div>' +


                    /* comment text box */
                    '<div class="comment_text_box">' +
                      '<span>' +
                        comment.text +
                      '</span>'+  
                    '</div>' +

                   
                  '</div>' +
                 '</li>';
      ul.append(html);
        
    } 
  });
}


/*
 *  Stream Time Box renderer
 */
function handle_stream_time(box_id, stream){

  var div=$("#" + box_id);
  if(stream.post && stream.post.time && stream.post.time.length > 0){
    var html='<span>' +
                'updated at:' + stream.post.time  + 
            '</span>';

    div.append(html); 
  }else{
    div.hide();
  }
}



/*
 * Create div on facebook
 */
function create_and_add_stream(ul, stream, current_user_id){
  var post = stream.post;
  var comments = stream.comment;
  
  /* Fail safe, due to any reason this happens, reject the stream from being displayed again*/
  if ($("#" + post.id ).length > 0){
   return;
  }
  var doc_box_id      = 'stream_doc_box_'      + post.id;
  var location_box_id = 'stream_location_box_' + post.id;
  var campaign_box_id = 'stream_campaign_box_' + post.id;
  var text_box_id     = 'stream_text_box_'     + post.id;
  var close_box_id    = 'stream_close_box_'    + post.id; 
  var comment_box_id  = 'stream_comment_box_'  + post.id;
  var time_box_id     = 'stream_time_box_'     + post.id;
  
  /* Main stream div definition */
  var html = '<li id="'+ post.id +'" class="stream_li" >' +
                '<div class="stream_box">' +

                    /* Post originator user */
                    '<div class="stream_user_box">' +
                      '<div class="user_box">' +
                        '<a href="/home/show?id=' +  post.user.id + '" class="summary_user_box_a">' +
                          '<img src="' + post.user.photo + '" alt="" class="summary_user_box_img" >' +
                            post.user.full_name + 
                          '</img>'+
                        '</a>'+  
                      '</div>' +
                    '</div>' +

                    /*************************** Title box ****************************/ 
                   '<div class="stream_title_box">' +
                      /* Post channel user */
                      '<div class="stream_channel_box">' +
                        '<span>' +
                          post.word.name +
                        '</span>' +
                      '</div>' +

                      /* Post location */
                      '<div class="stream_location_box" id="' + location_box_id + '" >' +
                      '</div>' +

                       /* post close */
                      '<div class="stream_close_box" id="' + close_box_id + '" >' +
                      '</div>' +

                      /* Post time*/
                      '<div class="stream_time_box" id="' + time_box_id + '" >' +
                      '</div>' +

                     
                    '</div>' + /* Title box closes here */

                    /* Post text*/
                    '<div class="stream_text_box" id="' + text_box_id + '" >' +
                    '</div>' +
                  
                    /* Post attachment */
                    '<div class="stream_doc_box" id="' + doc_box_id + '" >' +
                    '</div>' +
        
                  
                    /* Post campaigns */
                    '<div class="stream_campaign_box" id="' + campaign_box_id + '" >' +
                    '</div>' +
                  
                  
                    
                    /* Post comments */
                    '<div class="stream_comment_box" id="' + comment_box_id + '" >' +
                    '</div>' +

                  '</div>' + /* stream_box */        
              '</li>';

  ul.append(html);
  handle_stream_location(location_box_id, stream);
  handle_stream_time(time_box_id, stream);
  handle_stream_close(close_box_id, stream, current_user_id);
  handle_stream_docs(doc_box_id, stream);
  handle_stream_campaign(campaign_box_id, stream, current_user_id);
  handle_stream_text(text_box_id, stream);
  handle_stream_comments(comment_box_id, stream, current_user_id);
}


/*
 * Add streams to the page
 */
function append_stream(owner_id, current_user_id){
  var scroll = $(window).scrollTop();
  var more_cookie = $("#more_streams_cookie").val();
  
  $.ajax({
        url: '/activities/get_activities.json',
        type: 'GET',
        data: {
                id : owner_id, 
                filter : get_filter()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           $.each(data, function(i,stream){
            if( stream ){
                create_and_add_stream($("#streams"),stream , current_user_id);
                $("#more_streams_cookie").val(summary.id);
                $(window).scrollTop(scroll);
            } 
          });

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
        }
    });
}

/*
 * Clear stream div completely
 */
function clear_streams(){
  $("#streams").empty();
  $("#more_streams_cookie").val(0);
}



/*
 * On change of filter we need to do all these
 * On load of page as well we need to do all these
 */
function reload_streams_on_viewed_user(page_owner_id, session_owner_id){

  set_stream_to_focus_on_filter_change();
  clear_streams();
  append_stream(page_owner_id, session_owner_id);
  /*
  clear_related_friends();
  list_related_friends();
  clear_related_entities();
  list_related_entities();
  clear_related_locations();
  list_related_locations();*/
}
