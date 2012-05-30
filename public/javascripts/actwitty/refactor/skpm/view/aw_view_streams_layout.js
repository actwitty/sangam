/****************************************************************************

 ###########################################################################

                              NEW STREAMS LAYOUT

 ###########################################################################

****************************************************************************/


var aw_stream_view_filler_image_base_path = "/images/actwitty/refactor/aw_sketch/stream_layout_view/fillers/"

var stream_layout_structure ={};




function aw_streams_layout_view_html_init_post_layout(type)
{
  var html = "";
  switch (type) {
  case 'videos':
                 html = '<div class="aw_streams_layout_sectional_view_header">'+
                          'Videos' +
                        '</div>';
                 break;
  case 'images':
                 html = '<div class="aw_streams_layout_sectional_view_header">'+
                          'Images' +
                        '</div>';
                 break;

  case 'posts':
                 html = '<div class="aw_streams_layout_sectional_view_header">'+
                          'Posts' +
                        '</div>';
                 break;
  case 'mentions':
                 html = '<div class="aw_streams_layout_sectional_view_header">'+
                          'Topical Mentions' +
                        '</div>';
                 break;
  case 'small_posts':
                 html = '<div class="aw_streams_layout_sectional_view_header">'+
                          'Feeds ' +
                        '</div>';
                 break;
  }
  return html;
}


/*
 *
 * The api to filter the category for stream content.
 * This is just a plain categorization of post based on if content has
 * link, video, big_post, short_post.
 * Intent is to just get a heuristic for isotope layout
 *
 */
function aw_api_view_stream_layout_get_content_category(content)
{
  var category = "has_short_post";
  if (content.attachment) {
    $.each(content.attachment, function(key, attachment){
      if (attachment.type == 'link') {
         if (attachment.image_url) {
           category = "has_image";
         }
         if (attachment.description) {
           if(attachment.image_url)
              category =  (attachment.description.replace(/<.*>/,'').length > 50) ? "has_long_post" : "has_short_post";
           else
              category =  (attachment.description.replace(/<.*>/,'').length > 100) ? "has_long_post" : "has_short_post";
           return category;
         }
         if (attachment.provider) {
           if(attachment.image_url)
              category =  (attachment.provider.replace(/<.*>/,'').length > 50) ? "has_long_post" : "has_short_post";
           else
              category =  (attachment.provider.replace(/<.*>/,'').length > 100) ? "has_long_post" : "has_short_post";
           return category;
         } 
      } else if (attachment.type == 'embed')
          category = "has_video";
    });
  } else
    category = "has_short_post";

  if ((content.text && (content.text.replace(/<.*>/,'').length > 100))) 
    category = "has_long_post" ;

  return category;

}

/*
 *
 *
 */
function aw_api_view_streams_layout_prepare_content_type_meta(data, content_count_meta_data)
{
   $.each(data, function(key, entry){
    
    /*if (  entry.service.pid && entry.service.pid == "aw_service_error" ){ 
      if( aw_error_rendered[entry.service.name] ){
        return;
      }else{
        aw_error_rendered[entry.service.name] = true;
      }
    }*/

    content_type = aw_api_view_stream_layout_get_content_category(entry); 
    switch(content_type) {
    case 'has_video': 
                     content_count_meta_data.videos++;
                     break;
    case 'has_images':
                     content_count_meta_data.images++;
                     break;
    case 'has_long_post':
                     content_count_meta_data.long_posts++;
                     break;
    case 'has_short_post':
                     content_count_meta_data.short_posts++;
                     break;
    }
  });
}


/*
 *
 *
 */
function aw_api_stream_layout_prepare_isotope_class(category)
{
  switch (category) {
  case 'has_image':
                   return 'article_width_image';
  case 'has_video':
                   return 'article_width_video';
  case 'has_short_post':
                   return 'article_width_short_post';
  case 'has_long_post':
                   return 'article_width_long_post';
  }
  return 'article_width_short_post';
}


/*
 * THIS IS GOING TO BE HEAVILY HACKY AS ALL EXPERIMENTAL CONDITIONS ARE LIKELY TO GO HERE
 *
 */
