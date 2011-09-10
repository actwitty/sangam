
/*
 * NOTE: suggested file name for this file profile_helpers.js
 *
 */
 
 
 
 
 
 
 /*
 * Api's for enabling fancybox on attachments in streams as well as channels.
 * Fancy box is used to show the gallery of attachments which when clicked opens the
 * attachments in modal.
 *
 * There are many ways to show images using fancybox.
 * The current version in place is to show image gallery with prev and next button
 */

var g_current_user_channels_json = {};
var g_channel_ignore_auto_complete=false;
function get_channels_for_theme(userid){
    /*
     * Get data on ready
     */

    if( g_current_user_channels_json.length){
      g_channel_ignore_auto_complete = false;
      return g_current_user_channels_json;
    }
    $.ajax({
        url: '/home/get_channels.json',
        type: 'GET',
        data: {
               user_id:userid, 
               sort_order:1,
               aw_cache_time:aw_lib_get_cache_cookie_id()
              },
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          g_current_user_channels_json = data;
          g_channel_ignore_auto_complete = false;
          return g_current_user_channels_json;

        },
        error: function (error) {

        }
    });
    
}

function setup_on_start(element_id){
  //alert(element_id);
  //alert($("#" + element_id).val());
}


var g_show_theme_selector = false;
var g_theme_channel_id = 0;
var g_theme_doc_id = 0;
function activate_fancybox_group(post_group){

    $('a[rel=fnc_group_'+post_group+']').fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function( title, currentArray, currentIndex, currentOpts) {
          var image_theme_selector =  "";
          if (g_show_theme_selector == true){
            image_theme_selector =  '<div class="js_theme_base" >' +
                                       '<a  class="js_set_as_theme p-awp-st-set-theme" > Set As Theme <img src="/images/alpha/shares/plus.png" width="10" height="10"/>' +
                                      '</a>' +
                                      '<div>' +
                                        '<input type="text" placeholder="Select Channel" class="js_theme_on_channels p-awp-st-theme-input" />' +
                                      '</div>' +
                                    '</div>';
           
          }
					var fb_html = '<span id="fancybox-title-over">' +
                          'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') +
                            image_theme_selector +
                        '</span>' ;
          return fb_html;
				},
        'onStart' : function(selectedArray, selectedIndex, selectedOpts){
          var obj = selectedArray[ selectedIndex ];
          if($(obj).parent().find(".js_theme_doc_id").length){
            g_show_theme_selector = true;
            g_theme_channel_id = $(obj).parent().find(".js_theme_user_id").val();
            g_theme_doc_id =  $(obj).parent().find(".js_theme_doc_id").val();
          }else{
            g_show_theme_selector = false;
            g_theme_channel_id = 0;
            g_theme_doc_id = 0;
          }
        }
	});
}



/*
 * API for read more expander plugin
 */
function setup_readmore(content_class,slice_at) {
  $(content_class).expander({
      slicePoint:slice_at,  // default is 100
      expandText:'read more', // default is 'read more...'
      userCollapseText: '...less'  // default is '[collapse expanded text]'
  });
}


function create_theme_from_attachment(doc_id, channel_id){
   $.ajax({
        url: '/home/create_theme.json',
        type: 'POST',
        data: {
                  'summary_id' : channel_id,
                  'document_id' : doc_id
              },
        dataType: 'json',
        success: function (data) {
          g_channel_ignore_auto_complete = true; 
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
        }
    });
}


$(document).ready(function(){
  
  $(".js_theme_on_channels").live('keyup.autocomplete', function() {
    var json_data = get_channels_for_theme(aw_lib_get_session_owner_id());
    $(this).autocomplete(json_data, {
     	minChars: 0,
		  width: 310,
		  matchContains: true,
		  highlightItem: false,
      formatItem: function(channel) {
        return channel.name;
      }

    }).result(function(e, channel) {
      if (g_channel_ignore_auto_complete == false){
          g_channel_ignore_auto_complete=true;
          create_theme_from_attachment(g_theme_doc_id, channel.summary_id);
          $(this).hide('slow'); 
          $(this).closest(".js_theme_base").find('img').attr("src", "/images/alpha/shares/plus.png");
          $(this).val("");

        }
    });
  });


  $(".js_set_as_theme").live('click', function(){

    var channels_setter = $(this).parent().find(".js_theme_on_channels");
    if(channels_setter.css('display') == 'none'){ 
      //get_social_counter(post_id, $(this));
      channels_setter.show('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/minus.png");
    } else { 
      channels_setter.hide('slow'); 
      $(this).find('img').attr("src", "/images/alpha/shares/plus.png");
    }

  });

});




