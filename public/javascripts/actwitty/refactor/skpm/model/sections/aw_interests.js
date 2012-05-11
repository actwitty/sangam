/************************************************/
/* TEST JSON */
var aw_interest_test_json =     [ 
                                        {
                                          interest_id: 101,
                                          name: "entertainment",
                                          category: "entertainment",
                                          video: 0,
                                          image: 100,
                                          post: 10,
                                          link: 10,
                                          location: 15,
                                          mention: 21,
                                          services: [
                                                      {
                                                        name: "facebook",
                                                        share: 10
                                                      },
                                                      { name: "twitter",
                                                        share: 90}
                                                    ]
                                                          
                                        },
                                        {
                                          interest_id: 102,
                                          name: "sports",
                                          category: "sports",
                                          percentage: 10,
                                          video: 12,
                                          image: 88,
                                          post: 8888,
                                          link: 131,
                                          location: 15,
                                          mention: 21,
                                          services: [
                                                     { name: "facebook",
                                                       share: 100}
                                                    ]
                                        },
                                         {
                                          interest_id: 102,
                                          name: "games",
                                          category: "games",
                                          percentage: 10,
                                          video: 0,
                                          image: 245,
                                          post: 11,
                                          link: 0,
                                          location: 54,
                                          mention: 17,
                                          services: [
                                                     { name: "twitter",
                                                       share: 100}
                                                    ]
                                        },
                                        {
                                          interest_id: 102,
                                          name: "nonprofits",
                                          category: "nonprofits",
                                          percentage: 10,
                                          video: 0,
                                          image: 89,
                                          post: 34,
                                          link: 0,
                                          location: 3,
                                          mention: 190,
                                          services: [
                                                      {
                                                        name: "facebook",
                                                        share: 50
                                                      },
                                                      { name: "twitter",
                                                        share: 50}
                                                    ]
                                        }



                                    ];
/************************************************/
/*
 *
 *
 */
var aw_local_interest_data_json = [];
var aw_local_total_posts = 0;
/*************************************************/
/*
 *
 *
 */
function aw_api_model_interests_process_interest_data(data) {
  var rank = 1;
  $.each(data, function( index, summary){
    var interest_data =  {
                              interest_id: 0,
                              name: "Unknown",
                              category: "Unknown",
                              video: 0,
                              image: 0, 
                              post: 0, 
                              link: 0,
                              effort_rank: 0,
                              location: 0,
                              mention: 0, 
                              services: [], 
                              analytics:{}
                         };
     
    interest_data.interest_id = summary.id;
    interest_data.effort_rank = rank;
    rank++;

    if( summary.word ){
      interest_data.name =  summary.word.name;
    }

    if( summary.category_id ){
      interest_data.category =  summary.category_id;
    }
    
    if( summary.detail ){
      interest_data.detail = summary.detail;
    }
    if( summary.analytics_snapshot ){
      interest_data.analytics = summary.analytics_snapshot;
      /******************* post ************************/
      if( summary.analytics_snapshot.posts ){  

        if( summary.analytics_snapshot.posts &&
            summary.analytics_snapshot.posts.counts &&
            summary.analytics_snapshot.posts.counts.total ){
          interest_data.post =  summary.analytics_snapshot.posts.counts.total; 
          aw_local_total_posts += summary.analytics_snapshot.posts.counts.total;
        }
        if( summary.analytics_snapshot.posts.counts.services ){
          $.each(summary.analytics_snapshot.posts.counts.services, 
              function(service_name, post_count){
            var service = { 
                              name: service_name,
                              share: (post_count/interest_data.post)*100
                            };
            interest_data.services.push(service);
          });
        }

      }
      
      /**************** documents **********************/
      if( summary.analytics_snapshot.documents &&
          summary.analytics_snapshot.documents.counts &&
          summary.analytics_snapshot.documents.counts.categories ){

        if(summary.analytics_snapshot.documents.counts.categories.video
              && summary.analytics_snapshot.documents.counts.categories.video.total){
            interest_data.video = summary.analytics_snapshot.documents.counts.categories.video.total;
        }

        if(summary.analytics_snapshot.documents.counts.categories.image
              && summary.analytics_snapshot.documents.counts.categories.image.total){
            interest_data.image = summary.analytics_snapshot.documents.counts.categories.image.total;

          }

        if( summary.analytics_snapshot.documents.counts.categories.link
              && summary.analytics_snapshot.documents.counts.categories.link.total){
          interest_data.link = summary.analytics_snapshot.documents.counts.categories.link.total;

        }
      }

      /**************** mentions **********************/
      if( summary.analytics_snapshot.entities &&
            summary.analytics_snapshot.entities.counts &&
              summary.analytics_snapshot.entities.counts.total){
        interest_data.mention = summary.analytics_snapshot.entities.counts.total;
      }

      /**************** location **********************/
      if( summary.analytics_snapshot.locations &&
            summary.analytics_snapshot.locations.counts &&
              summary.analytics_snapshot.locations.counts.total){
        interest_data.location = summary.analytics_snapshot.locations.counts.total;
      }

    }

    aw_local_interest_data_json.push(interest_data);
  });
  aw_api_controller_render_interests(aw_local_interest_data_json);
}
/*************************************************/
/*
 *
 *
 */
function aw_api_model_interests_server_request(){
  if( aw_js_global_user_interests ){
      aw_api_model_interests_process_interest_data(aw_js_global_user_interests);
  }
  $.ajax({

            url: "/home/get_summary.json",
            type: 'GET',
            data: { 
                    user_id :  aw_js_global_visited_user_credentials.id,
                    cache : aw_js_global_visited_user_credentials.cache_time
                  },
            dataType: 'json',
            contentType: 'application/json',
            success:function(data){
              aw_api_model_interests_process_interest_data(data)
            },error:function(XMLHttpRequest,textStatus, errorThrown){ 
            aw_lib_console_log("error",
                              "aw_api_model_interests_server_request:  Server request failed for " 
                              +  " error: " + errorThrown + " status:" + textStatus);   
        }
    });
}

/*************************************************/
/* 
 * List of services which will be polled to generate
 * static profile
 *
 */
function aw_api_model_interests_initialize(){
  /* make a get call to server */
  aw_local_total_posts = 0;
  aw_local_interest_data_json = [];
  aw_api_model_interests_server_request();
  //TEST STUB
  //aw_api_controller_render_interests(aw_interest_test_json);
}


