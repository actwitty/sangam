/*************************************************************************************/
 function aw_api_view_set_invite_list_filter() { // header is any element, list is an unordered list
    // create and add the filter form to the header

    $("#aw_js_fb_invite_search")
      .change( function () {
        var filter = $(this).val();
        $(".aw_js_fb_friend_list_entry").removeClass("aw_js_invites_show_on_filter");
        if(filter) {
          // this finds all links in a list that contain the input,
          // and hide the ones not containing the input while showing the ones that do
          $("#aw_js_fb_friend_list").find("span:not(:Contains(" + filter + "))").parent().slideUp();
          $("#aw_js_fb_friend_list").find("span:Contains(" + filter + ")").parent().slideDown().addClass("aw_js_invites_show_on_filter");
        } else {
          $("#aw_js_fb_friend_list").find("li").slideDown();
        }
        return false;
      })
    .keyup( function () {
        // fire the above change event after every letter
        $(this).change();
    });

    $("#aw_js_fb_invite_all_check").click(function(){

      var checked = $(this).attr("checked");
      if( checked){
        $(".aw_js_fb_friend_list_entry.aw_js_invites_show_on_filter .aw_js_invites_check").attr("checked" , "checked");
      }else{
        $(".aw_js_invites_check").removeAttr("checked");
      }
    });

    $("#aw_js_fb_invites_submit").click(function(){
      aw_api_view_send_invite_on_facebook();
      $.fancybox.close();
      return false;
    });
}
/*************************************************************************************/
/*
 *
 *
 */
 
function aw_api_view_send_invite_on_facebook(){
  var count_names = 0;
  var fb_id_list = '';
  $(".aw_js_fb_friend_list_entry.aw_js_invites_show_on_filter .aw_js_invites_check").each(function(index){
      if( $(this).attr("checked") ){
        if( !count_names ){
          fb_id_list = $(this).attr('check_id');
        }else{
          fb_id_list = fb_id_list + ',' + $(this).attr('check_id');
        }
        count_names++;
      }

      if(count_names>= 49){
        return false;
      }
  });
  if( fb_id_list.length ){
    FB.ui({
      method: 'apprequests',
      to: fb_id_list,
      message: 'Checkout your complete impression on Actwitty https://www.actwitty.com'
    }, function (response) {
                });
  }


}
/*************************************************************************************/
/*
 *
 *
 */
function aw_api_view_init_invite_search(){
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };
}


/*************************************************************************************/
/*
 *
 *
 */
function aw_api_view_invitables_render(data){
  var fb_friends_html = "";
  aw_api_view_init_invite_search();
  if( data["facebook"] ){
    $.each(data["facebook"], function(index, contact){
        fb_friends_html = fb_friends_html + '<li class="fb_friends_li aw_js_fb_friend_list_entry aw_js_invites_show_on_filter aw_invite_contact_check" >' +
                                                  '<input type="checkbox" check_id='+  contact.uid +' class="aw_js_invites_check " checked="checked" />' +
                                                  '<img src="' + contact.photo + '" class="aw_invite_contact_image" />' +
                                                  '<span class="aw_invite_contact_name" >' + contact.name + '</span>' +
                                              '</li>';
          
    });
      
  
    var fb_html    =  '<form class="aw_invite_fb_friends_form" action="#" >' +
                        '<input class="aw_invite_fb_friends_name_search" type="text" id="aw_js_fb_invite_search"/>' +
                      '</form>' +
                      '<ul class="fb_friends_ul" id="aw_js_fb_friend_list" > ' +
                          fb_friends_html +
                      '</ul>' +
                      '<div class="aw_fb_invites_footer">' +
                        '<div class="aw_fb_invites_footer_select_all" >' +
                          '<input type="checkbox" id="aw_js_fb_invite_all_check" checked="checked" > Select All </input>' +
                         '</div>' +
                         '<div class="aw_fb_invites_footer_submit" >' +
                            '<input type="button" id="aw_js_fb_invites_submit" value="Continue" />' +                          
                         '</div>' +
                      '</div>';
    $("#aw_js_fb_invite_search_box").html(fb_html);
    aw_api_view_set_invite_list_filter();
  }

 // if(aw_js_global_check_invites == "yes"){
    $.fancybox({
          content: $('#aw_js_fb_invite_friends_fancybox')

    });
 // } 
}
