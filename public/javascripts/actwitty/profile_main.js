/*************************************/
var g_page_context = "profile_main";
function get_current_page_context(){
  return g_page_context;
}

function set_current_page_context(context){
  g_page_context = context;
}
/*************************************/

var g_initialized = 0;
$(document).ready(function(){
  /* main pump to decide page flow */
  if (g_initialized == 1){
    return;
  }
  g_initialized = 1;
  var page_context=$('#page_mode').attr("value");
  set_current_page_context(page_context);
  if( page_context == "profile_main"){
    main_profile_initializer();  /* in profile.js */
  }else if( page_context == "landing_page"){
    aw_api_lpm_initialize_landing_page(); 
  }else if( page_context == "single_post") {
    single_post_initializer();  /* in single_post.js */
  }else if( page_context == "entity"){
    show_all_on_entity();   /* in entity_page.js */
  }else if( page_context == "location"){
    show_all_on_location(); /* in location_page.js */
  }else if( page_context == "channel"){
    show_all_on_channel(); /* in channel_page.js */
  }else if( page_context == "facebook"){
    aw_fetch_facebook_friends(); /* in profile_facebook.js */
  }

  /** General functions to support auto complete based search **/
  function format(user) {
    return '<img alt="" class="p-st-fltr-search-img" src="'+ user.photo_small_url + '">   ' + user.full_name + "</img>";
  }

  function getID(user){
    return user.id;
  }

   $("#username_search").autocomplete("/home/search_people" , {
     	minChars: 3,
      delay:400,
		  width: 215,
		  matchContains: true,
		  highlightItem: false,
      parse: function(data) {
        return $.map(data, function(row) {
          return {
            data: row.user,
            value: row.user.full_name,
            result: row.user.full_name
          }
        });
      },
      formatItem: function(item) {
        return format(item);
      },

    }).result(function(e, item) {
      window.location.href = "/home/show?id=" + getID(item);
      
    });
    return false;
});
