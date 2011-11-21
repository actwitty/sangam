var aw_local_users_channels_data = {
                                      'PetsAndAnimals' : {'category':'pets and animals'},
                                      'ArtsAndDesign' : {'category':'arts and design'},
                                      'BooksAndArticles' : {'category':'books and articles'},
                                      'Business' : {'category':'business'},
                                      'Cars' : {'category':'cars'},
                                      'Celebrations' : {'category':'celebration'},
                                      'CultureAndSociety' : {'category':'culture'},
                                      'Entertainment' : {'category':'entertainment'},
                                      'Education' : {'category':'education'},
                                      'FashionAndStyle' : {'category':'fashion and style'},
                                      'FoodAndDrink' : {'category':'food and drink'},
                                      'ToysAndGames' : {'category':'toys and games'},
                                      'Health' : {'category':'health'},
                                      'HomeAndDecor' : {'category':'home'},
                                      'HobbiesAndLeisure' :  {'category':'hobbies and interest'},
                                      'NonProfits' : {'category':'nonprofit'},
                                      'Sports' : {'category': 'sports'},
                                      'Stories' : {'category':'stories'},
                                      'Technology' : {'category':'technology'},
                                      'TravelAndPlaces' : {'category':'travel and places'},
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

