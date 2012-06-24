/****************************************************************
 * SET SOCIAL MEDIA SHARING NOW THROUGH SCRIPTING. 
 ****************************************************************/
function aw_api_set_social_media_sharing(filter_link)
{
   filter_link = "http://" + aw_js_server_base + "/" + filter_link;

   var html = '<div class="aw_actwitty_share_on_twitter">'+
                  '<a class="twitter-share-button" data-via="act_witty" href="https://twitter.com/share?text=https%3A%2F%2Factwitty%3Acom%2Fsammy_ji%2Aenjoying">Tweet</a>'+
                  '<script>'+
           
                      '!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");'+
          
                  '</script>'+
                '</div>'+
                '<div class="aw_actwitty_share_on_facebook">'+
                  '<fb:like href="'+filter_link+'" send="false" layout="button_count" width="200" show_faces="false"></fb:like>'+
                '</div>'+
                '<div class="aw_actwitty_share_on_googleplus">'+
                  '<g:plusone annotation="inline" size="medium" width="120">'+
                    '<script>'+
         
                        '(function() {'+
                          'var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;'+
                          'po.src = "https://apis.google.com/js/plusone.js";'+
                          'var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);'+
                        '})();'+
        
                    '</script>'+
                  '</g:plusone>'+
                '</div>'+
                '<div class="aw_actwitty_share_on_linkedin">'+
                  '<script src="//platform.linkedin.com/in.js" type="text/javascript"></script>'+
                  '<script data-counter="right" type="IN/Share"></script>'+
                '</div>';

  
    $(".aw_streams_actwitty_share_on_social_media").html(html);

    FB.XFBML.parse();
    //twttr.widgets.load();
}


/*$(window).load(function(){
  FB.XFBML.parse();
  twttr.widgets.load();
});
*/










/****************************************************************/
/*
 *
 *
 */
function aw_api_view_decode_filter(object){
  var filter_titles_as_str =  object.attr("aw_filter_on");
  if ( !filter_titles_as_str || !filter_titles_as_str.length ){
    /* who wrote this code */
    return;
  }
  var filter_set_arr=[];
  var filter_set = filter_titles_as_str.split(',');

  var filter_type = "";
  var filter_value = "";
  aw_js_global_visited_user_credentials.username;


  if( $.isArray(filter_set)){
    filter_set_arr = filter_set;
  }else{
    filter_set_arr = [filter_set];
  }
  var filter = {
                  user_id : aw_js_global_visited_user_credentials.id
               };
  
  $.each( filter_set_arr, function( index, filter_title){
    if( filter_title == 'topic' ){
      filter['summary_id'] =  object.attr("aw_interest_filter");
      filter_link = aw_js_global_visited_user_credentials.username + "/streams/" + object.html();
    }
    
    if( filter_title == 'service'){
      filter['source_name'] =  object.attr("aw_service_filter");
    }

    if( filter_title == 'mention'){
      var mention_id = object.attr("aw_mention_filter");
      filter_link = aw_js_global_visited_user_credentials.username + "/mentions/" + object.html();
      if( !mention_id || !mention_id.length){
        filter['filter'] ={
                            entity: { 
                                      'all' : true
                                    }
                          };
      }else{
        filter['filter'] ={
                            entity: { 
                                      'id' : mention_id
                                    }
                          };

      }

    }


    if( filter_title == 'since' ){
      var since = object.attr("aw_since_filter");
      filter['since'] =  since;
    }


    if( filter_title == 'till' ){
      var till = object.attr("aw_till_filter");
      filter['till'] = till;
    }

    if( filter_title == 'action'){
      var aw_actions_name = object.attr("aw_action_filter");
      filter['filter'] = {};
      if( aw_actions_name && aw_actions_name.length){
        filter['filter']['source_action'] = {
                                    name : aw_actions_name 
                                  }
      }else{
         filter['filter']['source_action'] = {
                                    all : true
                                  }
      }
        
    }

    if( filter_title == 'image'){


        filter['filter'] ={
                          document: { 
                                      'type' : 'image',
                                      'all' : true
                                    }
                        };                              
    }

    if( filter_title == 'video'){
       filter['filter'] ={
                          document: { 
                                    'type' : 'video',
                                    'all' : true
                                  }
                        };                   
    }

    if( filter_title == 'link'){
        filter['filter'] ={
                          document: { 
                                      'type' : 'link',
                                      'all' : true
                                  }
                        }; 
    }

    if( filter_title == 'location'){
      filter['filter'] ={
                          location: { 
                                    'all' : 'true'
                                  }
                        }; 
    }

  });

  aw_api_controller_change_filter_on_stream(filter);

  aw_cache_api_set_data("aw.filter",filter);

  aw_api_set_social_media_sharing(filter_link);


}
/**************************************************
 *
 *
 *
 */
