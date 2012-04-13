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
    }
    
    if( filter_title == 'service'){
      filter['source_name'] =  object.attr("aw_service_filter");
    }

    if( filter_title == 'mention'){
      var mention_id = object.attr("aw_mention_filter");
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


}
/**************************************************
 *
 *
 *
 */
function aw_api_view_decode_filter_header(object){
  var filter_header_title =  object.attr("aw_filter_title");
  var filter_header_set = filter_header_title.split(',');
  var filter_header_set_arr = [];
  var stream_header = {};
  var header_text = "";
  
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

  header_text = "<span> Posts made  ";
  if( stream_header['topic']){
    header_text = header_text +  stream_header['topic'];
  }

  if( stream_header['data_type']){
    header_text = header_text +  stream_header['data_type'];
  }


  if( stream_header['service']){
    header_text = header_text +  stream_header['service'];
  }

  header_text = header_text + ". </span>";
  $("#aw_js_stream_internal_header").html(header_text);
}
