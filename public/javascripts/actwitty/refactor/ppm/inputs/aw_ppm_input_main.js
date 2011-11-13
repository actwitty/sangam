/*
 * Purpose: jQuery to post to input data.
 *          This file will take inputs from location.js, activity.js and entity.js input values.
 *          Pack them into json and send it to controller.
 *          So this is where the click to SUBMIT-POST should happen
 *          
 *
 */



var document_upload_handling_json={};
var thumb_upload_handling_json={};
var document_caption_cache={};
var documents_to_upload_count=0;
var campaigns_manager={};
campaigns_manager["Like"] = true;

function set_campaign_status(campain_type, state){
  campaigns_manager[campain_type] = state;
}

function get_campaign_status(campain_type){
  if( campaigns_manager[campain_type] ){
    return campaigns_manager[campain_type];
  }
  return false;
}

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
  
  var aw_js_ppm_input_hidden_location_type = $('#aw_js_ppm_input_hidden_location_type').val();
  
  if(aw_js_ppm_input_hidden_location_type == '1')
  {
    return {
             geo_location : {
                    geo_latitude : $('#aw_js_ppm_input_hidden_lat_value').val(), 
                    geo_longitude : $('#aw_js_ppm_input_hidden_lng_value').val(), 
                    geo_name : $('#aw_js_ppm_input_hidden_geo_location').val()} 
           };
  }
  else if (aw_js_ppm_input_hidden_location_type == '2')
  {
    return {
             web_location : {
                    web_location_url : $('#aw_js_ppm_input_location_name').val(), 
                    web_location_title : "hello"} 
           };
  }
  else if ((aw_js_ppm_input_hidden_location_type == '3') ||  (aw_js_ppm_input_hidden_location_type == '4'))
  {
    return {
            unresolved_location : {
                    unresolved_location_name : $('#aw_js_ppm_input_location_name').val()}
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
function clear_all_input_jsons(){
  

  document_upload_handling_json={};
  thumb_upload_handling_json={};
  document_caption_cache={};
  documents_to_upload_count=0;
  g_max_files_that_can_be_uploaded = 5;
  g_status_of_post=2;

}




/* get location string based on the type of location
 * Type 1: Geo Location
 * Type 2: URL
 * Type 3: Other
 *
 *
 */
function get_location_string(){
  
  var aw_js_ppm_input_hidden_location_type = $('#aw_js_ppm_input_hidden_location_type').val();
  var location_string=""; 
  if(aw_js_ppm_input_hidden_location_type == '1')
  {
     location_string = '&location[geo_location][geo_latitude]=' + $('#aw_js_ppm_input_hidden_lat_value').val() +
                       '&location[geo_location][geo_longitude]=' + $('#aw_js_ppm_input_hidden_lng_value').val() +  
                       '&location[geo_location][geo_name]=' + encodeURIComponent($('#aw_js_ppm_input_hidden_geo_location').val());

            
  }
  else if (aw_js_ppm_input_hidden_location_type == '2')
  {

    location_string = '&web_location[bocation_field][geo_latitude]=' + encodeURIComponent($('#aw_js_ppm_input_location_name').val()) +
                      '&web_location[web_location_title][geo_longitude]=' + "hello";
  }
  else if (aw_js_ppm_input_hidden_location_type == '3')
  {
    location_string = '&unresolved_location[unresolved_location_name]=' + encodeURIComponent($('#aw_js_ppm_input_location_name').val());
  }
  
  return location_string;
}
/*
 *
 *
 */

function aw_input_box_reset_after_post(){

  $('#aw_js_ppm_input_hidden_user_latlng').val("");
  $('#aw_js_ppm_input_hidden_lng_value').val("");
  $('#aw_js_ppm_input_hidden_lat_value').val("");
  $('#aw_js_ppm_input_hidden_geo_location').val("");
  $('#aw_js_ppm_input_location_name').val("");
  $('#aw_js_ppm_input_channel_name').val("");
  $('#aw_js_ppm_input_post_text').val("");
  $('#aw_js_ppm_input_hidden_title').val("");

  $("#aw_js_ppm_input_location_name").hide();
  $("#aw_js_ppm_show_hide_location").attr("src", "/images/actwitty/refactor/aw_ppm/common/location_gray.png");

  $("#aw_js_ppm_input_add_attachment_partial").hide();
  $("#aw_js_ppm_show_hide_attachment").attr("src", "/images/actwitty/refactor/aw_ppm/common/attachment_gray.png");

  $("#awppm_input_box").hide();
  $("#awppm_input_box_activate").show();

}

/*
 *
 *
 */
function aw_api_srv_resp_ppm_input_create_post(params){
    aw_input_box_reset_after_post();
    clear_all_input_jsons();
     $(".aw_js_ppm_ip_input_box").find(".aw_js_ppm_loading_animation").hide();
}
 
/*
 *
 *
 */
function post_activity_to_server(post_data){

 $(".aw_js_ppm_ip_input_box").find(".aw_js_ppm_loading_animation").show();
 var params = {
                  'aw_srv_protocol_params' : post_data,
                  'aw_srv_protocol_cookie' : {}
               };
 aw_api_srv_make_a_post_request('AW_SRV_PPM_CMN_CREATE_POST', params); 
}

$(".js_plupload_caption").live('change', function(){	
  var id = $(this).attr('id');
  document_caption_cache[id] = $(this).val();

});

function get_caption_value(id){
  if (document_caption_cache[id]){
    return document_caption_cache[id];
  }else{
    return "";
  }

}

function add_document_to_json(id, url_val, caption_val){
  var document_json = { url:url_val, caption:caption_val};
  document_upload_handling_json[id] = document_json;
}


function add_document_thumb_to_json(id, thumb_url_val){
  var thumb_json = { url:thumb_url_val};
  thumb_upload_handling_json[id] = thumb_json;
}

function document_set_pending_upload_count(count_to_upload){
  documents_to_upload_count=count_to_upload;
}


function get_documents_json(){
  var doc_arr = Array();
  for (var key in document_upload_handling_json) {
    document_upload_handling_json[key].thumb_url = thumb_upload_handling_json[key].url;
    doc_arr.push(document_upload_handling_json[key]);
  }
  /* handle the case for the preuploaded images */
  var preuploaded_docs=get_preuploaded_doc(); 
  for (var key in preuploaded_docs) {
    doc_arr.push(preuploaded_docs[key]);
  }
  /*************************************************/
  return doc_arr;
}

function get_campaigns(){
  var campaigns = 1;
  for (var key in campaigns_manager) {
    if ( key == "Like" ){
      campaigns |= 1;
    }else if (key == "Support" ){
      campaigns |= 2;
    }else if(key == "Join" ){
      campaigns |= 4;
    }
  }
  return campaigns;
}

/*
  :word => activity word or phrase in activity box  [MANDATORY]
  :text =>   ""entity box + @@ + location box" or nil [OPTIONAL]
  :location => {
                    :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
                                        OR
                    :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
                                        OR
                    :unresolved_location =>{:unresolved_location_name => "xyxzw"}
                                        OR
                                       nil
                   } [OPTIONAL]
  
  :documents => [{:caption => "abcd", :thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg",
                     :url => "https://s3.amazonaws.com/xyz.jpg" } ]#caption and thumb_url is optional in document
                    [OPTIONAL]
  
  :campaign_types => 1 to 7  #  Need to set by client. At present each bit represent on campaign type.
                           bit 0 => like, bit 1=>support,bit 2=> :join  #defualt is 1 ( like).
                          Check CAMPAIGN_TYPES in constant.yml
                          [MANDATORY]
  
  :status => 0 or 1   # 0 => saved, 1 => public share, #default => 1
                          #Need to set by client.
                          Check STATUS in constant.yml
                          [MANDATORY]
  
  :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
                    or custom email or mobile number #defualt is actwitty. Need to set by client.
                        Check SOURCE_NAME in constant.yml
                        [MANDATORY]
  
  :sub_title => "hello sudha baby" or nil. Need to set by client.
                       [OPTIONAL]
  
  :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
                  [MANDATORY]
 */
function document_upload_complete(){
  aw_lib_console_log("debug","document_upload_complete called"); 
  var latlang = document.getElementById('aw_js_ppm_input_hidden_user_latlng').value;
  /* check if the location field is empty then set type as user input */
  if($('#aw_js_ppm_input_location_name').val() == "")
  {
      $('#aw_js_ppm_input_hidden_location_type').val('4');
  }
  /* 
   * check if the geolocation field set from google map is same as in the location field then 
   * set type as geolocation 
   */
  else if($('#aw_js_ppm_input_hidden_geo_location').val() == $('#aw_js_ppm_input_location_name').val())
  {
     $('#aw_js_ppm_input_hidden_location_type').val('1');
  }
  else
  {
    /* if location field is set as url */
    if($('#aw_js_ppm_input_location_name').val().match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/))
    {
      $('#aw_js_ppm_input_hidden_location_type').val('2');
    }
    /* else set it as other type*/
    else
    { 
      $('#aw_js_ppm_input_hidden_location_type').val('3');
    }
  }
      
  var post_activity="";
  if(!$('#aw_js_ppm_input_channel_name').val()){
      post_activity = "shared";
  }else{
      post_activity = $('#aw_js_ppm_input_channel_name').val();
  }
   
  var post_json = { 
                    word : post_activity,
                    summary_category: $("#aw_js_ppm_input_channel_category").val(),
                    text : $('#aw_js_ppm_input_post_text').val(),
                    enrich : true,
                    location:get_location_json(),
                    documents:get_documents_json(),
                    campaign_types:get_campaigns(),
                    source_name:"actwitty",
                    sub_title:$('#aw_js_ppm_input_hidden_title').val(),
                    status:get_generate_status(),
                  };

   
  //alert(JSON.stringify(post_json));
  post_activity_to_server(post_json);

}
/***************************************/
var g_status_of_post=2;
function set_generate_status(status){
  g_status_of_post = status;
}

function get_generate_status(){
  return g_status_of_post;
}
/***************************************/
var g_max_files_that_can_be_uploaded = 5;
function get_max_file_that_can_be_uploaded(){
  return g_max_files_that_can_be_uploaded;
}

function change_max_file_that_can_be_uploaded(change_count){
  get_max_file_that_can_be_uploaded += change_count;
}
/***************************************/

/*******************************************************************************/
$(document).ready(function() {
   /* get user channels from rails */
  
   $("#aw_js_ppm_input_post_btn").live('click', function(){
      if(!$('#aw_js_ppm_input_channel_name').val() && !$('#aw_js_ppm_input_location_name').val() &&
        !$('#aw_js_ppm_input_post_text').val()){
        alert("Nothing set to generate a post");
        return false;
      }
      set_generate_status(2);
      /* trigger upload */
      if(documents_to_upload_count > 0){
        $('#uploader_start').trigger('click');  
      }else{
          /* nothing to wait for */
         document_upload_complete();
      }
      
      return false;

   });

   
   /* to make sure that only alphanumeric characters are allowed in activity field*/
  $("#aw_js_ppm_input_channel_name").alphanumeric();


   /*******************************************************************************/
  $("#aw_js_ppm_show_hide_attachment").click(function(){
    if( $("#aw_js_ppm_input_add_attachment_partial").is(":visible") ) {
      $("#aw_js_ppm_input_add_attachment_partial").hide();
      $(this).attr("src", "/images/actwitty/refactor/aw_ppm/common/attachment_gray.png");
    }
    else{
      $("#aw_js_ppm_input_add_attachment_partial").show();
      $(this).attr("src", "/images/actwitty/refactor/aw_ppm/common/attachment.png");
    }
  });

  /*******************************************************************************/
  $("#aw_js_ppm_show_hide_location").click(function(){
    if( $("#aw_js_ppm_input_location_name").is(":visible")){
       $("#aw_js_ppm_input_location_name").hide();
       $(this).attr("src", "/images/actwitty/refactor/aw_ppm/common/location_gray.png");
    }else{
       $("#aw_js_ppm_input_location_name").show();
       $(this).attr("src", "/images/actwitty/refactor/aw_ppm/common/location.png");
    }
  });

  /*******************************************************************************/
  $("#awppm_input_box_activate").click(function () {
      $(this).hide();
      $("#awppm_input_box").show();
    });

  /*******************************************************************************/
  $("#awppm_del_ipbox").click(function () {
      $("#awppm_input_box").hide();
      $("#awppm_input_box_activate").show();
    });
  /*******************************************************************************/
   
});
