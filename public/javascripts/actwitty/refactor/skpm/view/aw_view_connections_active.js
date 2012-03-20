/**********************************************************************/
/*
 *
 *
 */
function aw_api_view_connections_active_friends_render(data){
   var html = "<h3> Currently active friends on various networks</h3>";
   var count_elements = 0;
   var max_to_show = 21;
   $.each(data, function(key, per_user_data) {
     var single_post = per_user_data[0];
     var display_class = "aw_js_single_contact_box_show_always";

     if( count_elements >= max_to_show){
        display_class = "aw_js_single_contact_box_hide_on_less";
     }
     var twipsy = single_post.originator.name + ' has ' + per_user_data.length + ' posts from ' + single_post.service.name + ' in your wall. Click to read them.';
     html = html + '<div class="aw_single_contact_box aw_js_active_friend_contact_click ' + display_class +  ' " key='+ key +  ' rel="aw_js_twipsy_connections" data-original-title="' +  twipsy + ' "' + '>' +
                      '<img class="aw_single_contact_image" src="' + single_post.originator.image + '" width=56px height=56px />' +
                      '<img class="aw_single_contact_service_img" src="/images/actwitty/refactor/aw_sketch/contacts/' +   single_post.service.name +  '.png" width=16px height=16px />' +
                      
                      '<div class="aw_single_contact_posts_count" >' +
                        '<span>' +
                          per_user_data.length +
                        '</span>' +
                      '</div>' +
                   '</div>';
                   count_elements++;

    
   });
   var residue = count_elements - max_to_show;
   var more_html = "";
   if( residue > 0){
    more_html = '<div class="aw_show_more_contacts_box aw_js_show_more_contacts" state="show" total="' + residue + '">' +
                'Show ' + residue + ' more active contacts' +
              '</div>';
   }
  
   html = html + more_html;
   $("#aw_js_contacts").html(html);
   $("div[rel=aw_js_twipsy_connections]").twipsy({  live: true, placement: "below" }); 
   $("#aw_js_connections_busy").hide();
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_view_show_or_hide_all_active_contacts(object){
  if( object.attr('state') == "show") {
    
    $(".aw_js_single_contact_box_hide_on_less").removeClass("aw_js_single_contact_box_hide_on_less").addClass("aw_js_single_contact_box_show_on_more");
    object.attr('state', "hide");
    object.html(  'Show less' );
  }else{

    $(".aw_js_single_contact_box_show_on_more").removeClass("aw_js_single_contact_box_show_on_more").addClass("aw_js_single_contact_box_hide_on_less");
    object.attr('state', "show");
    var residue = object.attr('total');
    object.html( 'Show ' + residue + ' more active contacts');
  }
  
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_view_get_key_to_fetch_active_contact_data(object){
  return object.attr('key');
}
