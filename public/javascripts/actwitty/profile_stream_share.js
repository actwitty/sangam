function get_socialize_html(stream){
  var title="";
  if( stream.post.sub_title == undefined) {
    title = stream.post.sub_title;
  }
  
  var twitter_count = 0;
  var fb_count = 0;
  var digg_count = 0;
  var stumbleupon_count = 0;
  var delicious_count = 0;
  var buzz_count = 0;

  var cummulative_count = 0;
  if( stream.post.social_counters && stream.post.social_counters.length) {

    $.each(stream.post.social_counters, function(i, counter) { 
    
      if( counter.source_name == "twitter"){
        twitter_count = counter.count;
      }

      if( counter.source_name == "facebook"){
        fb_count = counter.count;
      }

      if( counter.source_name == "digg"){
        digg_count = counter.count;
      }

      if( counter.source_name == "stumbleupon"){
        stumbleupon_count = counter.count;
      }

      if( counter.source_name == "delicious"){
        delicious_count = counter.count;
      }

      if( counter.source_name == "buzz"){
        buzz_count = counter.count;
      }

      cummulative_count += counter.count;
    });
  }
  var socialize_html = '<div class="js_socialize_post">' +
                          '<input type="hidden" value="' + stream.post.id + '" class="socialize_post_id" />' +
                          '<input type="hidden" value="' + stream.post.summary_id + '" class="socialize_summary_id" />' +
                          '<input type="hidden" value="' + stream.post.sub_title + '" class="socialize_post_title" />' +
                          '<input type="hidden" value="' + cummulative_count + '" class="socialize_count" />' +
                          '<span>' + 
                            '<a  class="js_socialize_minimize" >' + cummulative_count + ' Shares  ' +'<img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                            '</a>' +
                          '</span>' +
                          '<div class="js_socialize_icons">' +
                            
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/twitter.png"  alt="Share on Twitter" width="25" height="25" class="js_share_post_externally JS_SHARE_TWITTER" id="twitter_share_' + stream.post.id + '" />' +
                              '<span class="twitter_text">' +
                                twitter_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/facebook.png"  alt="Share on facebook" width="25" height="25" class="js_share_post_externally JS_SHARE_FACEBOOK" id="facebook_share_' + stream.post.id + '"/>' +
                              '<span class="facebook_text">' +
                                fb_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/digg.png"  alt="Share on Digg" width="25" height="25" class="js_share_post_externally JS_SHARE_DIGG" id="digg_share_' + stream.post.id + '" />' +
                              '<span class="digg_text">' +
                                digg_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/stumbleupon.png"  alt="Share on Stumbleupon" width="25" height="25" class="js_share_post_externally JS_SHARE_STUMBLEUPON" id="stumbleupon_share_' + stream.post.id + '" />' +
                              '<span class="stumbleupon_text">' +
                                stumbleupon_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/delicious.png"  alt="Share on Delicious" width="25" height="25" class="js_share_post_externally JS_SHARE_DELICIOUS" id="delicious_share_' + stream.post.id + '" />' +
                              '<span class="delicious_text">' +
                                delicious_count +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/buzz.png"  alt="Share on Buzz" width="25" height="25" class="js_share_post_externally JS_SHARE_BUZZ" id="buzz_share_' + stream.post.id + '" />' +
                              '<span class="buzz_text">' +
                                buzz_count +
                              '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
  return socialize_html;
}


function get_socialize_icon_html(stream){
  var title="";
  var stream_socialize_id = stream.post.id + '_social';
  if( stream.post.sub_title == undefined) {
    title = stream.post.sub_title;
  }
  
   var socialize_html = '<div class="js_socialize_icons' + stream_socialize_id + '">' +
                            '<input type="hidden" value="' + stream.post.id + '" class="socialize_post_id" />' +
                            '<input type="hidden" value="' + stream.post.summary_id + '" class="socialize_summary_id" />' +
                            '<input type="hidden" value="' + stream.post.sub_title + '" class="socialize_post_title" />' +
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/twitter.png"  alt="Share on Twitter" width="25" height="25" class="js_share_post_externally JS_SHARE_TWITTER" id="twitter_share_' + stream.post.id + '" />' +
                              '<span class="twitter_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/facebook.png"  alt="Share on facebook" width="25" height="25" class="js_share_post_externally JS_SHARE_FACEBOOK" id="facebook_share_' + stream.post.id + '"/>' +
                              '<span class="facebook_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/digg.png"  alt="Share on Digg" width="25" height="25" class="js_share_post_externally JS_SHARE_DIGG" id="digg_share_' + stream.post.id + '" />' +
                              '<span class="digg_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/stumbleupon.png"  alt="Share on Stumbleupon" width="25" height="25" class="js_share_post_externally JS_SHARE_STUMBLEUPON" id="stumbleupon_share_' + stream.post.id + '" />' +
                              '<span class="stumbleupon_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/delicious.png"  alt="Share on Delicious" width="25" height="25" class="js_share_post_externally JS_SHARE_DELICIOUS" id="delicious_share_' + stream.post.id + '" />' +
                              '<span class="delicious_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                           
                            '<div class="socialize_box" >' +
                              '<img src="/images/alpha/shares/buzz.png"  alt="Share on Buzz" width="25" height="25" class="js_share_post_externally JS_SHARE_BUZZ" id="buzz_share_' + stream.post.id + '" />' +
                              '<span class="buzz_text">' +
                                '0' +
                              '</span>' +
                            '</div>' +
                        '</div>';
                  
  return socialize_html;
}

/*
 * Get post url for sharing
 */
