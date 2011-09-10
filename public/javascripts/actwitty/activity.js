/*
 * Home page input activities related jqueries
 * Purpose: to satisfy all the activity input box features
 *          (1).32 characters length
 *          (2).No space allowed
 *          (3).only english characters
 *          (4).auto suggest
 */


//Discard digits from input text box
function numeric(txt)
{
		txt = txt.replace(/[0-9]*/g, "");
		return txt;
}
//Discard Spaces from input text box
function space(txt)
{
		txt = txt.replace(/\s/g, "");
		return txt;
}
//Discard Below Symbols from input text box
function symbol(txt)
{
	txt = txt.replace(/[?#$!\@\%&.,]*/g, "");
	return txt;
}


function trimNotAllowedChar(txt)
{
  txt = txt.replace(/[^a-z0-9A-Z]/g,'');
  return txt;
}

function limit_text(id,limit,info)
{
		var text = $('#' + id).val();
		var original = text;
		text = numeric(text);	
	  text = space(text);	
		text = symbol(text);
    //text = trimNotAllowedChar(txt);
		$('#' + id ).val(text);

		var textlength = text.length;
    if(textlength > limit)
  		 $('#' + id).val(text.substr(0,limit));
    /*else
       $('#' + info).val(limit - textlength);
    */
}



 //$(function() {
$(document).ready(function() {
    //alert("My activity box is connected to autocomplete");
    // Below is the name of the textfield that will be autocomplete
    /*
    var data = "Core Selectors Attributes Traversing Manipulation CSS Events Effects Ajax Utilities".split(" ");
    $("#activity_field").autocomplete(data);
    $("#activity_field").autocomplete({
        source: ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby"] 
    });
    */
    $('#activity_field').autocomplete({
            // This shows the min length of charcters that must be 
            // typed before the autocomplete looks for a match.
            minLength: 1,
            // This is the source of the auocomplete suggestions. 
            // In this case a list of names from the people controller, in JSON format.
            //source: '/activity_words/activity_word_list',
            source: '/activities/top_activities',
            // This updates the textfield when you move the updown the suggestions list, 
            // with your keyboard. In our case it will reflect the same value that you 
            // see in the suggestions which is the person.given_name.
            focus: function(event, ui) {
                $('#activity_field').val(ui.item.name);
                return false;
            },
            // Once a value in the drop down list is selected, do the following:
            select: function(event, ui) {
                // place the person.given_name value into the textfield called 'select_origin'...
                $('#activity_field').val(ui.item.name);
                // and place the person.id into the hidden textfield called 'link_origin_id'. 
                //$('#link_origin_id').val(ui.item.person.id);
                return false;
            }
        })
        // The below code is straight from the jQuery example. 
        // It formats what data is displayed in the dropdown box, and can be customized.
        .data( "autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li></li>" )
                .data( "item.autocomplete", item )
                 // For now which just want to show the person.given_name in the list.
                .append( "<a>" + item.name + "</a>" )
                .appendTo( ul );
        };
        
        // to keep the activity field of 20 char size
        // has been binded to both keyup and blur to take care of copy/paste masters
        $('#activity_field').bind('keyup blur',function(){
           		limit_text('activity_field', 20, 'activity_field_remlen');
	      });
        $("#activity_field").keypress(function(e) {
            if(e.which < 97 /* a */ || e.which > 122 /* z */) {
                e.preventDefault();
            }
        });


});

