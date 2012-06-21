/*******************************************************/
/*
 *
 *
 */



function make_streams_layout_ready_for_rerender()
{
   /*
   $("#aw_streams_layout_entries").html("");
   $("#aw_streams_layout_mentions_entries").html("");
   $("#aw_streams_layout_small_posts_entries").html("");
   $("#aw_streams_layout_posts_entries_fitCol").html("");
   $("#awstreams_layout_posts_entries_fitCol_left").html("");
   $("#awstreams_layout_posts_entries_fitCol_right").html("");
   $("#aw_streams_layout_video_entries.isotope_item").html("");
   $("#aw_streams_layout_image_entries.isotope_item").html("");
   */
}



function setup_stream_layout_view(interest_name)
{
  var stream_layout_filter_id = 'aw_stream_layout_interest_id_' + interest_name;
  var interest_obj = $("#"+stream_layout_filter_id);
  interest_obj.trigger("click");
}



