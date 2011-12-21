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
