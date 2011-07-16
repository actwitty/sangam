/**********************************/
/* Big global jsons which need to maintain context for dynamism*/
var the_big_comment_add_json={ };
var the_big_comment_show_all_json={ };
var the_big_comment_count_json={ };
var the_big_comment_delete_json={ };
var the_big_stream_delete_json={ };
var the_big_stream_campaign_json={ };
/**********************************/



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
                ' @ ' + stream.location.name  + 
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
  /* set context for dynamism */
  var close_btn_json = {
                          stream_id : stream.post.id 
                       };
  var close_btn_id = "CLOSE_STREAM_BTN_" + stream.id;
  the_big_stream_delete_json[close_btn_id] = close_btn_json;
  /******************/
  var html = '<input type="button" value="x" id="' + close_btn_id + '" class="js_stream_delete_btn stream_close_button"/>';
  div.append(html);
}

/*
 * Render comments close button
 */
function handle_comment_close_box(box_id, comment, comment_post_id, current_user_id){
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
                            post_id : comment_post_id
                           };
  var comment_close_id = 'COMMENT_CLOSE_BTN_' + comment.id;
  the_big_comment_delete_json[comment_close_id] = comment_close_json;
  /******************************/


  var html = '<input type="button" value="Remove" id="' + comment_close_id + '" class="js_comment_delete_btn stream_comment_close_btn"/>';
  div.append(html);
}


/*
 * Render stream comments
 */
function handle_stream_comments(box_id, stream, current_user_id){
  var div=$("#" + box_id);
  var title_div_id = box_id + 'title';
  var html = '<div class="stream_comment_title_box" id="'+ title_div_id + '">' +
             '</div>'; 
  div.append(html);

  /* set context */
  var show_all_id = 'COMMENT_SHOW_ALL_' + stream.post.id;
  var add_new_btn_id = 'COMMENT_ADD_NEW_BTN_' + stream.post.id;
  var add_new_textarea_id = 'COMMENT_ADD_NEW_TEXT_' + stream.post.id;
  var count_display_span_id = 'COUNT_DISPLAY_SPAN_' + stream.post.id;
  var comments_ul_id = 'stream_comments_ul_' + stream.post.id;

  var show_all_json = {
                            post_id:stream.post.id
                      };
  var comment_count_json = {
                            count : stream.comment.count,
                            display_span : count_display_span_id
                        };


  var add_new_comment_json = {
                                post_id:stream.post.id,
                                text_id:add_new_textarea_id
                             };
  

  the_big_comment_show_all_json[show_all_id] = show_all_json;
  the_big_comment_count_json[stream.post.id] = comment_count_json; 
  the_big_comment_add_json[add_new_btn_id] = add_new_comment_json;
  /* context is set, go ahead */
  if( stream.comment ){
   
    var title_div = $("#" + title_div_id);
    if (parseInt(stream.comment.count) < 3){
      var html = '<span class="stream_comment_title_box_span" id="' + count_display_span_id  + '">' +
                'Total Comments :' + stream.comment.count +
               '</span>';
      title_div.append(html);
    }else{
       var html = 
               '<span class="stream_comment_title_box_span" id="' + count_display_span_id + '">' +
                  'Total Comments :' + stream.comment.count +
                '</span>'; 
                '<a href="#" class="js_show_all_comment_btn stream_post_all_comments" id="' + show_all_id + '">' +
                  'Show All' +
                '</a>';
      title_div.append(html);

    }
  }
  
  var html = '<ul class="stream_comments_box_ul" id="' + comments_ul_id + '">' +
              '</ul>';
  
  div.append(html);
  ul = $("#" + box_id + " ul");
  $.each(stream.comment.array, function(i,comment){
    if( comment ){
      var comment_box_id =  box_id + "_" + comment.id;
      var close_box_id =  comment_box_id + '_close'; 
      var comment_li_id = 'comment_li_' + comment.id;
      var html = '<li class="stream_comment_li" id="' + comment_li_id + '">' +
                  '<div class="stream_single_comment_box" id="' + comment_box_id + '">' +
                    
                    /* close box */
                    '<div class="stream_comment_close_box" id="'+ close_box_id +'">' +
                    '</div>' +

                    /* user box */
                    '<div class="stream_comment_user_box">' +
                      '<a href="/home/show?id=' +  comment.user.id + '" class="stream_comment_user_box_a">' +
                        '<img src="' + comment.user.photo + '" alt="" class="stream_comment_user_box_img" >' +
                          comment.user.full_name + 
                        '</img>'+
                      '</a>'+  
                    '</div>' +


                    /* comment text box */
                    '<div class="stream_comment_text_box">' +
                      '<span>' +
                        comment.text +
                      '</span>'+  
                    '</div>' +

                   
                  '</div>' +
                 '</li>';
      ul.append(html);
      handle_comment_close_box(close_box_id, comment, stream.post.id, current_user_id);
        
    }

  });

  /* add new comments */
  var html = 
               '<div class="stream_comment_add_new_box">' +
                  '<div class="stream_comment_text_area_box">' +
                    '<textarea class="stream_comment_new_text_area" rows="2" cols="20" maxlength="200" placeholder="New Comment" id="' + add_new_textarea_id + '" >' +
                    '</textarea>' +
                  '</div>' +
                  '<div class="stream_comment_text_area_box_btn_box">' +
                    '<input type="button"  value="Post" class="js_add_new_comment stream_comment_new_btn" id="' + add_new_btn_id + '"/>' +
                  '</div>' +
               '</div>'; 
  div.append(html);
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
  var html = '<li id="main_stream_li_'+ post.id +'" class="stream_li" >' +
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
  handle_stream_text(text_box_id, stream);
  handle_stream_docs(doc_box_id, stream);
  handle_stream_comments(comment_box_id, stream, current_user_id);
  handle_stream_campaign(campaign_box_id, stream, current_user_id);
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
                alert("1");
                $("#more_streams_cookie").val(stream.id);
                alert("2");
            } 
          });

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
        }
    });
    $(window).scrollTop(scroll);
}