function aw_api_view_stream_layout_apply_styleclass_entries(data, content_count_meta_data, content_display_index)
{
  var posts_entries_block = $("#aw_streams_layout_entries");
  var videos_entries_block = $("#aw_streams_layout_video_entries");
  var images_entries_block = $("#aw_streams_layout_image_entries");
  var small_posts_entries_block = $("#aw_streams_layout_small_posts_entries");
  var fitCol_posts_entries_block = $("#aw_streams_layout_posts_entries_fitCol");

  

  if (content_count_meta_data.videos == 0 && content_count_meta_data.images == 0 ){ 
     posts_entries_block.removeClass("aw_streams_layout_entries_full_width");
     posts_entries_block.addClass("aw_streams_layout_entries_large_width");    
     videos_entries_block.addClass("aw_streams_layout_entries_full_width");     
     images_entries_block.addClass("aw_streams_layout_entries_full_width");
     small_posts_entries_block.addClass("aw_streams_layout_entries_small_width");
     fitCol_posts_entries_block.addClass("aw_streams_layout_entries_full_width");
  }
  else {
     posts_entries_block.removeClass("aw_streams_layout_entries_full_width");
     posts_entries_block.addClass("aw_streams_layout_entries_large_width");    
     videos_entries_block.addClass("aw_streams_layout_entries_full_width");     
     images_entries_block.addClass("aw_streams_layout_entries_full_width"); 
     small_posts_entries_block.addClass("aw_streams_layout_entries_small_width");
     fitCol_posts_entries_block.addClass("aw_streams_layout_entries_full_width");
  }

  if (content_count_meta_data.posts < 4 ) {
     if ( content_count_meta_data.videos < 2 ) {
       // Deciding 
     } else {
       videos_entries_block.removeClass("aw_streams_layout_entries_small_width");
       images_entries_block.removeClass("aw_streams_layout_entries_small_width"); 
       videos_entries_block.addClass("aw_streams_layout_entries_full_width");     
       images_entries_block.addClass("aw_streams_layout_entries_full_width");     
       fitCol_posts_entries_block.addClass("aw_streams_layout_entries_full_width");
     }
  }

  if ( content_display_index.to_show.long_posts <= 0) {
    small_posts_entries_block.removeClass("aw_streams_layout_entries_small_width");
    small_posts_entries_block.addClass("aw_streams_layout_entries_large_width");
    small_posts_entries_block.find('.article_width_wit_post').each(function()
    {
      $(this).removeClass('article_width_wit_post');
      $(this).addClass('article_width_long_post');
    });
  }




}










/***********************************************************/
/*
 *
 *
 */
