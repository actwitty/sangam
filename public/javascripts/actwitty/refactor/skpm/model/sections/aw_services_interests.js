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
                                                                     name: "sports",
                                                                     id: 102
                                                                  },
                                                                  {
                                                                     name: "entertainment",
                                                                     id: 103
                                                                  },
                                                                  {
                                                                     name: "politics",
                                                                     id: 104
                                                                  },  
                                                               ]
                                                  
                                               },
                                               {
                                                  name: "twitter",
                                                  interests : [
                                                                  {
                                                                     name: "sports",
                                                                     id: 102
                                                                  },
                                                                  {
                                                                     name: "technology",
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


