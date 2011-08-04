/**********************************/
/* Big global jsons which need to maintain context for dynamism*/
var the_big_comment_add_json={ };
var the_big_comment_show_all_json={ };
var the_big_comment_count_json={ };
var the_big_comment_delete_json={ };
var the_big_stream_delete_json={ };
var the_big_stream_campaign_manager_json={ };
var the_big_stream_campaign_user_action={};
var the_big_stream_campaign_show_all={};
var the_big_stream_enriched_state={};
/**********************************/



/*
 * Render stream docs
 */
function handle_stream_docs(box_id, stream){
  docs_box= $("#" + box_id);
  if ( stream.documents &&  stream.documents.count ){
    var ul_box_id = box_id + "_ul"; 
    var doc_box_id = box_id + "_slider";
    var html = '<div  class="aw_slider" id="' + doc_box_id + '">' +                  
                  '<ul id="' + ul_box_id +  '" class="aw_slider">' +
                  '</ul>' +
                '</div>' ;

    docs_box.append(html);
    var ul_box = $("#" + ul_box_id);  
    $.each(stream.documents.array, function(i, attachment){
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
 * Render stream campaign
 */
function handle_a_campaign(ul_id, campaign,  stream_post_id){
  var ul = $("#" + ul_id);

  var campaigns_li_id = ul_id + "_"  + campaign.name;
  
  var li = $("#" + campaigns_li_id);
  if(li.length > 0){

  }else{
    var html='<li class="stream_campaign_li" id="'+ campaigns_li_id +'">' +
           '</li>';
    ul.append(html);
    li = $("#" + campaigns_li_id);
  }

 

  var users_campaign_id = 0;
  if(campaign.id){
      users_campaign_id = campaign.id;
  }


  var campaign_unique_handle = stream_post_id + '_' + campaign.name; 
  var campaign_hover_span_id = campaign_unique_handle + '_hover_span';
  var campaign_user_action_id = campaign_unique_handle + '_user';
  var campaign_show_all_id = campaign_unique_handle + '_show_all';

  var campaign_manager_json = {
                                  li_id:campaigns_li_id,
                                  ul:ul_id,
                                  post_id:stream_post_id,
                                  name:campaign.name,
                                  count:campaign.count,
                                  user_id:campaign.id,
                                  user_state:campaign.user,
                              };
  var campaign_user_action_json = {
                                    manager_id:campaign_unique_handle
                                  };
  var campaign_show_all_json = {
                                    manager_id:campaign_unique_handle
                                  };

  the_big_stream_campaign_manager_json[campaign_unique_handle] = campaign_manager_json;
  the_big_stream_campaign_user_action[campaign_user_action_id]=campaign_user_action_json;
  the_big_stream_campaign_show_all[campaign_show_all_id]=campaign_show_all_json;

  var campaign_text = campaign.name + 's: ' + campaign.count;
  var user_campaign_text ="";
  if( campaign.user == true ){
      user_campaign_text = 'Un-' + campaign.name;
  }else{
      user_campaign_text = campaign.name; 
  }


  var html = '<div class="stream_campaign_display">' +
                '<a href="#" class="stream_campaign_display_a">' +
                   campaign_text +
                  '</a>' +
                  '<span class="stream_campaign_hover_box" id="' + campaign_hover_span_id + '">' +
                    '<div class="stream_campaign_user_action_box">' +
                      '<a href="#" class="campaign_user_action_a js_campaign_user_action" id="' + campaign_user_action_id + '">' +
                       user_campaign_text +
                      '</a>' +
                    '</div>'+
                    '<div class="stream_campaign_show_all_box">' +
                      '<a href="#" class="campaign_show_all_a js_campaign_show_all" id="' + campaign_show_all_id + '">' +
                        'Show All' +
                      '</a>' +
                    '</div>'+ 
                  '</span>' +
             '</div>';
  
  li.append(html);

  
}

/*
 * Render stream campaign
 */
function handle_stream_campaign(box_id, stream){
  var div=$("#" + box_id);
  if(stream.campaign){
    var campaigns_ul_id = box_id + '_ul';
    var html = '<ul class="streams_campaigns_ul" id="' + campaigns_ul_id + '">' +
               '</ul>';
    div.append(html);
    $.each(stream.campaign, function(i,campaign){
      if( campaign ){
          handle_a_campaign(campaigns_ul_id, campaign, stream.post.id);
      } 
    }); 
    
  }else{
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
        var html='<p>' +
                post.text +
             '</p>';

        div.html(html);
    
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
  var close_btn_id = "CLOSE_STREAM_BTN_" + stream.post.id ;
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


  var html = '<input type="button" value="Remove" id="' + comment_close_id + '" class="js_comment_delete_btn p-st-comment-close-btn"/>';
  div.append(html);
}


function handle_stream_single_comment(comment, div_id, comment_post_id, current_user_id){

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
      handle_comment_close_box(close_box_id, comment, comment_post_id, current_user_id);
}

/*
 * Render stream comments
 */
function setup_comment_handling(box_id, id, show_all_id){

  var show_all_json = {post_id:id,
                      div_id:box_id};


  the_big_comment_show_all_json[show_all_id] = show_all_json;
}

function show_all_stream_comments(comments, post_id, current_user_id, click_id){


  var comments_count=0;
  var comments_div_id = the_big_comment_show_all_json[click_id].div_id;

  var div = $("#" + comments_div_id);
  div.html("");

  var add_new_btn_id = 'COMMENT_ADD_NEW_BTN_' + post_id;
  var add_new_textarea_id = 'COMMENT_ADD_NEW_TEXT_' + post_id;
  var count_display_span_id = 'COUNT_DISPLAY_SPAN_' + post_id;

  var comment_count_json = {
                            count : comments.length
                            //,
                            //display_span : count_display_span_id
                        };


  var add_new_comment_json = {
                                post_id:post_id,
                                text_id:add_new_textarea_id,
                                div_id:comments_div_id
                             };
  the_big_comment_count_json[post_id] = comment_count_json; 
  the_big_comment_add_json[add_new_btn_id] = add_new_comment_json;


  if( comments && comments.length){
    comments_count = comments.length;
  }
 
  /* context is set, go ahead */
  
  $.each(comments, function(i,data){
    if( data && data.comment ){
      handle_stream_single_comment(data.comment, comments_div_id, post_id, current_user_id); 
    }

  });

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
    div.show();
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
            if( stream.post.enriched == true ){
              handle_stream_text(the_big_stream_enriched_state[stream.post.id].text_box, 
                                stream);
              /* remove the element from the list of un enriched streams */
              delete the_big_stream_enriched_state[stream.post.id];
            }
          });

           setup_polling_for_enrich();

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
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




/*
 * Create div
 */
function create_and_add_stream(streams_box, stream, current_user_id, prepend){
  var post = stream.post;
  var comments = stream.comment;
  if(prepend===undefined){
    prepend=false;
  }
  
  /* Fail safe, due to any reason this happens, reject the stream from being displayed again*/
  if ($("#" + post.id ).length > 0){
   return;
  }
  var doc_box_id      = 'stream_doc_box_'      + post.id;
  var campaign_box_id = 'stream_campaign_box_' + post.id;
  var text_box_id     = 'stream_text_box_'     + post.id;
  var close_box_id    = 'stream_close_box_'    + post.id; 
  var comment_box_id  = 'stream_comment_box_'  + post.id;
  var comment_show_all_id = comment_box_id + '_show_all';
  var date_js = Date.parse('t');
  /* Main stream div definition */
  var html = '<div id="main_stream_li_'+ post.id +'" class="p-aw-post" >' +

                    /* Post originator user */
                    '<div class="p-awp-user">' +

                        '<a href="/home/show?id=' +  post.user.id + '" >' +
                          '<img src="' + post.user.photo + '" alt="" />' +
                            '<br/>'  +
                            post.user.full_name + 
                        '</a>'+  
                    '</div>' +
                     /* post close */
                     '<div class="p-awp-close" id="' + close_box_id + '" >' +
                     '</div>' +


                    /*************************** Title box ****************************/ 
                      /* Post channel user */
                      '<div class="p-awp-channel">' +
                        '<div class="p-awp-channel-desc">' +
                          '<label class="p-awp-channel-label">'  +
                            'Channel:' +
                          '</label>' +
                          '<span class="p-awp-channel-name">' +
                            post.word.name +
                          '</span>' +
                        '</div>' +
                      '</div>' +

                      '<div class="p-awp-subtitle">' +
                        '<span class="p-awp-subtitle-name">' + post.sub_title +'</span>' +
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
                  
                    /* Post attachment */
                    '<div class="p-awp-view-attachments" id="' + doc_box_id + '" >' +
                    '</div>' +

                    /* Post campaigns */
                    '<div class="p-awp-view-comment" id="' + campaign_box_id + '" >' +
                    '</div>' +
       

                    '<div class="p-awp-view-comment">' +
                      '<span class="view-comments js_show_all_comment_btn" id=' + comment_show_all_id + '>Comments ></span>' +
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
  handle_stream_close(close_box_id, stream, current_user_id);
  handle_stream_text(text_box_id, stream);
  handle_stream_docs(doc_box_id, stream);
  setup_comment_handling(comment_box_id,  post.id, comment_show_all_id);
  handle_stream_campaign(campaign_box_id, stream);

  if( stream.post.enriched == false ){
    the_big_stream_enriched_state[stream.post.id] = {text_box : text_box_id};
  }

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
                $("#more_streams_cookie").val(stream.post.id);
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
                                        current_user_id );
          $("#" + add_json.text_id).val("");

          count_json=the_big_comment_count_json[add_json.post_id];
          count_json.count = count_json.count + 1;

          count_span_str = 'Total Comments :  ' + count_json.count;
          //$("#" + count_json.display_span).html(count_span_str);
          the_big_comment_count_json[add_json.post_id] = count_json;
         
         
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}

//#INPUT => comment_id = 1234
function delete_comment(post_id, comment_id){
    var comment_li_id = 'comment_li_' + comment_id;
    $.ajax({
        url: '/home/delete_comment.json',
        type: 'POST',
        data: {"comment_id":comment_id},
        dataType: 'json',
        success: function (data) {
          $("#" + comment_li_id).remove();
          count_json=the_big_comment_count_json[post_id];
          count_json.count = data.comment_count;


          count_span_str = 'Total Comments :  ' + count_json.count;
          //$("#" + count_json.display_span).html(count_span_str);
          the_big_comment_count_json[post_id] = count_json;
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting comment. \n ActWitty is trying to solve.');
        }
    });
}

//#INPUT => activity_id => 123
function show_all_comments(post_id, this_id){
    var current_user_id=$('#session_owner_id').attr("value");
    $.ajax({
        url: '/home/get_all_comments.json',
        type: 'POST',
        data: {activity_id:post_id},
        dataType: 'json',
        success: function (data) {

          show_all_stream_comments(data, post_id, current_user_id, this_id);
          $(this).parent().next().slideToggle();
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
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
  the_big_comment_count_json={ };
  the_big_comment_delete_json={ };
  the_big_stream_delete_json={ };
  the_big_stream_campaign_manager_json={};
  the_big_stream_campaign_user_action={};
  the_big_stream_campaign_show_all={};
  the_big_stream_enriched_state={};
  /***********************/
}




/*
 * Add the live bindings
 */
$(document).ready(function(){
  
  /*
   * Delete stream
   */
  function delete_stream(post_id){
    var stream_li_id = 'main_stream_li_' + post_id;
    $.ajax({
        url: '/home/delete_stream.json',
        type: 'POST',
        data: "post_id=" + post_id,
        dataType: 'json',
        success: function (data) {
          $("#" + stream_li_id).remove();
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in deleting the stream. \n ActWitty is trying to solve.');
        }
    });
  }


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
      delete_comment(del_json.post_id, del_json.comment_id);
    }
    return false;
  });
  /********************************/

  /*
   * Stream delete button clicked
   */
  $('.js_stream_delete_btn').live('click', function(){
    var del_json = the_big_stream_delete_json[$(this).attr("id")];
    if(del_json){
      delete_stream(del_json.stream_id);
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
      //alert(JSON.stringify(all_json));
      show_all_comments(all_json.post_id, $(this).attr("id"));
    }
    return false;
  });

  /*
   * User action on campaign
   */
  $('.js_campaign_user_action').live('click', function(){
    alert("USER ACTION ON CAMPAIGN ");
    var user_json = the_big_stream_campaign_user_action[$(this).attr("id")];
    if(user_json){
      var manager_json = the_big_stream_campaign_manager_json[user_json.manager_id];
      if(manager_json){
        alert(JSON.stringify(manager_json));
      }
    }
    return false;
  });
  /********************************/

  /*
   * User action on campaign
   */
  $('.js_campaign_show_all').live('click', function(){
    alert("SHOW ALL ON CAMPAIGN ");
    var user_json = the_big_stream_campaign_show_all[$(this).attr("id")];
    if(user_json){
      var manager_json = the_big_stream_campaign_manager_json[user_json.manager_id];
      if(manager_json){
        alert(JSON.stringify(manager_json));
      }
    }
    return false;
  });
  /********************************/



});
/************************************/
