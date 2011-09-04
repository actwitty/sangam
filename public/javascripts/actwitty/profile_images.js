/* {"word":{"id":9,"name":"image"},"time":"2011-08-17T09:50:08Z","user":{"id":1,"full_name":"sudhanshu saxena","photo":"/images/profile/default.png"},"document":{"id":9,"url":"http://farm7.static.flickr.com/6137/5951657062_690a1ff8d8.jpg","thumb_url":null,"caption":null,"source_name":"actwitty","status":2,"uploaded":false,"category":"image","activity_id":13,"summary_id":4}} */

function activate_fancybox_doc_page_group(post_group,stream){
   $('a[rel=fnc_group_docs_page_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
					var html = '<span id="fancybox-title-over">' +
                        'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                      '</span>';

          return html;
				}
	});
}

function get_or_create_a_box(box_id, stream){
  var small_box_id = 'docs_box_' + stream.document.activity_id;
  var div =  $("#" + box_id);
  var small_div = $("#" + small_box_id);
  if( small_div.length == 0 ){

  var html = '<div class="p-st-docs-per-activity" id="' + small_box_id + '">' +
                   '<div class="p-awp-stream-post-info">' +
                      '<div class="p-awp-channel">'+
                        '<div class="p-awp-channel-desc">'+
                          '<label class="p-awp-channel-label">CHANNEL : </label>'+
                          '<a href="/channel_page?channel_id=' +  stream.word.id + '">' +
                          '<span class="p-awp-channel-name">' + stream.word.name + '</span>'+
                          '</a>' +
                        '</div>'+
                      '</div>'+
                      '<div class="p-awp-stream-post-author-section">'+
                        '<a href="/home/show?id=' +  stream.user.id + '" >' +
                        '<div class="p-awp-post-author">'+
                          '<div class="p-awp-post-author-img">'+
                            '<img src="' + stream.user.photo + '" alt="" />' +
                          '</div>'+
                          '<div class="p-awp-post-author-name">'+
                            '<span>' + stream.user.full_name + '</span>'+
                          '</div>'+
                        '</div>'+
                        '</a>'+
                      '</div>'+
                     
                   '</div>'+ 
                    '<div class="p-st-docs-list-view-post">' +
                        '<a href="/view?id=' + stream.document.activity_id + '">Goto Post</a>' +
                      '</div>' +
                   '<div style="z-index:1;" class="p-awp-view-attachment p-awp-view-images">' +
                   '</div>' +
            '</div>';
    
    
    div.append(html);
    small_div = $("#" + small_box_id);
  }

  return small_div;

}


function append_stream_docs(box_id, stream){
  var small_box_id = 'docs_box_' + stream.document.activity_id;
  var div_internal = get_or_create_a_box(box_id, stream);
 
  var img_box_div = $("#" + small_box_id + " div.p-awp-view-images");

  var caption = "";
  if(stream.document.caption && stream.document.caption.length){
    caption = stream.document.caption;
  }
  var thumb_nail = stream.document.url; 
  if (stream.document.thumb_url){
    thumb_nail = stream.document.thumb_url; 
  }
   
  aw_lib_console_log ("debug", "image stream attaching thumb url:" + thumb_nail);
  
  var html= '<div class="p-awp-view-attachment-inner-box">' +
              '<a rel="fnc_group_docs_page_'+ box_id +'" href="' + stream.document.url + '" title="' + caption  + '" class="p-st-docs-image">' + 
                '<img alt="" src="'+ thumb_nail + '"  width="60"  alt="" />' +
              '</a>' +
            '</div>';

  //div_internal.append(html);
  img_box_div.append(html);

  activate_fancybox_doc_page_group(box_id, stream);
}



function create_and_append_documents( data ){
}

function show_all_images(){
   var more_cookie = $("#more_streams_images_cookie").val();
   var scroll = $(window).scrollTop();
   $.ajax({
        url: '/home/get_document_stream.json',
        type: 'GET',
        dataType:"json",
        contentType: 'application/json',
        cache: true,
        data: {
                 user_id:aw_lib_get_page_owner_id(),
                 filter:get_filter(),
                 updated_at:more_cookie,
                 page_type:aw_get_stream_scope(),
                 cache_cookie:aw_lib_get_cache_cookie_id(),
                 category:"image"
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing
          if (data.length){
             $.each(data, function(i,stream){
              if( stream ){
                  append_stream_docs("streams_images_list", stream);
                  $("#more_streams_images_cookie").val(stream.time);
              } 
            });
             $(window).scrollTop(scroll);
          }else{
            if( more_cookie.length == 0){
              $("#streams_images_list").html("<br/> <br/> No images to show for this filter");
            }
            aw_lib_alert('No images to display');
          }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            aw_lib_alert('There has been a problem getting images. \n ActWitty is trying to solve.');
        }
    });
}

/*
 * Add the live bindings
 */
$(document).ready(function(){
    /*
     * Bind click to more on streams tab
     */
     $('#more_streams_images').click(function() {
        aw_lib_console_log("debug", "more images clicked on streams page");
        show_all_images();
        return false;
    });
});




