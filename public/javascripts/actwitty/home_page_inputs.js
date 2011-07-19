/*
 * Purpose: jQuery to post to input data.
 *          This file will take inputs from location.js, activity.js and entity.js input values.
 *          Pack them into json and send it to controller.
 *          So this is where the click to SUBMIT-POST should happen
 *          
 *
 */







/* get location json based on the type of location
 * Type 1: Geo Location
 * Type 2: URL
 * Type 3: Other
 *
 * :location => {
 *      :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
 *       OR
 *      :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
 *       OR
 *      :unresolved_location =>{:unresolved_location_name => "http://google.com"}
 *       OR
 *      nil
 *  }
 *
 */
function get_location_json(){

  var location_type = $('#location_type').val();
  
  if(location_type == '1')
  {
    return {
             geo_location : {
                    geo_latitude : $('#lat_value').val(), 
                    geo_longitude : $('#lng_value').val(), 
                    geo_name : $('#geo_location').val()} 
           };
  }
  else if (location_type == '2')
  {
    return {
             web_location : {
                    web_location_url : $('#location_field').val(), 
                    web_location_title : "hello"} 
           };
  }
  else if (location_type == '3')
  {
    return {
            unresolved_location : {
                    unresolved_location_name : $('#location_field').val()}
           };
  }
  else
  {
    return nil;
  }

}



$(document).ready(function() {
  
   $("#actwitty_generator").click(function() {
      alert("sad");   
      var latlang = document.getElementById('user_latlng').value;
      /* check if the location field is empty then set type as user input */
      if($('#location_field').val() == "")
      {
           alert("Nothing entered by user!!!!");
           $('#location_type').val('3');
      }
      /* 
       * check if the geolocation field set from google map is same as in the location field then 
       * set type as geolocation 
       */
      else if($('#geo_location').val() == $('#location_field').val())
      {
          $('#input_latlang').val($('#user_latlng').val());	
          $('#location_type').val('1');
          alert($('#geo_location').val());
          alert("seems to be a location with positions as:" + $('#lat_value').val() + "  " + $('#lng_value').val());	
      }
      else
      {
           /* if location field is set as url */
           if($('#location_field').val().match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/))
           {
               $('#location_type').val('2');
               alert("seems to be an url");
            }
            /* else set it as other type*/
            else
            { 
                $('#location_type').val('3');
                alert("Seems to be something of user's interest");
            }
       }


       var post_data = 
       {
          word :$('#activity_field').val(),
          text :$('#entity_field').val() + "@@" + $('#location_field').val(),
          location_type : get_location_json()
       };
      
      alert(post_data);
      var dataString = JSON.stringify(post_data);
      alert(dataString); 

   });


   
      /* 
      $.ajax({
	        url: "/testingjson/latlng",
	        dataType: "json",
	        type: "POST",
	        processData: false,
	        contentType: "application/json",
 
          data: dataString,
 
	        beforeSend: function(xhr)   
	        {
		        xhr.setRequestHeader("X-Http-Method-Override", "PUT");
	        }
      });
      */
     
 
    
   

  });
