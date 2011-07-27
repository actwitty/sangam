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
 *  [location][geo_location]=
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

/*
 * clear all boxes
 */
function clear_all_boxes(){
  $('#location_field').val("");
  $('#lat_value').val("");
  $('#geo_location').val("");
  $('#location_field').val("");
  $('#activity_field').val("");
  $('#entity_field').val("");
}


/* get location string based on the type of location
 * Type 1: Geo Location
 * Type 2: URL
 * Type 3: Other
 *
 *
 */
function get_location_string(){
  
  var location_type = $('#location_type').val();
  var location_string=""; 
  if(location_type == '1')
  {
     location_string = '&location[geo_location][geo_latitude]=' + $('#lat_value').val() +
                       '&location[geo_location][geo_longitude]=' + $('#lng_value').val() +  
                       '&location[geo_location][geo_name]=' + encodeURIComponent($('#geo_location').val());

            
  }
  else if (location_type == '2')
  {

    location_string = '&web_location[location_field][geo_latitude]=' + encodeURIComponent($('#location_field').val()) +
                      '&web_location[web_location_title][geo_longitude]=' + "hello";
  }
  else if (location_type == '3')
  {
    location_string = '&unresolved_location[unresolved_location_name]=' + encodeURIComponent($('#location_field').val());
  }
  
  return location_string;
}

function post_activity_to_server(post_data){
   $.ajax({
        url: '/home/create_activity.json',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        cache: true,
        success: function (data) {
          clear_all_boxes();
          alert('A new post has been added.');
        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem in creating activity. \n ActWitty is trying to solve.');
        }
    });
}


$(document).ready(function() {
   $("#actwitty_generator").click(function() {
      if(!$('#activity_field').val() && !$('#location_field').val() &&
        !$('#entity_field').val()){
        alert("Nothing set to generate a post");
        return false;
      }

          

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
      
      var post_activity="";
      if(!$('#activity_field').val()){
        post_activity = "shared";
      }else{
        post_activity = $('#activity_field').val();
      }
      var data_string = "word=" +  encodeURIComponent(post_activity) +
                       "&text=" + encodeURIComponent($('#entity_field').val()) + 
                       "&enrich=true" +
                       "&authenticity_token=" + encodeURIComponent(AUTH_TOKEN) +
                       get_location_string();
                         
      post_activity_to_server(data_string);

      return false;

   });


   
     
     
 
    
   

  });
