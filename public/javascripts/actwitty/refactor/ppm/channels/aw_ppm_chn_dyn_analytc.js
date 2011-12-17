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
                      'SUMMARY OF ACTIVITIES' + 
                    '</span>' +
                  '</div>' +
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_category" >' +
                    '<span class="aw_ppm_chn_dyn_anlytc_summary_category_label">' + 
                      'CATEGORY: ' +
                    '</span>' + 
                    '<span class="aw_ppm_chn_dyn_anlytc_summary_category_text">' + 
                      channel_info.category_data.name +
                    '</span>' + 
                  '</div>' +

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_lut">'+
                      '<span>last updated : ' + 
                        '<abbr class="aw_js_chn_timeago" title="' + last_update_time + '"></abbr>'+
                      '</span>' +
                  '</div>'+

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_standard_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_text aw_js_comma_seperated_numbers">10000</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_label"> RANKING </span>'+
                  '</div>'+
                 
                  '<div class="aw_ppm_chn_dyn_anlytc_summary_standard_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_text aw_js_comma_seperated_numbers">' +
                          fb_post_count + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_label"> FACEBOOK POSTS </span>'+
                  '</div>'+

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_standard_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_text aw_js_comma_seperated_numbers">' +
                          tweet_post_count + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_label"> TWEETS </span>'+
                  '</div>'+

                  '<div class="aw_ppm_chn_dyn_anlytc_summary_standard_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_text aw_js_comma_seperated_numbers">' +
                          aw_post_count + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_standard_label"> ACTWITTY </span>'+
                  '</div>'+

                   '<div class="aw_ppm_chn_dyn_anlytc_summary_width_box">'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                          'THAT MAKES IT ' + 
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_text aw_js_comma_seperated_numbers">' +
                        total_post_count +  
                      '</span>'+
                      '<span class="aw_ppm_chn_dyn_anlytc_width_label">' +
                          ' POSTS IN TOTAL ' + 
                      '</span>'+
                  '</div>'+

                   

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
                  '</div>'+


                '</div>';
          
  return html;
}