function aw_api_view_decode_filter_header(object){
  var filter_titles_as_str =  object.attr("aw_filter_on");
  var filter_header_title =  object.attr("aw_filter_title");
  var filter_header_set = filter_header_title.split(',');
  var filter_header_set_arr = [];
  var stream_header = {};
  var header_text = "";
 
  var filter = aw_cache_api_get_data("aw.filter",null);

  if( $.isArray(filter_header_set)){
    filter_header_set_arr = filter_header_set;
  }else{
    filter_header_set_arr = [filter_header_set];
  }

  $.each( filter_header_set_arr, function( index, filter_header_component){

    var header_title = filter_header_component.split('=');
    var section = header_title[0];
    var name = header_title[1];
    stream_header[section] = name;  

  });

  header_text = '<span class="aw_filter_subfilter"> FEEDS </span> ';
  if( stream_header['topic']){
    header_text = header_text + '<span class="aw_filter_delmiter">>></span>';
    header_text = header_text +  ' <span class="aw_filter_subfilter"> ' + stream_header['topic'] + '</span> ';
  }

  if( stream_header['data_type']){
    header_text = header_text + '<span class="aw_filter_delmiter">>></span>';
    header_text = header_text +  ' <span class="aw_filter_subfilter"> ' + stream_header['data_type'] + '</span> ';
  }


  if( stream_header['service']){
    header_text = header_text + '<span class="aw_filter_delmiter">>></span>';
    header_text = header_text +  '<span class="aw_filter_subfilter"> ' + stream_header['service'] + '</span> ';
  }

  if( stream_header['user']){
    header_text = header_text + '<span class="aw_filter_delmiter">>></span>';
    header_text = header_text +  '<span class="aw_filter_subfilter"> ' + stream_header['user'] + '</span> ';
  }

  if( stream_header['response']){
    header_text = header_text + '<span class="aw_filter_delmiter">>></span>';
    header_text = header_text +  '<span class="aw_filter_subfilter"> ' + stream_header['response'] + '</span> ';
  }

  $("#aw_js_stream_dynamic_header").html(header_text);


  if (aw_cache_api_get_data("aw.layout",null) == "streams_layout") {
      var header_text = aw_api_view_prepare_stream_layout_filter_header(stream_header, object, header_text);
      $("span.aw_streams_layout_trends_heading").timeago();
  }

  var layout_header = aw_api_view_construct_stream_layout_header(stream_header, filter_titles_as_str);

  $(".aw_streams_layout_interests_header_label").html(layout_header);
  $("#aw_streams_layout_interests_meta_data").html(header_text);
  $("span.aw_streams_layout_trends_heading").timeago();

  aw_cache_api_set_data("aw.stream.topic",stream_header['topic']);
  if (filter_titles_as_str === "topic")
      aw_cache_api_get_data("aw.interests",aw_api_view_stream_layout_render_meta_data);
  else if (filter_titles_as_str === "mention")
      aw_cache_api_get_data("aw.mentions",aw_api_view_stream_layout_render_mentions_meta_data);
   
}


/*
 *
 */
function aw_api_view_construct_stream_layout_header(stream_header, filter_titles_as_str)
{
    var header_text = "";
    var filter = aw_cache_api_get_data("aw.filter",null);

    if( stream_header['topic']){
        if (filter_titles_as_str === "mention" ) {
            //header_text = header_text +  '<span class="aw_filter_subfilter">Mention</span> ';
            //header_text = header_text + '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/breadcrumb_arrow.png">';
        } else if (filter_titles_as_str.indexOf('since') >=0 ) {
            header_text = header_text + '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/trends.png">';  
        }
        header_text = header_text +  ' <span class="aw_filter_subfilter"> ' + stream_header['topic'] + '</span> ';
        //if (filter_titles_as_str === "mention" ) 
        //    header_text = header_text +  ' <span> often mentioned in </span> ';
    }

    if( stream_header['data_type']){
        header_text = header_text + '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/breadcrumb_arrow.png">';
        header_text = header_text +  ' <span class="aw_filter_subfilter"> ' + stream_header['data_type'] + '</span> ';
    }


    if( stream_header['service']){
        header_text = header_text + '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/breadcrumb_arrow.png">';
        header_text = header_text +  '<span class="aw_filter_subfilter"> ' + stream_header['service'] + '</span> ';
    }

    if( stream_header['user']){
        header_text = header_text + '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/breadcrumb_arrow.png">';
        header_text = header_text +  '<span class="aw_filter_subfilter"> ' + stream_header['user'] + '</span> ';
    }

    if( stream_header['response']){
        header_text = header_text + '<img src="/images/actwitty/refactor/aw_sketch/stream_layout_view/icons/breadcrumb_arrow.png">';
        header_text = header_text +  '<span class="aw_filter_subfilter"> ' + stream_header['response'] + '</span> ';
    }
    return header_text;
}






/*
 *
 *
 */
function aw_api_view_prepare_stream_layout_filter_header(stream_header, object, header_text)
{
  var trend_since = object.attr("aw_since_filter");
  var trend_till = object.attr("aw_till_filter");
  var html = "";

  var stream_layout_header_label_html = '<span>' + stream_header['topic'].toUpperCase() + '</span>'; 
  $(".aw_streams_layout_interests_header_label").html(header_text); 


  if (trend_since && trend_till) {
     html = html +
             '<div class="aw_streams_layout_trends_header">'+
               '<span>......   </span>' +
               '<span class="aw_streams_layout_trends_heading" title='+ trend_since +'></span>'+
               /*'<span> to </span>' +
               '<span class="aw_streams_layout_trends_heading" title='+ trend_till +'></span>'+*/
             '</div>';
     return html;
  } else
  return stream_header['topic'];
  



}