function aw_view_stream_get_attachments_for_longpost_html(entry){
  var html = "";
  
  if ( entry.attachment ){
    var attachment_arr = entry.attachment;
    $.each(entry.attachment, function(key, attachment){
      if( attachment.type == 'link') {
        var title_html = "";
        var content_html = "";
        var caption_html = "";
        var image_html = "";
        if ( attachment.image_url ){
             image_html = '<div class="aw_attachment_image_box_longpost" >' +
                            '<a rel="aw_js_stream_imgs_fancy_box" href="' + attachment.image_url + '">' +
                             '<img class="aw_attachment_image " src="' + attachment.image_url + ' " style="max-width:300px;" />' +
                            '</a>' +
                          '</div>';
        } 
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title_box_longpost" >' +
                            '<a href="' + attachment.url + '" target="_blank" >' +
                              attachment.title +    
                            '</a>' +
                       '</div>';
        }
        if( !attachment.description){
          attachment.description = entry.text;
        }

        if( attachment.description){
         var short_text = attachment.description;
         if( short_text.length > 300 ){
          short_text = attachment.description  
                        .trim()
                        .substring(0, 300)
                        .split(" ")
                        .slice(0, -1)
                        .join(" ") + "...";
          } 
          if( attachment.provider ){
            var short_provider_text = attachment.provider;
            if (short_provider_text.length > 300) {
                short_provider_text =  attachment.provider
                                       .trim()
                                       .substring(0, 300)
                                       .split(" ")
                                       .slice(0, -1)
                                       .join(" ") + "...";
            }
            caption_html =  '<span class="aw_attachment_caption_longpost" >' +
                                short_provider_text +
                             '</span> -  ' ;
          }
          
          content_html = content_html + '<div class="aw_attachment_content_box_longpost" >' +
                                          '<p class="aw_attachment_paragraph" >' +
                                              caption_html +
                                               short_text +
                                          '</p>' +
                                        '</div>';
        }

        

        html = html + image_html +
                      title_html +
                      content_html;
      }else if( attachment.type == 'embed'){
        var title_html = "";
        var embed_html = "";
        var content_html = "";

       
        if( attachment.title ){
          title_html = '<div class="aw_attachment_title_box_longpost" >' +
                          '<a href="' + attachment.url + '" target="_blank" >' +
                            attachment.title +    
                          '</a>' +
                       '</div>';
        }

        if( attachment.embed){
          var embed_iframe = aw_view_api_check_and_get_video_iframe_html(attachment.embed,300,225);
          if(embed_iframe.length){
            embed_html = '<div class="aw_attachment_embed" >' + 
                          embed_iframe +
                       '</div>';
          }
        }


        if( attachment.description){
          if( attachment.provider ){
            caption_html =  '<span class="aw_attachment_caption" >' +
                                attachment.provider +
                             '</span>';
          }
          
          content_html = content_html + '<div class="aw_attachment_content_box" >' +
                                          '<p class="aw_attachment_paragraph" >' +
                                              caption_html +
                                               '  -  ' + attachment.description +
                                          '</p>' +
                                        '</div>';
        }

        html = html +    embed_html + 
                         title_html +
                         content_html;

      }
    });
  }
  return html;
}





function aw_api_view_streams_layout_render_videos_section(entry)
{
  var html = "";
  if( entry.attachment ){
      $.each(entry.attachment, function(key, attachment){
          if( attachment.type == 'embed'){
            if( attachment.embed){
              var video_html = "";
              html = html + '<div class="aw_single_video_container_box aw_js_video_thumbnails " video_url="' + attachment.embed + '">' +
                                video_html +
                              '</div>';
            }
          }
      });
  }
  return html;
}



/*
 *
 *
 */
function aw_view_stream_layout_get_entry_html(entry, force_class){
  
  var text_html = "";
  var hover_html = "";
  //var randomNum = Math.ceil(Math.random()*3); /* Pick random number between 1 and 2 */

  var content_type = aw_api_view_stream_layout_get_content_category(entry);
  var aw_isotope_class = aw_api_stream_layout_prepare_isotope_class(content_type); 

  if (aw_isotope_class == 'article_width_long_post')
    var attachment_html = aw_view_stream_get_attachments_for_longpost_html(entry);
  else
    var attachment_html = aw_view_stream_get_attachments_for_longpost_html(entry);

  if (force_class)
    aw_isotope_class = force_class;

  if(!attachment_html.length){
    text_html = aw_view_stream_get_text_html(entry);
  }else{
   hover_html = aw_api_view_stream_generate_hover_info(entry);
  }

  

  var html = '<div class="  masonry_item '+aw_isotope_class+'" >' +

                '<div class="aw_stream_time_orig" >' +
                    '<abbr class="aw_js_timeago" title="' + entry.timestamp + '"></abbr>' +
                '</div>' +

                '<div class="aw_stream_content" >' +
                  attachment_html +
                  text_html +
                  aw_view_stream_get_mentions_html(entry) +
                  aw_view_stream_get_location_html(entry) +
                '</div>' +

                aw_view_stream_get_actions_html(entry) +


                '<div class="aw_originator_box aw_js_stream_hover_originator" >' +
                  '<a href="' + entry.originator.url + '" target="_blank">' +
                    '<img src="' +  entry.originator.image  + '" width=16px height=16px />' +
                  '</a>' +
                  aw_view_stream_get_display_name(entry) +
                  '<img class="aw_stream_src_img" src="' + social_media_sources[entry.service.name] + '" width=16px height=16px />' +
                  hover_html +                
                '</div>' +
             '</div>';
  return html;
}



/*
 *
 *
 */
