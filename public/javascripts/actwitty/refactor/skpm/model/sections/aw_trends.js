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
 * List of services which will be polled to generate
 * static profile
 *
 */
function aw_api_model_trends_initialize(){
  /* make a get call to server */

  aw_api_controller_render_trends(aw_trends_test_json);
}


/*************************************************/
/*
 *
 *
 */

