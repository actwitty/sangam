

$(document).ready(function(){
      //alert("Inside profile_people.js ready");
      $('#all_followers').click(function() { 
          $( "#follower-dialog-modal" ).attr("title", "Manage followers");
          $( "#follower-dialog-modal" ).empty();                                       
          $( "#follower-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });      
          get_all_followers();
      });

         
     $('#all_followings').click(function() {
          $( "#follower-dialog-modal" ).attr("title", "Manage followings");
          $( "#following-dialog-modal" ).empty();                                       
          $( "#following-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });  
          get_all_followings();
     });

     $('#all_facebookers').click(function() {
          $( "#facebook-dialog-modal" ).attr("title", "Manage facebook");
          $( "#facebook-dialog-modal" ).empty();                                       
          $( "#facebook-dialog-modal" ).dialog({
			                                  height: 500,
                                        width: 800,
			                                  modal: true
		                                  });              
          //get_all_facebookers();
     });


  }); /* ready ends here */


  

