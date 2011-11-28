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
  var image_html='',video_html='',text_html='';
  var caption = '';
  
  if(fb_data_json['caption']){
    caption = fb_data_json['caption'];
  }

  var aw_images_container_id = aw_api_get_stream_id(stream_info) + '_fb_img'; 
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
