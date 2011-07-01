

$(document).ready(function(){
      $('#all_followers').click(function() { 
          var html= '<p>' +
                      'FOLLOWERS' +
                    '</p>';
          $( "#follower-dialog-modal" ).empty();                                       
          $( "#follower-dialog-modal" ).append(html);                                
          $( "#follower-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });                                  
      });

     $('#all_followings').click(function() {
          var html= '<p>' +
                      'FOLLOWINGS' +
                    '</p>';
          $( "#following-dialog-modal" ).empty();                                       
          $( "#following-dialog-modal" ).append(html);                                
          $( "#following-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });              
     });

     $('#all_facebookers').click(function() {
          var html= '<p>' +
                      'FACEBOOKS' +
                    '</p>';
          $( "#facebook-dialog-modal" ).empty();                                       
          $( "#facebook-dialog-modal" ).append(html);                                
          $( "#facebook-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });              
     });


  }); /* ready ends here */


  

