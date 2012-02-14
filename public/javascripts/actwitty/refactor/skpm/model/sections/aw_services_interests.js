/**********************************************************/
/*
 *
 *
 */

var aw_js_service_tester = [ 
                                              {
                                                  name: "facebook",
                                                  interests : [
                                                                  {
                                                                     name: "technology",
                                                                     id: 102
                                                                  },
                                                                  {
                                                                     name: "stories",
                                                                     id: 103
                                                                  },
                                                                  {
                                                                     name: "entertainment",
                                                                     id: 104
                                                                  },  
                                                               ]
                                                  
                                               },
                                               {
                                                  name: "twitter",
                                                  interests : [
                                                                  {
                                                                     name: "business",
                                                                     id: 102
                                                                  },
                                                                  {
                                                                     name: "sports",
                                                                     id: 106
                                                                  },
                                                                  
                                                               ]
                                                  
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


