/*******************************************/
/*
 *
 *
 */
function aw_api_get_video_id(video_info){
  return 'aw_ppm_stm_video_box_' + video_info.document.activity_id;
}

/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_videos_get_embedded_player_html( url, height, width){
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



/*************************************************************/
/*
 *
 *
 */
function aw_ppm_stm_videos_append_html(video_info){
    var video_box_id = aw_api_get_video_id(video_info);
    if($("#" + video_box_id).length){
       $("#" + video_box_id).find(".aw_js_ppm_video_list").append(aw_ppm_stm_videos_get_embedded_player_html(video_info.document.url,
                                                                                                                323,
                                                                                                                430));
    }else{
      var html = '<li class="aw_ppm_dyn_stm_videos_li_box" id="' + video_box_id  + '" >' +
                  '<div class="aw_ppm_dyn_stm_videos_div_box" >' +
                      '<div class="aw_ppm_dyn_stm_videos_post_info">' +
                        '<a class="aw_ppm_dyn_stm_videos_post_user_img" href="/home/show?id=' + video_info.user.id + '" >' +
                          '<img src="' + video_info.user.photo + '"/>' +
                        '</a>' +
                        '<a class="aw_ppm_dyn_stm_videos_post_user_name" href="/home/show?id=' + video_info.user.id + '">' +
                           video_info.user.full_name +
                        '</a>' +
                        '<span class="aw_ppm_dyn_stm_videos_post_time">' +
                          '<abbr class="aw_js_timeago" title="' + video_info.time + '"></abbr>' +
                        '</span>' +

                          '<a class="aw_ppm_dyn_stm_stream_videos_chn_name" href="#" ><span>' + video_info.word.name  + '</span></a>' +
                      '</div>' +
                      /* check and add title */
                      '<div class="aw_ppm_dyn_stm_videos_list_per_post aw_js_ppm_video_list" >' +
                        aw_ppm_stm_videos_get_embedded_player_html(video_info.document.url,
                                                                  323,
                                                                  430) +
                    '</div>' +
                    '<div class="aw_ppm_dyn_stm_video_view_full_post" >' +
                    '<a class="aw_ppm_dyn_stm_video_goto_post_link"  href="/view?id=' + video_info.document.activity_id + '">' +
                      '<span>' +
                        'Goto Post' +
                      '</span>' +
                    '</a>' +
                  '</div>' +
                     
                  '</div>' +

                  
               '</li>';
      $('#aw_js_ppm_stm_videos_timeline_list').append(html);
    }
    

}

/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_videos(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_ALL_VIDEOS');
  $.each(data, function(i, video_info){
    aw_ppm_stm_videos_append_html(video_info);
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_ALL_VIDEOS', video_info.time);
  });
  $("abbr.aw_js_timeago").timeago();
  
  
  //TODO: fix this dirty hack
  /* enable the more button */
  $("#aw_js_ppm_stm_data_more").attr("disabled", false);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").hide(); 
}
/******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_videos_request(on_init){
 /* disable the more button */
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }

  var time_cookie = '';
  if( on_init ){
    /* erase the timeline */
    $("#aw_js_ppm_stm_videos_timeline_list").html('');
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_ALL_VIDEOS', '');
  }
  $("#aw_js_ppm_stm_data_more").attr("disabled", true);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").show();
  var srv_params = {
                        user_id : aw_lib_get_page_owner_id(),
                        updated_at : aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_STM_GET_ALL_VIDEOS'),
                        filter : aw_api_ppm_stm_get_filter(),
                        page_type:aw_api_ppm_stm_get_page_scope(),
                        category : "video",
                        cache_cookie:aw_lib_get_cache_cookie_id()
                   };

  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_VIDEOS', params);  
}

