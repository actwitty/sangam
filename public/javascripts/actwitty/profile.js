/*
 * Home page activities related jqueries
 *
 */



function append_recent(id){
}


$(document).ready(function(){
    var owner_id=$('#page_owner_id').attr("value");
    var populated_personal=false;
    var populated_friends=false;
    var populated_recent=false;

    if(populated_personal == false){
      var personal_summaries_count = parseInt($('#personal_count').val());
      append_personal_summary(owner_id, personal_summaries_count);
      populated_personal=true;
    }
    
    $("#sub_filter_tabs").tabs({cache: true,
        select: function(event, ui) {
          if(ui.panel.id == "Personal"){
              if(populated_personal == false){
                var personal_summaries_count =  parseInt($('#personal_count').val());
                append_personal_summary(owner_id, personal_summaries_count);
                populated_personal=true;
              }
          }else{
            
            if(ui.panel.id == "Friends"){
              if(populated_friends == false){
                var friend_summaries_count = parseInt($('#friend_count').val());
                append_friends_summary(owner_id, friend_summaries_count);
                populated_friends=true;
              }
            }else if(ui.panel.id == "Recent"){
              if(populated_recent == false){
                append_recent(owner_id);
                populated_recent=true;
              }
            }
            
          }
        }
    });   


    $('#more_personal').click(function() {
      if(populated_personal == true){
        var personal_summaries_count =  parseInt($('#personal_count').val());
        append_personal_summary(owner_id, personal_summaries_count);
      }
    });

    $('#more_friends').click(function() {
      if(populated_friends == true){
        var friends_summaries_count = parseInt($('#friend_count').val());
        append_friends_summary(owner_id, friends_summaries_count);
      }
    });


  

  }); /* ready ends here */


  

