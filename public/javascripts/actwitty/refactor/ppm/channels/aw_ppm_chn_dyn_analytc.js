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
 
  var html =    '<div class="aw_ppm_chn_dyn_anlytc_summary_header">' +
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_rank">'+
                      '<img class="aw_ppm_chn_dyn_anlytc_rank_icon" src="/images/actwitty/refactor/aw_ppm/channel/analytics/analytic_rank_icon.jpg">'+
                      '<span>100</span>'+
                      '<span class="aw_ppm_chn_dyn_analytc_rank_label"> Rank </span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_lut">'+
                      '<span>Last update : 12 hours ago</span>'+
                  '</div>'+
                '</div>'+
                '<div class="aw_ppm_chn_dyn_analytc_summary_posts">'+
                    '<h5>Posts</h5>'+
                    '<div class="aw_ppm_chn_dyn_analytic_fb_post aw_ppm_chn_dyn_analytc_posts_box">'+
                       '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/facebook_active.png" width="50">'+
                       '<span>543</span>'+
                    '</div>'+
                    '<div class="aw_ppm_chn_dyn_analytic_twt_post aw_ppm_chn_dyn_analytc_posts_box">'+
                       '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/twitter_active.png" width="50">'+
                       '<span>200</span>'+
                    '</div>'+
                    '<div class="aw_ppm_chn_dyn_analytic_aw_post aw_ppm_chn_dyn_analytc_posts_box">'+
                       '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/flickr.png" width="50">'+
                       '<span>2000</span>'+
                    '</div>'+
                '</div>'+
                '<div class="aw_ppm_chn_dyn_analytc_summary_counters">'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_subscribers">'+
                     '<span class="aw_ppm_chn_dyn_analytc_subcrb_count">345</span>'+
                     '<span>Subscribers</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_demograph">'+
                      '<div class="aw_ppm_chn_dyn_analytc_demograph_box">'+
                        '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/man.png" height="50">'+
                        '<span>24</span>'+
                      '</div>'+
                      '<div class="aw_ppm_chn_dyn_analytc_demograph_box">'+
                          '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/woman.png" height="50">'+
                          '<span>46</span>'+
                      '</div>'+
                  '</div>'+
                '</div>'+

                '<div class="aw_ppm_chn_dyn_analytc_actions">'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_actions">'+
                     '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/analytic_like.png" width="30">'+
                     '<span>200</span>'+
                     '<span class="aw_ppm_chn_dyn_analytc_action_label">Likes</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_actions">'+
                     '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/share_active.png" width="30">'+
                     '<span>200</span>'+
                     '<span class="aw_ppm_chn_dyn_analytc_action_label">Shares</span>'+
                  '</div>'+
                  '<div class="aw_ppm_chn_dyn_analytc_summary_actions">'+
                     '<img src="/images/actwitty/refactor/aw_ppm/channel/analytics/comments.png" width="30">'+
                     '<span>200</span>'+
                     '<span class="aw_ppm_chn_dyn_analytc_action_label_comments ">Comments</span>'+
                  '</div>'+
                '</div>';
          

  //the_big_modal_subscription_json[link_id] = {user_id: subscription.id};
  return html;
}









