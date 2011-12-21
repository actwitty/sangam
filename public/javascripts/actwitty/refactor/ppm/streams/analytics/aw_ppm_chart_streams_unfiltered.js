/****************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_charts_create_posts_distribution_chart(chart_box_id, channel_name_array, series_arr){
  var chart = new Highcharts.Chart({
					                      chart: {
                              						renderTo: chart_box_id,
                              						defaultSeriesType: 'bar'
                              				 },
                      					title: {
						                              text: 'Post Source Across Channels'
					                             },
                                xAxis: {
						                              categories: channel_name_array
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
				                        series: series_arr
				                  });
}
/****************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_charts_create_posts_karma_chart(chart_box_id, channel_name_array, series_arr){
      var chart = new Highcharts.Chart({
					chart: {
						renderTo: chart_box_id
					},
					title: {
						text: 'Karma Analytics'
					},
					xAxis: {
						categories: channel_name_array,
            labels: {
							rotation: -45,
							align: 'right',
							style: {
								 font: 'normal 11px Verdana, sans-serif'
							}
						}
					},
           yAxis: {
						          min: 0,
						          title: {
							                text: 'Karma'
						                 }
					        },
					series: series_arr
				});
}
/****************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_charts_create_subscriber_gender_chart(chart_box_id, channel_name_array, series_arr){
  	  var chart = new Highcharts.Chart({
					chart: {
						renderTo: chart_box_id,
						defaultSeriesType: 'bar'
					},
					title: {
						text: 'Subscribers Analytics'
					},
					xAxis: [{
						categories: channel_name_array,
						reversed: false
					}, { // mirror axis on right side
						opposite: true,
						reversed: false,
						categories: channel_name_array,
						linkedTo: 0
					}],
					yAxis: {
						title: {
							text: null
						},
            min: -500,
						max: 500,
            labels: {
						formatter: function(){
								return (Math.abs(this.value));
							}
						}
						
					},
          tooltip: {
						formatter: function(){
							return '<b>'+ this.series.name +', subscribing '+ this.point.category +'</b><br/>'+
								 ': '+ Highcharts.numberFormat(Math.abs(this.point.y), 0);
						}
					},
					
					plotOptions: {
						series: {
							stacking: 'normal'
						}
					},
				
					series: series_arr
				});
}
/****************************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_charts_create_multimedia_distribution_chart(chart_box_id, channel_name_array, series_arr){
    var chart = new Highcharts.Chart({
					chart: {
						renderTo: chart_box_id
					},
					title: {
						text: 'Multimedia Share Analytics'
					},
					xAxis: {
						categories: channel_name_array,
            labels: {
							rotation: -45,
							align: 'right',
							style: {
								 font: 'normal 11px Verdana, sans-serif'
							}
						}
					},
           yAxis: {
						          min: 0,
						          title: {
							                text: 'Count'
						                 }
					        },
					series: series_arr
				});	
}
/****************************************************************************/
/*
 *
 *
 */
function aw_handle_channel_analytics_summary(params, index, 
                                            tw_count_arr, 
                                            fb_count_arr, 
                                            aw_count_arr){
  var analytics = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  if(analytics.posts){
    if(analytics.posts.facebook){
      fb_count_arr[index] = analytics.posts.facebook;
    }else{
      fb_count_arr[index] = 0;
    }

    if(analytics.posts.twitter){
      tw_count_arr[index] = analytics.posts.twitter;
    }else{
      tw_count_arr[index] = 0;
    }

    if(analytics.posts.actwitty){
      aw_count_arr[index] = analytics.posts.actwitty;
    }else{
      aw_count_arr[index] = 0;
    }
  }else{
    aw_count_arr[index] = 0;
    tw_count_arr[index] = 0;
    fb_count_arr[index] = 0;
  }
}
/****************************************************************************/
/*
 *
 *
 */
function aw_handle_channel_karma_analytics_summary( params, index, 
                                                    likes_count_arr,
                                                    shares_count_arr,
                                                    comments_count_arr,
                                                    rank_count_arr){
   var analytics = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
   if(analytics.comments && analytics.comments.total){
    comments_count_arr[index] = analytics.comments.total;
   }else{
     comments_count_arr[index] = 0;
   }

   if(analytics.likes && analytics.likes.total){
     likes_count_arr[index] = analytics.likes.total;
   }else{
     likes_count_arr[index] = 0;
   }

  if(analytics.actions && analytics.actions.share){
     shares_count_arr[index] = analytics.actions.share;
   }else{
     shares_count_arr[index] = 0;
   }



   if(analytics.channel_ranks){
     rank_count_arr[index] = analytics.channel_ranks;
   }else{
      rank_count_arr[index] = 0; 
   }


}
/****************************************************************************/
/*
 *
 *
 */
function aw_handle_channel_subscriber_gender_analytics_summary(params, index, 
                                                               male_count_arr,
                                                               female_count_arr){
  var analytics = aw_awpi_serv_resp_data_for_get_request_in_params(params);
  if(analytics.demographics && analytics.demographics.male){
     male_count_arr[index] =  analytics.demographics.male;
  }else{
    male_count_arr[index] = 21 + index;
  }

  if(analytics.demographics && analytics.demographics.female){
     female_count_arr[index] =  -1 * analytics.demographics.female;
  }else{
    female_count_arr[index] = -50 + index;
  }


}
/****************************************************************************/
/*
 *
 *
 */
