/**********************************************************/
/*
 *
 *
 */

var aw_js_service_tester = [ 
                              { 
                                name: 'technology',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 100,
                                                        comments: 20,
                                                        likes: 15
                                                      },
                                            twitter: {
                                                        retweets: 20,
                                                        replies: 15
                                                     }
                                          }
                              },
                              { 
                                name: 'sports',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 20,
                                                        comments: 6,
                                                        likes: 17
                                                      },
                                            twitter: {
                                                        retweets: 18,
                                                        replies: 123
                                                     }
                                          }
                              },
                              { 
                                name: 'arts',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 78,
                                                        comments: 13,
                                                        likes: 16
                                                      },
                                            twitter: {
                                                        retweets: 65,
                                                        replies: 25
                                                     }
                                          }
                              },
                              { 
                                name: 'entertainment',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 63,
                                                        comments: 42,
                                                        likes: 31
                                                      },
                                            twitter: {
                                                        retweets: 24,
                                                        replies: 542
                                                     }
                                          }
                              },
                              { 
                                name: 'world',
                                id: 102,
                                services: {
                                            facebook: {
                                                        shares: 112,
                                                        comments: 321,
                                                        likes: 21
                                                      },
                                            twitter: {
                                                        retweets: 23,
                                                        replies: 123
                                                     }
                                          }
                              }
                                               
                                                
                          ];

/****************************************************/
/*
 *
 *
 */
function aw_api_model_service_pouplarity_initialize(){
  /* make a get call to server */
  aw_api_view_service_popularity_render(aw_js_service_tester);
}


