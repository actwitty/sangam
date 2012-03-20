/***************************************************/
function aw_get_graph_html(interests){
  var html = "";
  var lowest = 100;
  var highest = 0;
  $.each(interests, function(key, interest_detail) {
    if( lowest > interest_detail.percent){
      lowest = interest_detail.percent;
    }
    if( highest < interest_detail.percent){
      highest = interest_detail.percent;
    }
  });
  var range = highest - lowest ;
  var minimum_width = 50;
  if ( lowest == highest ) {
    var minimum_width = 100;
  }
  $.each(interests, function(key, interest_detail) {
    var graph_width = 0;
    if( range != 0 ){
      graph_width = minimum_width + ((interest_detail.percent - lowest)/range) * 150;
    }else{
      graph_width = minimum_width + interest_detail.percent;
    }
    //alert("range:" + range+ " lowest:" + lowest + " highest:" + highest + " percent:" + interest_detail.percent + " width:" + graph_width);
    var trend_twipsy = 'Click to see posts made under the topic ' + interest_detail.name;
    html = html + '<div class="aw_sketch_timeline_single_topic_box aw_js_filterer" ' + 
                        ' aw_filter_on="topic,since,till" ' +
                        ' aw_interest_filter="' + interest_detail.interest_id + '" ' +                       
                        ' aw_since_filter="' + interest_detail.since + '" ' +                        
                        ' aw_till_filter="' + interest_detail.till + '" ' +                        
                      '>' +

                      '<img rel="aw_js_twipsy_trend" data-original-title="' + trend_twipsy + '" src="/images/actwitty/refactor/aw_sketch/topics/' + interest_detail.category + '.png" width=25px height=25px >' +
                      '<div class="aw_label_box" >' +
                        '<span rel="aw_js_twipsy_trend" data-original-title="' + trend_twipsy + '" >' +
                          interest_detail.name +
                        '</span>' +
                      '</div>' +
                      '<div rel="aw_js_twipsy_trend" data-original-title="' + trend_twipsy + '" class="aw_graph_box" style="width:' + graph_width + 'px;" />' +                      
                  '</div>';
  });
  return html;
}

/**************************************************/
/*
 *
 *
 */
function aw_api_view_trends_render(data){

  var dates_html = "";
  var details_html = "";


      
  $.each(data.reverse(), function(key, snapshot) {
     var timeline_id = 'aw_js_timeline_' + key;
     dates_html = dates_html + '<li>' +
                                  '<a class="aw_sketch_timeline_links" href="#' + timeline_id + '">' +
                                    '<abbr class="aw_js_trend_timeago" title="' +  snapshot.title + '"></abbr>' +
                                  '</a>' + 
                               '</li>';
    
      details_html = details_html + '<li id="' + timeline_id + '" >' +
                                      '<div class="aw_sketch_timeline_week_snapshot_box">' +
                                        aw_get_graph_html(snapshot.interests) + 
                                        '<div class="aw_graph_axis_box">' +
                                          '<span class="left_limit"> Lowest </span>' +
                                          '<span class="right_limit"> Highest </span>' +
                                          '<span class="mid_limit"> Moderate </span>' +
                                        '</div>' +
                                      '</div>' +
                                      
                                    '</li>';
     
  });

  $("#aw_js_sketch_timeline_dates").html(dates_html);
  $("#aw_js_sketch_timeline_details").html(details_html);

  $("abbr.aw_js_trend_timeago").timeago();
  $("div[rel=aw_js_twipsy_trend]").twipsy({  live: true, placement: "below" }); 
  $("img[rel=aw_js_twipsy_trend]").twipsy({  live: true, placement: "below" }); 
  $("span[rel=aw_js_twipsy_trend]").twipsy({  live: true, placement: "below" }); 
  /* invoke timeliner */
  $().timelinr();
  $("#aw_js_trends_busy").hide();
}
