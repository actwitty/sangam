/*******************************************/
/*
 *
 *
 */
function aw_api_get_image_id(image_info){
  return 'aw_ppm_stm_image_box_' + image_info.document.activity_id;
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_images_activate_fancybox(){
    $('a[rel=aw_ppm_stm_img_timeline_images_fancybox]').fancybox({
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
/*************************************************************/
/*
 *
 *
 */
function aw_get_one_image_html(image_info){
  var caption = "";
  if(image_info.document.caption && image_info.document.caption.length){
    caption = image_info.document.caption;
  }
  var thumb_nail = image_info.document.url; 
  if (image_info.document.thumb_url){
    thumb_nail = image_info.document.thumb_url; 
  }
  var html = '<div class="awppm_dyn_stm_img_single_box " >' +
              '<a rel="aw_ppm_stm_img_timeline_images_fancybox' +'" href="' + image_info.document.url + '" title="' + caption  + '" >' + 
                '<img alt="" src="'+ thumb_nail + '"   height="100" max-width="100" alt="" />' +
              '</a>' +
            '</div>';
  return html;
}


/*************************************************************/
/*
 *
 *
 */
function aw_ppm_stm_images_append_html(image_info){
    var image_box_id = aw_api_get_image_id(image_info);
    if($("#" + image_box_id).length){
      $("#" + image_box_id).find(".aw_js_ppm_image_list").append(aw_get_one_image_html(image_info));

    }else{
      var html = '<li class="aw_ppm_dyn_stm_images_li_box" id="' + image_box_id  + '" >' +
                  '<div class="aw_ppm_dyn_stm_images_div_box" >' +
                      '<div class="aw_ppm_dyn_stm_images_post_info">' +
                        '<a class="aw_ppm_dyn_stm_images_post_user_img" href="/home/show?id=' + image_info.user.id + '" >' +
                          '<img src="' + image_info.user.photo + '"/>' +
                        '</a>' +
                        '<a class="aw_ppm_dyn_stm_images_post_user_name" href="/home/show?id=' + image_info.user.id + '">' +
                           image_info.user.full_name +
                        '</a>' +
                        '<span class="aw_ppm_dyn_stm_images_post_time">' +
                          '<abbr class="aw_js_timeago" title="' + image_info.time + '"></abbr>' +
                        '</span>' +

                          '<a class="aw_ppm_dyn_stm_stream_images_chn_name" href="#" ><span>' + image_info.word.name  + '</span></a>' +
                      '</div>' +
                      /* check and add title */
                      '<div class="aw_ppm_dyn_stm_images_list_per_post aw_js_ppm_image_list" >' +
                        aw_get_one_image_html(image_info) + 
                      '</div>' +
                      '<div class="aw_ppm_dyn_stm_image_view_full_post" >' +
                        '<a class="aw_ppm_dyn_stm_image_goto_post_link"  href="/view?id=' + image_info.document.activity_id + '">' +
                          '<span>' +
                            'Goto Post' +
                          '</span>' +
                        '</a>' +
                      '</div>' +
                  '</div>' +
               '</li>';
      $('#aw_js_ppm_stm_images_timeline_list').append(html);
    }
    

}

/*************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_render_images(params){
  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_STM_GET_ALL_IMAGES');

  $.each(data, function(i, image_info){
    aw_ppm_stm_images_append_html(image_info);
  });
  $("abbr.aw_js_timeago").timeago();
  aw_ppm_stm_images_activate_fancybox();
  
  
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
function aw_api_ppm_stm_images_request(on_init){
/* disable the more button */
  var params = {};
  var req_cookie = {};
  if( typeof on_init == 'undefined' ){
      on_init = 0;
  }
  var time_cookie = '';
  if( on_init ){
    /* erase the timeline */
    $("#aw_js_ppm_stm_images_timeline_list").html();
    aw_api_ppm_cmn_more_cookie_set('AW_SRV_PPM_STM_GET_ALL_IMAGES', '');
  }
  $("#aw_js_ppm_stm_data_more").attr("disabled", true);
  $('#aw_js_ppm_stm_stream_timelines_div').find(".aw_js_ppm_loading_animation").show();
  var srv_params = {
                        user_id : aw_lib_get_page_owner_id(),
                        updated_at : aw_api_ppm_cmn_more_cookie_get('AW_SRV_PPM_STM_GET_ALL_IMAGES'),
                        filter : aw_api_ppm_stm_get_filter(),
                        page_type:aw_api_ppm_stm_get_page_scope(),
                        category : "image",
                        cache_cookie:aw_lib_get_cache_cookie_id()
                   };

  params['aw_srv_protocol_params'] = srv_params;
  params['aw_srv_protocol_cookie'] = req_cookie;
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_GET_ALL_IMAGES', params);   
}

