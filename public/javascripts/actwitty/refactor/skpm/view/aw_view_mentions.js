/*******************************************/
function aw_api_view_mentions_callback_on_click(mention_id){
}
/********************************************/
/*
 *
 *
 */
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

  var html = '<div id="aw_js_sketch_mentions_jqcloud" style="width: 530px; height: 300px; "> </div>' ;
  $("#aw_js_mentions_list_box").html(html);
  $("#aw_js_sketch_mentions_jqcloud").jQCloud(view_mention_arr);
}
