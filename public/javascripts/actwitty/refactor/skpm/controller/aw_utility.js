/*******************************************************/
/*
 *
 *
 */


function setup_stream_layout_view(interest_name)
{
  var stream_layout_filter_id = 'aw_stream_layout_interest_id_' + interest_name;
  var interest_obj = $("#"+stream_layout_filter_id);
  interest_obj.trigger("click");
}

$(document).ready(function()
{
  //alert("stream currenly active " + aw_js_active_interest_stream );
  
  // TODO : NEW_STREAM
  //setup_stream_layout_view(aw_js_active_interest_stream);

});