function aw_api_streams_layout_build_images_section(content)
{
  var html = "";
  if (content.attachment) {
    $.each(content.attachment, function(key, attachment){
       if (attachment.image_url) {
           html = html + '<img src="' + attachment.image_url + '">';
    
         }
    });
  }
  return html;
}


/*
 *
 *
 */
function aw_api_streams_layout_build_global_images_section(content, content_display_index)
{
  if (content.attachment) {
    $.each(content.attachment, function(key, attachment){
       if (attachment.image_url && content_display_index.global_images.count < 4) {
           content_display_index.global_images.html = content_display_index.global_images.html + 
                                                      '<a rel="aw_streams_layout_fallback_filler_img_fancybox" href=' + attachment.image_url + '>'+
                                                      '<img class="aw_streams_layout_filler_img" src="' + attachment.image_url + '">'+
                                                      '</a>';
           content_display_index.global_images.count = content_display_index.global_images.count + 1;
         }
    });
  }
}





/*
 *
 *  Part of experiment
 */
function aw_api_view_streams_layout_prepare_display_index_table(data, content_types_count, content_display_index )
{
  var isFitColMode = false;

  content_display_index.to_show.videos = content_types_count.videos;
  content_display_index.to_show.images = content_types_count.images;
  content_display_index.to_show.long_posts = content_types_count.long_posts;
  content_display_index.to_show.short_posts = content_types_count.short_posts;
  

  var long_short_dist = Math.abs(content_types_count.long_posts - content_types_count.short_posts);
  
  var valid_posts_count = (content_types_count.long_posts != 0 && content_types_count.short_posts != 0); 


  if ( valid_posts_count &&  (long_short_dist > 2 ) && (content_types_count.long_posts < content_types_count.short_posts)){
    content_display_index.to_show.short_posts = content_types_count.long_posts + 2 ;
    isFitColMode = true;
  } else if ( valid_posts_count &&   (long_short_dist > 2) && (content_types_count.long_posts > content_types_count.short_posts)) {
    content_display_index.to_show.long_posts = content_types_count.short_posts - 2 ;  
    isFitColMode = true;
  }


  if(isFitColMode) {
    content_display_index.to_show.filCol_posts = (content_types_count.long_posts + content_types_count.short_posts) -
                                                 (content_display_index.to_show.long_posts + content_display_index.to_show.short_posts);
  } else if(!valid_posts_count) {
    content_display_index.to_show.filCol_posts = long_short_dist;
    content_display_index.to_show.short_posts = 0;
    content_display_index.to_show.long_posts = 0;
  }

  
   

}



/*
 *
 *
 */
