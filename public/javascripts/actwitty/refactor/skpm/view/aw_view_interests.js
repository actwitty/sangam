
/*********************************************************/
/*
 *
 *
 */
function aw_api_view_interest_render(data){
  var html = "";
  var single_box_html = "";
  var shown_count = 0;
  var total_count = data.length;
  var max_show = 6;
  $.each(data, function(index, topic_detail) { 
    var internal_details_html = "";
    var position_count = 0;
    var display_class="aw_js_topics_box_show_always";

    var internal_image_list = '';
    var image_path = "/images/actwitty/refactor/aw_sketch/topics/internals/";

    if ( topic_detail.video  && topic_detail.video != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.video + ' Videos" src="' + image_path + 'video.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="video,topic" video="all"  />';
    }

    if ( topic_detail.image  && topic_detail.image != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer"  rel="twipsy" data-original-title="' + topic_detail.image + ' Pictures" src="' + image_path + 'image.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="image,topic" />';
    }
   
    if ( topic_detail.link  && topic_detail.link != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.link + ' Links" src="' + image_path + 'link.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="link,topic" />';
    }

    if ( topic_detail.location  && topic_detail.location != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.location + ' Places" src="' + image_path + 'location.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="location,topic" />';
    }

    if ( topic_detail.mention  && topic_detail.mention != 0 ){
      internal_image_list = internal_image_list + '<img class="aw_sketch_dyn_topics_box_internal_img aw_js_filterer" rel="twipsy" data-original-title="' + topic_detail.mention + ' Mentions" src="' + image_path + 'mention.png" aw_interest_filter="' + topic_detail.interest_id + '" aw_filter_on="mention,topic" />';
    }

  var services_html_internal = '';
  $.each( topic_detail.services, function ( index, service){
    services_html_internal = services_html_internal + 
                       '<img class="aw_sketch_dyn_topics_box_services_img aw_js_filterer" '
                      + 'src="/images/actwitty/refactor/aw_sketch/topics/services/' + service.name + '.png" '                      +  'rel="twipsy" data-original-title="' + parseInt(service.share) + '% from ' + service.name + '" '    
                      + 'aw_interest_filter="' + topic_detail.interest_id + '" '
                      + 'aw_filter_on="service,topic" aw_service_filter="' + service.name + '" />';
  });

   var topic_twipsy = "";
   if(aw_js_categories_json[topic_detail.name] &&
          aw_js_categories_json[topic_detail.name]['name']){
    topic_twipsy = topic_detail.post + ' posts on ' + aw_js_categories_json[topic_detail.name]['name'];
  }else{
   topic_twipsy = topic_detail.post + ' posts ';    
  }
    if( shown_count >= max_show){
      display_class="aw_js_topics_box_hide_on_less";
    }
    single_box_html = '<div class="aw_sketch_dyn_topics_box ' + display_class + ' " >' +
                        '<div class="aw_sketch_dyn_topics_box_index aw_js_filterer"' + 
                        'aw_filter_on="topic"'  + 
                        'aw_interest_filter="' + topic_detail.interest_id + '" >' +
                          '<p>' + topic_detail.post  + '</p>' +
                        '</div>' +
                        '<div class="aw_sketch_dyn_topics_box_name aw_js_filterer" aw_filter_on="topic"   aw_interest_filter="' + topic_detail.interest_id + '" >' +
                          '<p rel="twipsy" data-original-title="'  + topic_twipsy + '" >' + topic_detail.name + '</p>' +
                        '</div>' +
                        '<div class="aw_sketch_dyn_topics_box_images" >' +
                          internal_image_list + 
                        '</div>' +
                        '<div class="aw_sketch_dyn_topics_box_delimiter" > </div>' +
                        '<div class="aw_sketch_dyn_topics_box_services">' +
                          services_html_internal +
                        '</div>' +
                      '</div>';
    html = html + single_box_html;
    shown_count++;
  });

  
  

  var gender_img = "/images/actwitty/refactor/aw_sketch/topics/women.svg"; 
  if( aw_js_global_visited_user_credentials.gender == "male" ){
    gender_img = "/images/actwitty/refactor/aw_sketch/topics/men.svg"; 
  }
  var base_html = '<div class="aw_sketch_interest_main_box" >' +
                    '<div class="aw_sketch_interest_background_box"  >' +
                      '<img class="aw_sketch_interest_background_img" src="' + gender_img +  '" height=100% />' +
                    '</div>' +
                    html +
                  '</div>';

   var residue = shown_count - max_show;
   var more_html = "";
   if( residue > 0){
    more_html = '<div class="aw_show_more_topics_box aw_js_show_more_topics"  state="show" total="' + residue + '" >' +
                  'Show ' + residue + ' more interest topics' +
                '</div>';
   }
  
  html = base_html + more_html;
  if( html.length ){
    $("#aw_js_topics_list_box").html(html);
    $("img[rel=twipsy]").twipsy({  live: true, placement: "below" });
    $("p[rel=twipsy]").twipsy({  live: true, placement: "below" });


    var topic_box_min_height = $(".aw_sketch_dyn_topics_box:first").css("min-height");
    topic_box_min_height = topic_box_min_height.replace("px","");
    var main_box_min_height = $(".aw_sketch_interest_main_box:first").css("min-height");
    main_box_min_height = main_box_min_height.replace("px","");
    var display_height = parseInt(topic_box_min_height) * total_count;
  
    if( display_height < main_box_min_height ){
      var min_box_height = main_box_min_height / total_count;
      $(".aw_sketch_dyn_topics_box").each(function(index) {
        $(this).height(min_box_height + 'px');
      });

    }

    $("#aw_js_topics_shared_busy").hide();
    $("#aw_js_interests_main_container").show();
  }

}
/****************************************************************/
/*
 *
 *
 */
function aw_api_view_reapply_interest_bkg(){
  var gender_img = "/images/actwitty/refactor/aw_sketch/topics/women.svg"; 
  if( aw_js_global_visited_user_credentials.gender == "male" ){
    gender_img = "/images/actwitty/refactor/aw_sketch/topics/men.svg"; 
  }
  var html = '<img class="aw_sketch_interest_background_img" src="' + gender_img +  '"  height=100% />';
  $(".aw_sketch_interest_background_box").html(html);
}
/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_interest_topics(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_topics_box_hide_on_less").removeClass("aw_js_topics_box_hide_on_less").addClass("aw_js_topics_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_topics_box_show_on_more").removeClass("aw_js_topics_box_show_on_more").addClass("aw_js_topics_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html( 'Show ' + residue + ' more interest topics');
  }

  aw_api_view_reapply_interest_bkg();
}



  
