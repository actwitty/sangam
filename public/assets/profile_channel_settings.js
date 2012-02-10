

/***************************************************************************************************
 * jS file to take care of channel settings page related queries.     
 *
 * awcspm_js_channel_settings_list_box : This is the main js related id for the left side of 
 *                                       channel settings page. 
 *                                       All channel lists(html) should be updated on this id
 *
 *************************************************************************************************** /







/*
 *
 * Plupload callback on successful update for channel theme as thumbnail
 * NOT USED CURRENTLY AS WE THOUGHT OF GIVING OUR OWN THEMES 
 */

function aw_notify_channel_theme_thumbnail(url_l, url_s)
{
   // TODO : get the summary category from category.yml
   /* var post_json = { 
                    word : 'ThemeUpdate',
                    summary_category: 'stories',
                    text : aw_lib_get_page_owner_name() + ' has updated channel thumbnail',
                    enrich : true,
                    //location:get_location_json(),
                    documents:[{url:main, thumb_url:thumb, caption:"Profile Picture"}],
                    campaign_types:get_campaigns(),
                    source_name:"actwitty",
                    fb: "false",
                    tw: "false"
                  };

   
   post_activity_to_server(post_json);


   $("#awppm_js_user_img_settings").attr("src", main);
   $("#awppm_js_user_profile_settings_profile_pic_url").val(thumb);
 
   $('#awppm_user_profile_change_profile_pic_submit').trigger('click'); 
   */
   return true; 
}




/*
 *
 * Plupload callback on successful update for stream theme as background
 *
 * NOT USED CURRENTLY AS WE THOUGHT OF GIVING OUR OWN THEMES
 */

function aw_notify_channel_theme_background(url_l, url_s)
{
  return true;
}




/******************************************/
/*
 *
 *
 */
var aw_local_cspm_context_manager={};


var aw_local_curr_active_channel_key;

/******************************************/
/*
 *
 *
 */
function aw_api_cspm_context_reinit(){
  aw_local_cspm_context_manager={};
}
/******************************************/
/*
 *
 *
 */
function aw_api_cspm_add_context(key, channel_info){
    aw_local_cspm_context_manager[key] = channel_info;
}
/******************************************/
/*
 *
 *
 */
function aw_api_cspm_remove_context(key){
  delete aw_local_cspm_context_manager[key];
}

/******************************************/
/*
 *
 *
 */
function aw_api_cspm_get_context_id_for_ele(element){
  var key = element.closest(".aw_js_cspm_channel_info_box_backtracker").attr('id');
  return key;
}
/******************************************/
/*
 *
 *
 */
function aw_api_cspm_get_context(element){
  var key = element.closest(".aw_js_cspm_channel_info_box_backtracker").attr('id');
  return aw_local_cspm_context_manager[key];
}
/******************************************/
/*
 *
 *
 */
function aw_api_cspm_get_contex_for_key(key){
  return aw_local_cspm_context_manager[key];
}
/******************************************/






/*
 *
 *
 *  Function to display the list of user summaries on the left side of the panel
 *
 *  General layout for this is
 *  .awcspm_profile_data_info_header
      .awcspm_profile_channel_labels
        %span Food
      .awcspm_profile_data_info
 *
 *
 */

function aw_get_channel_lists_settings_html(channel_info){
  var channel_theme = aw_lib_get_channel_theme_thumb(channel_info);
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var box_id = "aw_cspm_channel_list_" + channel_info.word.id ;

  aw_api_cspm_add_context(box_id , channel_info);
  
  var channel_info_html = "";
  var channel_info_html1 = "";


  if (aw_lib_get_page_owner_id() == aw_lib_get_session_owner_id()){

     channel_info_html = '<div class="awcspm_profile_data_info_header" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center" id="' + box_id + '" >' +
                            '<div class="awcspm_profile_channel_labels">'+
                              '<span>' + channel_info.word.name + '</span>' +
                            '</div>'+
                            '<div class="awcspm_channel_edit_pop_up"> Click to edit this channel</div>'+
                         '</div>';
    
  }
  
  return channel_info_html;
}




