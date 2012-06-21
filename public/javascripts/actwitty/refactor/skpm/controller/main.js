/******************************************************************/
/*
 *
 *
 */
var aw_global_status_manager = {
                                  status : 1,
                                  fancybox_open: false,
                                  fancybox_modal: false,
                                  fancybox_timer: null
                               };


/* Objects for holding html elements for page's stream and profile */
var aw_global_streams_html_section = $(".aw_page_stream_overlap_wrapper");
var aw_global_profile_html_section = $(".aw_page_wrapper");


/******************************************************************/
/*
 *
 *
 */
function aw_api_control_verify_status_of_sketch_page(){
  
    $.ajax({
            url: "/home/get_sketch_data_status",
            type: 'GET',
            data: {
                    user_id : aw_js_global_visited_user_credentials.id,
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function ( status_data ) {
              aw_global_status_manager.fancybox_timer = null;
              if(status_data.status ) {
                if(status_data.status == 1){
                  aw_global_status_manager.fancybox_modal = false; /* always false */
                }else if(status_data.status == 2){
                  aw_global_status_manager.fancybox_modal = false;
                }else if (status_data.status == 3){
                  if(aw_global_status_manager.fancybox_open){
                      $.fancybox.close();
                      aw_global_status_manager.fancybox_open = false;
                      location.reload();
                  }
                }

                if(  status_data.status != 3 ){                    
                    
                  if( !aw_global_status_manager.fancybox_open ){
                    $.fancybox({
                      content: $('#aw_js_fb_data_busy_modal_fancybox'),
                      modal: aw_global_status_manager.fancybox_modal,
                      onClosed:function() {
                                            if( aw_global_status_manager.fancybox_timer ){
                                              window.clearTimeout(aw_global_status_manager.fancybox_timer); 
                                            }
                                        }
                      });
                      aw_global_status_manager.fancybox_open = true;
                    }

                    aw_global_status_manager.fancybox_timer = window.setTimeout(  aw_api_control_verify_status_of_sketch_page, 10000);


                }
              }

            },error:function(XMLHttpRequest,textStatus, errorThrown){ 

            }
          });


 
}


/******************************************************************/
var aw_js_global_services_user_enabled={};
/* Main entry point to sketch initialize
 *
 *
 */
function aw_api_controller_sketch_main_init(){

  aw_lib_console_log("DEBUG", "Entry point into main controller");
  aw_api_view_initialize_views();
  aw_api_control_verify_status_of_sketch_page();
  $.each(aw_js_global_rails_user_services_enabled, function( index, service_data){
    if ( service_data['provider'] ){
      aw_js_global_services_user_enabled[ service_data['provider'] + '_service_enabled'] = true;
    }
  });
  if( aw_js_global_services_user_enabled[ 'facebook_service_enabled' ] ){
      aw_lib_console_log("DEBUG", "invoking facebook token init");
    /* facebook is there need to check current log in */    
    aw_global_services_api_registry['facebook']['service_init'](aw_api_controller_sketch_start_data_pulls);
  }else{
    /* facebook is not there no need to check current log in */
    aw_api_controller_sketch_start_data_pulls();
  }
  aw_api_view_search_autocomplete();

}

/******************************************************************/
/*
 *
 *
 *
 */
function aw_api_controller_view_minimal_init(){
  aw_api_view_search_autocomplete();
}
/******************************************************************/
/*
 *
 *
 */
function aw_api_controller_sketch_start_data_pulls(){
  aw_lib_console_log("DEBUG", "entered: aw_api_controller_sketch_start_data_pulls");
  /*initialize */
  //aw_api_model_static_profile_initialize();
  aw_api_model_service_list_initialize();
  aw_api_model_interests_initialize();
  //aw_api_model_trends_initialize();
  aw_api_model_mentions_initialize();
  //aw_api_model_service_pouplarity_initialize();
  //aw_api_view_locations_initialize_map_view(0, 0);
  
  /* prepare */ 
  $.each(aw_js_global_services_enabled.services, function(service_name, detail) { 
    var key = service_name + '_service_enabled';
    if( aw_js_global_services_user_enabled[ key ] ){
      aw_lib_console_log("DEBUG", "preparing:" + service_name);
      /* add to list of services to be processed */
      aw_api_model_static_profile_add_service(service_name);
      aw_api_model_stream_view_add_service(service_name);
      aw_api_model_images_add_service(service_name);

      if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id )
      {
        aw_api_model_visited_user_feed_add_service(service_name);
        if(aw_js_global_check_invites == "yes"){
          aw_api_model_user_friends_add_service(service_name);
        }
      }
    }
  });

  /* trigger */
  //1. Static profile section
  //aw_api_model_static_profile_trigger_fetch();
  //aw_api_model_stream_view_fetch();
  //aw_api_model_visited_user_feed_fetch();
  aw_api_model_videos_fetch();
  //aw_api_model_location_fetch();
  //aw_api_model_visited_user_friends_fetch();
  if ( aw_js_global_visited_user_credentials.id == aw_js_global_logged_in_user_credentials.id ){
    aw_api_model_visited_user_feed_fetch();
  }
  aw_api_model_images_fetch();
  //aw_api_view_stream_set_default_internal_header();

  // samarth : fetch some data for all interests
  //aw_api_model_topical_data_fetch();
  // end

  aw_lib_console_log("DEBUG", "exitting: aw_api_controller_sketch_start_data_pulls");
  
  
  // A HACK FOR REDIRECTING HOME PAGE NOW TO STREAMS LAYOUT PAGE
  activate_streams_deactivate_profile();
  aw_cache_api_get_data("aw.interests",aw_api_view_stream_layout_render_header);
  aw_cache_api_get_data("aw.mentions.data",aw_api_view_stream_layout_render_mentions_header);
  if (aw_js_active_interest_stream === "all") {
      //$("#aw_js_stream_home_layout_filterer").trigger('click');
      //aw_cache_api_get_data("aw.interests",aw_api_view_stream_layout_render_header);
      //aw_cache_api_get_data("aw.mentions.data",aw_api_view_stream_layout_render_mentions_header);
      //aw_cache_api_get_data("aw.interests.data", aw_api_view_home_in_streams_layout);       

      // need to wait to invoke home screen viewing from aw_local_stream ... a big hack :(
  } else if (aw_js_active_interest_stream === "images") {
      aw_cache_api_get_data("aw.images", aw_api_view_images_in_streams_layout); 
  } else if (aw_js_active_interest_stream === "videos") {
      aw_cache_api_get_data("aw.videos", aw_api_view_videos_in_streams_layout);
  }

}



/*
 * utilities for handling html show/hide events 
 */
function activate_streams_deactivate_profile()
{
  $(".aw_page_stream_overlap_wrapper").show();
  $(".aw_page_wrapper").hide();
  $(".aw_actwitty_share_on_social_media").hide();

  /*
  $(".aw_page_sketch_header").css("height","140px");
  $(".aw_banner_image_box").css("height","140px");
  $(".aw_banner_info_box").css("height","140px");
  */
  aw_cache_api_set_data("aw.layout","streams_layout");

}

function activate_profile_deactivate_streams()
{
  $(".aw_page_stream_overlap_wrapper").hide();
  $(".aw_page_wrapper").show();
  $(".aw_actwitty_share_on_social_media").show();

  $(".aw_page_sketch_header").css("height","300px");
  $(".aw_banner_image_box").css("height","300px");
  $(".aw_banner_info_box").css("height","300px");

  aw_cache_api_set_data("aw.layout","infographic_layout");

}



