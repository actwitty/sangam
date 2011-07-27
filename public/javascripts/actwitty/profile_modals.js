

$(document).ready(function(){
      var page_owner_id=$('#page_owner_id').attr("value");
      //alert("Inside profile_modals.js ready");
      $('#all_channels').click(function() { 
          $( "#channel-dialog-modal" ).attr("title", "Select a channel filter");
          $( "#channel-dialog-modal" ).empty();                                       
          $( "#channel-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });                                  
          get_all_channels(page_owner_id);
      });

     $('#all_things').click(function() {

          $( "#thing-dialog-modal" ).attr("title", "Select a thing filter");
          $( "#thing-dialog-modal" ).empty();                                       
          $( "#thing-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });  
          get_all_things(page_owner_id);
     });
    
     $('#all_locations').click(function() {
          var html= '<p>' +
                      'LOCATION' +
                    '</p>';
          $( "#location-dialog-modal" ).empty();                                       
          $( "#location-dialog-modal" ).append(html);                                
          $( "#location-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });   
           get_all_locations(page_owner_id);
     });


  }); /* ready ends here */


  

