var aw_local_json_callback_mapper = {
                                      'AW_LPM_GET_LATEST_CHANNELS' : function aw_temp_latest_summary(params){
                                                                        aw_api_lpm_render_latest_channels(params);
                                                                     }
                                    };

function aw_api_rails_get_latest_channel_info(){
   $.ajax({

            url: '/home/get_latest_summary.json',
            type: 'GET',
            data: {},
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              // if rails demands a redirect because of log in missing
              params={
                      resp_data : data
                     };
              if(aw_local_json_callback_mapper['AW_LPM_GET_LATEST_CHANNELS']){
                  aw_local_json_callback_mapper['AW_LPM_GET_LATEST_CHANNELS'](params);
              }
            

        },
        error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_alert('There has been a problem getting summaries. \n ActWitty is trying to solve.');
        }
    });
}
