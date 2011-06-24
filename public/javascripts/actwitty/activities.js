/*
 * Home page activities related jqueries
 *
 */

/*
 * Render activities 
 */
function renderActivities(json){
  //TODO: this may need fixing
  //$.each(json, function(i,activity_data){
      //if( user_data && user_data.user){
  $.each(json, function(i,activity){
      if( activity){
        var html ='<li id=' + activity.id  +  ' class="user_stamp">' +
                    '<label  class="activities_sidebar" id="' + activity.id + '">' +
                      activity.name + '  (' + activity.count + ')' +
                    '</label>'+ 
                  '</li>';
        $('#activities_side_list').append(html);
          
      }
  });

  $('#activities_side_title').text('All (' +  $('#activities_side_list li').size() + ') Activities' );
}



$(document).ready(function(){

    var activities_json=null;
    /*
     * Get data on ready
     */
    $.ajax({
        url: '/activities/top_activities',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderActivities(data);
          }
          //TODO: try to use this in search, why should search hit server, again and again
          activities_json=data;
        },
        error: function (error) {

        }
    });


    /********************************************************************************************/
    function format(activity) {
		  return activity.name;
	  }

    function getID(activity){
      return activity.id;
    }
    /********************************************************************************************/

	  $("#search_activities").autocomplete('/activities/top_activities', {
		  multiple: false,
      //cacheLength:1000,
		  dataType: "json",
        parse: function(data) {
        return $.map(data, function(row) {
          return {
            data: row,
            value: row.name,
            result: row.name
          }
        });
      },
      formatItem: function(item) {
        return format(item);
      }
    }).result(function(e, item) {
        alert( 'Activity ID seen is ' +  getID(item));
    });

  

});
/********************************* READY ENDS HERE ******************************************/

$('.activities_sidebar').live('click', function () { 
    alert('clicked ' + $(this).attr('id'));   
});
