
/**************************/
var document_pre_uploaded_handling_json={};
function add_preuploaded_doc(id, url_val, thumb_url_val, caption_val){ 
  document_pre_uploaded_handling_json[id] = {
                                              url:url_val,
                                              thumb_url:thumb_url_val,
                                              caption:caption_val
                                            };

                                                
}


function remove_preuploaded_doc(id){ 
  delete document_pre_uploaded_handling_json[id];
                                                
}

function get_preuploaded_doc(){
  return document_pre_uploaded_handling_json;
}
/***************************/
function append_pre_uploaded_docs(docs){
  $.each(docs.array, function(i, attachment){
    var caption="";
    if(attachment.caption){
      caption = attachment.caption;
    }

    add_preuploaded_doc(attachment.id, attachment.url, attachment.thumb_url, caption);
    var id = 'preuploaded_' + attachment.id;
    var caption_id = id + '_caption';
    var remove_id = id + '_remove';
    var html = '<div id="' + id + '" class="pre_uploaded_image" >'  +
                  '<img src="' + attachment.thumb_url + '"  />' +
                  '<input type="text" value="' + attachment.caption + '" id="' + caption_id + '" class="js_perupload_caption preupload_caption_class"/>' +
                  '<a  id="' + remove_id + '" class="js_perupload_remove preupload_remove_class">Remove</a>' +
               '</div>';

    $("#pre_uploaded_docs").append(html);

  });
}

function populate_to_input(post_json){

  /* location */
  if(post_json.location){
    //$("#user_latlng").val();
    //$("#input_latlang").val();
    //
    if(post_json.location.name != undefined){
      $('#location_field').val(post_json.location.name);
      $("#geo_location").val(post_json.location.name);
    }

    if(post_json.location.type != undefined){
      $("#location_type").val(post_json.location.type);
    }
    if(post_json.location.lat != undefined){
      $("#lat_value").val(  '' + post_json.location.lat);
    }

    if(post_json.location.long != undefined){
      $("#lng_value").val( '' + post_json.location.long);
    }
  }
  
  /* text */
  $('#entity_field').val(post_json.post.text);
  /* title */ 
  $('#title_field').val(post_json.post.sub_title);
  /* channel */
  $('#activity_field').val(post_json.post.word.name);
  change_max_file_that_can_be_uploaded(post_json.documents.count * -1);
  append_pre_uploaded_docs(post_json.documents);

  
}

function init_edit_box(){
  $(".close.page_input_close").hide();
  $(".input-whats-up").hide();
  $(".home_page_inputs").show();
  var post_id = $("#post_id").val();
  alert(post_id); 
  $.ajax({
        url: '/home/get_single_activity.json',
        type: 'GET',
        dataType:"json",
        cache: true,
        data: {
                activity_id:post_id
              },
        success: function (data) {
          // if rails demands a redirect because of log in missing 
           document_pre_uploaded_handling_json={};
           alert(JSON.stringify(data)); 
           $.each(data, function(i,post_json){
            if( post_json ){
                populate_to_input(post_json);
            } 
          });

        },
        error:function(XMLHttpRequest,textStatus, errorThrown) {
            alert('There has been a problem getting post. \n ActWitty is trying to solve.');
        }
    });

 
}

$(document).ready(function() {
 $(".js_perupload_remove").live("click",function(){
      alert("Remove:" + $(this).attr("id"));
      alert(JSON.stringify(document_pre_uploaded_handling_json));
      delete document_pre_uploaded_handling_json[$(this).parent().attr("id")];
      $(this).parent().empty().remove();
      alert(JSON.stringify(document_pre_uploaded_handling_json));

  });
  
  $(".js_perupload_caption").live("change", function(){
      alert("Text:" + $(this).attr("id"));
      remove_preuploaded_doc(id);
      alert(JSON.stringify(document_pre_uploaded_handling_json));
  });
});
