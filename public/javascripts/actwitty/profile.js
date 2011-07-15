/*
 * Home page activities related jqueries
 *
 */






$(document).ready(function(){
    var page_owner_id=$('#page_owner_id').attr("value");
    var session_owner_id=$('#session_owner_id').attr("value");
    var default_tab = $('#default_page_mode').attr("value");
    var populated_personal=false;
    var populated_friends=false;
    var populated_stream=false;
   
    $("#sub_filter_tabs").tabs({cache: true,
        select: function(event, ui) {
          if(ui.panel.id == "Personal"){
              if(populated_personal == false){
                append_personal_summary(page_owner_id);
                populated_personal=true;
              }
          }else{
            
            if(ui.panel.id == "Friends"){
              if(populated_friends == false){
                append_friends_summary(page_owner_id);
                populated_friends=true;
              }
            }else if(ui.panel.id == "Stream"){
              if(populated_stream == false){
                //append_stream(page_owner_id);
                populated_stream=true;
              }
            }
            
          }
        }
    });  
    
    if(default_tab.length > 0 && default_tab =='filtered'){
      var last_tab =  $('#sub_filter_tabs ul').tabs().size();
      $('#sub_filter_tabs').tabs('select', (last_tab - 1));
      if(populated_stream == false){
        //append_friends_summary(page_owner_id);
        populated_stream=true;
      }
    }else{
      $('#sub_filter_tabs').tabs('select', 0);
      append_personal_summary(page_owner_id);
      populated_personal=true;
    }


    $('#more_personal').click(function() {
      if(populated_personal == true){
        append_personal_summary(page_owner_id);
      }
    });

    $('#more_friends').click(function() {
      if(populated_friends == true){
        append_friends_summary(page_owner_id);
      }
    });

     $('#more_streams').click(function() {
      if(populated_stream == true){
        var streams_count = parseInt($('#stream_count').val());
        append_friends_summary(page_owner_id, streams_count);
      }
    });


 

  }); /* ready ends here */


  

