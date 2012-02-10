/******************************************/
/*
 *
 *
 */
var aw_local_ppm_channel_context_manager={};
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_add_channel_context(key, channel_info){
    aw_local_ppm_channel_context_manager[key] = channel_info;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_remove_channel_context(key){
  delete aw_local_ppm_channel_context_manager[key];
}

/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_chn_context_id_for_ele(element){
  var key = element.closest(".aw_js_ppm_channel_box_backtracker").attr('id');
  return key;
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_chn_context(element){
  var key = element.closest(".aw_js_ppm_channel_box_backtracker").attr('id');
  return aw_local_ppm_channel_context_manager[key];
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_get_chn_contex_for_key(key){
  return aw_local_ppm_channel_context_manager[key];
}

/******************************************/
/*
 *
 *
 */
function aw_internal_ppm_chn_srv_requests_on_init(){
  
  aw_api_ppm_chn_request_user_channels(1);
  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
    aw_api_ppm_chn_request_subscribed_channels(1);
    aw_api_ppm_chn_request_all_channels(1);
  }
  aw_api_ppm_chn_request_users_mentions(1);
  aw_api_ppm_chn_request_users_locations(1);
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_initialize_chn_page(){
  aw_api_ppm_input_initialize_auto_suggest();
  aw_internal_ppm_chn_srv_requests_on_init();
}

/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_resp_subscribe(params){
  aw_lib_console_log("debug","Subscribe response");
  
  var context_id = params['aw_srv_protocol_cookie'].context_id;
  var channel_info = aw_api_ppm_get_chn_contex_for_key(context_id);
  aw_api_ppm_remove_channel_context(context_id);
  channel_info['subscribed'] = true;
  aw_api_ppm_add_channel_context(context_id, channel_info);
  $("#" + context_id).remove();
   if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
     /* if its my page */
     var new_html = aw_get_subscribed_channel_html(channel_info);
     $('#aw_js_ppm_subscribed_chn_container').prepend(new_html);
   }else{
     var new_html = aw_get_user_channel_html(channel_info);
     $('#aw_js_ppm_user_chn_container').prepend(new_html);
   }
}
/*******************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_resp_unsubscribe(params){
  aw_lib_console_log("debug","Unsubscribe response"); 
  var context_id = params['aw_srv_protocol_cookie']['context_id'];
  var channel_info = aw_api_ppm_get_chn_contex_for_key(context_id);
  aw_api_ppm_remove_channel_context(context_id);
  channel_info['subscribed'] = false;
  aw_api_ppm_add_channel_context(context_id, channel_info);
  $("#" + context_id).remove();
  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
     /* if its my page */
     var new_html = aw_get_all_channel_html(channel_info);
     $('#aw_js_ppm_all_chn_container').prepend(new_html);
   }else{
     var new_html = aw_get_user_channel_html(channel_info);
     $('#aw_js_ppm_user_chn_container').prepend(new_html);
   }
}
/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){

  /* more click event handler start */
  $("#aw_js_ppm_user_chn_data_more").live('click', function(){
    aw_api_ppm_chn_request_user_channels(0);
    return false;
  });

  $("#aw_js_ppm_subscribed_chn_data_more").live('click', function(){
    aw_api_ppm_chn_request_subscribed_channels(0);
    return false;
  });

  $("#aw_js_ppm_subscriptions_data_more").live('click', function(){
  });

  $("#aw_js_ppm_mentions_data_more").live('click', function(){
    aw_api_ppm_chn_request_users_mentions(0);
    return false;
  });

  $("#aw_js_ppm_locations_data_more").live('click', function(){
    aw_api_ppm_chn_request_users_locations(0);
    return false;
  });

  $("#aw_js_ppm_all_chn_data_more").live('click', function(){
    aw_api_ppm_chn_request_all_channels(0);
    return false;
  });

  $(".aw_js_ppm_subscribe_action").live('click', function(){
    var channel_cntxt = aw_api_ppm_get_chn_context($(this));
    var params = {
                  'aw_srv_protocol_params' : {
                                                'summary_id': channel_cntxt.id
                                             },
                  'aw_srv_protocol_cookie' : {
                                               'context_id' :  aw_api_ppm_get_chn_context_id_for_ele($(this))
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_CMN_CREATE_POST', params); 

    if( channel_cntxt.subscribed && channel_cntxt.subscribed == true){
      /* Change subscribed to unsubscribed */
      aw_lib_console_log("debug","Unsubscribe requested"); 
      aw_api_srv_make_a_post_request('AW_SRV_PPM_CHN_UNSUBSCRIBE_CHANNEL', params); 
    }else{
      /* Change usubscribed to subscribed */
      aw_lib_console_log("debug","Subscribe requested"); 
      aw_api_srv_make_a_post_request('AW_SRV_PPM_CHN_SUBSCRIBE_CHANNEL', params); 
    }
     
    return false;

  });


  $(".aw_js_ppm_chn_mentions").live('click', function(){
    var mention_id = $(this).find(".aw_js_ppm_chn_mention_id").val();
    var mention_name = $(this).find(".aw_js_ppm_chn_mention_name").html();
    window.location.href = '/home/streams?id=' + aw_lib_get_page_owner_id() + '&m_id=' +  mention_id + "&m_name=" + mention_name;
  });

  $(".aw_js_ppm_chn_locations").live('click', function(){
    var location_id = $(this).find(".aw_js_ppm_chn_location_id").val();
    var location_name = $(this).find(".aw_js_ppm_chn_location_name").html();
    window.location.href = '/home/streams?id=' + aw_lib_get_page_owner_id() + '&l_id=' +  location_id + "&l_name=" + location_name;
  });

  $(".aw_js_ppm_chn_locations").live('click', function(){
    var location_id = $(this).find(".aw_js_ppm_chn_location_id").val();
    var location_name = $(this).find(".aw_js_ppm_chn_location_name").html();
    window.location.href = '/home/streams?id=' + aw_lib_get_page_owner_id() + '&l_id=' +  location_id + "&l_name=" + location_name;
  });

  $(".aw_js_ppm_channel_box_filter_setter").live('click', function(){
    var channel_info = aw_api_ppm_get_chn_contex_for_key($(this).attr('id'));
    var channel_name = channel_info.word.name;
    var channel_id = channel_info.word.id;
    var user_id = channel_info.user.id;
    window.location.href = '/home/streams?id=' + user_id + '&c_id=' +  channel_id + "&c_name=" + channel_name; 
    
  });
  /* more click event handler end */
  
});

/*
 *   File to build the dynamic analytics info for channel icons on channel page
 *   - As per our current need , analytic summary info is shown on hover to Channel icons.
 *   - Currently we have different css classes for My channels, Subscribed channels, All channels.
 *     We thought that we might require different layout for analytical info, which if really required
 *     will need 3 different functions.
 *
 *   
 */




function aw_ppm_channel_dyn_analytic_info_build(channel_info){
  // this needs to be filled in
  var dyn_analytic_info_id = "analytic_box_" ;
  var html = "";
  var tweet_post_count = 0;
  var fb_post_count = 0;
  var aw_post_count = 0;
  var total_post_count = 0;
  var subscribers = 0;
  var male = 0;
  var female = 0;
  var like_count = 0;
  var share_count = 0;
  var comment_count = 0;
  var last_update_time = '';

  if( channel_info.analytics_summary ){
    if( channel_info.analytics_summary.posts ){
        if( channel_info.analytics_summary.posts.actwitty ){
          aw_post_count = channel_info.analytics_summary.posts.actwitty;
        }

        if( channel_info.analytics_summary.posts.facebook ){
          fb_post_count = channel_info.analytics_summary.posts.facebook;
        }

        if( channel_info.analytics_summary.posts.twitter ){
          tweet_post_count = channel_info.analytics_summary.posts.twitter;
        }
        
        if( channel_info.analytics_summary.posts.total ){
          total_post_count = channel_info.analytics_summary.posts.total;
        }
    }

    if( channel_info.analytics_summary.subscribers ){
      subscribers = channel_info.analytics_summary.subscribers;
    }
    if( channel_info.analytics_summary.demographics ){

      if( channel_info.analytics_summary.demographics.male ){
        male = channel_info.analytics_summary.demographics.male;
      }

      if( channel_info.analytics_summary.demographics.female ){
        female = channel_info.analytics_summary.demographics.female;
      }
    }
  }

  if( channel_info.time ){
    last_update_time = channel_info.time;
  }

  if( channel_info.likes && channel_info.likes.total){
    like_count = channel_info.likes.total;
  }

  if( channel_info.comments && channel_info.comments.total){
    comment_count = channel_info.comments.total;
  }

  if( channel_info.social_counters && channel_info.social_counters.length ){
    $.each(channel_info.social_counters, function(i, counter) { 
          share_count = share_count + counter.count;
      });
  }
  html =    '<div class="aw_ppm_chn_dyn_anlytc_summary_header">' +
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_header_label" >' +
                    '<span>' + 
                      'INFO CARD' + 
                    '</span>' +
                  '</div>' +

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_lut">'+
                      '<span>Last updated : ' + 
                        '<abbr class="aw_js_chn_timeago" title="' + last_update_time + '"></abbr>'+
                      '</span>' +
                  '</div>'+


                  '<div class="aw_ppm_chn_dyn_anlytc_summary_category" >' +
                    '<span class="aw_ppm_chn_dyn_anlytc_summary_category_label">' + 
                      'CATEGORY: ' +
                    '</span>' + 
                    '<span class="aw_ppm_chn_dyn_anlytc_summary_category_text">' + 
                      channel_info.category_data.name +
                    '</span>' + 
                  '</div>' +

                  

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">10000</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label"> RANKING </span>'+
                  '</div>'+
                 
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                          fb_post_count + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label"> FACEBOOK   POSTS </span>'+
                  '</div>'+

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                          tweet_post_count + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label"> TWEETS </span>'+
                  '</div>'+

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                          aw_post_count + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label"> ACTWITTY   POSTS </span>'+
                  '</div>'+

                   '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                        total_post_count +  
                      '</span>' +
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                          ' POSTS IN TOTAL ' + 
                      '</span>' +
                  '</div>' +

                  /* 

                   '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                        + subscribers +
                      '</span>'+
                  
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                          ' SUBSCRIBERS,  ' + 
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                         male +
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                        ' MALES AND ' +
                      '</span>'+

                       '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                         female +
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                        ' FEMALES ' +
                      '</span>'+

                  '</div>'+

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                        + like_count +
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                          ' LIKES,  ' + 
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                         share_count +
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                        ' POSTS SHARED AND ' +
                      '</span>'+

                       '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                         comment_count +
                      '</span>'+

                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                        ' COMMENTS ' +
                      '</span>'+
                  '</div>'+ */


                '</div>';
          
  return html;
}










/*************************************************************/
/*
 *
 *
 */
function aw_get_user_channel_html(channel_info){
  // commented to verify theme api's  TODO: replace all
  /*
  var default_theme = aw_lib_get_default_channel_theme_for_category(channel_info.category_data); 
  var channel_theme = default_theme.thumb;
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  */

  var channel_theme = aw_lib_get_channel_theme_thumb(channel_info);
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }


  var box_id = aw_lib_get_channel_box_id(channel_info);

  aw_api_ppm_add_channel_context(box_id, channel_info);

  var channel_info_html = "";
  // build the channel analytic summary info, which will be displayed when hovered over channel icon
  var channel_dyn_analytic_info_html = aw_ppm_channel_dyn_analytic_info_build(channel_info);
  
  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){
     channel_info_html = '<div class="aw_ppm_dyn_users_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            // channel dynamic summary info append
                            '<div class="aw_ppm_dyn_users_chn_info_hover_box">'+
                                channel_dyn_analytic_info_html +     
                            '</div>'+
                            '<div class="aw_ppm_dyn_users_chn_label_own_page">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                          '</div>';
  }else{
     var subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/subscribe.png';
     var subscription_tooltip = 'Click to subscribe to this channel.';
     if ( channel_info.subscribed && channel_info.subscribed == true ){
        subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/unsubscribe.png';
        subscription_tooltip = 'You are already subscribed to this channel. Click to unsubscribe.';
     }
     channel_info_html =  '<div class="aw_ppm_dyn_users_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            '<div class="aw_ppm_dyn_users_chn_info_hover_box">' +
                                channel_dyn_analytic_info_html +     
                            '</div>' +
                            '<div class="aw_ppm_dyn_users_own_chn_label_others_page">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_user_chn_subscription_action_box aw_js_ppm_subscribe_action" style="background:url(' + subscription_action_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center" >' +
                              '<span>' + subscription_tooltip +  '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_user_chn_user_info_box">' +
                                  '<img src="' + channel_info.user.photo +  '">' +
                                  '<span>' + channel_info.user.full_name +  '</span>' +
                            '</div>' +
                          '</div>';
  }

  return channel_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_user_channels(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_user_chn_container').html('');
  }
  while ( data.length > 8 ){
    data.pop();
  }
  $.each(data, function(i, channel_info){
    if( i==0 && !channel_info.word){
      $('#aw_js_ppm_user_chn_container').html("No channels created so far.");
      return;
    }
    var html = aw_get_user_channel_html(channel_info);
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_USER_CHANNELS', channel_info.time);
    $('#aw_js_ppm_user_chn_container').append(html);

  });
  $("abbr.aw_js_chn_timeago").timeago();
  $("span.aw_js_comma_seperated_numbers").digits();
  /* enable the more button */
  $("#aw_js_ppm_user_chn_data_more").attr("disabled", false);
  $('#aw_js_ppm_user_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_user_channels(on_init){
  /* disable the more button */
  $("#aw_js_ppm_user_chn_data_more").attr("disabled", true);
  $('#aw_js_ppm_user_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_USER_CHANNELS', '');
  }

  
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        updated_at: aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_CHN_GET_USER_CHANNELS'), 
                        page_type: 1,
                        cache_cookie:aw_lib_get_cache_cookie_id()
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_USER_CHANNELS', params);
}
/*************************************************************/