function aw_api_view_stream_layout_render(data)
{
  
  var html = aw_streams_layout_view_html_init_post_layout("posts");
  var video_html = aw_streams_layout_view_html_init_post_layout("videos");
  var images_html = aw_streams_layout_view_html_init_post_layout("images");
  var small_posts_html = aw_streams_layout_view_html_init_post_layout("small_posts");
  var fitCol_posts_html = aw_streams_layout_view_html_init_post_layout("posts");
  var fitCol_left_posts_html = "";
  var fitCol_right_posts_html = "";
  
  var str = "";
  var content_type = "";
  var index = 0;
 
  var fitCol_left = true;

  var aw_error_rendered = {};

  var content_types_count ={
                              images: 0,
                              videos: 0,
                              long_posts:0,
                              short_posts:0
                           };

  var content_display_index = {
                          shown : {
                                   images: 0,
                                   videos: 0,
                                   long_posts:0,
                                   short_posts:0,
                                   filCol_posts:0
                                  },
                          remaining : {
                                   images: 0,
                                   videos: 0,
                                   long_posts:0,
                                   short_posts:0,
                                   filCol_posts:0
                                  },
                          to_show : {
                                   images: 0,
                                   videos: 0,
                                   long_posts:0,
                                   short_posts:0,
                                   filCol_posts:0
                                  },
                          global_images :
                                  {
                                    count:0,
                                    html: ""
                                  },
                      };


  aw_api_view_streams_layout_prepare_content_type_meta(data, content_types_count);

  aw_api_view_streams_layout_prepare_display_index_table(data, content_types_count, content_display_index );

  $.each(data, function(key, entry){
    if (  entry.service.pid && entry.service.pid == "aw_service_error" ){ 
      if( aw_error_rendered[entry.service.name] ){
        return;
      }else{
        aw_error_rendered[entry.service.name] = true;
      }
    }

    
    content_type = aw_api_view_stream_layout_get_content_category(entry); 

    // Build html for video section if any.
    if (content_type == "has_video") {
      video_html = video_html + aw_api_view_streams_layout_render_videos_section(entry);
      //content_types_count.videos++;
      content_display_index.shown.videos++;
    } else if (content_type == "has_short_post" ) {
      // Build htmls for small posts section
      if (content_display_index.shown.short_posts < content_display_index.to_show.short_posts) {
        small_posts_html = small_posts_html + aw_view_stream_layout_get_entry_html(entry,"article_width_wit_post");
      }
      content_display_index.shown.short_posts++;
    } else if (content_type == "has_image") {
      if ((str = aw_api_streams_layout_build_images_section(entry)) != "" ) {
         if (content_types_count.images < 5 )
           images_html = images_html + str;
         content_types_count.images++;
      } 
    } else if (content_type == "has_long_post" ) {
      // Build html for posts section if any.
      if (content_display_index.shown.long_posts < content_display_index.to_show.long_posts)
          html= html + aw_view_stream_layout_get_entry_html(entry);
      content_display_index.shown.long_posts++;
    } 


    index++;

    aw_api_streams_layout_build_global_images_section(entry,content_display_index);
  });
  

  index  = 0;  
  var count = 0;
  $.each(data, function(key, entry){
    content_type = aw_api_view_stream_layout_get_content_category(entry);
    if (content_type == "has_long_post" || content_type == "has_short_post") {
      count = count + 1 ; 
      if (count > (content_display_index.to_show.short_posts + content_display_index.to_show.long_posts)){ 
        // Build html for fitCol section if any.
        if (content_display_index.shown.filCol_posts < content_display_index.to_show.filCol_posts) {
            index = index + 1;
            if (index%2)
              fitCol_left_posts_html = fitCol_left_posts_html + aw_view_stream_layout_get_entry_html(entry, "article_width_fitCol_post");
            else
              fitCol_right_posts_html = fitCol_right_posts_html + aw_view_stream_layout_get_entry_html(entry, "article_width_fitCol_post");
            filCol_left = !fitCol_left;
        }
        content_display_index.shown.filCol_posts++;
      }
    }  
  });







  /* new stream layout */
  if (content_display_index.to_show.long_posts > 0) {
    $("#aw_streams_layout_entries").show();
    $("#aw_streams_layout_entries").html(html);
  } else {
    $("#aw_streams_layout_entries").hide();
  }


  if (content_types_count.videos > 0) {
    $("#aw_streams_layout_video_entries").show();
    $("#aw_streams_layout_video_entries").html(video_html);
    $(".aw_js_video_thumbnails").each(function() {
                              aw_model_api_get_video_thumbnail($(this));
                           });
  } else {
    $("#aw_streams_layout_video_entries").hide();
  }

  if (content_display_index.to_show.short_posts > 0) {
    $("#aw_streams_layout_small_posts_entries").show();
    $("#aw_streams_layout_small_posts_entries").html(small_posts_html);
  } else {
    $("#aw_streams_layout_small_posts_entries").hide();
  }
 
 

  
  if(content_display_index.to_show.filCol_posts > 0) {
    $("#aw_streams_layout_posts_entries_fitCol").show();
    $("#awstreams_layout_posts_entries_fitCol_left").html(fitCol_left_posts_html);
    $("#awstreams_layout_posts_entries_fitCol_right").html(fitCol_right_posts_html);
  } else {
     $("#aw_streams_layout_posts_entries_fitCol").hide();
  }



  
  if(content_display_index.to_show.image_posts) {
    $("#aw_streams_layout_image_entries").show();
    $("#aw_streams_layout_image_entries").html(images_html);
  } else {
    $("#aw_streams_layout_image_entries").hide();
  }

  
  aw_api_view_stream_layout_apply_styleclass_entries(data,content_types_count, content_display_index);


  // Prepare mentions section in streams layout. 
  aw_api_streams_layout_prepare_mentions_section(content_display_index);
  
  $("#aw_js_stream_entries").scrollTop(0); 
  $("abbr.aw_js_timeago").timeago();
  $("#aw_js_stream_busy").hide();
  $("a[rel=aw_js_stream_imgs_fancy_box]").fancybox({
	  	'transitionIn'		: 'none',
		  'transitionOut'		: 'none',
  		'titlePosition' 	: 'over',
	  
    });
 
 aw_api_view_streams_layout_apply_final_layouting(content_display_index );
  
}



