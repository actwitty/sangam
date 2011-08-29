
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

    if(attachment.uploaded == false){
      return;
    }
    if(attachment.caption){
      caption = attachment.caption;
    }
    add_preuploaded_doc(attachment.id, attachment.url, attachment.thumb_url, caption);
    var id = 'preuploaded_' + attachment.id;
    var caption_id = id + '_caption';
    var remove_id = id + '_remove';
    var html = '<div class="p-preuploaded-images-on-input" >' +
                  '<div class="p-preuploaded-delete-cntrl js_preupload_remove" id="' + attachment.id + '" >' +
                  '</div>' +
                  '<div class="p-preload-image-data" >' + 
                    '<div class="preupload-image"> ' +
                      '<img src="' + attachment.thumb_url + '" width=60 />' +
                    '</div>' +
                  
                    '<div class="p-preupload-caption">' +
                      '<input type="text" value="' + attachment.caption + '" id="' + caption_id + '" class="js_perupload_caption " />' +
               
                    '</div>' +
                  '</div>' +
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
  if(post_json.post.text){
    $('#entity_field').val(post_json.post.text);
  }
  /* title */ 
  if(post_json.post.sub_title){
    $('#title_field').val(post_json.post.sub_title);
  }
  /* channel */
  if(post_json.post.word.name){
    $('#activity_field').val(post_json.post.word.name);
  }
  change_max_file_that_can_be_uploaded(post_json.documents.count * -1);
  append_pre_uploaded_docs(post_json.documents);

  
}

function init_edit_box(post_id){
  
  reset_to_default();
  clear_all_input_jsons();
  $("#pre_uploaded_docs").empty();
  $(".add-page-input").hide();
  $(".home_page_inputs").show();
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
           //alert(JSON.stringify(data)); 
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
 $(".js_preupload_remove").live("click",function(){
      delete document_pre_uploaded_handling_json[$(this).parent().attr("id")];
      $(this).parent().empty().remove();

  });
  
  $(".js_perupload_caption").live("change", function(){
      remove_preuploaded_doc(id);
  });
});
