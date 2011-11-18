
/**************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_shares_revise_counters(stream_info){
    var share_counter = 0;
    var twitter_count = 0;
    var fb_count = 0;

    if(stream_info.post.social_counters){
      $.each(stream_info.post.social_counters, function(i, counter) { 
        if( counter.source_name == "twitter"){
          twitter_count = counter.count;
        }

        if( counter.source_name == "facebook"){
          fb_count = counter.count;
        }

        share_counter = share_counter + counter.count;
      });
    }
    
    var stream_main_box_id = aw_api_get_stream_id(stream_info);
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_shares_counter").html(share_counter);
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_share_facebook_counter").html(fb_count);
    $('#' + stream_main_box_id).find(".aw_js_ppm_stm_share_twitter_counter").html(twitter_count);
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_shares_get_html_box_html(stream_info){

   var html =  '<div class="aw_ppm_stm_dyn_share_box aw_js_ppm_stm_shares_main_box">'  +
                '<div class="aw_ppm_stm_dyn_share_header" >' +
                  '<span> Share over other networks </span>' +
                '</div>' +
                '<div class="aw_ppm_stm_dyn_share_twitter aw_js_ppm_stm_share_twitter_action">' +
                  '<div class="aw_ppm_stm_dyn_share_twitter_img "></div>' +
                  '<div class="aw_ppm_stm_dyn_share_twitter_count aw_js_ppm_stm_share_twitter_counter">0</div>' +
                '</div>' +

                '<div class="aw_ppm_stm_dyn_share_facebook aw_js_ppm_stm_share_facebook_action">' +
                  '<div class="aw_ppm_stm_dyn_share_facebook_img "></div>' +
                  '<div class="aw_ppm_stm_dyn_shares_facebook_count aw_js_ppm_stm_share_facebook_counter">0</div>' +
                '</div>' +
              
              '</div>';
  return html;

}

/****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_shares_show_all(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  
  var ext_share_main_box = $("#" + stream_main_box_id).find(".aw_js_ppm_stm_shares_main_box");
  var ext_share_action_img_box = $('#' + stream_main_box_id).find(".aw_js_ppm_stm_shares_action .aw_js_ppm_stm_action_image");
  if(ext_share_main_box.is(":visible") ){
    ext_share_main_box.hide();
    ext_share_action_img_box.removeClass('aw_ppm_stm_dyn_action_shares_on_img');
    ext_share_action_img_box.addClass('aw_ppm_stm_dyn_action_shares_img');
  }else{
    ext_share_main_box.show();
    ext_share_action_img_box.removeClass('aw_ppm_stm_dyn_action_shares_img');
    ext_share_action_img_box.addClass('aw_ppm_stm_dyn_action_shares_on_img');
  }
  
}
/****************************************************/
/*
 * Get post url for sharing
 */
function aw_get_post_url(stream_info){
   var url = aw_lib_get_base_url() + '/view?id=' + stream_info.post.id;
   return url;
}
/****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_shares_twitter_share(element){
  
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);
  aw_update_social_media_share_counter(stream_info,  'twitter', 'share');

  var host = window.location.hostname;
  var post_title =   stream_info.post.user.full_name + '\'s post about ' +   stream_info.post.word.name  + ' on actwitty.com';
  var url = aw_get_post_url(stream_info);
  var modal_href = "";
  
  modal_href = 'http://twitter.com/home?status='+ post_title + '%20' + url;
  
  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 
  
  var win_popup = window.open(modal_href, "Share ActWitty post", 'top=' + wint + ', left=' + winl + ' width=600, height=400, resizable, toolbar=no');
  return win_popup.focus();

}

/****************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_shares_facebook_share(element){
  var stream_main_box_id = aw_api_ppm_get_stm_context_id_for_ele(element);
  var stream_info = aw_api_ppm_get_stm_contex_for_key(stream_main_box_id);

  aw_update_social_media_share_counter(stream_info,  'facebook', 'share');
  var host = window.location.hostname;

  var post_title =   stream_info.post.user.full_name + '\'s post about ' +   stream_info.post.word.name  + ' on actwitty.com';
  var url = aw_get_post_url(stream_info);
  var modal_href = "";

  modal_href = 'http://www.facebook.com/sharer.php?u='+url

  var winl = ($(window).width() - 600)/2; 
  var wint = ($(window).height() - 400)/2; 

  var win_popup = window.open(modal_href, "Share ActWitty post", 'top=' + wint + ', left=' + winl + ' width=600, height=400, resizable, toolbar=no');
  return win_popup.focus();


}

/****************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_shares_update_counters(params){
   /*do nothing function */
}

/****************************************************/
/*
 *
 *
 */
function aw_update_social_media_share_counter(stream_info, source, action){
  
   var twitter_count = 0;
   var fb_count =0;
   if(stream_info.post.social_counters){
      $.each(stream_info.post.social_counters, function(i, counter) { 
        if( counter.source_name == "twitter"){
          twitter_count = counter.count;
        }

        if( counter.source_name == "facebook"){
          fb_count = counter.count;
        }

      });
  }
  if( source == "twitter"){
    twitter_count++;
  }else if( source == "facebook"){
    fb_count++;
  }


  var social_media_share_count = [ 
                                    {"source_name":"twitter","action":"share","count":twitter_count},
                                    {"source_name":"facebook","action":"share","count":fb_count}
                                 ];
  aw_api_ppm_stm_modify_shares( aw_api_get_stream_id(stream_info), social_media_share_count); 
  aw_api_ppm_stm_shares_revise_counters(stream_info);
  var params = {
                  'aw_srv_protocol_params' : {
                                                activity_id: stream_info.post.id,
                                                summary_id: stream_info.post.summary_id,
                                                source_name:source,
                                                action_type:action
                                              },
                  'aw_srv_protocol_cookie' : {
                                                stream_box_id: aw_api_get_stream_id(stream_info)
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_UPDATE_SOCIAL_SHARE_COUNTER',  params);





}
