var aw_local_users_channels_data = {
                                      'animals' :       {'category':'pets and animals'},
                                      'art' :           {'category':'arts and design'},
                                      'books' :         {'category':'books and articles'},
                                      'business' :      {'category':'business'},
                                      'cars' :          {'category':'cars'},
                                      'celebrations' :  {'category':'holidays and events'},
                                      'culture' :       {'category':'culture and society'},
                                      'entertainment' : {'category':'entertainment'},
                                      'education' :     {'category':'education'},
                                      'fashion' :       {'category':'fashion and style'},
                                      'food' :          {'category':'food and drink'},
                                      'toys' :          {'category':'toys and games'},
                                      'health' :        {'category':'health'},
                                      'home' :          {'category':'home'},
                                      'hobbies' :       {'category':'hobbies and interest'},
                                      'nonprofits' :    {'category':'nonprofits'},
                                      'sports' :        {'category': 'sports'},
                                      'stories' :       {'category':'stories'},
                                      'technology' :    {'category':'technology'},
                                      'travel' :        {'category':'travel and places'},
                                   };

var aw_local_users_channel_names = [];

/*
 *
 *
 */
function aw_api_srv_resp_ppm_cmn_render_user_suggest_channels(params){

  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CMN_GET_USER_AUTOCOMPELTE_CHANNELS');
  //create an array for auto suggest to work properly
  aw_local_users_channel_names = [];
  for (var key in aw_local_users_channels_data) {
    aw_local_users_channel_names.push({'name':key});
  }
  //////////////////////////////////////////////
  //
  //
  $.each(data, function(i,channel){
    if( channel ){
        var channel_name = channel.name;
        if ( !aw_local_users_channels_data[channel_name] || 
                   aw_local_users_channels_data[channel_name].length == 0 ){
          //TODO: Fix the category, rails must send this
          // A new channel found other than the default accept this.
          var new_category={'category':'unknown'};
          aw_local_users_channels_data[channel_name] = new_category; 
          aw_local_users_channel_names.push({'name':channel_name});
        }
    }

  });

  /* register this only when JSON is ready */
  $("#aw_js_ppm_input_channel_name").autocomplete(aw_local_users_channel_names, {
     	  minChars: 0,
		    matchContains: true,
		    highlightItem: false,
        formatItem: function(channel) {
          $("#awppm_ip_category").show();
          return channel.name;
        }
      }).result(function(event, item) {
        //$("#awppm_ip_category").hide();
        $("#aw_js_ppm_input_channel_category").val(aw_local_users_channels_data[item.name].category);
      });
}


/*
 *
 *
 */
function aw_api_ppm_input_initialize_auto_suggest(){
   var params = {
                  'aw_srv_protocol_params' : {
                                                 user_id: aw_lib_get_page_owner_id(),
                                                 sort_order: 1,
                                                 cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {}
               };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CMN_GET_USER_AUTOCOMPELTE_CHANNELS',  params);
}

