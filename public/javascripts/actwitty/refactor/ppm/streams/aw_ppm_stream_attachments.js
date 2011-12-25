/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachment_get_embedded_player_html( url, height, width){
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

/*********************************************************/
/*
 *
 *
 */
function aw_api_stm_get_images_attachments_container_id(stream_info){
  return aw_api_get_stream_id(stream_info) + '_img_attachments';
}

/*********************************************************/
/*
 *
 *
 */
function aw_api_stm_get_attachment_box_id(stream_info, attachment_id){
  return aw_api_get_stream_id(stream_info) + '_attachment_' + attachment_id;
}

/*********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachments_get_videos_html(stream_info){
  var aw_videos_html = '';
  var aw_img_delete_html = '';
  var aw_video_delete_html = '';
  var aw_videos_html = '';
  var videos_count = 0;
  if(aw_api_ppm_stm_facebook_post_check(stream_info)){
    return '';
  }
  if( stream_info.post.user.id == aw_lib_get_session_owner_id()){
    aw_video_delete_html = '<div class="awppm_stm_attachment_video_delete aw_js_ppm_stm_delete_video" >' +
                            '<img src="/images/actwitty/refactor/aw_common/aw_close.png"> </img>' +
                            '<span>Click here to delete the video.</span>' +
                          '</div>';
  } 
  $.each(stream_info.documents.array, function(i, attachment){
      if( attachment.category == "video" ){
        var attachment_box_id = aw_api_stm_get_attachment_box_id(stream_info, attachment.id);
        var single_html = '<div class="awppm_stm_attachment_single_video_box aw_js_ppm_stm_video_attachment_box"  id= "' + attachment_box_id + '">' +
                            aw_video_delete_html + 
                            aw_ppm_stm_attachment_get_embedded_player_html(attachment.url, 323, 430) +
                            '<input type="hidden" class="aw_js_ppm_stm_hidden_attachment_id" value="' +  attachment.id + '"  >' +
                        '</div>';
        videos_count++;
        aw_videos_html = aw_videos_html + single_html;
      }
  });

  if( videos_count ){
    var html = '<div class="awppm_stm_post_attachments" >' +
                 aw_videos_html +
              '</div>';
      return html;
  }else{
    return '';
  }
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachments_get_links_html(stream_info){

  var aw_link_delete_html  = '';
  var links_count = 0;
  var aw_links_html = '';
  var single_html = '';
  
  $.each(stream_info.documents.array, function(i, attachment){
      if( attachment.category == "link" ){
        var attachment_box_id = aw_api_stm_get_attachment_box_id(stream_info, attachment.id);
        var title_html = '';
        var link_detail_html ='';
        var link_provider_html = '';

        /************************/
        if( attachment.url_title ) {
          title_html = '<a class="awppm_stm_attachment_link_title" src="' + attachment.url + '">' +
                      attachment.url_title +
                   '</a>';
    
        }else{
          title_html = '<a class="awppm_stm_attachment_link_title" src="' + attachment.url + '"> Goto Link </a>';
        }

        /************************/
        if ( attachment.url_description || attachment.url_image){
          var description_html = '';
          var img_html = '';
          if( attachment.url_description ) {
            description_html = '<p class="awppm_stm_attachment_link_description" >' +
                              attachment.url_description +                    
                           '</p>';
          }

          if( attachment.url_image ) {
            img_html = '<img class="awppm_stm_attachment_link_thumbnail" src="' + attachment.url_image + '" />';
          }
          link_detail_html = '<div class="awppm_stm_attachment_single_link_details">' +
                          img_html +
                          description_html +
                         '</div>';


        }
        /************************/
        if ( attachment.url_provider ){
          link_provider_html =  '<p class="awppm_stm_attachment_link_provider">' + 
                                  'Provider: ' + attachment.url_provider +
                                '</p>';
        }
        /************************/

        links_count++;

        var single_html = '<div class="awppm_stm_attachment_single_link_box aw_js_ppm_stm_link_attachment_box"  id="' + attachment_box_id + '">' +
                              title_html +
                              link_detail_html +
                              link_provider_html +
                          '</div>';

        aw_links_html = aw_links_html + single_html;
      }
  });


        

  if( links_count ){
    var html = '<div class="awppm_stm_post_attachments" >' +
                 aw_links_html +
              '</div>';
      return html;
  }else{
    return '';
  }

    


    
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_attachments_get_images_html(stream_info){
  var aw_images_count = 0;
  var max_images_to_show = 3;
  var aw_images_html = '';
  var aw_img_delete_html = '';


  if(aw_api_ppm_stm_facebook_post_check(stream_info)){
    return '';
  }
  if( stream_info.post.user.id == aw_lib_get_session_owner_id()){
    aw_img_delete_html = '<div class="awppm_stm_attachment_image_delete aw_js_ppm_stm_delete_image" >' +
                            '<span>Click here to delete the image.</span>' +
                            '<img src="/images/actwitty/refactor/aw_common/aw_close.png" > </img>' + 
                          '</div>';

  } 
  /* images container id */
  var aw_images_container_id = aw_api_stm_get_images_attachments_container_id(stream_info);

  $.each(stream_info.documents.array, function(i, attachment){

    if( attachment.category == "image" ){
      var caption = "";
      if(attachment.caption && attachment.caption.length){
        caption = attachment.caption;
      }
      var thumb_nail = attachment.url; 
      if (attachment.thumb_url){
        thumb_nail = attachment.thumb_url; 
      }

      var aw_images_hide_class = '';
      if( aw_images_count >= max_images_to_show ){
           aw_images_hide_class = 'style="display:none;"';
      }
      var attachment_box_id = aw_api_stm_get_attachment_box_id(stream_info, attachment.id);
      var single_html = '<div class="awppm_stm_attachment_single_image_box aw_js_ppm_stm_img_attachment_box" ' + aw_images_hide_class +  ' id="' + attachment_box_id + '">' +
                          aw_img_delete_html +    
                          '<a rel="aw_ppm_stm_fancy_box_img_grp_'+ aw_images_container_id +'" href="' + attachment.url + '" title="' + caption  + '" >' + 
                            '<img alt="" src="'+ thumb_nail + '"   width="150" alt="" />' +
                             '<input type="hidden" class="aw_js_ppm_stm_hidden_attachment_id" value="' +  attachment.id + '"  >' +
                          '</a>' +
                        '</div>';
      aw_images_count++;
     
      aw_images_html = aw_images_html + single_html;
    }
  });


  var images_view_all_html = "";
  if( aw_images_count > max_images_to_show){
    images_view_all_html = '<div class="awppm_stm_post_attachments_view_all">' +
                                  '<span class="aw_js_ppm_stm_images_view_all"  >View All ' + aw_images_count + ' Images</span>' +
                            '</div>';
  }


  if( aw_images_count > 0 ){
      var html = '<div class="awppm_stm_post_attachments aw_js_ppm_stm_post_images_container " id="' + aw_images_container_id + '">' +
                    aw_images_html +
                    images_view_all_html +
                 '</div>';

      return html;

  }else{
    return '';
  }
}
/***********************************************************/
/*
 *
 *
 */
