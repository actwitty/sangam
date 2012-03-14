/*******************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_srv_make_summary_request(params){
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHART_GET_ANALYTICS_SUMMARY', params);
}
/*******************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_srv_make_full_request(params){
  aw_api_srv_make_a_get_request('AW_SRV_PPM_STM_CHART_GET_ANALYTICS_FULL', params);
}

/*******************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chart_analytics_summary_cb(params){
  var cb_fn = params['aw_srv_protocol_cookie']['cb_fn'];
  cb_fn(params);
}


/*******************************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_stm_chart_analytics_full_cb(params){
  var cb_fn = params['aw_srv_protocol_cookie']['cb_fn'];
  cb_fn(params);
}

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
						text: 'Multimedia Share Analytics',
					},
					xAxis: {
						categories: channel_name_array,
            labels: {
							rotation: -30,
							align: 'right',
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
				


/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_posts_data_cb(data){
  return data.total;
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_generate_posts_timeseries(data_arr){
  if( !data_arr ){
    var chart_hash={
                  start_year: 2001,
                  start_month: 01,
                  start_day: 01,
                  arr: []
                };
    chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_1' ;
    chart_hash['max_zoom_days'] = 2;
    chart_hash['vertical_name'] =  'Count';
    chart_hash['horizontal_name'] = 'Posts'
    chart_hash['title'] = 'Channel Trending';
    aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_1_large';
    aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    return;
  }
  var chart_hash = aw_api_convert_date_wise_series_to_chartable_array(data_arr, aw_api_ppm_stm_chart_posts_data_cb);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_1' ;
  chart_hash['max_zoom_days'] = 2;
  chart_hash['vertical_name'] =  'Count';
  chart_hash['horizontal_name'] = 'Posts'
  chart_hash['title'] = 'Channel Trending';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_1_large';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);

}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_likes_data_cb(data){
  return data.total;
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_generate_likes_timeseries(data_arr){
  if( !data_arr ){
    var chart_hash={
                  start_year: 2001,
                  start_month: 01,
                  start_day: 01,
                  arr: []
                };
    chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_2' ;
    chart_hash['max_zoom_days'] = 2;
    chart_hash['vertical_name'] =  'Count';
    chart_hash['horizontal_name'] = 'Likes'
    chart_hash['title'] = 'Channel Likes';
    aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_2_large';
    aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    return;
  }
  var chart_hash = aw_api_convert_date_wise_series_to_chartable_array(data_arr, aw_api_ppm_stm_chart_likes_data_cb);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_2' ;
  chart_hash['max_zoom_days'] = 2;
  chart_hash['vertical_name'] =  'Count';
  chart_hash['horizontal_name'] = 'Likes'
  chart_hash['title'] = 'Channel Likes';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_2_large';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_rank_data_cb(data){
  return data;
}

/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_generate_rank_timeseries(data_arr){
  if( !data_arr ){
    var chart_hash={
                  start_year: 2001,
                  start_month: 01,
                  start_day: 01,
                  arr: []
                };
    chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_3' ;
    chart_hash['max_zoom_days'] = 2;
    chart_hash['vertical_name'] =  'Rank';
    chart_hash['horizontal_name'] = 'Ranking'
    chart_hash['title'] = 'Channel Ranking';
    aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_3_large';
    aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    return;
  }

  var chart_hash = aw_api_convert_date_wise_series_to_chartable_array(data_arr, aw_api_ppm_stm_chart_rank_data_cb);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_3' ;
  chart_hash['max_zoom_days'] = 2;
  chart_hash['vertical_name'] =  'Rank';
  chart_hash['horizontal_name'] = 'Channel Ranking'
  chart_hash['title'] = 'Channel Ranking';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_3_large';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);

}
/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_subscribers_data_cb(data){
  return data;
}
/*************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_generate_subscribers_timeseries(data_arr){
    if( !data_arr ){
      var chart_hash={
                  start_year: 2001,
                  start_month: 01,
                  start_day: 01,
                  arr: []
                };
      chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_4' ;
      chart_hash['max_zoom_days'] = 2;
      chart_hash['vertical_name'] =  'Count';
      chart_hash['horizontal_name'] = 'Subscribers'
      chart_hash['title'] = 'Channel Reach';
      aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
      chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_4_large';
      aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
    return;
  }

  var chart_hash = aw_api_convert_date_wise_series_to_chartable_array(data_arr, aw_api_ppm_stm_chart_subscribers_data_cb);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_4' ;
  chart_hash['max_zoom_days'] = 2;
  chart_hash['vertical_name'] =  'Count';
  chart_hash['horizontal_name'] = 'Subscribers'
  chart_hash['title'] = 'Channel Reach';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
  chart_hash['chart_box_id'] = 'aw_js_ppm_stm_analytics_box_4_large';
  aw_api_ppm_stm_chart_timeseries_chart(chart_hash);
}

/**************************************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_chart_render_filtered_charts(){
  var channel_id = aw_api_ppm_stm_get_chn_filter_id();
  $("#aw_js_ppm_stm_chart_label").html(aw_api_ppm_stm_get_chn_filter_name() + " channel analytics");
  var params = {
                    'aw_srv_protocol_params' :{
                                                 id: channel_id,
                                                 type: 'channel',
                                                 fields: ['posts', 'likes', 'channel_ranks', 'subscribers']
                                              },
                    'aw_srv_protocol_cookie' : {
                                                  cb_fn:function(params_cb){
                                                      var data = aw_awpi_serv_resp_data_for_get_request_in_params(params_cb);
                                                      aw_api_ppm_stm_chart_generate_rank_timeseries(data.channel_ranks);
                                                      aw_api_ppm_stm_chart_generate_subscribers_timeseries(data.subscribers);
                                                      aw_api_ppm_stm_chart_generate_likes_timeseries(data.likes);
                                                      aw_api_ppm_stm_chart_generate_posts_timeseries(data.posts);

                                                  }
                                               }
              };
  aw_api_ppm_stm_chart_srv_make_full_request(params);
}

/*************************************************************/
/*
 *
 *input => 
 *  {
 *    chart_box_id : '',
 *    title  : '',
 *    max_zoom_days: '',
 *    vertical_name: '',
 *    horizontal_name: '',
 *    start_year: Int,
 *    start_month: Int,
 *    start_day: Int,
 *    arr: [], //Integer array with a value for each day
 *  }
 *
 */
