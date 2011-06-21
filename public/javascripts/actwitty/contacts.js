$(function() {
      $.getJSON("contacts/facebook_friends_list",function(data){
         $.each(data.items, function(i,item){
            alert (i);
         };
      });
    });


