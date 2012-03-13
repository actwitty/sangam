/************************************************/
/* TEST JSON */
var aw_trends_test_json =   [ 
                                  {
                                        id: 101,
                                        title: "this week",
                                        /* interests in descending order */
                                        interests: [
                                                        {
                                                           interest_id: 101, 
                                                           name: "technology",
                                                           category: "technology",
                                                           percent: 30
                                                        },
                                                        {
                                                           interest_id: 102, 
                                                           name: "stories",
                                                           category: "stories",
                                                           percent: 20
                                                        },
                                                        {
                                                           interest_id: 101, 
                                                           name: "business",
                                                           category: "business",
                                                           percent: 15
                                                        },
                                                       {
                                                           interest_id: 0, 
                                                           name: "entertainment",
                                                           category: "entertainment",
                                                           percent: 35
                                                        },
                                                   ],
                                     },
                                  {
                                        id: 102,
                                        title: "last week",
                                        /* interests in descending order */
                                        interests: [
                                                       {
                                                          interest_id: 101, 
                                                          name : "sports",
                                                          category: "sports",
                                                          percent: 50
                                                       },
                                                       {
                                                          interest_id: 102, 
                                                          name: "entertainment",
                                                          category: "entertainment",
                                                          percent: 30
                                                       },
                                                       {
                                                           interest_id: 101, 
                                                           name: "world",
                                                          category: "world",
                                                           percent: 20
                                                        },

                                                  ],
                                    },
                                     {
                                        id: 103,
                                        title: "two weeks back",
                                        /* interests in descending order */
                                        interests: [
                                                        {
                                                           interest_id: 101, 
                                                           name: "sports",
                                                          category: "sports",
                                                           percent: 37
                                                        },
                                                        {
                                                           interest_id: 102, 
                                                           name: "entertainment",
                                                          category: "entertainment",
                                                           percent: 23
                                                        },
                                                        {
                                                           interest_id: 0, 
                                                           name: "other",
                                                          category: "other",
                                                           percent: 50
                                                        },
                                                   ],
                                     },
                                      {
                                        id: 104,
                                        title: "nearly a month back",
                                        /* interests in descending order */
                                        interests: [
                                                        {
                                                           interest_id: 101, 
                                                           name: "sports",
                                                           category: "sports",
                                                           percent: 50
                                                        },
                                                        {
                                                           interest_id: 102, 
                                                           name: "entertainment",
                                                           category: "entertainment",
                                                           percent: 50
                                                        },
                                                   ],
                                     }
                                 ];
/*************************************************/
/*
 *
 *
 */
function aw_api_model_trends_fetch_data(){
    $.ajax({
            url: "/home/get_analytics_timeline",
            type: 'GET',
            data: {
                    user_id : aw_js_global_visited_user_credentials.id,
                    rest : 2 
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (timeline_data) {
              var trend_data = [];
              var week_json   = {};
              var trend_data = timeline_data.trends;
              $.each( trend_data, function( week_key, week_data ){
                //var time = ('' + week_data.start_date).replace(/-/g,"/").replace(/[TZ]/g," ");
                var interests = [];
                var title = week_data.start_date;
                var cumulative_total = 0;

                if( week_data.weeks.services){
                  $.each( week_data.weeks.services, function( service_name, count){
                    cumulative_total += count;
                  });
                }

                if( week_data.weeks.topics && cumulative_total) {
                  $.each(week_data.weeks.topics, function( interest_name, data){
                  
                    if( week_data.weeks.topics[interest_name].posts &&
                          week_data.weeks.topics[interest_name].posts.counts &&
                            week_data.weeks.topics[interest_name].posts.counts.total ){
                            var interest_json = {
                                                  interest_id: week_data.weeks.topics[interest_name].summary_id,
                                                  name: interest_name,
                                                  category: interest_name,
                                                  percent: (week_data.weeks.topics[interest_name].posts.counts.total * 100)/cumulative_total

                                                };
                            interests.push(interest_json);

                    }
                  });
                      

                  week_json = { 
                              'title' : title,
                              'interests' : interests
                            };   

                  trend_data.push(week_json);
                }
  
              });             
              //aw_api_controller_render_trends(time_line_data);
              aw_api_controller_render_trends(trend_data);
              aw_api_modal_handle_service_popularity(timeline_data.popularity);
            },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
              aw_api_controller_render_trends([]);
              aw_api_modal_handle_service_popularity(null);
              aw_lib_console_log("error",
                              "aw_api_model_trends_fetch_data:  Server request failed for " + request_tag 
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });
}
/*************************************************/
/* 
 * 
 *
 *
 */
function aw_api_model_trends_initialize(){
  /* make a get call to server */
  aw_api_model_trends_fetch_data();

}


/*************************************************/
/*
 *
 *
 */