/*
 * Bring stream on focus whenever there is a change in filter
 */
function set_stream_to_focus_on_filter_change(){
    $(".tab_content").hide();
    $("ul.tabs li").removeClass("active");
    $("ul.tabs li:last").addClass("active").show(); 
	  $(".tab_content:last").show();
}


/*
 * Clear stream div completely
 */
function clear_streams(){
  $("#streams").empty();
  $("#more_streams_cookie").val(0);
  /* reset all big jsons */
  the_big_comment_add_json={ };
  the_big_comment_show_all_json={ };
  the_big_comment_count_json={ };
  the_big_comment_delete_json={ };
  the_big_stream_delete_json={ };
  the_big_stream_campaign_json={ };
  /***********************/
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

/*
 * Add the live bindings
 */
$(document).ready(function(){
  /*
   * Comment add button clicked
   */
  $('.js_add_new_comment').live('click', function(){
    alert("ADD NEW COMMENT BUTTON CLICKED");
    //the_big_comment_count_json
    var add_json = the_big_comment_add_json[$(this).attr("id")];
    if(add_json){
      alert(JSON.stringify(add_json));
    }
  });

  /*
   * Comment delete button clicked
   */
  $('.js_comment_delete_btn').live('click', function(){
    alert("DELETE CLICKED ");
    //the_big_comment_count_json
    var del_json = the_big_comment_delete_json[$(this).attr("id")];
    if(del_json){
      alert(JSON.stringify(del_json));
    }
  });
  /********************************/

  /*
   * Stream delete button clicked
   */
  $('.js_stream_delete_btn').live('click', function(){
    alert("STREAM DELETE CLICKED ");
    var del_json = the_big_stream_delete_json[$(this).attr("id")];
    if(del_json){
      alert(JSON.stringify(del_json));
    }
  });
  /********************************/

  /*
   * Stream show all button clicked
   */
  $('.js_show_all_comment_btn').live('click', function(){
    alert("SHOW ALL BTN CLICKED ");
     var all_json = the_big_comment_show_all_json[$(this).attr("id")];
    if(all_json){
      alert(JSON.stringify(all_json));
    }
  });
});
