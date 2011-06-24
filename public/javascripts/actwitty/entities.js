/*
 * Home page friends related jqueries
 *
 */

/*
 * Render entities 
 */
function renderEntities(json){
  $.each(json, function(i,entity){
      if( entity){
        var html ='<li id=' + entity.id  +  ' class="user_stamp">' +
                    '<img src="' + entity.image + '" alt="" class="img_stamp user_stamp entity_list" id="' + entity.id + '">' +
                           entity.name + '  (' + entity.count + ')' +  
                    '</img>'+
                  '</li>';
        $('#entities_side_list').append(html);
          
      }
  });

  $('#entities_side_title').text('All (' +  $('#entities_side_list li').size() + ') Entities' );
}


/*
 * Invoke on page load
 */
$(document).ready(function(){

    /*
     * Get data on ready
     */
    $.ajax({
        url: '/entities/top_entities',
        type: 'GET',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          /* if rails demands a redirect because of log in missing */
          if (data && data.location) {
            window.location.href = data.location;
          }else{
            renderEntities(data);
          }
          //TODO: try to use this in search, why should search hit server, again and again
        },
        error: function (error) {

        }
    });


   


    /********************************************************************************************/
    /** General functions to support auto complete based search **/
    function format(entity) {
		  return '<img alt="" class="img_stamp user_stamp" src="'+ entity.image + '">   ' + entity.name + "</img>";
	  }

    function getID(entity){
      return entity.id;
    }

    /********************************************************************************************/
    /*
     * Friends search
     */
	  $("#search_entities").autocomplete('/entities/top_entities', {
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
        //$("#content").append("<p>selected " + format(item) + "</p>");
        alert('Clicked ' + getID(item));
    });

    /********************************************************************************************/

});


/********************************* READY ENDS HERE ******************************************/
/*
 * Click on entity
 */
$('.entity_list').live('click', function () { 
    alert($(this).attr('id'));
});