/*************************************************************/
/*
 *
 *
 */
function aw_get_subscribed_channel_html(channel_info){
  var default_theme = aw_lib_get_default_channel_theme_for_category(channel_info.category_data); 
  var channel_theme = default_theme.thumb;
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = aw_lib_get_channel_box_id(channel_info);
  aw_api_ppm_add_channel_context(box_id, channel_info);
  var subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/subscribe.png';
  var subscription_tooltip = 'Click to subscribe to this channel.';
  if ( channel_info.subscribed && channel_info.subscribed == true ){
    subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/unsubscribe.png';
    subscription_tooltip = 'You are already subscribed to this channel. Click to unsubscribe.';
  }

  // build the channel analytic summary info, which will be displayed when hovered over channel icon
  var channel_dyn_analytic_info_html = aw_ppm_channel_dyn_analytic_info_build(channel_info);

  var channel_info_html = '<div class="aw_ppm_dyn_subscribed_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            // channel dynamic summary info append 
                            '<div class="aw_ppm_dyn_subscribed_chn_info_hover_box">'+
                              channel_dyn_analytic_info_html + 
                            '</div>'+
                            '<div class="aw_ppm_dyn_subscribed_chn_label">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_subscribed_chn_subscription_action_box aw_js_ppm_subscribe_action" style="background:url(' + subscription_action_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center" >' +
                               '<span>' + subscription_tooltip +  '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_subscribed_chn_user_info_box">' +
                                  '<img src="' + channel_info.user.photo +  '">' +
                                  '<span>' + channel_info.user.full_name +  '</span>' +
                            '</div>' +
                          '</div>';
  return channel_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_subscribed_channels(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS');
  var cookie = params['aw_srv_protocol_cookie'];
  var init_mode = 1;
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_subscribed_chn_container').html('');
  }
  while ( data.length > 8 ){
    data.pop();
  }
  $.each(data, function(i, channel_info){
    if( init_mode == 1){
      channel_info['subscribed'] = true;
    }
    if( aw_lib_get_page_owner_id() != channel_info.user.id ) {
      var html = aw_get_subscribed_channel_html(channel_info);
      $('#aw_js_ppm_subscribed_chn_container').append(html);
      aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS', channel_info.time);
    }
  });
  $("abbr.aw_js_chn_timeago").timeago();
  /* enable the more button */
  $("#aw_js_ppm_subscribed_chn_data_more").attr("disabled", false);
  $('#aw_js_ppm_subscribed_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_subscribed_channels(on_init){
  /* disable the more button */
  $("#aw_js_ppm_subscribed_chn_data_more").attr("disabled", true);
  $('#aw_js_ppm_subscribed_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS', '');
  }
  
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        updated_at: aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS'), 
                        page_type: 2,
                        cache_cookie:aw_lib_get_cache_cookie_id()
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_SUBSCRIBED_CHANNELS', params);
}
/*************************************************************/