function aw_api_view_stream_layout_render_header(data)
{
   var first_level_html = "";
   var second_level_html = ""; 
   var third_level_html = "";
   var interests_count = data.length;
   var topic_index = 0;
   $.each(data, function(key, entry){
      topic_index = topic_index + 1;
      if (topic_index <= 5) {
          first_level_html = first_level_html +
                 '<div class="aw_streams_layout_header_entry_flevel aw_js_stream_layout_filterer" aw_filter_on="topic"'+
                    'aw_interest_filter="' + entry.interest_id + '" ' +
                    'aw_filter_title="topic=' + entry.name  + '" ' +
                    'id="'+entry.interest_id+'">' +
                     entry.name+
                 '</div>';
      } else if (topic_index <= (5+7)){
          second_level_html = second_level_html +
                 '<div class="aw_streams_layout_header_entry_slevel aw_js_stream_layout_filterer" aw_filter_on="topic"'+
                    'aw_interest_filter="' + entry.interest_id + '" ' +
                    'aw_filter_title="topic=' + entry.name  + '" ' +
                    'id="'+entry.interest_id+'">' +
                     entry.name+
                 '</div>';
      } else {
          third_level_html = third_level_html +
                 '<div class="aw_streams_layout_header_entry_tlevel aw_js_stream_layout_filterer" aw_filter_on="topic"'+
                    'aw_interest_filter="' + entry.interest_id + '" ' +
                    'aw_filter_title="topic=' + entry.name  + '" ' +
                    'id="'+entry.interest_id+'">' +
                     entry.name+
                 '</div>'; 
      }
   });
   
   

   $("#aw_streams_layout_header_level1").html(first_level_html);
   $("#aw_streams_layout_header_level2").html(second_level_html);
   $("#aw_streams_layout_header_level3").html(third_level_html);


   if (topic_index <= 5 )
     $("#aw_streams_layout_header_view_operator").hide();
   else 
     $("#aw_streams_layout_header_view_operator").show(); 

}



/*
 * To render the meta data information on the stream layout content header.
 */



function aw_stream_layout_prepare_meta_info_html(meta_data_type, meta_data_value)
{
  var html = '<div class="aw_streams_layout_interests_meta_info_box">'+
               '<div class="aw_streams_layout_interests_meta_info_icon">'+
                 '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/'+ meta_data_type+'.png">'+
               '</div>'+
               '<p><strong>'+
                  meta_data_value +
                  '</strong>'+
                  meta_data_type +
               '</p>'+
            '</div>';
  return html;

}


/*
 *
 */
function aw_api_view_stream_layout_render_meta_data(data)
{
  var active_stream_topic = aw_cache_api_get_data("aw.stream.topic",null);
  var html = "";
  $.each(data, function(key, entry){
    if (entry.name == active_stream_topic) {

      if(entry.post > 0)
        html = html + aw_stream_layout_prepare_meta_info_html("posts",entry.post);
      
      if(entry.image > 0)
        html = html + aw_stream_layout_prepare_meta_info_html("images",entry.image);
 
      if(entry.video > 0)
        html = html + aw_stream_layout_prepare_meta_info_html("videos",entry.video);

      if(entry.link > 0)
        html = html + aw_stream_layout_prepare_meta_info_html("links",entry.link);

      if(entry.location > 0)
        html = html + aw_stream_layout_prepare_meta_info_html("locations",entry.location);
    
      if(entry.mention > 0)
        html = html + aw_stream_layout_prepare_meta_info_html("mentions",entry.mention);
    }
  });
  if (html == "") {
    $("#aw_streams_layout_interests_meta_data").html(active_stream_topic);
    $("span.aw_streams_layout_trends_heading").timeago();
  } else {
    $("#aw_streams_layout_interests_meta_data").html(html);
  }


}



