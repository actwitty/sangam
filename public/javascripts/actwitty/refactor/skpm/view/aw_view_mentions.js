/**********************************************************/
/*
 *
 *
 */
function aw_view_mentions_get_html(data){

  var max_to_show_in_one_interest = 4;
  var max_interests_to_show = 3;

  var last_interest_name = "";
  var count_in_this_interest = 0;

  var show_more = false;

  var display_class = "aw_js_mentions_box_show_always";
  var tab_class = "aw_js_mentions_box_show_always";


  var main_html = "";
  var one_interest_html = "";
  var running_interest_count = 0;

  $.each(data, function(index, mention_data){
    if( mention_data.process == "done" && mention_data.image){

      if( last_interest_name.length == 0 ||
          last_interest_name != mention_data.interest_name ){

          display_class = "aw_js_mentions_box_show_always";
          count_in_this_interest = 0;
       
          /* close the column */
          if(one_interest_html.length){
            one_interest_html = one_interest_html + '</div></div>' ;
          }

          /* handle end of the tab */
          if(running_interest_count >= max_interests_to_show){                       
            tab_class = 'aw_js_mentions_tab_hide_on_less';
            show_more = true;
          }
          
          /* park a tab */
          main_html = main_html + one_interest_html;
          
          /* start a new tab */
          one_interest_html = '<div id="aw_js_mentions_view_tab" ' + 'class="aw_sketch_mentions_segment ' + tab_class + '">' +
                                '<div class="aw_sketch_one_interest_header">' +
                                  '<span>' +
                                    mention_data.interest_name.toUpperCase() +
                                  '</span>' +
                                '</div>' +
                              '<div class="aw_sketch_one_interest_mention" >';
          running_interest_count++;
          last_interest_name = mention_data.interest_name;
        }


        if(  mention_data.name && mention_data.image ){

          count_in_this_interest++;
          if( count_in_this_interest >= max_to_show_in_one_interest){
            display_class = "aw_js_mentions_box_hide_on_less";
            show_more = true;
          }

          one_interest_html = one_interest_html +
                              '<div class="aw_sketch_mention_box ' + display_class + '" >' +
                                '<div class="aw_sketch_mention_img_box" >' +
                                  '<img ' + 
                                    'class="aw_js_mention_image_class" ' +
                                    ' src="' + mention_data.image + "?maxwidth=200" + '"' +                                                                  ' desc_url="' + mention_data.description + '" ' +
                                    ' name="' + mention_data.name + '" rel="aw_js_twipsy_mention_image" data-original-title="' + mention_data.name.toUpperCase() + ' " ' +
                                    ' />' +
                              '</div>' +
                            '</div>';
        }
      }


  });


 if( show_more ){
   main_html = main_html  +
                '<div class="aw_show_more_mentions_box aw_js_show_more_mentions"  state="show"  >' +
                  'Show more mentions made' +
                '</div>';
 }
  return main_html;
 

}

/**********************************************************/
/*
 *
 *
 */
function aw_api_view_mentions_render(data){
  $("#aw_js_mentions_list_box").html(aw_view_mentions_get_html(data));
  $("img[rel=aw_js_twipsy_mention_image]").twipsy({  live: true, placement: "below" }); 
  $("#aw_js_mentions_busy").hide();
  /* fetch descriptions */ 
  $(".aw_js_mention_image_class").each( function(index){
    $(this).aw_api_js_get_description_fn();
  });


  
}

/*******************************************************/
/*
 *
 *
 */
jQuery.fn.aw_api_js_get_description_fn = function() {
  var element = $(this[0]);
  var name = element.attr("name");
  var desc_url = $(this).attr("desc_url");
  if( desc_url.length ){
    $.getJSON(desc_url + "?format=plain&maxlength=150&callback=?", function(data) {
    })
    .success(function(data){
      if( data && data.result){
        var twipsy = element.attr("data-original-title");
        twipsy = twipsy + '  :  ' + data.result;
        
        element.attr("data-original-title", twipsy);
        $("img[rel=aw_js_twipsy_mention_image]").twipsy({  live: true, placement: "below" }); 

      }
    });
  }
   

     
};
/****************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_mentions(object){
   if( object.attr('state') == "show") {
    
    $(".aw_js_mentions_tab_hide_on_less").removeClass("aw_js_mentions_tab_hide_on_less").addClass("aw_js_mentions_tab_show_on_more");
    $(".aw_js_mentions_box_hide_on_less").removeClass("aw_js_mentions_box_hide_on_less").addClass("aw_js_mentions_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less mentions made' );
  }else{

    $(".aw_js_mentions_tab_show_on_more").removeClass("aw_js_mentions_tab_show_on_more").addClass("aw_js_mentions_tab_hide_on_less");
    $(".aw_js_mentions_box_show_on_more").removeClass("aw_js_mentions_box_show_on_more").addClass("aw_js_mentions_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html( 'Show more mentions made');
  }

}



