
/*******************************************************/
/*
 *
 *
 */
$(document).ready(function(){


  $(".aw_js_show_more_contacts").live('click', function(){
    aw_api_view_show_or_hide_all_active_contacts($(this));
    return false;
  });

  $(".aw_js_show_more_topics").live('click', function(){
    aw_api_view_show_or_hide_all_interest_topics($(this));
    return false;
  });

  $(".aw_js_active_friend_contact_click").live('click', function(){
    var key = aw_api_view_get_key_to_fetch_active_contact_data($(this));
    var data = aw_api_model_get_active_contact_stream(key);
    if( data != null){
      aw_api_view_stream_render(data); 
    }
    return false;
  });

  $(".aw_js_filterer").live('click', function(){
    aw_api_view_decode_filter($(this));
    return false;
  });

});
