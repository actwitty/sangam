
                
/***************************************************************/
/*
 *
 *
 */
var aw_js_service_color_codes = {
                                   facebook: "aw_service_color_facebook",
                                   twitter: "aw_service_color_twitter"
                                };


/***************************************************************/
/*
 *
 *
 */
function aw_view_get_all_details_for_interest_html(interest_name, data){
  var html = '';
  
  $.each(data.services, function(service_name, service_data) {
      $.each(service_data, function(field_name, field_data) {
        var twipsy = 'Click to see all posts from ' + service_name + ' with ' + field_name + ' under ' + interest_name + '.';
        html = html + '<div class="aw_service_popularity_details_box aw_js_filterer " ' + 
                        ' aw_filter_on="topic,action" ' +
                        ' aw_interest_filter="' + data.id + '" ' +                       
                        ' aw_action_filter="' + field_name + '" ' +  
                        ' aw_filter_title="topic=' + interest_name  + ',service=' + service_name + ',response=with ' + field_name + '"' +
                        ' rel="aw_js_twipsy_popularity" data-original-title="' +  twipsy + ' "' +
                        ' >' +
                        '<span class="aw_service_popularity_number">' +
                            field_data +
                        '</span>'+
                        '<img class="aw_service_popularity_field"' + 
                              'src="/images/actwitty/refactor/aw_sketch/service_popularity/' + service_name + '_' + field_name + '.png">' +
                       
                      '</div>';
      });

    });
  
  return html;

}
/***************************************************************/
/*
 *
 *
 */
var show_more_popularity = false; /*TODO: fix this without global*/
function aw_view_get_topic_popularity_html(index, data){
   var html = "";
   var max_to_show = 3;
   var display_class = "aw_js_popularity_box_show_always";
   if( index >= max_to_show){
     display_class = "aw_js_popularity_box_hide_on_less";
     show_more_popularity = true;
   }
   html = html + '<div class ="aw_service_popularity_segment ' + display_class + '" >' +
                     '<div class="aw_service_popularity_interest_header" >' +
                      '<span>' +
                        data.name + 
                     '</div>' +
                     '<div class="aw_service_popularity_interest_details" >' +
                        aw_view_get_all_details_for_interest_html(data.name, data) +
                     '</div>' +
                '</div>';
   return html;  
}
/***************************************************************/
/*
 *
 *
 */
function aw_api_view_service_popularity_render(data){
  var html= "";
  $.each(data, function(index, interest_data) {
     html = html + aw_view_get_topic_popularity_html(index, interest_data);
;
  });
  if( show_more_popularity){
    html =  html + '<div class="aw_show_more_popularity_box aw_js_show_more_popularity"  state="show"  >' +
                  'Show all interest popularities.' +
                '</div>';  
  }
  if( html.length ){
    $("#aw_js_service_popularity_box").html(html);
    $("div[rel=aw_js_twipsy_popularity]").twipsy({  live: true, placement: "below" }); 
    $("#aw_js_popularity_busy").hide();
    $("#aw_js_popularity_main_container").show();
    $("#aw_js_popularity_nav").show();
  }
}

/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_popularity(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_popularity_box_hide_on_less").removeClass("aw_js_popularity_box_hide_on_less").addClass("aw_js_popularity_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_popularity_box_show_on_more").removeClass("aw_js_popularity_box_show_on_more").addClass("aw_js_popularity_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html(  'Show all interest popularities.' );
  }

}
