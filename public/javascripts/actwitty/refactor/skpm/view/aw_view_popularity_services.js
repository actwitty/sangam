
/***************************************************************/
/*
 *
 *
 */
var aw_js_topic_adjective = {
                              
                                  animals: "Animal Lover",
                                  arts: "Artist",
                                  automobiles: "Roadie",
                                  books: "Reader",
                                  business: "Money maker",
                                  education: "Learner",
                                  entertainment: "Enjoying",
                                  food: "Foodie",
                                  games: "Gamer",
                                  health: "Healthy",
                                  hobbies: "Hobbyist",
                                  home: "Family Person",
                                  leisure: "Chilling",
                                  nonprofits: "Philanthropist",
                                  places: "Traveller",
                                  products: "Shopoholic",
                                  sports: "Sporty",
                                  stories:  "Friendly",
                                  technology: "Techie",
                                  politics:  "Knowledgeable"


                             };                             
/***************************************************************/
/*
 *
 *
 */
var aw_js_service_color_codes = {
                                   facebook: "aw_service_color_facebook",
                                   twitter: "aw_service_color_twitter"
                                };
var aw_js_service_logo = {
                                   facebook: "/images/actwitty/refactor/aw_common/fb1.png",
                                   twitter: "/images/actwitty/refactor/aw_common/tw1.png",
                                };                            
var aw_js_service_label = {
                                   facebook: "Facebookers",
                                   twitter: "Twitterati"
                                };                                

function aw_view_get_markings(count){
  var html = '<div class="aw_service_topic_popularity_top" /> ' +
             '<div class="aw_service_topic_popularity_bottom" /> ';
  if ( count == 2){
    html = html + '<div class="aw_service_topic_popularity_middle" /> ';
  }else if ( count == 3){
    html = html + '<div class="aw_service_topic_popularity_one_third" /> ';
    html = html + '<div class="aw_service_topic_popularity_two_third" /> ';
  }

  return html;
}
/***************************************************************/
/*
 *
 *
 */
function aw_view_get_topic_labels(interests){
  var html = "";
  var count = interests.length; 
  if( count == 3){
    html = '<div class="aw_service_topic_popularity_container_labels">' +
                '<div class="aw_service_popularity_1_of_3">' +
                  '<div class="aw_service_popularity_adjective_for_3">' +
                      interests[0].name +
                      //aw_js_topic_adjective[interests[0].name] +
                  '</div>' +
                  /*
                  '<div class="aw_service_popularity_topic_for_3">' +
                      'for ' + interests[0].name +
                  '</div>' +
                  */
                '</div>' +

                '<div class="aw_service_popularity_2_of_3">' +
                  '<div class="aw_service_popularity_adjective_for_3">' +
                      //aw_js_topic_adjective[interests[1].name] +
                      interests[1].name +
                  '</div>' +
                  /*
                  '<div class="aw_service_popularity_topic_for_3">' +
                      'for ' + interests[1].name +
                  '</div>' +
                  */
                '</div>' +

                '<div class="aw_service_popularity_3_of_3">' +
                  '<div class="aw_service_popularity_adjective_for_3">' +
                      //aw_js_topic_adjective[interests[2].name] +
                      interests[2].name +
                  '</div>' +
                  /*
                  '<div class="aw_service_popularity_topic_for_3">' +
                      'for ' + interests[2].name +
                  '</div>' +
                  */
                '</div>' +
           '</div>';
  }else if(count == 2){
    html =  '<div class="aw_service_topic_popularity_container_labels">' +
                '<div class="aw_service_popularity_1_of_2">' +
                  '<div class="aw_service_popularity_adjective_for_2">' +
                      //aw_js_topic_adjective[interests[0].name] +
                      interests[0].name +
                  '</div>' +
                  /*
                  '<div class="aw_service_popularity_topic_for_2">' +
                      'for ' + interests[0].name +
                  '</div>' +
                  */
                '</div>' +
                '<div class="aw_service_popularity_2_of_2">' +
                  '<div class="aw_service_popularity_adjective_for_2">' +
                      //aw_js_topic_adjective[interests[1].name] +
                      interests[1].name +
                  '</div>' +
                  /*
                  '<div class="aw_service_popularity_topic_for_2">' +
                      'for ' + interests[1].name +
                  '</div>' +
                  */
                '</div>' +

           '</div>';
  }else if( count = 1){
    html =  '<div class="aw_service_topic_popularity_container_labels">' +
                '<div class="aw_service_popularity_1_of_1">' +
                  '<div class="aw_service_popularity_adjective">' +
                      //aw_js_topic_adjective[interests[0].name] +
                      interests[0].name +
                  '</div>' +
                  /*
                  '<div class="aw_service_popularity_topic">' +
                      'for ' + interests[0].name +
                  '</div>' +
                  */
                '</div>' +
           '</div>';
  }else{
    return "";
  }
  return html;
}
/***************************************************************/
/*
 *
 *
 */
function aw_view_get_topic_popularity_html(service_name, interests){
   var html = "";

   html = html + '<div class ="aw_service_topic_popularity_container" >' +
                    
                     '<div class="aw_service_topic_poularity_box ' + aw_js_service_color_codes[service_name] + '">' +
                     '</div>' +
                     '<img class="aw_service_popularity_service_logo" src="'+aw_js_service_logo[service_name]+'">'+
                     '<img class="aw_service_popularity_man" src="/images/actwitty/refactor/aw_sketch/service_popularity/man.png" />' +
                      aw_view_get_markings(interests.length) + 
                  '</div>';
   return html;  
}
/***************************************************************/
/*
 *
 *
 */
function aw_api_view_service_popularity_render(data){
  var html = "";
  $.each(data, function(key, service) {
     html = html + '<div class="aw_service_popularity_container" >' +
                      aw_view_get_topic_popularity_html(service.name, service.interests) +
                      aw_view_get_topic_labels(service.interests) +
                   '</div>';
  });

  $("#aw_js_service_popularity_box").html(html);
}