/*
 * This funtion will get triggered when we directly land in interests page using external links
 */
function aw_api_view_stream_trigger_interest_rendering(interest)
{
}




function aw_api_view_stream_prepare_header_viewer_operator()
{
  $("#aw_streams_layout_header_level2").slideToggle();
  if (aw_cache_api_get_data("aw.interests",null).length > (5+7) )
    $("#aw_streams_layout_header_level3").slideToggle();
  var span_element = $("#aw_streams_layout_header_viewer span");
  var img_element = $("#aw_streams_layout_header_viewer img");
  
  var src_view_more = '/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/view_more.png';
  var src_view_less = '/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/view_less.png';

  var text = span_element.text() == 'view more' ? 'view less' : 'view more';
  var src = img_element.attr('src').indexOf('more') >= 0 ? src_view_less : src_view_more;

  span_element.text(text);
  img_element.attr('src',src);
  
}






/***********************************************************
 *
 *   APPLYING FINAL LAYOUT AND CONSIDERING FILLERS 
 *
 ***********************************************************/

function aw_api_view_apply_fillers(content_display_index)
{
   var posts_entries_block = $("#aw_streams_layout_entries");
   var videos_entries_block = $("#aw_streams_layout_video_entries");
   var images_entries_block = $("#aw_streams_layout_image_entries");
   var small_posts_entries_block = $("#aw_streams_layout_small_posts_entries");
   var fitCol_posts_entries_block = $("#aw_streams_layout_posts_entries_fitCol");
   var mentions_entries_block = $("#aw_streams_layout_mentions_entries");


   var posts_block_height = posts_entries_block.height();
   var small_posts_block_height = small_posts_entries_block.height();
   var videos_block_height = videos_entries_block.height();
   var images_block_height = images_entries_block.height();
   var filCol_block_height = fitCol_posts_entries_block.height();
   var mentions_block_height = mentions_entries_block.height();



   if (content_display_index.to_show.long_posts > 0 &&  content_display_index.to_show.short_posts > 0)
     var block_diff = Math.abs(posts_block_height - (small_posts_block_height + mentions_block_height));

   
   if (content_display_index.global_images.count > 0) {
     var filler_image_section = '<div class="aw_streams_layout_image_filler_section">' + 
                                   aw_streams_layout_view_html_init_post_layout('images') +
                                   content_display_index.global_images.html + 
                                '</div>';
   } else {
     var filler_image_section = '<div class="aw_streams_layout_image_filler_section">' +
                                   aw_streams_layout_view_html_init_post_layout('images') +
                                   '<a rel="aw_streams_layout_fallback_filler_img_fancybox" href="' + aw_stream_view_filler_image_base_path + '">' +
                                     '<img  class="aw_streams_layout_fallback_filler_img" src='+aw_stream_view_filler_image_base_path +
                                        aw_cache_api_get_data("aw.stream.topic",null)+'.jpg'+ '>'+
                                    '</a>'+
                                '</div>';
   }
 
   

   var valid_major_block_post_count = (content_display_index.to_show.long_posts >= 1 && content_display_index.to_show.short_posts >= 1)
   /*
   alert(posts_block_height);
   alert(small_posts_block_height);
   alert(mentions_block_height);
   */
   function filler_image_insertion() {
    if (block_diff > 100  && valid_major_block_post_count ) {
       $(".aw_streams_layout_image_filler_section").remove();
      if ( posts_block_height > (small_posts_block_height + mentions_block_height)) {
           //small_posts_entries_block.find('.aw_streams_layout_sectional_view_header').after(filler_image_section);
          small_posts_entries_block.append(filler_image_section);
          $(".aw_streams_layout_image_filler_section").addClass("article_width_wit_post");
      } else {
           //posts_entries_block.find('.aw_streams_layout_sectional_view_header').after(filler_image_section);
           posts_entries_block.append(filler_image_section);
           $(".aw_streams_layout_image_filler_section").addClass("article_width_long_post");
      }
      $("a[rel=aw_streams_layout_fallback_filler_img_fancybox]").fancybox({
	  	'transitionIn'		: 'none',
		  'transitionOut'		: 'none',
  		'titlePosition' 	: 'over',
	  
    });
     }
  }
  /*$(window).load(function() {
    // Handler for .ready() called.
    filler_image_insertion();
  });
  */
  $('#aw_streams_layout_entries_box').waitForImages(function() {

    //alert('All images are loaded.');
    //$(this).slideUp();
    filler_image_insertion();
  });


}



