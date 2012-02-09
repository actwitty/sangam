/********************************************************/
/*
 *
 *
 */
var aw_local_map_color_code = {
                        video: { color: "aw_grid_box_color_gray5", show: "/images/actwitty/refactor/aw_sketch/topics/internals/video.png", twipsy: "aw_js_interest_video"},
                        image: { color: "aw_grid_box_color_gray5", show: "/images/actwitty/refactor/aw_sketch/topics/internals/image.png", twipsy: "aw_js_interest_image" },
                        location: { color: "aw_grid_box_color_gray5", show: "/images/actwitty/refactor/aw_sketch/topics/internals/location.png", twipsy: "aw_js_interest_location" },
                        post: { color: "aw_grid_box_color_gray5", show: "/images/actwitty/refactor/aw_sketch/topics/internals/post.png", twipsy: "aw_js_interest_post" },
                        mention: { color: "aw_grid_box_color_gray5", show: "/images/actwitty/refactor/aw_sketch/topics/internals/mention.png", twipsy: "aw_js_interest_mention" },
                        link: { color: "aw_grid_box_color_gray5", show: "/images/actwitty/refactor/aw_sketch/topics/internals/link.png", twipsy: "aw_js_interest_link" }
                     };
var aw_local_map_box_classes = [
                                  "aw_sketch_dyn_topic_grid_box_top_left",
                                  "aw_sketch_dyn_topic_grid_box_top_right",
                                  "aw_sketch_dyn_topic_grid_box_bottom_left",
                                  "aw_sketch_dyn_topic_grid_box_bottom_right"
                                ];
/***********************************************************/
/*
 * Show in a priority list from 1 to 6 (top 4 non zero to be shown)
 *
 */
var aw_local_show_priority_list = {
                            video: 1,
                            image: 2,
                            link: 3,
                            location: 4,
                            mention: 5,
                            post: 6
                          };

function aw_get_values_to_show(topic_detail){
   var details_json = {};
   var push_to_complete = {};
   added_count = 0;
   $.each(aw_local_show_priority_list, function(key, priority) {
      if(topic_detail[key] != null
          && topic_detail[key] > 0 
            && added_count < 4){
        details_json[key] = topic_detail[key];
        added_count++;
      }else{
        push_to_complete[key] = 0;
      }
  });

  if( added_count < 4 ){
     $.each(push_to_complete, function(key, priority) {
        if( added_count < 4 ){
          details_json[key] = topic_detail[key];
          added_count++;
        }
     });
  }
  return details_json;
}

/*********************************************************/
/*
 *
 *
 */
function aw_get_service_distribution_html(topic_detail){
  //TODO: this is the dimension sensitive part based on css
  var remaining = 100;
  var min_share = 30;
  var total_services = topic_detail.services.length;
  var total_remaining = 100 - (total_services * min_share);
  var html = '<div class="aw_sketch_dyn_topic_service_distro" >';
  var count = 0;
  $.each( topic_detail.services, function( key, service){
    
    count++;
    var service_class = "aw_sketch_dyn_topic_service_" + service.name;
    var share = (total_remaining * service.share / 100) + min_share;
    if ( count == total_services){
      share = min_share + total_remaining;
    }
    total_remaining = total_remaining + min_share - share;
    html = html + '<div class="' + service_class + ' aw_js_filterer" style="width:' + share + '%"  interest_id="' + topic_detail.interest_id + '" filter_on="service,topic" service="' + service.name + '" >' +
                    '<img src="/images/actwitty/refactor/aw_sketch/topic_share/' + service.name + '_share.png"  height=22px >' +
                  '</div>';
  });
  html = html +  '</div>';
  return html;
}

/*********************************************************/
/*
 *
 *
 */