function aw_api_ppm_stm_chart_timeseries_chart(series_data){
  var chart = new Highcharts.Chart({
					chart: {
						renderTo: series_data.chart_box_id,
						zoomType: 'x',
						spacingRight: 20
					},
				    title: {
						text:  series_data.title
					},
				    subtitle: {
						text: document.ontouchstart === undefined ?
							'Click and drag in the plot area to zoom in' :
							'Drag your finger over the plot to zoom in'
					},
					xAxis: {
						type: 'datetime',
						maxZoom: series_data.max_zoom_days * 24 * 3600000, // fourteen days
						title: {
							text: null
						}
					},
					yAxis: {
						title: {
							text: series_data.vertical_name
						},
						min: 0.6,
						startOnTick: false,
						showFirstLabel: false
					},
					tooltip: {
						shared: true					
					},
					legend: {
						enabled: false
					},
					plotOptions: {
						area: {
							fillColor: {
								linearGradient: [0, 0, 0, 300],
								stops: [
									[0, Highcharts.getOptions().colors[0]],
									[1, 'rgba(2,0,0,0)']
								]
							},
							lineWidth: 1,
							marker: {
								enabled: false,
								states: {
									hover: {
										enabled: true,
										radius: 5
									}
								}
							},
							shadow: false,
							states: {
								hover: {
									lineWidth: 1						
								}
							}
						}
					},
				
					series: [{
						type: 'area',
						name: series_data.horizontal_name,
						pointInterval: 24 * 3600 * 1000,
						pointStart: Date.UTC(series_data.start_year, 
                                 series_data.start_month,
                                 series_data.start_day),
						data: series_data.arr
					}]
				});

}

/*********************************************************************/
/*
 * Input Format dd/mm/yyyy
 *
 */
function aw_parse_date(date_str){
  var date_fields = date_str.split("/");
  var ret_date = new Date("20" + date_fields[2],parseInt(date_fields[0]) -1, date_fields[1], "01" );
  //date.setUTCMonth(parseInt(date_fields[0]));
  return ret_date;

}

/*********************************************************************/
/*
 * Difference in days
 *
 */
function aw_get_days_difference(date_old, date_new){
   return ( date_new - date_old )/(1000*60*60*24);
}

/**********************************************************************/
/*
 *
 *
 */
function aw_api_convert_date_wise_series_to_chartable_array(data_map, cb_fn){
  var last_date;
  var last_val = 0;
  var current_date;
  var current_val = 0;
  var start_date;
  var resp_arr = [];
  $.each(data_map, function(date_str, fields_hash) { 
    current_date = aw_parse_date(date_str);
    if( last_date ){
      var days = aw_get_days_difference(last_date, current_date);
      if( days > 1){
        var i = 0;
        for( i=1; i<days; i++){
          resp_arr.push(last_val);            
        }
        current_val = cb_fn(fields_hash);
        resp_arr.push(current_val);            
      }else{
        current_val = cb_fn(fields_hash);
        resp_arr.push(current_val);    
      }
    }else{
      current_val = cb_fn(fields_hash);
      resp_arr.push(current_val);    
      start_date = current_date;
    }

    last_date = current_date;
    last_val = current_val;
    
  });
  var resp_hash={
                  start_year: parseInt(start_date.getUTCFullYear()),
                  start_month: parseInt(start_date.getUTCMonth()),
                  start_day: parseInt(start_date.getDate()),
                  arr: resp_arr
                };

 return resp_hash;

}