/*************************************************************/
/*
 *
 *
 */
function aw_get_all_channel_html(channel_info){
  var default_theme = aw_lib_get_default_channel_theme_for_category(channel_info.category_data); 
  var channel_theme = default_theme.thumb;
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = aw_lib_get_channel_box_id(channel_info);
  aw_api_ppm_add_channel_context(box_id, channel_info);
  
  var subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/subscribe.png';
  var subscription_tooltip = 'Click to subscribe to this channel.';
  if ( channel_info.subscribed && channel_info.subscribed == true ){
    subscription_action_image = '/images/actwitty/refactor/aw_ppm/channel/unsubscribe.png';
    subscription_tooltip = 'You are already subscribed to this channel. Click to unsubscribe.';
  }
  
  // build the channel analytic summary info, which will be displayed when hovered over channel icon
  var channel_dyn_analytic_info_html = aw_ppm_channel_dyn_analytic_info_build(channel_info);

  var channel_info_html = '<div class="aw_ppm_dyn_all_chn_box aw_js_ppm_channel_box_backtracker aw_js_ppm_channel_box_filter_setter" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            // channel dynamic summary info append 
                            '<div class="aw_ppm_dyn_all_chn_info_hover_box">'+
                              channel_dyn_analytic_info_html +
                            '</div>'+
                            '<div class="aw_ppm_dyn_all_chn_label">' +
                                '<span>' + channel_info.word.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_all_chn_subscription_action_box aw_js_ppm_subscribe_action" style="background:url(' + subscription_action_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center" >' +
                               '<span>' + subscription_tooltip +  '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_all_chn_user_info_box">' +
                                  '<img src="' + channel_info.user.photo +  '">' +
                                  '<span>' + channel_info.user.full_name +  '</span>' +
                            '</div>' +
                          '</div>';
  return channel_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_all_channels(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_CHANNELS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_all_chn_container').html('');
  }
  while ( data.length > 8 ){
    data.pop();
  }
  $.each(data, function(i, channel_info){
    if( aw_lib_get_page_owner_id() != channel_info.user.id ) {
      if ( channel_info.subscribed && channel_info.subscribed == true ){
        /* skip */
      }else{
        var html = aw_get_all_channel_html(channel_info);
        aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_ALL_CHANNELS', channel_info.time);
        $('#aw_js_ppm_all_chn_container').append(html);
      }

    }
  });
  $("abbr.aw_js_chn_timeago").timeago();
  /* enable the more button */
  $("#aw_js_ppm_all_chn_data_more").attr("disabled", false);
    $('#aw_js_ppm_all_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_all_channels(on_init){
  /* disable the more button */
  $("#aw_js_ppm_all_chn_data_more").attr("disabled", true);
  $('#aw_js_ppm_all_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_CHN_GET_ALL_CHANNELS', '');
  }
 
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        updated_at: aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_CHN_GET_ALL_CHANNELS'), 
                        page_type: 3,
                        cache_cookie:aw_lib_get_cache_cookie_id('AW_SRV_PPM_CHN_GET_ALL_CHANNELS')
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_CHANNELS', params);
}
/*************************************************************/

/*************************************************************/
/*
 *
 *
 *
 */
function aw_get_mention_box_id(mention_info){
  return "aw_ppm_chn_mention_box_" + aw_lib_get_page_owner_id() + "_" + mention_info.id;
}

/*************************************************************/
/*
 *
 *
 */
function aw_get_user_mentions_html(mention_info){
  var box_id = aw_get_mention_box_id(mention_info);
  var mention_image = mention_info.image + "?maxWidth=80";
  var mention_info_html = '<div class="aw_ppm_dyn_chn_mentions_box aw_js_ppm_chn_mentions" style="background:url(' + mention_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                            '<input type="hidden" class="aw_js_ppm_chn_mention_id" value="' + mention_info.id + '" />' +
                            '<div class="aw_ppm_dyn_chn_mention_label">' +
                                '<span  class="aw_js_ppm_chn_mention_name">' + mention_info.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_mention_info_hover_box" >' +
                              'Click to see stream with ' + mention_info.name +
                            '</div>'+
                          '</div>';
  return mention_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_user_mentions(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_MENTIONS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_user_mention_container').html('');
    while ( data.length > 14 ){
      data.pop();
    }
  }
  $.each(data, function(i, mention_info){
    var html = aw_get_user_mentions_html(mention_info);
    $('#aw_js_ppm_user_mention_container').append(html);

  });
  /* enable the more button */
  $("#aw_js_ppm_mentions_data_more").attr("disabled", false);
  $('#aw_js_ppm_user_mentions_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_users_mentions(on_init){
  /* disable the more button */
  $("#aw_js_ppm_mentions_data_more").attr("disabled", true);
  $('#aw_js_ppm_user_mentions_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
  }
  

  var srv_params =   { 
                        user_id:   aw_lib_get_page_owner_id(), 
                        sort_order: 1,
                        cache_cookie: aw_lib_get_cache_cookie_id()
                      };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_MENTIONS', params);
}
/*************************************************************/

/*************************************************************/
/*
 *
 *
 *
 */
function aw_get_location_box_id(location_info){
  return "aw_ppm_chn_location_box_" + aw_lib_get_page_owner_id() + "_" + location_info.time;
}

/*************************************************************/
/*
 *
 *
 */
function aw_get_user_locations_html(location_info){
  var box_id = aw_get_location_box_id(location_info);
  var location_info_html = "";
  if( location_info.type == 2){
    location_info_html = '<div class="aw_ppm_dyn_chn_locations_box aw_js_ppm_chn_locations"  id="' + box_id + '" >' +
                            '<input type="hidden" class="aw_js_ppm_chn_location_id" value="' + location_info.id + '" />' +
                            '<div class="aw_ppm_dyn_chn_locations_map_box aw_js_ppm_geo_map" id="' + box_id + '_map" >' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_chn_location_label_box">' +
                                '<span class="aw_js_ppm_chn_location_name">' + location_info.name + '</span>' +
                            '</div>' +
                            '<div class="aw_ppm_dyn_location_info_hover_box">' +
                              'Click to see the streams with geo location : ' +  location_info.name +
                            '</div>'+
                          '</div>';
  }else{
    var location_image = '/images/actwitty/refactor/aw_ppm/channel/aw_unknown_geo_location.jpg';
    location_info_html = '<div class="aw_ppm_dyn_chn_locations_box" style="background:url(' + location_image + '); background-size: 100%; background-repeat:no-repeat; background-position:center"  id="' + box_id + '" >' +
                          '<div class="aw_ppm_dyn_chn_location_label_box">' +
                              '<span>' + location_info.name + '</span>' +
                          '</div>' +
                          '<div class="aw_ppm_dyn_location_info_hover_box">' +
                              'Click to see the streams with location : ' +  location_info.name +
                          '</div>'+

                        '</div>';
                          
  }
  return location_info_html;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_chn_render_user_locations(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CHN_GET_ALL_LOCATIONS');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#aw_js_ppm_user_location_container').html('');
    while ( data.length > 24 ){
      data.pop();
    }
  }
  $.each(data, function(i, location_info){
    if( i==0 && !location_info.id){
      $('#aw_js_ppm_user_chn_container').html("No checkin to a location so far.");
      return;
    } 
    var map_id =  aw_get_location_box_id(location_info) + "_map";
    var html = aw_get_user_locations_html(location_info);
    $('#aw_js_ppm_user_location_container').append(html);
    if( location_info.type == 2){
      var mapOptions = {
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: new google.maps.LatLng(location_info.lat,location_info.long)
                    };
      map = new google.maps.Map(document.getElementById(map_id),mapOptions);
    }

  });
  /* enable the more button */
  $("#aw_js_ppm_locations_data_more").attr("disabled", false);
  $('#aw_js_ppm_user_location_channel_data').find(".aw_js_ppm_loading_animation").hide();
}
/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_ppm_chn_request_users_locations(on_init){
  /* disable the more button */
  $("#aw_js_ppm_locations_data_more").attr("disabled", true);
  $('#aw_js_ppm_user_location_channel_data').find(".aw_js_ppm_loading_animation").show();
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
  }
  

  var srv_params =   { 
                        user_id:   aw_lib_get_page_owner_id(), 
                        sort_order: 1,
                        cache_cookie: aw_lib_get_cache_cookie_id()
                      };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CHN_GET_ALL_LOCATIONS', params);
}
/*************************************************************/


