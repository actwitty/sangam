

$(document).ready(function(){
      $('#all_channels').click(function() { 
          $( "#channel-dialog-modal" ).attr("title", "Select a channel filter");
          $( "#channel-dialog-modal" ).empty();                                       
          $( "#channel-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });                                  
          get_all_channels();
      });

     $('#all_things').click(function() {
          var html= '<p>' +
                      'THINGS' +
                    '</p>';
          $( "#thing-dialog-modal" ).empty();                                       
          $( "#thing-dialog-modal" ).append(html);                                
          $( "#thing-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });              
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
     });


  }); /* ready ends here */


  