/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_cspm_chn_render_user_channels(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST');
  var cookie = params['aw_srv_protocol_cookie'];
  if ( cookie && cookie['init'] && cookie['init'] == 1 ){
    $('#awcspm_js_channel_settings_list_box').html('');
  }
  while ( data.length > 8 ){
    data.pop();
  }
  $.each(data, function(i, channel_info){
    if( i==0 && !channel_info.word){
      $('#awcspm_js_channel_settings_list_box').html("No channels created so far.");
      return;
    }
    if (i==0){
      var channel_bckg = aw_lib_get_channel_theme_background(channel_info);
      $(".awcspm_channel_settings_column2").css('background','url('+channel_bckg+')');
      $("#awcspm_channel_edit_label_header").html('Channel <strong>'+channel_info.word.name+'</strong> is set for edit');
      aw_local_curr_active_channel_key =  "aw_cspm_channel_list_" + channel_info.word.id ;
      aw_cspm_set_channel_for_edit(channel_info,aw_local_curr_active_channel_key);
    }
   
    
    var html = aw_get_channel_lists_settings_html(channel_info);
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST', channel_info.time);
    $('#awcspm_js_channel_settings_list_box').append(html);
  });
  
  // TODO
  $("abbr.aw_js_chn_timeago").timeago();
  //$("#aw_js_ppm_user_chn_data_more").attr("disabled", false);
  $('#awcspm_js_channel_settings_list_box').find(".aw_js_ppm_loading_animation").hide();
}





/*************************************************************/
/*
 *
 *
 *
 */
function aw_api_cspm_chn_setting_request_user_channels(on_init){
  // TODO
  //$("#aw_js_ppm_user_chn_data_more").attr("disabled", true);
  $('#awcspm_js_channel_settings_list_box').find(".aw_js_ppm_loading_animation").show();
  
  
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  if( on_init == 1){
    req_cookie = { 'init' : 1 };
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST', '');
  }

  
  var srv_params =   {
                        user_id : aw_lib_get_page_owner_id(), 
                        updated_at: aw_api_ppm_cmn_more_cookie_get('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST'), 
                        page_type: 1,
                        cache_cookie:aw_lib_get_cache_cookie_id()
                     };
  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_CSPM_CHN_GET_USER_CHANNELS_LIST', params);
  
}
/*************************************************************/









function build_channel_edit_html(channel_context)
{
  var channel_theme = aw_lib_get_channel_theme_thumb(channel_context);
  var channel_edit_html = '<div class="awcspm_chn_data_info_header_edit" style="background:url(' +channel_theme + '); background-size: 100%; background-repeat:no-repeat; background-position:center" id="awcspm_js_curr_chn_edit">' +
                            '<div class="awcspm_profile_channel_labels">'+
                              '<span>' + channel_context.word.name + '</span>' +
                            '</div>'+
                         '</div>'+
                         '<a class="awcspm_delete_channel" href="#">Delete Channel</a>';

  // TODO: need to think on providing analytics info
  /*var channel_analytics_html = '<div class="aw_cspm_dyn_chn_analytics">'+
                                  aw_ppm_channel_dyn_analytic_info_build(channel_context)+
                               '</div>';
  aw_ppm_channel_dyn_analytic_info_build(channel_context);
  */
  //return channel_edit_html + channel_analytics_html;
  return channel_edit_html;
}


/*
 * Function to set the required fields for editing of channel context.
 * i.e Any click on channel box, in the left hand side list, will fill
 * that channel details in the edit panel
 *
 *
 */

function aw_cspm_set_channel_for_edit(channel_context,key)
{
  
  $("#awcspm_js_channel_info_edit_box").html(build_channel_edit_html(channel_context));
  $("#awcspm_js_channel_settings_name").val(channel_context.word.name);
  $("#awcspm_js_channel_settings_category").val(channel_context.category_data.name);
  $("#awcspm_js_channel_theme_code_name").val(channel_context.theme_data.fg_color);
  $(".aw_js_cspm_channel_info_box_backtracker").val(key);


}


