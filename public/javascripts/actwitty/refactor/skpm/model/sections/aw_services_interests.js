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
                                                     }
                                          }
                              }
                                               
                                                
                          ];
/****************************************************/
/*
 *
 *
 */
function aw_api_modal_handle_service_popularity(timeline_data){
  var popularity_data = [];
  var populated = false;
  if( timeline_data ) {

    var keys = [];
    for (i in timeline_data) { keys.push(i); }


    $.each( keys.reverse(), function( index, week_key ){
      week_data = timeline_data[week_key];
      alert(JSON.stringify(week_data));
      if( week_data &&
            week_data.weeks &&
              week_data.weeks.topics ){


        $.each( week_data.weeks.topics, function( interest_name, interest_data ){
          if(interest_data.source_actions){

            var interest = {
                              name : interest_name,
                              id : interest_data.summary_id,
                              services: {}
                            };
            if( interest_data.source_actions.counts &&
                  interest_data.source_actions.counts.actions){
              $.each(interest_data.source_actions.counts.actions, 
                            function( action_name, action_data ){

                  if( action_data.services ){
                    $.each( action_data.services, function( service_name, count ){
                      if( !interest.services[service_name] ){
                        interest.services[service_name] = {};
                      }

                      interest.services[service_name][action_name] = count;
                      populated = true;
                    });
                  }

              });


            }
            popularity_data.push(interest);
          }
        });
      }

      if( populated )
        return false; /* break after first*/
            
    });
    aw_api_view_service_popularity_render(popularity_data);
  }
}
/****************************************************/
/*
 *
 *
 */
function aw_api_model_service_pouplarity_initialize(){
  /* make a get call to server */
}


