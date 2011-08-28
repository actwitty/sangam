
 function create_and_add_box(id){
   alert("Entry to create_add_box");

   var html = "<h3>Into the Create And Add Box</h3>";

   id.append(html);

   alert("Into the Create and add box");
 }


 function custom_box_effects(fb_box){
    alert("In Custom Box Effects");
    create_and_add_box($('#fb_box')); 
 }


$(document).ready(function(){
  //$("#y").append("Hello");
  get_all_facebookers(); 
  
  $("ul.p-cstab1 li").click(function() {

  $(".tab_content").hide(); //Hide all tab content
      /* Remove active from all tabs */
  $("ul.p-cstab1 li").removeClass("active");
  $(this).addClass("active"); //Add "active" class to selected tab
      
  var tab_id = $(this).attr("id");
  if(tab_id == "invite_tab_head"){
       //alert("invite");
       //get_all_facebookers(); 
	append_invite_friends();
  }
  else if(tab_id == "follow_tab_head"){
	//alert("follow");
	append_follow_friends();
  }
  else{
	//alert("unfollow");
	append_unfollow_friends();
  }

 
      var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
      $(activeTab).fadeIn(); //Fade in the active ID content
      return false;
  });
 
});
