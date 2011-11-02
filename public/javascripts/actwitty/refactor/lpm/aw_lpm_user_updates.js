
var g_aw_lpm_local_stored_latest_updates




function aw_get_update_block_html(channel_info){
  var channel_theme =  "images/actwitty/refactor/aw_lpm/aw_lpm_no_theme.png";
  if( channel_info.theme_data.url && channel_info.theme_data.url.length){
    channel_theme = channel_info.theme_data.url;
  }
  var channel_info_html =   '<div class="awlpm_channel_name">' +
                                '<p>' +
                                  channel_info.word.name +
                                '</p>' +
                              '</div>' +
                              '<div class="awlpm_channel_theme_img">' +
                                '<img src="'+ channel_theme + '" />' +
                              '</div>' +
                              '<div class="awlpm_channel_originator">' +
                                '<div class="awlpm_channel_originator_img">' +
                                  '<img src="'+ channel_info.user.photo + '"/>' +
                                '</div>' +
                                '<div class="awlpm_channel_originator_name">' +
                                  '<p>' + channel_info.user.full_name + '</p>' +
                                '</div>' +
                              '</div>';
  return channel_info_html;
}


function aw_generate_random_number(max, min){
  var range = max - min + 1;
  return min + Math.floor(range * (Math.random() % 1));
}

function aw_api_lpm_render_latest_channels(params){
  g_aw_lpm_local_stored_latest_updates = params.resp_data;
  var i=1;
  var max_show = 4;
  $.each(params.resp_data, function(i, channel_info){
    i++;
    if (i> 4)
      return;
    var html = aw_get_update_block_html(channel_info);
    $('#awlpm_js_user_update_box_' + i).html(html);
    var random_num=aw_generate_random_number(1,9);
    var bkg_image = "images/actwitty/refactor/aw_lpm/backgrounds/aw_lpm_bkg" + random_num + ".jpg";
    $('#awlpm_js_user_update_box_' + i).css({
                            'backgroundImage' :'url(' + bkg_image + ')',
                            //'backgroundRepeat': 'no-repeat',
                            'backgroundPosition': 'center center'
                          }); 

  });
}

function aw_api_lpm_initialize_landing_page(){
  aw_api_rails_get_latest_channel_info();
}