function aw_ppm_stm_activate_fancybox(post_group){
    $('a[rel=aw_ppm_stm_fancy_box_img_grp_'+post_group+']').fancybox({
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

/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_attachments_enable_fancybox(stream_info){
    var aw_images_box_id = aw_api_stm_get_images_attachments_container_id(stream_info);
    if( $("#" + aw_images_box_id).length){
     /* activate fancy box  */
      aw_ppm_stm_activate_fancybox(aw_images_box_id);   
    }
}
/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_view_all_images(element){
    var stream_id = aw_api_ppm_get_stm_context_id_for_ele(element);
    $("#" + stream_id).find(".aw_js_ppm_stm_post_images_container a").first().trigger('click');

}

/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_delete_images(element){
    var attachment_id = element.closest(".aw_js_ppm_stm_img_attachment_box").find(".aw_js_ppm_stm_hidden_attachment_id").val();
    var stream_id = aw_api_ppm_get_stm_context_id_for_ele(element);
    var params = {
                    'aw_srv_protocol_params' : { "doc_id" : attachment_id },
                    'aw_srv_protocol_cookie' : {
                                                  "attachment_id" : attachment_id,
                                                  "stream_id"     : stream_id                                                
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_IMAGE_ATTACHMENT',  params);


}

/***********************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_evt_hndl_delete_videos(element){
    var attachment_id = $(element).closest(".aw_js_ppm_stm_video_attachment_box").find(".aw_js_ppm_stm_hidden_attachment_id").val();
    var stream_id = aw_api_ppm_get_stm_context_id_for_ele(element);
    var params = {
                    'aw_srv_protocol_params' : { "doc_id" : attachment_id },
                    'aw_srv_protocol_cookie' : {
                                                  "attachment_id" : attachment_id,
                                                  "stream_id"     : stream_id                                                
                                             }
               };
    aw_api_srv_make_a_post_request('AW_SRV_PPM_STM_DELETE_VIDEO_ATTACHMENT',  params);

}

/************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_delete_video(params){
  var stream_id = params['aw_srv_protocol_cookie']['stream_id'];
  var attachment_id = params['aw_srv_protocol_cookie']['attachment_id'];
  var video_box_id  = aw_api_stm_get_attachment_box_id(aw_api_ppm_get_stm_contex_for_key(stream_id), attachment_id);
  $("#" + video_box_id).remove();

}
/************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_delete_image(params){
  var stream_id = params['aw_srv_protocol_cookie']['stream_id'];
  var attachment_id = params['aw_srv_protocol_cookie']['attachment_id'];
  var image_box_id = aw_api_stm_get_attachment_box_id(aw_api_ppm_get_stm_contex_for_key(stream_id), attachment_id);
  $("#" + image_box_id).remove();
}


