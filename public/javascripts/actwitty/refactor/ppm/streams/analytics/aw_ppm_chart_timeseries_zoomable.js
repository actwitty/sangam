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
