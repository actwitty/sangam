/****************************************************/
/*
 *
 *
 */
function aw_api_view_search_autocomplete(){
  $("#aw_js_ppm_header_search_text").autocomplete(
            "/home/search_user.json", 
            {
		          multiple: false,
              minChars: 3,
              autoFill: true,
              max: 8,
              mustMatch: true,
		          dataType: "json",
              parse: function(data){
                 return $.map(data, function(item) {
                    return { data: item, value: item.name, result: item.href };
                 });
              },
              formatItem: function(item) {
                 return aw_get_autocomplete_html(item);
                }
              }).result(function(e, item) {
                aw_get_autocomplete_result_click(item);
              });

}


/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_result_click(item){
  if( item ){
    window.location.href = '/home/sketch?id=' + item.id;
  }
}

/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_html(item){

  var html = '';
  html = '<div class="awppm_search_autocomplete_box" >' +

              '<div class="awppm_search_img_box" >' +
                '<img class="awppm_search_autocomplete_img" src="' + item.image + '" width="22px" height="22px" />' +               
              '</div>' +

              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              
          '</div>';
           
  return html;

}