function aw_handle_channel_attachments_analytics_summary(params, index, 
                                                         pictures_count_arr,
                                                         videos_count_arr){
   var analytics = aw_awpi_serv_resp_data_for_get_request_in_params(params);
   if(analytics.documents && analytics.documents.image){
     pictures_count_arr[index] = analytics.documents.image;
   }else{
     pictures_count_arr[index] = 0;
   }

   if(analytics.documents && analytics.documents.video){
     videos_count_arr[index] = analytics.documents.video;
   }else{
     videos_count_arr[index] = 0;
   }
}
/****************************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chart_all_channels(params){
   var all_channels = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
   
    
   var total_length = all_channels.length;
   var twitter_series = {name:"Twitter", data:new Array(total_length)};
   var facebook_series = {name:"Facebook", data:new Array(total_length)};
   var actwitty_series = {name:"ActWitty", data:new Array(total_length)};
   var categories_array = new Array(total_length);

   var likes_series = {name:"Likes",type:"column", data:new Array(total_length)};
   var comments_series = {name:"Comments", type:"column", data:new Array(total_length)};
   var shares_series = {name:"Shares", type:"column", data:new Array(total_length)};
   var rank_series = {name:"Rank", type:"spline", data:new Array(total_length)};

   var videos_series = {name:"Videos",type:"column", data:new Array(total_length)};
   var images_series = {name:"Pictures",type:"column", data:new Array(total_length)};

   var male_series = {name:"Male", data:new Array(total_length)};
   var female_series = {name:"Female", data:new Array(total_length)};

   var processed_count = 0;
   $.each(all_channels, function(index, channel_hash) { 
     var params_internal = {
                    'aw_srv_protocol_params' :{
                                                 id: channel_hash.summary_id,
                                                 type: 'channel',
                                              },
                    'aw_srv_protocol_cookie' : {
                                                  cb_fn:function(params_cb){
                                                    /* handle chart 1*/
                                                    aw_handle_channel_analytics_summary(params_cb,
                                                                                       index,
                                                                                       twitter_series.data,
                                                                                       facebook_series.data,
                                                                                       actwitty_series.data); 
                                                    /* handle chart 2*/
                                                    aw_handle_channel_karma_analytics_summary(params_cb,
                                                                                              index,
                                                                                              likes_series.data,
                                                                                              shares_series.data,
                                                                                              comments_series.data,
                                                                                              rank_series.data);
                                                    
                                                    /*handle chart 3*/
                                                    aw_handle_channel_subscriber_gender_analytics_summary(params_cb,
                                                                                                          index,
                                                                                                          male_series.data,
                                                                                                          female_series.data);
                                                    
                                                    /*handle chart 4 */
                                                    aw_handle_channel_attachments_analytics_summary(params_cb,
                                                                                                    index,
                                                                                                    images_series.data,
                                                                                                    videos_series.data);
                                                    categories_array[index] = channel_hash.name;
                                                    processed_count++;
                                                    if(processed_count == total_length){
                                                      var series_arr = [];
                                                      series_arr.push(twitter_series);
                                                      series_arr.push(facebook_series);
                                                      series_arr.push(actwitty_series);
                                                       
                                                      var series_arr_karma = [];
                                                      series_arr_karma.push(likes_series);
                                                      series_arr_karma.push(shares_series);
                                                      series_arr_karma.push(comments_series);
                                                      series_arr_karma.push(rank_series);

                                                      var series_arr_subscribers = [];
                                                      series_arr_subscribers.push(male_series);
                                                      series_arr_subscribers.push(female_series);
                                                      
                                                      var series_arr_multimedia = [];
                                                      series_arr_multimedia.push(images_series);
                                                      series_arr_multimedia.push(videos_series);



                                                      aw_api_ppm_stm_charts_create_posts_distribution_chart("aw_js_ppm_stm_analytics_box_1",
                                                                                                            categories_array,
                                                                                                            series_arr);
                                                      aw_api_ppm_stm_charts_create_posts_distribution_chart("aw_js_ppm_stm_analytics_box_1_large",
                                                                                                            categories_array,
                                                                                                            series_arr);
                                                      
                                                      aw_api_ppm_stm_charts_create_posts_karma_chart("aw_js_ppm_stm_analytics_box_2",
                                                                                                            categories_array,
                                                                                                            series_arr_karma);
                                                      aw_api_ppm_stm_charts_create_posts_karma_chart("aw_js_ppm_stm_analytics_box_2_large",
                                                                                                            categories_array,
                                                                                                            series_arr_karma);
                                                      aw_api_ppm_stm_charts_create_subscriber_gender_chart("aw_js_ppm_stm_analytics_box_3",
                                                                                                            categories_array,
                                                                                                            series_arr_subscribers);                                                                                 aw_api_ppm_stm_charts_create_subscriber_gender_chart("aw_js_ppm_stm_analytics_box_3_large",
                                                                                                            categories_array,
                                                                                                            series_arr_subscribers);  
                                                      
                                                      aw_api_ppm_stm_charts_create_multimedia_distribution_chart("aw_js_ppm_stm_analytics_box_4",
                                                                                                            categories_array,
                                                                                                            series_arr_multimedia);
                                                      aw_api_ppm_stm_charts_create_multimedia_distribution_chart("aw_js_ppm_stm_analytics_box_4_large",
                                                                                                            categories_array,
                                                                                                            series_arr_multimedia)
                                                    }

                                                  }
                                               }
                };
      
    aw_api_ppm_stm_chart_srv_make_summary_request(params_internal);
  });

 


}
/****************************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_generate_sources_distribution_chart(){
      $("#aw_js_ppm_stm_chart_label").html("All channels analytics");    
    var params = {
                    'aw_srv_protocol_params' :{
                                                user_id: aw_lib_get_page_owner_id(),
                                                sort_order: 1,
                                              },
                    'aw_srv_protocol_cookie' : {}
                };

		aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHART_GET_ALL_CHANNELS', params);
}
				