function aw_api_view_interest_render(data){
  var html = "";
  var single_box_html = "";
  var shown_count = 0;
  var max_show = 8;
  $.each(data, function(index, topic_detail) { 
    var internal_details_html = "";
    var position_count = 0;

    var to_show_json = aw_get_values_to_show(topic_detail);
    $.each( to_show_json, function( key, show_detail){

      var box_class = aw_local_map_box_classes[position_count];
      var box_color_class = aw_local_map_color_code[ key ].color;
      var box_click_handle_class = "aw_js_topic_click_" + key;
      var box_img = aw_local_map_color_code[ key ].show;
      var box_twipsy = aw_local_map_color_code[key].twipsy;
      internal_details_html = internal_details_html + 
                              '<div class="' + box_class + ' ' + box_color_class + ' ' + box_click_handle_class + ' ' + box_twipsy + ' aw_js_filterer" interest_id="' + topic_detail.interest_id + '" filter_on="' + key + ',topic" ' +  key + '="all" >' +
                                  '<img class="aw_sketch_dyn_topic_grid_img" src="' + box_img + '"  width="20px" height="20px"/>' +
                                  '<span class="aw_sketch_dyn_topic_grid_number">' + show_detail + '</span>' +
                              '</div>';
      
      position_count++;

         
    });
 
    var display_class="aw_js_topics_box_show_always";
    if( shown_count >= max_show){
      var display_class="aw_js_topics_box_hide_on_less";
    }
    
    single_box_html = '<div class="aw_sketch_dyn_topics_box  ' + display_class + ' " filter_on="topic" interest_id="' + topic_detail.interest_id + '" >' +
                        '<div class="aw_sketch_dyn_topic_title">' +
                          '<span class="aw_js_filterer" filter_on="topic"   interest_id="' + topic_detail.interest_id + '" >' + topic_detail.name + '</span>' +
                        '</div>' +
                         internal_details_html  +

                         '<img class="aw_sketch_dyn_topic_logo_small" src="/images/actwitty/refactor/aw_sketch/topics/' + topic_detail.category + '.png" width="40px" height="40px" />' +
                         '<img class="aw_sketch_dyn_topic_logo_large aw_js_filterer" src="/images/actwitty/refactor/aw_sketch/topics/' + topic_detail.category + '.png" width="60px" height="60px" filter_on="topic" interest_id="' + topic_detail.interest_id + '"/>' +


                         aw_get_service_distribution_html(topic_detail) +
                      '</div>';
    html = html + single_box_html;

    shown_count++;
  });
  
  var residue = shown_count - max_show;
   var more_html = "";
   if( residue > 0){
    more_html = '<div class="aw_show_more_topics_box aw_js_show_more_topics"  state="show" total="' + residue + '" >' +
                  'Show ' + residue + ' more interest topics' +
                '</div>';
   }
  
   html = html + more_html;
   $("#aw_js_topics_list_box").html(html);
  
  /* $(".aw_js_interest_video").twipsy({
                                        placement: 'right',
                                        delay: 0,
                                        title: "hello"

                                     }).twipsy('show');*/

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
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_decode_filter(object){
  var fitler_set = object.attr("filter_on").split(',');
  var filter = {
                  user_id : aw_js_global_visited_user_credentials.id
               };
  $.each( filter_set, function( index, filter){
    if( filter == 'topic'){
      filter['summary_id'] =  object.attr("interest_id");
    }
    
    if( filter == 'service'){
      filter['summary_id'] =  object.attr("service");
    }

    if( filter == 'mention'){
      filter['entity'] =  { 
                              'all' : true
                          };

    }

    if( filter == 'image'){
       filter['document'] =  { 
                                  'all' : true,
                                  'type' : 'image'
                              };
    }

    if( filter == 'video'){
      filter['document'] =  { 
                                  'all' : true,
                                  'type' : 'video'
                              };
    }

    if( filter == 'link'){
       filter['document'] =  { 
                                  'all' : true,
                                  'type' : 'link'
                              };
    }

    if( filter == 'location'){
      filter['location'] = {
                            'all' : true
                            };
    }

  });

  aw


}

  