function aw_api_view_streams_layout_apply_final_layouting(content_display_index)
{
   if (0) {
    var $container = $('#aw_streams_layout_entries');
    $container.isotope({
      layoutMode : 'masonry',
      itemSelector: '.masonry_item',
      masonry: {
        itemSelector : '.element',
        masonry : {
          columnWidth : 120
        },
        masonryHorizontal : {
          rowHeight: 120
        },
        cellsByRow : {
          columnWidth : 240,
          rowHeight : 240
        },
        cellsByColumn : {
          columnWidth : 240,
          rowHeight : 240
        }
      }
    });

  } else {
    /*
    var $tumblelog = $('#aw_streams_layout_entries');
    $tumblelog.imagesLoaded( function(){
      $tumblelog.masonry({
        columnWidth: 240,
        cornerStampSelector: '.aw_streams_layout_sidebar_entry'
      });
    });

    var $main_container = $('#aw_streams_layout_entries_box');
   
    $main_container.imagesLoaded( function(){
      $main_container.masonry({
        columnWidth: 240,
      });
    });
    */
   
  }


  aw_api_view_apply_fillers(content_display_index);
}





/***********************************************************
 *                                                         *
 *      Extra curricular sections in Streams Layout        *
 *                                                         *   
 * *********************************************************/

function aw_api_streams_layout_render_mentions_section(data)
{
  var $streams_layout_mention_section = $("#aw_streams_layout_mentions_entries");
  var html = ""; 
  var decoded_mentions = {};
  var last_interest_name = "";
  var index = 0
  var currently_set_interest = aw_cache_api_get_data("aw.stream.topic",null);

  if (!data.length) {
    $streams_layout_mention_section.html("");
    $streams_layout_mention_section.hide();
    return;
  }

  if(currently_set_interest == null)
    currently_set_interest == "";

  html = html + aw_streams_layout_view_html_init_post_layout("mentions");

  $.each(data, function(key, mention_data){
    
    if( mention_data.process == "done" && mention_data.image && mention_data.interest_name == currently_set_interest ){
      
      if( last_interest_name.length == 0 ||
          last_interest_name != mention_data.interest_name ){
          
          if( last_interest_name.length != 0)  
              html = html + '</div>';  

          html = html +    
                 '<div class="aw_stream_layout_mentions_entry_box masonry_item " >'+
                   '<div class="aw_stream_layout_mentions_entry_label_header" >'+
                     '<span>'+ 
                       mention_data.interest_name +
                     '</span>'+
                   '</div>';
         index = index + 1;
      } 
      html = html + 
             '<div class="aw_stream_layout_mentions_entry_name aw_js_filterer " '+
               'aw_filter_on="mention" ' +
               'aw_mention_filter="' + mention_data.id + '" ' +
               'aw_filter_title="topic=' + mention_data.name  + '" ' +
             '>'+
               mention_data.name+
             '</div>';
      last_interest_name = mention_data.interest_name;
      
    }
  });
   
   if( index == 0) 
     $streams_layout_mention_section.hide();
   else {
     $streams_layout_mention_section.show();
     $streams_layout_mention_section.html(html);
   }

  
    
    
}


function aw_api_streams_layout_prepare_mentions_section(content_display_index)
{
    //if (content_display_index.to_show.long_posts > 4 && content_display_index.to_show.short_posts > 2 ) {
    if(1) { 
      $("#aw_streams_layout_mentions_entries").show(); 
      aw_cache_api_get_data("aw.mentions",aw_api_streams_layout_render_mentions_section);
    } else {
       $("#aw_streams_layout_mentions_entries").hide(); 
    }
}
