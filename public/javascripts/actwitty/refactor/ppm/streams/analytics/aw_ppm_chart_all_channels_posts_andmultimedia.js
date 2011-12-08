/****************************************************************/
/*
 *
 *
 */
function aw_char_get_channel_chartbox_id(){
}
/****************************************************************/
/*
 *
 *
 */
function aw_chart_get_channels_name_array(){
}
/****************************************************************/
/*
 *
 *
 */
function aw_chart_get_channel_sources_series_array(){
}


/****************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_charts_create_posts_distribution_chart(){
  chart = new Highcharts.Chart({
					                      chart: {
                              						renderTo: aw_char_get_channel_chartbox_id(),
                              						defaultSeriesType: 'bar'
                              				 },
                      					title: {
						                              text: 'Channel Sources Analytics'
					                             },
                                xAxis: {
						                              categories: aw_chart_get_channels_name_array()
					                             },
                                yAxis: {
						                              min: 0,
						                              title: {
							                                     text: 'Post sources'
						                                     }
					                             },
                                legend: {
                              						backgroundColor: '#FFFFFF',
                              						reversed: true
                              					},
                      					tooltip: {
                              						formatter: function() {
                                                    							return ''+
                                                	  						  this.series.name +': '+ this.y +'';
                                                    						}
                              					},
                      					plotOptions: {
                                  						series: {
                                          							stacking: 'normal'
                                          						}
                                    				},
				                        series: aw_chart_get_channel_sources_series_array()
				                  });
}
/****************************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chart_all_channels(params){
   var all_channels = aw_awpi_serv_resp_data_for_get_request_in_params(params); 

   $.each(all_channels, function(index, channel_hash) { 
     var params = {
                    'aw_srv_protocol_params' :{
                                                 id: channel.summary_id,
                                                 type: 'channel',
                                              },
                    'aw_srv_protocol_cookie' : {
                                                  cb_fn:function(){
                                                    aw_handle_channel_analytics_summary();                                                                                                                            }
                                               }
                };
     
    
  });
}
/****************************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_generate_sources_distribution_chart(){
    var params = {
                    'aw_srv_protocol_params' :{
                                                 user_id: aw_lib_get_page_owner_id(),
                                                 sort_order: 1,
                                               },
                    'aw_srv_protocol_cookie' : {}
                };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CMN_GET_USER_AUTOCOMPELTE_CHANNELS',  params);
		  		
}
				
