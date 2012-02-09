/***************************************************************/
/*
 *
 *
 */
function aw_api_view_images_render(data){
  var html="";
  var count = 0;
  var html_col_1 = '<div class="aw_images_col" >';
  var html_col_2 = '<div class="aw_images_col" >';
  var html_col_3 = '<div class="aw_images_col" >';

  $.each(data, function(key, image_json){

    var img_html =  '<div class="aw_single_img_box" >' +
                      '<img src="' + image_json.url + '" width="100%" />' +
                    '</div>';
    if(count%3 == 0){
        html_col_1 = html_col_1 + img_html;
    }else if(count%3 == 1){
        html_col_2 = html_col_2 + img_html;
    }else{
        html_col_3 = html_col_3 + img_html;
    }
    count++; 
  });
  html_col_1 = html_col_1 + '</div>';
  html_col_2 = html_col_2 + '</div>';
  html_col_3 = html_col_3 + '</div>';
  html =  '<div class="aw_images_container_box" >' +
              html_col_1 + 
              html_col_2 +
              html_col_3 +
          '</div>';
  $("#aw_js_images_box").html(html);
}
