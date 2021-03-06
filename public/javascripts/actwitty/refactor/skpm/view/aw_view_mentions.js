/**********************************************************/
/*
 *
 *
 */
function aw_view_mentions_get_html_ver2(data){

  var max_to_show_in_one_interest = 7;
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
                                    mention_data.interest_name.toUpperCase() + ' - have ' + mention_data.total_mentions + ' mentions ' +
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
           
          var mention_layout_filter_id = 'aw_stream_layout_mention_id_' + mention_data.name.replace(/ /g, ''); 
          
          one_interest_html = one_interest_html +
                              '<div class="aw_sketch_mention_box aw_js_filterer ' + display_class + '" ' +
                                  'aw_filter_on="mention" ' +
                                  'aw_mention_filter="' + mention_data.id + '" ' +
                                  'aw_filter_title="topic=' + mention_data.name  + '" ' +
                                  'id="' + mention_layout_filter_id +'"'+
                                '>' +
                                '<span>' +
                                  mention_data.name + 
                                '</span>' +
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
function aw_view_mentions_get_html(data){

  var main_html = "";
  var one_interest_html = "";
  var running_interest_count = 0;

  $.each(data, function(index, mention_data){
    if( mention_data.process == "done" && mention_data.image){

        if(  mention_data.name && mention_data.image ){
           
          var mention_layout_filter_id = 'aw_stream_layout_mention_id_' + mention_data.name.replace(/ /g, ''); 
          
          main_html = main_html +
                              '<div class="aw_sketch_mention_box aw_js_filterer " ' +
                                  'aw_filter_on="mention" ' +
                                  'aw_mention_filter="' + mention_data.id + '" ' +
                                  'aw_filter_title="topic=' + mention_data.name  + '" ' +
                                  'id="' + mention_layout_filter_id +'"'+
                                '>' +
                            '</div>';
        }
      }


  });

  return main_html;
 

}



/**********************************************************/
/*
 *
 *
 */
function aw_api_view_mentions_render(data){
  var html = aw_view_mentions_get_html(data);
  if( html.length ){
    $("#aw_js_mentions_list_box").append(html);

  }

  if (aw_js_active_mention_stream != "")
      setup_mention_layout_view(aw_js_active_mention_stream); 
  
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
    $.getJSON(desc_url + '?format=plain&maxlength=150&key=' + aw_global_freebase_api_key  +  '&callback=?', function(data) {
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



