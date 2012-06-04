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

  $(".aw_js_show_more_mentions").live('click', function(){
    aw_api_view_show_or_hide_all_mentions($(this));
    return false;
  });

  $(".aw_js_show_more_popularity").live('click', function(){
    aw_api_view_show_or_hide_all_popularity($(this));
    return false;
  });

  $(".aw_js_show_more_videos").live('click', function(){
    aw_api_view_show_or_hide_all_videos($(this));
    return false;
  });

  $(".aw_js_show_more_pictures").live('click', function(){
    aw_api_view_show_or_hide_all_images($(this));
    return false;
  });

  $(".aw_js_active_friend_contact_click").live('click', function(){
    var key = aw_api_view_get_key_to_fetch_active_contact_data($(this));
    var data = aw_api_model_get_active_contact_stream(key);
    if( data != null){
      aw_api_view_stream_render(data);
      aw_api_view_decode_filter_header($(this));
      aw_api_view_show_or_hide_close(true);
    }
    return false;
  });


  /* The click event which drives filters on streams to be applied and shown in streams section*/
  $(".aw_js_filterer").live('click', function(){
    // TODO : NEW_STREAMS
    //activate_streams_deactivate_profile();
    aw_api_view_decode_filter($(this));
    aw_api_view_decode_filter_header($(this));
    return false;
  });

  /* The click event which drives filters on streams to be applied and shown in streams section*/
  $(".aw_js_stream_layout_filterer").live('click', function(){
    aw_api_view_decode_filter($(this));
    aw_api_view_decode_filter_header($(this));
    aw_api_view_highlight_current_interest($(this));
    return false;
  });


  $("#aw_js_stream_close_control").live('click', function(){
    aw_api_controller_show_or_hide_close(false);
    aw_api_controller_render_stream(aw_api_model_get_base_streams());
    aw_api_view_stream_set_default_internal_header();
    return false;
  });
 
  $(".aw_js_action_link_click").live('click', function(){
    aw_api_view_stream_apply_link_action($(this));
    return false;
  });

  $(".aw_js_stream_hover_originator").live( 'hover', function(){
    aw_api_view_handle_hover_show_overlay($(this));
    return false;
  });

  $(".aw_js_stream_info_box").live('mouseenter', function(){
                                                  aw_api_view_handle_hover_handle_overlay_hover_in($(this));
                                                  return false;
                                            }); 
  $(".aw_js_stream_info_box").live('mouseleave', function(){
                                                    aw_api_view_handle_hover_handle_overlay_hover_out($(this));
                                                    return false;
                                            });
  $(".aw_stream_js_stream_info_close").live('click', function(){
                                                        aw_api_view_handle_hover_close($(this));
                                                     });
  $(document).scroll(function() {
    var scroll_point = $(document).scrollTop();
    if( scroll_point >= 360){
      $('#aw_js_sidebox_container').addClass('aw_sidebox_outer_container_fixed');
      $('#aw_js_sidebox_container').removeClass('aw_sidebox_outer_container_absolute');

      $("#aw_js_left_side_navs").addClass('aw_vertical_navigation_fixed');
      $("#aw_js_left_side_navs").removeClass('aw_vertical_navigation_absolute');

    }else{
      $('#aw_js_sidebox_container').addClass('aw_sidebox_outer_container_absolute');
      $('#aw_js_sidebox_container').removeClass('aw_sidebox_outer_container_fixed');
      
      $("#aw_js_left_side_navs").addClass('aw_vertical_navigation_absolute');
      $("#aw_js_left_side_navs").removeClass('aw_vertical_navigation_fixed');
    }

   return false; 
  });

  $(".aw_js_scroll_nav").live('click', function(){
    // TODO: NEW_STREAMS
    //activate_profile_deactivate_streams();
    var scroll_to_top_id = $(this).attr("aw_scroll_top_id");
    var position = $("#" + scroll_to_top_id).offset();
    $('html, body').animate({scrollTop: (position.top - 40)}, "slow");
    return false;
  });
  var body_height = $(window).height();
  aw_api_view_stream_apply_height(body_height);
 

  $("#aw_streams_layout_header_viewer").live('click',function() {
    aw_api_view_stream_prepare_header_viewer_operator();
  });
    
});

// for the window resize
$(window).resize(function() {
  var body_height = $(window).height();
  aw_api_view_stream_apply_height(body_height);
});