function get_post_url(post_id){
   var url = aw_lib_get_base_url() + '/view?id=' + post_id;
   return url;
}
/***********************/
function get_cummulative_count(clicked_ele){
 return clicked_ele.closest(".js_socialize_post").find(".socialize_count").val();
}
/***********************/
function set_cummulative_count(clicked_ele, value){
 var curr_value =  get_cummulative_count(clicked_ele);
 curr_value =  value +  parseInt(get_cummulative_count(clicked_ele));
 clicked_ele.closest(".js_socialize_post").find(".socialize_count").val(curr_value);
 var html = ' ' + 
            curr_value + 
            ' Shares  ' + 
            '<img src="/images/alpha/shares/plus.png" width="10" height="10"/>';
 clicked_ele.closest(".js_socialize_post").find(".js_socialize_minimize").html(html);
}
/***********************/
/*
 * Get post title for sharing
 */
function get_summary_id_on_click(clicked_ele){
   return clicked_ele.closest(".js_socialize_post").find(".socialize_summary_id").val();
}
/***********************/
/*
 * Get post id from hidden on click of share
 */
function get_post_id_on_click(clicked_ele){
  return clicked_ele.closest(".js_socialize_post").find(".socialize_post_id").val();
}

/*
 * Get summary id from hidden on click of share
 */
function get_post_id_on_click(clicked_ele){
  return clicked_ele.closest(".js_socialize_post").find(".socialize_summary_id").val();
}
/***********************/
function get_social_counter(post_id, element){
    var social_data = {
                        activity_id:post_id,
                      };
    var base = element.closest(".js_socialize_post");

    $.ajax({
        url: '/home/get_social_counter.json',
        type: 'POST',
        data: social_data,
        dataType: 'json',
        success: function (data) {
          $.each(data, function(i,social_share){
             if (social_share.action == "share"){
               base.find('.' + social_share.source_name + '_text').html(social_share.count);
             }
          }); 
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}
/***********************/
function update_social_counter(post, summary, source, action_type){
    var social_data = {
                    activity_id:post,
                    summary_id:summary,
                    source_name:source,
                    action_type:action_type
                };

    $.ajax({
        url: '/home/update_social_media_share.json',
        type: 'POST',
        data: social_data,
        dataType: 'json',
        success: function (data) {
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem in adding new comment. \n ActWitty is trying to solve.');
        }
    });
}
/***********************/

/*
 * Share externally modal dialog
 */
function aw_render_share_externally( trigger_id){
  var share_prefix = "JS_SHARE";
  $($("#" + trigger_id).attr('class').split(' ')).each(function() { 
    if (this !== '' && this.substring(0,share_prefix.length) == share_prefix){
      share_class = this;
    }    
  });
  var host = window.location.hostname;
  var post_id = get_post_id_on_click($("#" + trigger_id));
  var summary_id = get_summary_id_on_click($("#" + trigger_id));
  var post_title = "";//get_post_title_on_click($("#" + trigger_id));
  var url = get_post_url(post_id);
  var modal_href = "";
  var source_name="";
  var action_name="share";



  if(share_class == "JS_SHARE_TWITTER"){
    modal_href = 'http://twitter.com/home?status='+ post_title + '%20' + url;
    source_name="twitter";

  }else if(share_class == "JS_SHARE_FACEBOOK"){
    modal_href = 'http://www.facebook.com/sharer.php?u='+url
    source_name="facebook";

  }else if(share_class == "JS_SHARE_DELICIOUS"){
    modal_href  = 'http://del.icio.us/post?url='+url+'&amp;title='+ post_title;
    source_name="delicious";

  }else if(share_class == "JS_SHARE_DIGG"){
    modal_href = 'http://digg.com/submit?phase=2&url='+url+'&amp;title='+ post_title;
    source_name="digg";

  }else if(share_class == "JS_SHARE_STUMBLEUPON"){
    modal_href = 'http://stumbleupon.com/submit?url='+url+'&amp;title='+post_title;
    source_name="stumbleupon";

  }else if(share_class == "JS_SHARE_BUZZ"){
     modal_href = 'http://www.google.com/reader/link?url='+url+'&amp;title='+ post_title +'&amp;srcURL='+host;
    source_name="buzz";
  }
  var base = $("#" + trigger_id).closest(".js_socialize_post");
  var existing_count = base.find('.' + source_name + '_text').html();
  existing_count = parseInt(existing_count) + 1;
  base.find('.' + source_name + '_text').html(existing_count);

  set_cummulative_count($("#" + trigger_id), 1);
  //var div = $("#" + win_id);
  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 
  update_social_counter(post_id, summary_id, source_name, action_name );
  var win_popup = window.open(modal_href, "Share ActWitty post", 'top=' + wint + ', left=' + winl + ' width=600, height=400, resizable, toolbar=no');
  return win_popup.focus();
  return false;
}
/***********************/


/*
 * Add the live bindings
 */
$(document).ready(function(){
  /*
   * show socialize
   */
  $(".js_socialize_minimize").live('click', function(){
    var socialize_block = $(this).closest(".js_socialize_post").find(".js_socialize_icons");
    
    var post_id = get_post_id_on_click($(this));
    if(socialize_block.css('display') == 'none'){ 
      //get_social_counter(post_id, $(this));
      socialize_block.show('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/minus.png");
    } else { 
      socialize_block.hide('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/plus.png");
    }
  });

  /*
   * open a modal
   */
  $(".js_share_post_externally").live('click', function(){
    return aw_render_share_externally($(this).attr('id'));
  });
  

});