/*
 *
 *
 */

function build_channel_theme_selection_list() {

  $.each (aw_local_channel_theme_list_json, function (theme_selector) {

    var theme_selector_html = '<div class="awcspm_channel_theme_box">' +
                                '<img class="awcspm_channel_theme_selector" width="170" height="100" id="'+theme_selector+'" src="'+aw_local_channel_theme_list_json[theme_selector].thumb+'">'+
                                '<div class="awcspm_channel_theme_info">'+
                                  '<span>'+
                                      aw_local_channel_theme_list_json[theme_selector].text+
                                      '<strong>'+aw_local_channel_theme_list_json[theme_selector].name+'</strong>'+
                                  '</span>'+
                                '</div>'+
                              '</div>';
    $("#awcspm_channel_theme_selection_list").append(theme_selector_html);
  });

}



/*
 *
 *
 */
function aw_api_srv_resp_cspm_update_channel(params){
  var edited_channel_box_id = params['aw_srv_protocol_cookie']['channel_box_id'];
  var new_theme_code = params['aw_srv_protocol_cookie']['theme_code_name'];

  updated_channel_context = aw_api_cspm_get_contex_for_key(params['aw_srv_protocol_cookie']['channel_box_id']);

  if(updated_channel_context.theme_data.fg_color != new_theme_code){
    thumbnail_url = aw_lib_get_thumnail_for_theme_code(new_theme_code);
    $("#"+edited_channel_box_id).css('background','url('+thumbnail_url+')'); 
  }
}





/*
 *
 *
 *
 */
function aw_save_channel_edit_updates() {
  var channel_name = $("#awcspm_js_channel_settings_name").val();
  var channel_category = $("#awcspm_js_channel_settings_category").val();
  var channel_theme_code = $("#awcspm_js_channel_theme_code_name").val();

  var channel_context = aw_api_cspm_get_contex_for_key(aw_local_curr_active_channel_key);
  var summary_id = channel_context.id;
  
  var params = {
               'aw_srv_protocol_params' :  { 
                                              summary_id: summary_id,
                                              theme_id:channel_theme_code, 
                                              channel_name: channel_name, 
                                              channel_category: channel_category 
                                            },
                'aw_srv_protocol_cookie' : {
                                              'channel_box_id': aw_local_curr_active_channel_key,
                                              'theme_code_name': channel_theme_code
                                           }     
               }
  aw_api_srv_make_a_post_request('AW_SRV_CSPM_CHANNEL_EDIT',params);     

}







/*
 *
 *
 *
 */

$(document).ready(function(){

  
  build_channel_theme_selection_list();



  $(".awcspm_profile_data_info_header").live('click',function(){
    var key = $(this).attr("id");
    var channel_context = aw_api_cspm_get_contex_for_key(key);
    var channel_st_bckg = aw_lib_get_channel_theme_background(channel_context);
    aw_cspm_set_channel_for_edit(channel_context,key);
    $(".awcspm_channel_settings_column2").css('background','url('+channel_st_bckg+')');
    $("#awcspm_channel_edit_label_header").html('Channel <strong>'+channel_context.word.name+'</strong> is set for edit');
    aw_local_curr_active_channel_key = key;

  
  });
  
  $("#awcspm_js_channel_setting_save").live('click',function(){
    aw_save_channel_edit_updates();
  });



  $(".awcspm_channel_theme_selector").live('click',function(){
    var theme_code = $(this).attr('id');
    var bckg_url = aw_lib_get_background_for_theme_code(theme_code); 
    $("#awcspm_js_channel_theme_code_name").val(theme_code);
    $("#awcspm_js_curr_chn_edit").css('background','url('+$(this).attr("src")+')');
    $(".awcspm_channel_settings_column2").css('background','url('+bckg_url+')');
  });

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









