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
  var subscribers ="No";
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
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_rank">'+
                      '<span class="aw_ppm_chn_dyn_analytc_rank_label"> Rank </span>'+
                      '<img class="aw_ppm_chn_dyn_anlytc_rank_icon" src="/images/actwitty/refactor/aw_ppm/channel/analytics/analytic_rank_icon.png">'+
                      '<span>100</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_lut">'+
                      '<span>Last update : ' + 
                      '<abbr class="aw_js_chn_timeago" title="' + last_update_time + '"></abbr>'+
                      '</span>' +
                  '</div>'+
                '</div>'+
                '<div class="aw_ppm_chn_dyn_analytc_summary_posts">'+
                    '<h5>Posts</h5>'+
                    '<div class="aw_ppm_chn_dyn_analytic_fb_post aw_ppm_chn_dyn_analytc_posts_box">'+
                       '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/facebook_analytics.png" width="50">'+
                       '<span>' + fb_post_count + '</span>'+
                    '</div>'+
                    '<div class="aw_ppm_chn_dyn_analytic_twt_post aw_ppm_chn_dyn_analytc_posts_box">'+
                       '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/twitter_analytics.png" width="50">'+
                        '<span>' + tweet_post_count + '</span>'+
                    '</div>'+
                    '<div class="aw_ppm_chn_dyn_analytic_aw_post aw_ppm_chn_dyn_analytc_posts_box">'+
                       '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/actwitty_analytics.png" width="50">'+
                       '<span>' + aw_post_count + '</span>'+
                    '</div>'+
                '</div>'+
                '<div class="aw_ppm_chn_dyn_analytc_summary_counters">'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_subscribers">'+
                     '<span class="aw_ppm_chn_dyn_analytc_subcrb_count">' + subscribers + '</span>'+
                     '<span>Subscribers</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_demograph">'+
                      '<div class="aw_ppm_chn_dyn_analytc_demograph_box">'+
                        '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/man.png" height="50">'+
                        '<span>' + male + '</span>'+
                      '</div>'+
                      '<div class="aw_ppm_chn_dyn_analytc_demograph_box">'+
                          '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/woman.png" height="50">'+
                        '<span>' + female + '</span>'+
                      '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="aw_ppm_chn_dyn_analytc_actions">'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_actions">'+
                     '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/analytic_like.png" width="30">'+
                     '<span>' + like_count + '</span>'+
                     '<span class="aw_ppm_chn_dyn_analytc_action_label">Likes</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_actions">'+
                     '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/share_active.png" width="30">'+
                     '<span>' + share_count + '</span>'+
                     '<span class="aw_ppm_chn_dyn_analytc_action_label">Shares</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_actions">'+
                     '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/comments.png" width="30">'+
                     '<span>' + comment_count + '</span>'+
                     '<span class="aw_ppm_chn_dyn_analytc_action_label_comments ">Comments</span>'+
                  '</div>'+
                '</div>';
          
  //the_big_modal_subscription_json[link_id] = {user_id: subscription.id};
  return html;
}









