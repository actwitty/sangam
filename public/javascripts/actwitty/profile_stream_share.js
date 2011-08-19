function get_socialize_html(post_id, title){
  if( title == undefined) {
    title = "";
  }
  var socialize_html = '<div class="js_socialize_post">' +
                          '<input type="hidden" value="' + post_id + '" class="socialize_post_id" />' +
                          '<input type="hidden" value="' + title + '" class="socialize_post_title" />' +
                          '<span>' + 
                            'Share' + 
                            '<a  class="js_socialize_minimize" > <img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                            '</a>' +
                          '</span>' +
                          '<div class="js_socialize_icons">' +
                            '<img src="/images/alpha/shares/twitter.png"  alt="Share on Twitter" width="25" height="25" class="JS_AW_MODAL_share JS_SHARE_TWITTER" id="twitter_share_' + post_id + '" />' +
                            '<img src="/images/alpha/shares/facebook.png"  alt="Share on facebook" width="25" height="25" class="JS_AW_MODAL_share JS_SHARE_FACEBOOK" id="facebook_share_' + post_id + '"/>' +
                            '<img src="/images/alpha/shares/digg.png"  alt="Share on Digg" width="25" height="25" class="JS_AW_MODAL_share JS_SHARE_DIGG" id="digg_share_' + post_id + '" />' +
                            '<img src="/images/alpha/shares/stumbleupon.png"  alt="Share on Stumbleupon" width="25" height="25" class="JS_AW_MODAL_share JS_SHARE_STUMBLEUPON" id="stumbleupon_share_' + post_id + '" />' +
                            '<img src="/images/alpha/shares/delicious.png"  alt="Share on Delicious" width="25" height="25" class="JS_AW_MODAL_share JS_SHARE_DELICIOUS" id="delicious_share_' + post_id + '" />' +
                            '<img src="/images/alpha/shares/buzz.png"  alt="Share on Buzz" width="25" height="25" class="JS_AW_MODAL_share JS_SHARE_BUZZ" id="buzz_share_' + post_id + '" />' +
                        '</div>' +
                  
                    '</div>';
  return socialize_html;
}

/*
 * Get post url for sharing
 */
function get_post_url(post_id){
   var url = 'http://localhost:3000/view?id=' + post_id;
   return url;
}
/***********************/
/*
 * Get post title for sharing
 */
function get_post_title_on_click(post_id){
   return clicked_ele.closest(".js_socialize_post").find(".socialize_post_title").val();
}
/***********************/
/*
 * Get post id from hidden on click of share
 */
function get_post_id_on_click(clicked_ele){
  return clicked_ele.closest(".js_socialize_post").find(".socialize_post_id").val();
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
  var post_title = "";//get_post_title_on_click($("#" + trigger_id));
  var url = get_post_url(post_id);
  var modal_href = "";
  if(share_class == "JS_SHARE_TWITTER"){
    modal_href = 'http://twitter.com/home?status='+ post_title + '%20' + url;

  }else if(share_class == "JS_SHARE_FACEBOOK"){
    modal_href = 'http://www.facebook.com/sharer.php?u='+url

  }else if(share_class == "JS_SHARE_DELICIOUS"){
    modal_href  = 'http://del.icio.us/post?url='+url+'&amp;title='+ post_title;

  }else if(share_class == "JS_SHARE_DIGG"){
    modal_href = 'http://digg.com/submit?phase=2&url='+url+'&amp;title='+ post_title;

  }else if(share_class == "JS_SHARE_STUMBLEUPON"){
    modal_href = 'http://stumbleupon.com/submit?url='+url+'&amp;title='+post_title;

  }else if(share_class == "JS_SHARE_BUZZ"){
     modal_href = 'http://www.google.com/reader/link?url='+url+'&amp;title='+ post_title +'&amp;srcURL='+host;
  }
  //var div = $("#" + win_id);
  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 
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
    if(socialize_block.css('display') == 'none'){ 
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
  $(".JS_AW_MODAL_share").live('click', function(){
    return aw_render_share_externally($(this).attr('id'));
  });
  

});
