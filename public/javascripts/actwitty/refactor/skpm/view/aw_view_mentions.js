/*******************************************/
function aw_api_view_mentions_callback_on_click(mention_id){
}
/********************************************/
/*
 *
 *
 */


$.fn.tagcloud.defaults = {
  size: {start: 24, end: 32, unit: 'pt'},
  color: {start: '#c61951', end: '#229fa3'}
};


function aw_api_view_mentions_render(data){
  var view_mention_arr = [];
  $.each(data, function(key, mention) {
    var entry = {
                  text: mention.name,
                  weight: mention.weight,
                  callback: aw_api_view_mentions_callback_on_click(mention.id)
                };
    view_mention_arr.push(entry);
  });

  var html = '<div id="aw_js_sketch_mentions_jqcloud" style="width: 530px; height: 260px; "> </div>' ;
  $("#aw_js_mentions_list_box").html(html);
  $("#aw_js_sketch_mentions_jqcloud").jQCloud(view_mention_arr);
}