/***********************************************************/
var aw_local_fb_access_token;
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_initialize_access_token(fn_cb){
  var auth_token = $("#aw_js_ppm_fb_access_token").val();
  if(auth_token.length){
    aw_local_fb_access_token = auth_token;
    fn_cb();
    return;
  }
  FB.init({
        appId      : '172893766124779',
        channelUrl : aw_lib_get_base_url() + '/channel.html',
        status     : true, 
        cookie     : true, 
        oauth      : true, 
        xfbml      : true  
      });
  FB.getLoginStatus(function(response) {
  if (response.authResponse) {
    aw_local_fb_access_token = response.authResponse.accessToken;
  } 
  fn_cb();
});
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_post_check(stream_info){
  if( stream_info.post.source_name == 'facebook' && stream_info.post.source_object_id ){
    return true;
  }
  return false;
}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_facebook_get_signed_in_auth_token(){
  return aw_local_fb_access_token;
 
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_skip_processing(stream_info, fb_resp_data){
 
  if( (fb_resp_data.message && fb_resp_data.message.length) || ( fb_resp_data.link &&  fb_resp_data.link.length) ){
    return false;
  }else{
    var stream_main_box_id = aw_api_get_stream_id(stream_info);                       
    $("#" + stream_main_box_id).remove();
    aw_api_ppm_remove_stream_context(stream_main_box_id);
    return true;
  }


}
/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_link_is_video(url){
  if(url.match('http://(www.)?youtube|youtu\.be')){
    return true;
  }else if(url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/)){
    return true;
  }
  return false;
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_image_link(url){
  if (url.match(/(\.|\/)(gif|jpe?g|png)$/i)){
    return true;
  }
  return false;
}

/************************************************************/
/*
 *
 *
 */
function aw_get_params_by_name( url, name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_check_fb_link_with_fbid(fb_resp_data){
  return aw_get_params_by_name(fb_resp_data.link, 'fbid'); 
}

/************************************************************/
/*
 *
 *
 */
function aw_api_process_facebook_links_with_fbid(stream_info, fbid, fb_resp_data){
  var fbid_url = 'https://graph.facebook.com/' + fbid +"?access_token="+ aw_api_ppm_facebook_get_signed_in_auth_token() + "&callback=?";
  $.getJSON(fbid_url, function(fbid_resp_data){
    var fb_data_json = {};
    if(fbid_resp_data.message){
      fb_data_json['internal_message'] = fbid_resp_data.message;
    }
    if(fbid_resp_data.source){
      fb_data_json['internal_src'] = fbid_resp_data.source;
     if(aw_api_ppm_stm_facebook_check_link_is_video(fbid_resp_data.source)){
        fb_data_json['video'] = fbid_resp_data.source; 
      }else if(aw_api_ppm_stm_facebook_check_image_link(fbid_resp_data.source)){
         fb_data_json['image'] = fbid_resp_data.source; 
      }else{
        fb_data_json['unresolved'] = fbid_resp_data.source; 
      }
    }

     if(fb_resp_data.message){
      fb_data_json['message'] = fb_resp_data.message;
    } 
    fb_data_json['link'] = fb_resp_data.link;
    aw_api_facebook_render_post_data(stream_info, fb_data_json);
  });
}


/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_process_fb_data(stream_info, fb_resp_data){
  var fb_data_json = {};
  fb_data_json['link'] = '';
  if(fb_resp_data.link){
    fb_data_json['link'] = fb_resp_data.link;
    if(aw_api_ppm_stm_facebook_check_link_is_video(fb_resp_data.link)){
      fb_data_json['video'] = fb_resp_data.link; 
      fb_data_json['caption'] = fb_resp_data.caption; 
      if(fb_resp_data.message){
        fb_data_json['message'] = fb_resp_data.message;
      }
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }else if(aw_api_ppm_stm_facebook_check_image_link(fb_resp_data.link)){
      fb_data_json['image'] = fb_resp_data.link; 
      fb_data_json['caption'] = fb_resp_data.caption; 
      if(fb_resp_data.message){
        fb_data_json['message'] = fb_resp_data.message;
      }
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }else{
      var fbid = aw_api_ppm_stm_facebook_check_fb_link_with_fbid(fb_resp_data);
      if(fbid.length){
        aw_api_process_facebook_links_with_fbid(stream_info, fbid, fb_resp_data);
      }else{
        fb_data_json['unresolved'] = fb_resp_data.link; 
        fb_data_json['description'] = fb_resp_data.description; 
        fb_data_json['caption'] = fb_resp_data.caption; 
        if(fb_resp_data.message){
          fb_data_json['message'] = fb_resp_data.message;
        }
        aw_api_facebook_render_post_data(stream_info, fb_data_json);
      }
    }

  }else{
    if(fb_resp_data.message){
      fb_data_json['message'] = fb_resp_data.message;
      aw_api_facebook_render_post_data(stream_info, fb_data_json);
    }
  }
  
  
  

}

/************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_facebook_make_srv_get_request(stream_info){
   var fb_url = 'https://graph.facebook.com/' + stream_info.post.source_object_id +"?access_token="+ aw_api_ppm_facebook_get_signed_in_auth_token() + "&callback=?";
    $.getJSON(fb_url, function(fb_resp_data){
       if( !aw_api_ppm_stm_facebook_check_skip_processing(stream_info, fb_resp_data) ){
          aw_api_ppm_stm_facebook_process_fb_data(stream_info, fb_resp_data);
       }
    });

}

/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_facebook_attachment_get_embedded_player_html( url, height, width){
	var output = '';
  
	var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	var vimeoUrl = url.match(/^http:\/\/(www\.)?vimeo\.com\/(clip\:)?(\d+).*$/);

  if(url.match('http://(www.)?youtube|youtu\.be')){
    var youtube_id=url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
    output = '<iframe class="video" width="'+width+'" height="'+height+'" src="http://www.youtube.com/embed/'+ youtube_id +'?wmode=transparent"></iframe>';
  }else if(vimeoUrl){
		output =  '<iframe class="video" src="http://player.vimeo.com/video/'+vimeoUrl[3]+'" width="'+width+'" height="'+height+'" frameborder="0" ></iframe>';
	}else{
		output = '<p>no video url found - only vimeo and youtube supported</p>';
	}
	return output;
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_activate_facebook_fancybox(post_group){
    $('a[rel=aw_ppm_stm_facebook_fancy_box_img_grp_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function( title, currentArray, currentIndex, currentOpts) {
					var fancybox_html = '<span id="fancybox-title-over">' +
                                'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                              '</span>' ;
          return fancybox_html;
				},
        'onStart' : function(selectedArray, selectedIndex, selectedOpts){
          var obj = selectedArray[ selectedIndex ];
        }
	});
}
/********************************************************/
/*
 *
 *
 */
function aw_api_facebook_render_post_data(stream_info, fb_data_json){
  var image_html='';
  var video_html='';
  var text_html='';
  var link_html = '';
  var caption = '';
  
  if(fb_data_json['caption']){
    caption = fb_data_json['caption'];
  }

  var aw_images_container_id = aw_api_get_stream_id(stream_info) + '_fb_img';
  //alert(JSON.stringify(fb_data_json));
  if(fb_data_json['image']){
    image_html ='<div class="awppm_stm_fb_post_attachments">'  +
                  '<div class="awppm_stm_fb_attachment_single_image_box" >' +
                    '<a rel="aw_ppm_stm_facebook_fancy_box_img_grp_'+ aw_images_container_id +'" href="' + fb_data_json['image'] + '" title="' + caption  + '" >' + 
                            '<img alt="" src="'+ fb_data_json['image'] + '"   width="300" alt="" />' +
                    '</a>' +
                  '</div>' +
                '</div>';
  }

  if( fb_data_json['video']){
    video_html = '<div class="awppm_stm_fb_post_attachments">' +
                    '<div class="awppm_stm_fb_attachment_single_video_box" >' +
                        aw_ppm_stm_facebook_attachment_get_embedded_player_html(fb_data_json['video'], 323, 430) +
                    '</div>' +
                  '</div>';
  }



  if( fb_data_json['message'] || fb_data_json['internal_message'] || fb_data_json['description'] || fb_data_json['unresolved'] ){
    var link = '';
    var description = '';

    if ( fb_data_json['unresolved'] ){
      link = fb_data_json['unresolved'];
      if( fb_data_json['description'] ){
        description = fb_data_json['description'];
      }

    }
    var message = '';
    if( fb_data_json['message'] ){
      message = fb_data_json['message'] + '<br>';
    }

    if( fb_data_json['internal_message'] ){
      message = fb_data_json['internal_message'] + '<br>';
    }

    
    text_html = '<div class="aw_ppm_dyn_stm_fb_post_text aw_js_ppm_stm_fb_post_text">' +
                    '<p class="aw_ppm_dyn_stm_fb_text_box ">' +
                        message +
                    '</p>' +

                    '<p class="aw_ppm_dyn_stm_fb_link_text_box">' +
                        description + '<br>' +
                        '<a href="' + link + '">' + link + '</a>' +
                    '</p>' +
                    '<input type="hidden" class="aw_js_ppm_stm_fb_link" value="' + fb_data_json['link'] + '" />'+
                    '</div>' +
                  '</div>';
  }

  var html = image_html + video_html + text_html;
  var stream_main_box_id = aw_api_get_stream_id(stream_info);                       
  $("#" + stream_main_box_id).find(".aw_js_ppm_stm_fb_content_box").html(html);
  if(fb_data_json['image']){
    aw_ppm_stm_activate_facebook_fancybox(aw_images_container_id);
  }

}


function  aw_api_ppm_stm_facebook_jump_to_fb_link(element){
  var link = element.find(".aw_js_ppm_stm_fb_link").val();
  window.location.href = link; 
}
