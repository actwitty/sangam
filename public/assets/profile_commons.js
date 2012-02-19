/***********************************************/
/*
 *
 *
 */
var aw_local_more_cookie_manager={};

/***********************************************/
/*
 *
 *
 */
function aw_api_ppm_cmn_more_cookie_set(key, value){
  aw_local_more_cookie_manager[key] = value;
}


/***********************************************/
/*
 *
 *
 */
function aw_api_ppm_cmn_more_cookie_get(key){
  if( aw_local_more_cookie_manager[key]){
    return  aw_local_more_cookie_manager[key];
  }else{
    return '';
  }

}


/****************************************************************/
/*
 *
 *
 */
function aw_get_currently_active_search_mode(){
  return $("input:radio[name=aw_js_ppm_top_search_type]:checked").val();
}
/****************************************************************/
/*
 *
 *
 */
 function aw_get_search_autocompelte_format(data){
  return data.name;
 }

/****************************************************************/
/* UNUSED FUNCTION
 *
 *
 */
function aw_api_srv_resp_ppm_cmn_header_render_search_any(params){

  var autocomplete_json = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  alert(JSON.stringify(params));
  /* register this only when JSON is ready */
  $("#aw_js_ppm_header_search_text").autocomplete(autocomplete_json, {
     	  minChars: 0,
		    matchContains: true,
		    highlightItem: false,
        formatItem: function(data) {
          return aw_get_search_autocompelte_format(data);
        }
      }).result(function(event, item) {
      });

}
/****************************************************/
/* UNUSED FUNCTION
 *
 *
 */
function aw_ppm_cmn_header_request_data_for_autocomplete(){
  
  var search_type = aw_get_currently_active_search_mode();
  var search_name = element.val();
  alert(search_type);
  var params = {
                  'aw_srv_protocol_params' : {  
                                                type: search_type, 
                                                name: search_name
                                            },
                  'aw_srv_protocol_cookie' : {
                                             }
               };

    aw_api_srv_make_a_get_request('AW_SRV_PPM_CMN_SEARCH_ANY_TYPE',  params);

}
/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_html(item){
  var current_mode = aw_get_currently_active_search_mode();
  var html = '';
  if(current_mode == 'user'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_img_box" >' +
                '<img class="awppm_search_autocomplete_img" src="' + item.image + '" width="25px" height="25px" />' +               
              '</div>' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/user.png" />' + 
              '</div>' +
           '</div>';
           
  }else if(current_mode == 'channel'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/channel.png" />' + 
              '</div>' +
           '</div>';
  }else if(current_mode == 'location'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/location.png" />' + 
              '</div>' +
           '</div>';
  }else if(current_mode == 'entity'){
    html = '<div class="awppm_search_autocomplete_box" >' +
              '<div class="awppm_search_img_box" >' +
                '<img class="awppm_search_autocomplete_img" src="' + item.image + '" width="25px" height="25px" />' +               
              '</div>' +
              '<div class="awppm_search_name_box" >' +
                '<span class="awppm_search_autocomplete_name">' +
                  item.name +
                '</span>' +
              '</div>' +
              '<div class="awppm_search_type_box" >' +
                '<img class="awppm_search_autocomplete_mode_img" src="/images/actwitty/refactor/aw_ppm/common/autocomplete/mention.png" />' + 
              '</div>' +
           '</div>';
  }
  return html;

}
/********************************************************************************/
/*
 *
 *
 */
function aw_get_autocomplete_result_click(item){
  var current_mode = aw_get_currently_active_search_mode();
  var link = "#";
  if( item && item.id){
    if(current_mode == 'user'){
      var link = '/home/show?id=' + item.id;
    }else if (current_mode == 'channel'){
      var link = '/channel_page?id=' + item.id;
    }else if (current_mode == 'location'){
      var link = '/location_page?id=' + item.id;
    }else if (current_mode == 'entity'){
      var link = '/mention_page?id=' + item.id;
    }
    window.location.href = link; 
  }

}
/*******************************************************************************/
/*
 *
 *
 */
function aw_register_search_any_autocomplete(){
  $("#aw_js_ppm_header_search_text").autocomplete(
            "/home/search_any.json?type=" + aw_get_currently_active_search_mode(), 
            {
		          multiple: false,
              minChars: 3,
              autoFill: true,
              max: 8,
              mustMatch: true,
		          dataType: "json",
              parse: function(data){
                 return $.map(data, function(item) {
                    return { data: item, value: item.name, result: item.href };
                 });
              },
              formatItem: function(item) {
                 return aw_get_autocomplete_html(item);
                }
              }).result(function(e, item) {
                aw_get_autocomplete_result_click(item);
              });
}

/*******************************************************************************/
/*
 *
 *
 */
$(document).ready(function() {
  $("#aw_js_ppm_header_search").click(function () {
    if($("#aw_js_ppm_search_box").is(":visible")){
      $("#aw_js_ppm_search_box").hide();
      $(this).css("background-image", "url(/images/actwitty/refactor/aw_ppm/common/search_inactive.png)");  
    }else{
      $("#aw_js_ppm_search_box").show();
      $(this).css("background-image", "url(/images/actwitty/refactor/aw_ppm/common/search.png)"); 
    }
    $("#aw_js_ppm_header_search_text").val("");
    $("#aw_js_ppm_header_search_ppl").attr("checked", true);
    $("#aw_js_ppm_header_search_chn").attr("checked", false);
    $("#aw_js_ppm_header_search_locations").attr("checked", false);
    $("#aw_js_ppm_header_search_mentions").attr("checked", false);
    aw_register_search_any_autocomplete();
    return false;
  });
  
  $("#aw_js_ppm_header_user_image_click").click(function () {
    $("#awppm_header_options_menu").slideToggle();
    return false;
  });

  $("input:radio[name=aw_js_ppm_top_search_type]").click(function() {
    var value = $(this).val();
    $("#aw_js_ppm_header_search_text").val("");
  });
  
  $(".aw_js_ppm_cmn_search_radio_click").click(function(){
    aw_register_search_any_autocomplete(); 
  });
 
  aw_register_search_any_autocomplete(); 

 

});




/*
 * Purpose: (1)To fetch the geo location from google map api's.
 *          (2)To update the hidden fields for getting right location type
 *
 */

var autocomplete, map;
var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));

function aw_api_ppm_input_geo_location_initialize() {
  if( !$('#aw_js_map').length ){
    return;
  }
  map = new google.maps.Map(document.getElementById('aw_js_map'));
  map.setMapTypeId('roadmap');
  map.fitBounds(defaultBounds);

  var input = document.getElementById('aw_js_ppm_input_location_name');
  var options = {
    boxStyle: { border: "1px solid black", opacity: 0.75, width:"40px" }
  };
  autocomplete = new google.maps.places.Autocomplete(input, options);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker();
  marker.setMap(map);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);  // Why 17? Because it looks good.
    }
    var image = new google.maps.MarkerImage(
      place.icon, new google.maps.Size(71, 71),
      new google.maps.Point(0, 0), new google.maps.Point(17, 34),
      new google.maps.Size(100, 100));
    marker.setIcon(image);
    marker.setPosition(place.geometry.location);

    var address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
         place.address_components[0].short_name || ""),
        (place.address_components[1] &&
         place.address_components[1].short_name || ""),
        (place.address_components[2] &&
         place.address_components[2].short_name || "")].join(" ");
    }
    infowindow.setContent(
      '<div><b>actwitty ' + place.name + '</b><br>'
      + address);
    infowindow.open(map, marker);


    /*document.getElementById('map123').style.display = 'block';
    document.getElementById('map321').style.display = 'block'; 
    document.getElementById('map123').innerHTML = "Lat =" + map.getCenter().lat() + "Long=" + map.getCenter().lng();
    document.getElementById('map321').innerHTML = place.geometry.location;
    */
    document.getElementById('aw_js_ppm_input_hidden_user_latlng').value = place.geometry.location;
    document.getElementById('aw_js_ppm_input_hidden_lat_value').value = map.getCenter().lat();
    document.getElementById('aw_js_ppm_input_hidden_lng_value').value = map.getCenter().lng();
    document.getElementById('aw_js_ppm_input_hidden_geo_location').value = document.getElementById('aw_js_ppm_input_location_name').value;
    

  });

  google.maps.event.addListener(map, 'bounds_changed', function() {
    autocomplete.setBounds(map.getBounds());
  });
}

function changeType(value) {
  autocomplete.setTypes(value ? [value] : []);
}


/* Calling initialize function to invoke google maps api   */
$(window).load(aw_api_ppm_input_geo_location_initialize);

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
 *      :lat => 23.6567, :long => 120.3, :name => "sj"
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
                    lat : $('#aw_js_ppm_input_hidden_lat_value').val(),
                    long : $('#aw_js_ppm_input_hidden_lng_value').val(),
                    name : $('#aw_js_ppm_input_hidden_geo_location').val()}
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
     location_string = '&location[geo_location][lat]=' + $('#aw_js_ppm_input_hidden_lat_value').val() +
                       '&location[geo_location][long]=' + $('#aw_js_ppm_input_hidden_lng_value').val() +
                       '&location[geo_location][name]=' + encodeURIComponent($('#aw_js_ppm_input_hidden_geo_location').val());

            
  }
  else if (aw_js_ppm_input_hidden_location_type == '2')
  {

    location_string = '&web_location[bocation_field][lat]=' + encodeURIComponent($('#aw_js_ppm_input_location_name').val()) +
                      '&web_location[web_location_title][long]=' + "hello";
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

  $("#aw_js_ppm_category_hide").hide();

  $("#awppm_input_box").hide();
  $("#awppm_input_box_activate").show();

}

/*
 *
 *
 */
function aw_api_srv_resp_ppm_input_create_post(params){
    var post_resp_json = aw_api_srv_resp_data_for_post_request('AW_SRV_PPM_CMN_CREATE_POST');
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
                   :lat => 23.6567, :long => 120.3, :name => "sj"

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
  
  var fb_share = "false";
  var tw_share = "false"
  if ( $("#aw_js_ppm_fb_share").val() == "on" ){
    fb_share = "true";
  }

  if ( $("#aw_js_ppm_fb_share").val() == "on" ){
    tw_share = "true";
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
                    fb: fb_share,
                    tw: tw_share,
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
/*************************************************/
/*
 *
 *
 */
function aw_ppm_input_fetch_new_stream(new_post_id){
   var params = {
                    'aw_srv_protocol_params' : {  
                                                  id: new_post_id
                                              },
                    'aw_srv_protocol_cookie' : {
                                               }
                 };
   aw_api_srv_make_a_get_request('AW_SRV_PPM_INPUT_RESP_GET_NEW_POST',  params);
}
/************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_input_get_new_stream(params){
  var data = aw_awpi_serv_resp_data_for_get_request_in_params(params); 
  $.each(data, function(i,stream_info){
    if( stream_info ){
      if(get_current_page_context() == 'profile_stm_page'){
        var aw_chn_filter_id = aw_api_ppm_stm_get_chn_filter_id();
        if(aw_chn_filter_id.length == 0 || aw_chn_filter_id == stream_info.word.id){
          aw_api_srv_add_new_stream(stream_info);
        }
      }
    } 
  });

}
/*************************************************/
/*
 * TODO: Add code to handle this once rails support is added
 *
 */
function aw_ppm_input_fetch_new_summary(summary_id){
  /*do nothing*/
    if(get_current_page_context() == 'profile_chn_page'){
    /*  var params = {
                    'aw_srv_protocol_params' : {  
                                                  post_id: new_post_id, 
                                              },
                    'aw_srv_protocol_cookie' : {
                                               }
                 };
      aw_api_srv_make_a_post_request('AW_SRV_PPM_INPUT_RESP_GET_NEW_CHN',  params);*/
    }
}
/*************************************************/
/*
 *
 *
 */
function aw_api_srv_resp_ppm_input_get_new_channels(params){
}



var aw_local_users_channels_data = {
                                      'cats' :       {'category':'animals'},
                                      'dogs' :       {'category':'animals'},
                                      'hamsters' :   {'category':'animals'},
                                      'fish' :       {'category':'animals'},
                                      'mice' :       {'category':'animals'},
                                      'birds' :       {'category':'animals'},
                                      'snakes' :       {'category':'animals'},
                                      'AnimalCare' :       {'category':'animals'},
                                      'RareSpecies' :       {'category':'animals'},
                                      'ExtinctSpecies' :       {'category':'animals'},
                                      'zoo' :       {'category':'animals'},
                                      'WildLife' :       {'category':'animals'},

                                      'painting' :      {'category':'arts'},
                                      'drawing' :       {'category':'arts'},
                                      'bouquet' :       {'category':'arts'},
                                      'papercraft' :       {'category':'arts'},
                                      'knitting' :       {'category':'arts'},
                                      'JweleryMaking' :       {'category':'arts'},
                                      'Crochet' :       {'category':'arts'},
                                      'Photoshop' :       {'category':'arts'},
                                      'MacroShots' :       {'category':'arts'},
                                      'NaturePhotography' :       {'category':'arts'},
                                      'CameraAndLenses' :       {'category':'arts'},
                                      'AbstractArt' :       {'category':'arts'},
                                      'Pottery' :       {'category':'arts'},
                                      'Handicraft' :       {'category':'arts'},
                                      'Floristry' :       {'category':'arts'},
                                      'WoodCarving' :       {'category':'arts'},
                                      'Sculpting' :       {'category':'arts'},
                                      'ArtSelling' :       {'category':'arts'},
                                      'ArtCollection' :       {'category':'arts'},
                                      'Dancing' :       {'category':'arts'},


                                      'Books' :         {'category':'books'},
                                      'Reading' :         {'category':'books'},
                                      'BookLending' :         {'category':'books'},
                                      'Library' :         {'category':'books'},
                                      'ComicBooks' :         {'category':'books'},
                                      'FictionBooks' :         {'category':'books'},
                                      'Memoirs' :         {'category':'books'},
                                      'OnlineBooks' :         {'category':'books'},
                                      'KindleBooks' :         {'category':'books'},
                                      'SpritualBooks' :         {'category':'books'},
                                      'MotivationalBooks' :         {'category':'books'},
                                      'PoetryBooks' :         {'category':'books'},
                                      'ReligiousBooks' :         {'category':'books'},
                                      'DIYBooks' :         {'category':'books'},
                                      'TechnicalBooks' :         {'category':'books'},
                                      'Essays' :         {'category':'books'},
                                      'SchoolBooks' :         {'category':'books'},
                                      'Literature' :         {'category':'books'},
                                      'HumorousBooks' :         {'category':'books'},
                                      'HorrorBooks' :         {'category':'books'},
                                      
                                      'Business' :      {'category':'business'},
                                      'Startups' :      {'category':'business'},
                                      'Startups' :      {'category':'business'},
                                      'Buying' :      {'category':'business'},
                                      'Sold' :      {'category':'business'},
                                      'Own' :      {'category':'business'},
                                      'StockMarkets' :      {'category':'business'},
                                      'NYSE' :      {'category':'business'},
                                      'BSE' :      {'category':'business'},
                                      'OnlineTrading' :      {'category':'business'},
                                      'BusinessNews' :      {'category':'business'},

                                      'Cars' :           {'category':'automobiles'},
                                      'Motorbikes' :     {'category':'automobiles'},
                                      'Cycles' :         {'category':'automobiles'},
                                      'Mycar' :          {'category':'automobiles'},
                                      'CarMaintenance' : {'category':'automobiles'},
                                      'Driving' :        {'category':'automobiles'},
                                      'RoadTrip' :       {'category':'automobiles'},
                                      'BuyingACar' :     {'category':'automobiles'},
                                      'DreamCar' :     {'category':'automobiles'},

                                      'celebrations' :  {'category':'places'},
                                      'birthdays' :  {'category':'places'},
                                      'thanksgiving' :  {'category':'places'},
                                      'newyears' :  {'category':'places'},
                                      'christmas' :  {'category':'places'},
                                      'GoodFriday' :  {'category':'places'},
                                      'EasterSunday' :  {'category':'places'},
                                      'YomKippur' :  {'category':'places'},
                                      'Sabbath' :  {'category':'places'},
                                      'IndependenceDay' :  {'category':'places'},
                                      'Eid' :  {'category':'places'},
                                      'anniversary' :  {'category':'places'},
                                      'diwali' :  {'category':'places'},
                                      'Onam' :  {'category':'places'},
                                      'Pongal' :  {'category':'places'},

                                      'Culture' :       {'category':'politics'},
                                      'Society' :       {'category':'politics'},
                                      'Elections' :       {'category':'politics'},
                                      'Politics' :       {'category':'politics'},
                                      'Corruption' :       {'category':'politics'},
                                      'MyOpinion' :       {'category':'politics'},
                                      'Progress' :       {'category':'politics'},
                                      'Wars' :       {'category':'politics'},
                                      'Peace' :       {'category':'politics'},
                                      'Leaders' :       {'category':'politics'},

                                      'Entertainment' : {'category':'entertainment'},
                                      'Movies' : {'category':'entertainment'},
                                      'Music' : {'category':'entertainment'},
                                      'TVShows' : {'category':'entertainment'},
                                      'Concert' : {'category':'entertainment'},
                                      'RockBand' : {'category':'entertainment'},
                                      'Radio' : {'category':'entertainment'},
                                      'Videos' : {'category':'entertainment'},
                                      'Guitar' : {'category':'entertainment'},
                                      
                                      'Education' :     {'category':'education'},
                                      'University' :     {'category':'education'},
                                      'Schools' :     {'category':'education'},
                                      'Science' :     {'category':'education'},
                                      'Maths' :     {'category':'education'},
                                      'Doctors' :     {'category':'education'},
                                      'Medicine' :     {'category':'education'},
                                      'Geography' :     {'category':'education'},

                                      'Fashion' :       {'category':'leisure'},
                                      'MensAccessories' :       {'category':'leisure'},
                                      'WomensAccessories' :       {'category':'leisure'},
                                      'Cosmetics' :       {'category':'leisure'},
                                      'FashionBrands' :       {'category':'leisure'},
                                      'Jwellery' :       {'category':'leisure'},
                                      'HairStyling' :       {'category':'leisure'},
                                      'Shoes' :       {'category':'leisure'},
                                      'Bags' :       {'category':'leisure'},
                                      'Watches' :       {'category':'leisure'},
                                      'Bangles' :       {'category':'leisure'},

                                      'Food' :          {'category':'food'},
                                      'Wines' :          {'category':'food'},
                                      'Dining' :          {'category':'food'},
                                      'Restaurants' :          {'category':'food'},
                                      'Cooking' :          {'category':'food'},
                                      'Bakeries' :          {'category':'food'},
                                      'Chocolates' :          {'category':'food'},
                                      'Recipes' :          {'category':'food'},
                                      'Beer' :          {'category':'food'},
                                      'Breads' :          {'category':'food'},
                                      'Pizzas' :          {'category':'food'},
                                      'ChineseFood' :          {'category':'food'},
                                      'ItalianFood' :          {'category':'food'},
                                      'MexicanFood' :          {'category':'food'},
                                      'IndianFood' :          {'category':'food'},


                                      'Toys' :          {'category':'games'},
                                      'Scrabble' :          {'category':'games'},
                                      'StuffedToys' :          {'category':'games'},
                                      'OnlineGaming' :          {'category':'games'},
                                      'SuperMario' :          {'category':'games'},
                                      'Contra' :          {'category':'games'},
                                      'AngryBirds' :          {'category':'games'},
                                      'AllYourBaseAreBelongToUs' :          {'category':'games'},
                                      'PacMan' :          {'category':'games'},
                                      'Tetris' :          {'category':'games'},
                                      'XBox' :          {'category':'games'},
                                      'Kinect' :          {'category':'games'},
                                      'Nintendo' :          {'category':'games'},
                                      'Sega' :          {'category':'games'},
                                      'PlayStation' :          {'category':'games'},
                                      'Crosswords' :          {'category':'games'},
                                      
                                      'Health' :        {'category':'health'},
                                      'Gym' :        {'category':'health'},
                                      'Fitness' :        {'category':'health'},
                                      'Spa' :        {'category':'health'},
                                      'BreastCancer' :        {'category':'health'},
                                      'HIV' :        {'category':'health'},
                                      'Vaccinations' :        {'category':'health'},
                                      'WorldHealth' :        {'category':'health'},
                                      'HealthInsurance' :        {'category':'health'},
                                      'Hospitals' :        {'category':'health'},
                                      'Aging' :        {'category':'health'},
                                      'Infants' :        {'category':'health'},
                                      
                                      'Home' :          {'category':'home'},
                                      'Kids' :       {'category':'home'},
                                      'Parenting' :       {'category':'home'},
                                      'Curtains' :       {'category':'home'},
                                      'Decorations' :       {'category':'home'},
                                      'Furnitures' :       {'category':'home'},
                                      'BuyingHome' :       {'category':'home'},
                                      'BuyingHome' :       {'category':'home'},

                                      'Hobbies' :       {'category':'hobbies'},
                                      'Blogging' :       {'category':'hobbies'},
                                      'Gardening' :       {'category':'hobbies'},
                                      'StampCollection' :       {'category':'hobbies'},
                                      'BathroomSinging' :       {'category':'hobbies'},

                                      'NGO' :     {'category':'nonprofit'},
                                      'GlobalWarming' :     {'category':'nonprofit'},
                                      'Nature' :     {'category':'nonprofit'},
                                      'Poverty' :     {'category':'nonprofit'},
                                      'Hunger' :     {'category':'nonprofit'},
                                      'Starvation' :     {'category':'nonprofit'},
                                      'FloodRelief' :     {'category':'nonprofit'},
                                      'EarthQuakes' :     {'category':'nonprofit'},
                                      'GreenEnergy' :     {'category':'nonprofit'},

                                      'Sports' :        {'category': 'sports'},
                                      'Tennis' :        {'category': 'sports'},
                                      'Cycling' :        {'category': 'sports'},
                                      'Running' :        {'category': 'sports'},
                                      'WaterSports' :        {'category': 'sports'},
                                      'OutdoorSports' :        {'category': 'sports'},
                                      'IndoorSports' :        {'category': 'sports'},
                                      'Walking' :        {'category': 'sports'},
                                      'Jogging' :        {'category': 'sports'},
                                      'Badminton' :        {'category': 'sports'},
                                      'Yoga' :        {'category': 'sports'},
                                      'MartialArts' :        {'category': 'sports'},

                                      'Stories' :       {'category':'stories'},
                                      'Family' :       {'category':'stories'},
                                      'Jokes' :       {'category':'stories'},
                                      'Fun' :       {'category':'stories'},
                                      'Life' :       {'category':'stories'},
                                      'God' :       {'category':'stories'},
                                      'Religion' :       {'category':'stories'},
                                      'Dreams' :       {'category':'stories'},

                                      'Technology' :    {'category':'technology'},
                                      'Electronics' :    {'category':'technology'},
                                      'Android' :    {'category':'technology'},
                                      'IPhone' :    {'category':'technology'},
                                      'BlackBerry' :    {'category':'technology'},
                                      'Gadgets' :    {'category':'technology'},
                                      'Internet' :    {'category':'technology'},
                                      'TechJobs' :    {'category':'technology'},
                                      'TechReads' :    {'category':'technology'},
                                      'SteveJobs' :    {'category':'technology'},
                                      'Programming' :    {'category':'technology'},

                                      'Travel' :        {'category':'places'},
                                      'Hiking' :        {'category':'places'},
                                      'NorthAmerica' :        {'category':'places'},
                                      'Asia' :        {'category':'places'},
                                      'Africa' :        {'category':'places'},
                                      'Australia' :        {'category':'places'},
                                      'SouthAmerica' :        {'category':'places'},
                                      'China' :        {'category':'places'},
                                      'Hills' :        {'category':'places'},
                                      'Seas' :        {'category':'places'},
                                      'HotelsAndStays' :        {'category':'places'},
                                      'Vaccations' :        {'category':'places'},
                                      'Flying' :        {'category':'places'},
                                   };

var aw_local_users_channel_names = [];

jQuery.fn.sort = function() {  
    return this.pushStack( [].sort.apply( this, arguments ), []);  
};  

 function sort_on_name(a,b){  
     if (a.name == b.name){
       return 0;
     }
     return a.l_name> b.l_name ? 1 : -1;  
 };  
  function sort_on_name_desc(a,b){  
     return sort_on_name(a,b) * -1;  
 };


/*
 *
 *
 */
function aw_api_srv_resp_ppm_cmn_render_user_suggest_channels(params){

  var data = aw_api_srv_get_data_for_request('AW_SRV_PPM_CMN_GET_USER_AUTOCOMPELTE_CHANNELS');
  //create an array for auto suggest to work properly
  aw_local_users_channel_names = [];
  for (var key in aw_local_users_channels_data) {
    aw_local_users_channel_names.push({'name':key});
  }
  //////////////////////////////////////////////
  //
  //
  $.each(data, function(i,channel){
    if( channel ){
        var channel_name = channel.name;
        if ( !aw_local_users_channels_data[channel_name] || 
                   aw_local_users_channels_data[channel_name].length == 0 ){
          //TODO: Fix the category, rails must send this
          // A new channel found other than the default accept this.
          var new_category={'category':'__EXISTING__'};
          aw_local_users_channels_data[channel_name] = new_category; 
          aw_local_users_channel_names.push({'name':channel_name});
        }
    }

  });
  
 var aw_local_users_channel_names_sorted = aw_local_users_channel_names.sort(sort_on_name_desc);




  /* register this only when JSON is ready */
  $("#aw_js_ppm_input_channel_name").autocomplete(aw_local_users_channel_names_sorted, {
     	  minChars: 0,
		    matchContains: true,
		    highlightItem: false,
        formatItem: function(channel) {
          return channel.name;
        }
      }).result(function(event, item) {
        $("#aw_js_ppm_input_channel_category").val(aw_local_users_channels_data[item.name].category);
      });
}


/*
 *
 *
 */
function aw_api_ppm_input_initialize_auto_suggest(){
   var params = {
                  'aw_srv_protocol_params' : {
                                                 user_id: aw_lib_get_page_owner_id(),
                                                 sort_order: 1,
                                                 cache_cookie:aw_lib_get_cache_cookie_id()
                                             },
                  'aw_srv_protocol_cookie' : {}
               };
  aw_api_srv_make_a_get_request('AW_SRV_PPM_CMN_GET_USER_AUTOCOMPELTE_CHANNELS',  params);
  $("#aw_js_ppm_input_channel_name").one("keypress", function () {
    $("#aw_js_ppm_category_hide").show();
  });
}


/**
 * plupload.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

// JSLint defined globals
/*global window:false, escape:false */

/*!@@version@@*/

(function() {
	var count = 0, runtimes = [], i18n = {}, mimes = {},
		xmlEncodeChars = {'<' : 'lt', '>' : 'gt', '&' : 'amp', '"' : 'quot', '\'' : '#39'},
		xmlEncodeRegExp = /[<>&\"\']/g, undef, delay = window.setTimeout,
		// A place to store references to event handlers
		eventhash = {},
		uid;

	// IE W3C like event funcs
	function preventDefault() {
		this.returnValue = false;
	}

	function stopPropagation() {
		this.cancelBubble = true;
	}

	// Parses the default mime types string into a mimes lookup map
	(function(mime_data) {
		var items = mime_data.split(/,/), i, y, ext;

		for (i = 0; i < items.length; i += 2) {
			ext = items[i + 1].split(/ /);

			for (y = 0; y < ext.length; y++) {
				mimes[ext[y]] = items[i];
			}
		}
	})(
		"application/msword,doc dot," +
		"application/pdf,pdf," +
		"application/pgp-signature,pgp," +
		"application/postscript,ps ai eps," +
		"application/rtf,rtf," +
		"application/vnd.ms-excel,xls xlb," +
		"application/vnd.ms-powerpoint,ppt pps pot," +
		"application/zip,zip," +
		"application/x-shockwave-flash,swf swfl," +
		"application/vnd.openxmlformats,docx pptx xlsx," +
		"audio/mpeg,mpga mpega mp2 mp3," +
		"audio/x-wav,wav," +
		"audio/mp4,m4a," +
		"image/bmp,bmp," +
		"image/gif,gif," +
		"image/jpeg,jpeg jpg jpe," +
		"image/png,png," +
		"image/svg+xml,svg svgz," +
		"image/tiff,tiff tif," +
		"text/html,htm html xhtml," +
		"text/rtf,rtf," +
		"video/mpeg,mpeg mpg mpe," +
		"video/quicktime,qt mov," +
		"video/mp4,mp4," +
		"video/x-m4v,m4v," +
		"video/x-flv,flv," +
		"video/vnd.rn-realvideo,rv," +
		"text/csv,csv," +
		"text/plain,asc txt text diff log," +
		"application/octet-stream,exe"
	);

	/**
	 * Plupload class with some global constants and functions.
	 *
	 * @example
	 * // Encode entities
	 * console.log(plupload.xmlEncode("My string &lt;&gt;"));
	 *
	 * // Generate unique id
	 * console.log(plupload.guid());
	 *
	 * @static
	 * @class plupload
	 */
	var plupload = {
		/**
		 * Plupload version will be replaced on build.
		 */
		VERSION : '@@version@@',

		/**
		 * Inital state of the queue and also the state ones it's finished all it's uploads.
		 *
		 * @property STOPPED
		 * @final
		 */
		STOPPED : 1,

		/**
		 * Upload process is running
		 *
		 * @property STARTED
		 * @final
		 */
		STARTED : 2,

		/**
		 * File is queued for upload
		 *
		 * @property QUEUED
		 * @final
		 */
		QUEUED : 1,

		/**
		 * File is being uploaded
		 *
		 * @property UPLOADING
		 * @final
		 */
		UPLOADING : 2,

		/**
		 * File has failed to be uploaded
		 *
		 * @property FAILED
		 * @final
		 */
		FAILED : 4,

		/**
		 * File has been uploaded successfully
		 *
		 * @property DONE
		 * @final
		 */
		DONE : 5,

		// Error constants used by the Error event

		/**
		 * Generic error for example if an exception is thrown inside Silverlight.
		 *
		 * @property GENERIC_ERROR
		 * @final
		 */
		GENERIC_ERROR : -100,

		/**
		 * HTTP transport error. For example if the server produces a HTTP status other than 200.
		 *
		 * @property HTTP_ERROR
		 * @final
		 */
		HTTP_ERROR : -200,

		/**
		 * Generic I/O error. For exampe if it wasn't possible to open the file stream on local machine.
		 *
		 * @property IO_ERROR
		 * @final
		 */
		IO_ERROR : -300,

		/**
		 * Generic I/O error. For exampe if it wasn't possible to open the file stream on local machine.
		 *
		 * @property SECURITY_ERROR
		 * @final
		 */
		SECURITY_ERROR : -400,

		/**
		 * Initialization error. Will be triggered if no runtime was initialized.
		 *
		 * @property INIT_ERROR
		 * @final
		 */
		INIT_ERROR : -500,

		/**
		 * File size error. If the user selects a file that is to large it will be blocked and an error of this type will be triggered.
		 *
		 * @property FILE_SIZE_ERROR
		 * @final
		 */
		FILE_SIZE_ERROR : -600,

		/**
		 * File extension error. If the user selects a file that isn't valid according to the filters setting.
		 *
		 * @property FILE_EXTENSION_ERROR
		 * @final
		 */
		FILE_EXTENSION_ERROR : -601,

		/**
		 * Runtime will try to detect if image is proper one. Otherwise will throw this error.
		 *
		 * @property IMAGE_FORMAT_ERROR
		 * @final
		 */
		IMAGE_FORMAT_ERROR : -700,

		/**
		 * While working on the image runtime will try to detect if the operation may potentially run out of memeory and will throw this error.
		 *
		 * @property IMAGE_MEMORY_ERROR
		 * @final
		 */
		IMAGE_MEMORY_ERROR : -701,

		/**
		 * Each runtime has an upper limit on a dimension of the image it can handle. If bigger, will throw this error.
		 *
		 * @property IMAGE_DIMENSIONS_ERROR
		 * @final
		 */
		IMAGE_DIMENSIONS_ERROR : -702,


		/**
		 * Mime type lookup table.
		 *
		 * @property mimeTypes
		 * @type Object
		 * @final
		 */
		mimeTypes : mimes,

		/**
		 * Extends the specified object with another object.
		 *
		 * @method extend
		 * @param {Object} target Object to extend.
		 * @param {Object..} obj Multiple objects to extend with.
		 * @return {Object} Same as target, the extended object.
		 */
		extend : function(target) {
			plupload.each(arguments, function(arg, i) {
				if (i > 0) {
					plupload.each(arg, function(value, key) {
						target[key] = value;
					});
				}
			});

			return target;
		},

		/**
		 * Cleans the specified name from national characters (diacritics). The result will be a name with only a-z, 0-9 and _.
		 *
		 * @method cleanName
		 * @param {String} s String to clean up.
		 * @return {String} Cleaned string.
		 */
		cleanName : function(name) {
			var i, lookup;

			// Replace diacritics
			lookup = [
				/[\300-\306]/g, 'A', /[\340-\346]/g, 'a', 
				/\307/g, 'C', /\347/g, 'c',
				/[\310-\313]/g, 'E', /[\350-\353]/g, 'e',
				/[\314-\317]/g, 'I', /[\354-\357]/g, 'i',
				/\321/g, 'N', /\361/g, 'n',
				/[\322-\330]/g, 'O', /[\362-\370]/g, 'o',
				/[\331-\334]/g, 'U', /[\371-\374]/g, 'u'
			];

			for (i = 0; i < lookup.length; i += 2) {
				name = name.replace(lookup[i], lookup[i + 1]);
			}

			// Replace whitespace
			name = name.replace(/\s+/g, '_');

			// Remove anything else
			name = name.replace(/[^a-z0-9_\-\.]+/gi, '');

			return name;
		},

		/**
		 * Adds a specific upload runtime like for example flash or gears.
		 *
		 * @method addRuntime
		 * @param {String} name Runtime name for example flash.
		 * @param {Object} obj Object containing init/destroy method.
		 */
		addRuntime : function(name, runtime) {			
			runtime.name = name;
			runtimes[name] = runtime;
			runtimes.push(runtime);

			return runtime;
		},

		/**
		 * Generates an unique ID. This is 99.99% unique since it takes the current time and 5 random numbers.
		 * The only way a user would be able to get the same ID is if the two persons at the same exact milisecond manages
		 * to get 5 the same random numbers between 0-65535 it also uses a counter so each call will be guaranteed to be page unique.
		 * It's more probable for the earth to be hit with an ansteriod. You can also if you want to be 100% sure set the plupload.guidPrefix property
		 * to an user unique key.
		 *
		 * @method guid
		 * @return {String} Virtually unique id.
		 */
		guid : function() {
			var guid = new Date().getTime().toString(32), i;

			for (i = 0; i < 5; i++) {
				guid += Math.floor(Math.random() * 65535).toString(32);
			}

			return (plupload.guidPrefix || 'p') + guid + (count++).toString(32);
		},

		/**
		 * Builds a full url out of a base URL and an object with items to append as query string items.
		 *
		 * @param {String} url Base URL to append query string items to.
		 * @param {Object} items Name/value object to serialize as a querystring.
		 * @return {String} String with url + serialized query string items.
		 */
		buildUrl : function(url, items) {
			var query = '';

			plupload.each(items, function(value, name) {
				query += (query ? '&' : '') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
			});

			if (query) {
				url += (url.indexOf('?') > 0 ? '&' : '?') + query;
			}

			return url;
		},

		/**
		 * Executes the callback function for each item in array/object. If you return false in the
		 * callback it will break the loop.
		 *
		 * @param {Object} obj Object to iterate.
		 * @param {function} callback Callback function to execute for each item.
		 */
		each : function(obj, callback) {
			var length, key, i;

			if (obj) {
				length = obj.length;

				if (length === undef) {
					// Loop object items
					for (key in obj) {
						if (obj.hasOwnProperty(key)) {
							if (callback(obj[key], key) === false) {
								return;
							}
						}
					}
				} else {
					// Loop array items
					for (i = 0; i < length; i++) {
						if (callback(obj[i], i) === false) {
							return;
						}
					}
				}
			}
		},

		/**
		 * Formats the specified number as a size string for example 1024 becomes 1 KB.
		 *
		 * @method formatSize
		 * @param {Number} size Size to format as string.
		 * @return {String} Formatted size string.
		 */
		formatSize : function(size) {
			if (size === undef || /\D/.test(size)) {
				return plupload.translate('N/A');
			}

			// GB
			if (size > 1073741824) {
				return Math.round(size / 1073741824, 1) + " GB";
			}

			// MB
			if (size > 1048576) {
				return Math.round(size / 1048576, 1) + " MB";
			}

			// KB
			if (size > 1024) {
				return Math.round(size / 1024, 1) + " KB";
			}

			return size + " b";
		},

		/**
		 * Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.
		 *
		 * @method getPos
		 * @param {Element} node HTML element or element id to get x, y position from.
		 * @param {Element} root Optional root element to stop calculations at.
		 * @return {object} Absolute position of the specified element object with x, y fields.
		 */
		 getPos : function(node, root) {
			var x = 0, y = 0, parent, doc = document, nodeRect, rootRect;

			node = node;
			root = root || doc.body;

			// Returns the x, y cordinate for an element on IE 6 and IE 7
			function getIEPos(node) {
				var bodyElm, rect, x = 0, y = 0;

				if (node) {
					rect = node.getBoundingClientRect();
					bodyElm = doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body;
					x = rect.left + bodyElm.scrollLeft;
					y = rect.top + bodyElm.scrollTop;
				}

				return {
					x : x,
					y : y
				};
			}

			// Use getBoundingClientRect on IE 6 and IE 7 but not on IE 8 in standards mode
			if (node && node.getBoundingClientRect && (navigator.userAgent.indexOf('MSIE') > 0 && doc.documentMode !== 8)) {
				nodeRect = getIEPos(node);
				rootRect = getIEPos(root);

				return {
					x : nodeRect.x - rootRect.x,
					y : nodeRect.y - rootRect.y
				};
			}

			parent = node;
			while (parent && parent != root && parent.nodeType) {
				x += parent.offsetLeft || 0;
				y += parent.offsetTop || 0;
				parent = parent.offsetParent;
			}

			parent = node.parentNode;
			while (parent && parent != root && parent.nodeType) {
				x -= parent.scrollLeft || 0;
				y -= parent.scrollTop || 0;
				parent = parent.parentNode;
			}

			return {
				x : x,
				y : y
			};
		},

		/**
		 * Returns the size of the specified node in pixels.
		 *
		 * @param {Node} node Node to get the size of.
		 * @return {Object} Object with a w and h property.
		 */
		getSize : function(node) {
			return {
				w : node.offsetWidth || node.clientWidth,
				h : node.offsetHeight || node.clientHeight
			};
		},

		/**
		 * Parses the specified size string into a byte value. For example 10kb becomes 10240.
		 *
		 * @method parseSize
		 * @param {String/Number} size String to parse or number to just pass through.
		 * @return {Number} Size in bytes.
		 */
		parseSize : function(size) {
			var mul;

			if (typeof(size) == 'string') {
				size = /^([0-9]+)([mgk]+)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));
				mul = size[2];
				size = +size[1];

				if (mul == 'g') {
					size *= 1073741824;
				}

				if (mul == 'm') {
					size *= 1048576;
				}

				if (mul == 'k') {
					size *= 1024;
				}
			}

			return size;
		},

		/**
		 * Encodes the specified string.
		 *
		 * @method xmlEncode
		 * @param {String} s String to encode.
		 * @return {String} Encoded string.
		 */
		xmlEncode : function(str) {
			return str ? ('' + str).replace(xmlEncodeRegExp, function(chr) {
				return xmlEncodeChars[chr] ? '&' + xmlEncodeChars[chr] + ';' : chr;
			}) : str;
		},

		/**
		 * Forces anything into an array.
		 *
		 * @method toArray
		 * @param {Object} obj Object with length field.
		 * @return {Array} Array object containing all items.
		 */
		toArray : function(obj) {
			var i, arr = [];

			for (i = 0; i < obj.length; i++) {
				arr[i] = obj[i];
			}

			return arr;
		},

		/**
		 * Extends the language pack object with new items.
		 *
		 * @param {Object} pack Language pack items to add.
		 * @return {Object} Extended language pack object.
		 */
		addI18n : function(pack) {
			return plupload.extend(i18n, pack);
		},

		/**
		 * Translates the specified string by checking for the english string in the language pack lookup.
		 *
		 * @param {String} str String to look for.
		 * @return {String} Translated string or the input string if it wasn't found.
		 */
		translate : function(str) {
			return i18n[str] || str;
		},

		/**
		 * Checks if object is empty.
		 *
		 * @param {Object} obj Object to check.
		 * @return {Boolean}
		 */
		isEmptyObj : function(obj) {
			if (obj === undef) return true;

			for (var prop in obj) {
				return false;	
			}
			return true;
		},

		/**
		 * Checks if specified DOM element has specified class.
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Class name
		 */
		hasClass : function(obj, name) {
			var regExp;

			if (obj.className == '') {
				return false;
			}

			regExp = new RegExp("(^|\\s+)"+name+"(\\s+|$)");

			return regExp.test(obj.className);
		},

		/**
		 * Adds specified className to specified DOM element.
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Class name
		 */
		addClass : function(obj, name) {
			if (!plupload.hasClass(obj, name)) {
				obj.className = obj.className == '' ? name : obj.className.replace(/\s+$/, '')+' '+name;
			}
		},

		/**
		 * Removes specified className from specified DOM element.
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Class name
		 */
		removeClass : function(obj, name) {
			var regExp = new RegExp("(^|\\s+)"+name+"(\\s+|$)");

			obj.className = obj.className.replace(regExp, function($0, $1, $2) {
				return $1 === ' ' && $2 === ' ' ? ' ' : '';
			});
		},
    
		/**
		 * Returns a given computed style of a DOM element.
		 *
		 * @param {Object} obj DOM element like object.
		 * @param {String} name Style you want to get from the DOM element
		 */
		getStyle : function(obj, name) {
			if (obj.currentStyle) {
				return obj.currentStyle[name];
			} else if (window.getComputedStyle) {
				return window.getComputedStyle(obj, null)[name];
			}
		},

		/**
		 * Adds an event handler to the specified object and store reference to the handler
		 * in objects internal Plupload registry (@see removeEvent).
		 *
		 * @param {Object} obj DOM element like object to add handler to.
		 * @param {String} name Name to add event listener to.
		 * @param {Function} callback Function to call when event occurs.
		 * @param {String} (optional) key that might be used to add specifity to the event record.
		 */
		addEvent : function(obj, name, callback) {
			var func, events, types, key;

			// if passed in, event will be locked with this key - one would need to provide it to removeEvent
			key = arguments[3];

			name = name.toLowerCase();

			// Initialize unique identifier if needed
			if (uid === undef) {
				uid = 'Plupload_' + plupload.guid();
			}

			// Add event listener
			if (obj.attachEvent) {

				func = function() {
					var evt = window.event;

					if (!evt.target) {
						evt.target = evt.srcElement;
					}

					evt.preventDefault = preventDefault;
					evt.stopPropagation = stopPropagation;

					callback(evt);
				};
				obj.attachEvent('on' + name, func);

			} else if (obj.addEventListener) {
				func = callback;

				obj.addEventListener(name, func, false);
			}

			// Log event handler to objects internal Plupload registry
			if (obj[uid] === undef) {
				obj[uid] = plupload.guid();
			}

			if (!eventhash.hasOwnProperty(obj[uid])) {
				eventhash[obj[uid]] = {};
			}

			events = eventhash[obj[uid]];

			if (!events.hasOwnProperty(name)) {
				events[name] = [];
			}

			events[name].push({
				func: func,
				orig: callback, // store original callback for IE
				key: key
			});
		},


		/**
		 * Remove event handler from the specified object. If third argument (callback)
		 * is not specified remove all events with the specified name.
		 *
		 * @param {Object} obj DOM element to remove event listener(s) from.
		 * @param {String} name Name of event listener to remove.
		 * @param {Function|String} (optional) might be a callback or unique key to match.
		 */
		removeEvent: function(obj, name) {
			var type, callback, key;

			// match the handler either by callback or by key	
			if (typeof(arguments[2]) == "function") {
				callback = arguments[2];
			} else {
				key = arguments[2];
			}

			name = name.toLowerCase();

			if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
				type = eventhash[obj[uid]][name];
			} else {
				return;
			}


			for (var i=type.length-1; i>=0; i--) {
				// undefined or not, key should match			
				if (type[i].key === key || type[i].orig === callback) {

					if (obj.detachEvent) {
						obj.detachEvent('on'+name, type[i].func);
					} else if (obj.removeEventListener) {
						obj.removeEventListener(name, type[i].func, false);		
					}

					type[i].orig = null;
					type[i].func = null;

					type.splice(i, 1);

					// If callback was passed we are done here, otherwise proceed
					if (callback !== undef) {
						break;
					}
				}			
			}	

			// If event array got empty, remove it
			if (!type.length) {
				delete eventhash[obj[uid]][name];
			}

			// If Plupload registry has become empty, remove it
			if (plupload.isEmptyObj(eventhash[obj[uid]])) {
				delete eventhash[obj[uid]];

				// IE doesn't let you remove DOM object property with - delete
				try {
					delete obj[uid];
				} catch(e) {
					obj[uid] = undef;
				}
			}
		},


		/**
		 * Remove all kind of events from the specified object
		 *
		 * @param {Object} obj DOM element to remove event listeners from.
		 * @param {String} (optional) unique key to match, when removing events.
		 */
		removeAllEvents: function(obj) {
			var key = arguments[1];

			if (obj[uid] === undef || !obj[uid]) {
				return;
			}

			plupload.each(eventhash[obj[uid]], function(events, name) {
				plupload.removeEvent(obj, name, key);
			});		
		}		
	};


	/**
	 * Uploader class, an instance of this class will be created for each upload field.
	 *
	 * @example
	 * var uploader = new plupload.Uploader({
	 *     runtimes : 'gears,html5,flash',
	 *     browse_button : 'button_id'
	 * });
	 *
	 * uploader.bind('Init', function(up) {
	 *     alert('Supports drag/drop: ' + (!!up.features.dragdrop));
	 * });
	 *
	 * uploader.bind('FilesAdded', function(up, files) {
	 *     alert('Selected files: ' + files.length);
	 * });
	 *
	 * uploader.bind('QueueChanged', function(up) {
	 *     alert('Queued files: ' + uploader.files.length);
	 * });
	 *
	 * uploader.init();
	 *
	 * @class plupload.Uploader
	 */

	/**
	 * Constructs a new uploader instance.
	 *
	 * @constructor
	 * @method Uploader
	 * @param {Object} settings Initialization settings, to be used by the uploader instance and runtimes.
	 */
	plupload.Uploader = function(settings) {
		var events = {}, total, files = [], startTime;

		// Inital total state
		total = new plupload.QueueProgress();

		// Default settings
		settings = plupload.extend({
			chunk_size : 0,
			multipart : true,
			multi_selection : true,
			file_data_name : 'file',
			filters : []
		}, settings);

		// Private methods
		function uploadNext() {
			var file, count = 0, i;

			if (this.state == plupload.STARTED) {
				// Find first QUEUED file
				for (i = 0; i < files.length; i++) {
					if (!file && files[i].status == plupload.QUEUED) {
						file = files[i];
						file.status = plupload.UPLOADING;
						this.trigger("BeforeUpload", file);
						this.trigger("UploadFile", file);
					} else {
						count++;
					}
				}

				// All files are DONE or FAILED
				if (count == files.length) {
					this.trigger("UploadComplete", files);
					this.stop();
				}
			}
		}

		function calc() {
			var i, file;

			// Reset stats
			total.reset();

			// Check status, size, loaded etc on all files
			for (i = 0; i < files.length; i++) {
				file = files[i];

				if (file.size !== undef) {
					total.size += file.size;
					total.loaded += file.loaded;
				} else {
					total.size = undef;
				}

				if (file.status == plupload.DONE) {
					total.uploaded++;
				} else if (file.status == plupload.FAILED) {
					total.failed++;
				} else {
					total.queued++;
				}
			}

			// If we couldn't calculate a total file size then use the number of files to calc percent
			if (total.size === undef) {
				total.percent = files.length > 0 ? Math.ceil(total.uploaded / files.length * 100) : 0;
			} else {
				total.bytesPerSec = Math.ceil(total.loaded / ((+new Date() - startTime || 1) / 1000.0));
				total.percent = total.size > 0 ? Math.ceil(total.loaded / total.size * 100) : 0;
			}
		}

		// Add public methods
		plupload.extend(this, {
			/**
			 * Current state of the total uploading progress. This one can either be plupload.STARTED or plupload.STOPPED.
			 * These states are controlled by the stop/start methods. The default value is STOPPED.
			 *
			 * @property state
			 * @type Number
			 */
			state : plupload.STOPPED,

			/**
			 * Current runtime name.
			 *
			 * @property runtime
			 * @type String
			 */
			runtime: '',

			/**
			 * Map of features that are available for the uploader runtime. Features will be filled
			 * before the init event is called, these features can then be used to alter the UI for the end user.
			 * Some of the current features that might be in this map is: dragdrop, chunks, jpgresize, pngresize.
			 *
			 * @property features
			 * @type Object
			 */
			features : {},

			/**
			 * Current upload queue, an array of File instances.
			 *
			 * @property files
			 * @type Array
			 * @see plupload.File
			 */
			files : files,

			/**
			 * Object with name/value settings.
			 *
			 * @property settings
			 * @type Object
			 */
			settings : settings,

			/**
			 * Total progess information. How many files has been uploaded, total percent etc.
			 *
			 * @property total
			 * @type plupload.QueueProgress
			 */
			total : total,

			/**
			 * Unique id for the Uploader instance.
			 *
			 * @property id
			 * @type String
			 */
			id : plupload.guid(),

			/**
			 * Initializes the Uploader instance and adds internal event listeners.
			 *
			 * @method init
			 */
			init : function() {
				var self = this, i, runtimeList, a, runTimeIndex = 0, items;

				if (typeof(settings.preinit) == "function") {
					settings.preinit(self);
				} else {
					plupload.each(settings.preinit, function(func, name) {
						self.bind(name, func);
					});
				}

				settings.page_url = settings.page_url || document.location.pathname.replace(/\/[^\/]+$/g, '/');

				// If url is relative force it absolute to the current page
				if (!/^(\w+:\/\/|\/)/.test(settings.url)) {
					settings.url = settings.page_url + settings.url;
				}

				// Convert settings
				settings.chunk_size = plupload.parseSize(settings.chunk_size);
				settings.max_file_size = plupload.parseSize(settings.max_file_size);

				// Add files to queue
				self.bind('FilesAdded', function(up, selected_files) {
					var i, file, count = 0, extensionsRegExp, filters = settings.filters;

					// Convert extensions to regexp
					if (filters && filters.length) {
						extensionsRegExp = [];

						plupload.each(filters, function(filter) {
							plupload.each(filter.extensions.split(/,/), function(ext) {
								if (/^\s*\*\s*$/.test(ext)) {
									extensionsRegExp.push('\\.*');
								} else {
									extensionsRegExp.push('\\.' + ext.replace(new RegExp('[' + ('/^$.*+?|()[]{}\\'.replace(/./g, '\\$&')) + ']', 'g'), '\\$&'));
								}
							});
						});

						extensionsRegExp = new RegExp(extensionsRegExp.join('|') + '$', 'i');
					}

					for (i = 0; i < selected_files.length; i++) {
						file = selected_files[i];
						file.loaded = 0;
						file.percent = 0;
						file.status = plupload.QUEUED;

						// Invalid file extension
						if (extensionsRegExp && !extensionsRegExp.test(file.name)) {
							up.trigger('Error', {
								code : plupload.FILE_EXTENSION_ERROR,
								message : plupload.translate('File extension error.'),
								file : file
							});

							continue;
						}

						// Invalid file size
						if (file.size !== undef && file.size > settings.max_file_size) {
							up.trigger('Error', {
								code : plupload.FILE_SIZE_ERROR,
								message : plupload.translate('File size error.'),
								file : file
							});

							continue;
						}

						// Add valid file to list
						files.push(file);
						count++;
					}

					// Only trigger QueueChanged event if any files where added
					if (count) {
						delay(function() {
							self.trigger("QueueChanged");
							self.refresh();
						}, 1);
					} else {
						return false; // Stop the FilesAdded event from immediate propagation
					}
				});

				// Generate unique target filenames
				if (settings.unique_names) {
					self.bind("UploadFile", function(up, file) {
						var matches = file.name.match(/\.([^.]+)$/), ext = "tmp";

						if (matches) {
							ext = matches[1];
						}

						file.target_name = file.id + '.' + ext;
					});
				}

				self.bind('UploadProgress', function(up, file) {
					file.percent = file.size > 0 ? Math.ceil(file.loaded / file.size * 100) : 100;
					calc();
				});

				self.bind('StateChanged', function(up) {
					if (up.state == plupload.STARTED) {
						// Get start time to calculate bps
						startTime = (+new Date());

					} else if (up.state == plupload.STOPPED) {
						// Reset currently uploading files
						for (i = up.files.length - 1; i >= 0; i--) {
							if (up.files[i].status == plupload.UPLOADING) {
								up.files[i].status = plupload.QUEUED;
								calc();
							}
						}
					}
				});

				self.bind('QueueChanged', calc);

				self.bind("Error", function(up, err) {
					// Set failed status if an error occured on a file
					if (err.file) {
						err.file.status = plupload.FAILED;
						calc();

						// Upload next file but detach it from the error event
						// since other custom listeners might want to stop the queue
						if (up.state == plupload.STARTED) {
							delay(function() {
								uploadNext.call(self);
							}, 1);
						}
					}
				});

				self.bind("FileUploaded", function(up, file) {
					file.status = plupload.DONE;
					file.loaded = file.size;
					up.trigger('UploadProgress', file);

					// Upload next file but detach it from the error event
					// since other custom listeners might want to stop the queue
					delay(function() {
						uploadNext.call(self);
					}, 1);
				});

				// Setup runtimeList
				if (settings.runtimes) {
					runtimeList = [];
					items = settings.runtimes.split(/\s?,\s?/);

					for (i = 0; i < items.length; i++) {
						if (runtimes[items[i]]) {
							runtimeList.push(runtimes[items[i]]);
						}
					}
				} else {
					runtimeList = runtimes;
				}

				// Call init on each runtime in sequence
				function callNextInit() {
					var runtime = runtimeList[runTimeIndex++], features, requiredFeatures, i;

					if (runtime) {
						features = runtime.getFeatures();

						// Check if runtime supports required features
						requiredFeatures = self.settings.required_features;
						if (requiredFeatures) {
							requiredFeatures = requiredFeatures.split(',');

							for (i = 0; i < requiredFeatures.length; i++) {
								// Specified feature doesn't exist
								if (!features[requiredFeatures[i]]) {
									callNextInit();
									return;
								}
							}
						}

						// Try initializing the runtime
						runtime.init(self, function(res) {
							if (res && res.success) {
								// Successful initialization
								self.features = features;
								self.runtime = runtime.name;
								self.trigger('Init', {runtime : runtime.name});
								self.trigger('PostInit');
								self.refresh();
							} else {
								callNextInit();
							}
						});
					} else {
						// Trigger an init error if we run out of runtimes
						self.trigger('Error', {
							code : plupload.INIT_ERROR,
							message : plupload.translate('Init error.')
						});
					}
				}

				callNextInit();

				if (typeof(settings.init) == "function") {
					settings.init(self);
				} else {
					plupload.each(settings.init, function(func, name) {
						self.bind(name, func);
					});
				}
			},

			/**
			 * Refreshes the upload instance by dispatching out a refresh event to all runtimes.
			 * This would for example reposition flash/silverlight shims on the page.
			 *
			 * @method refresh
			 */
			refresh : function() {
				this.trigger("Refresh");
			},

			/**
			 * Starts uploading the queued files.
			 *
			 * @method start
			 */
			start : function() {
				if (this.state != plupload.STARTED) {
					this.state = plupload.STARTED;
					this.trigger("StateChanged");	

					uploadNext.call(this);				
				}
			},

			/**
			 * Stops the upload of the queued files.
			 *
			 * @method stop
			 */
			stop : function() {
				if (this.state != plupload.STOPPED) {
					this.state = plupload.STOPPED;					
					this.trigger("StateChanged");
				}
			},

			/**
			 * Returns the specified file object by id.
			 *
			 * @method getFile
			 * @param {String} id File id to look for.
			 * @return {plupload.File} File object or undefined if it wasn't found;
			 */
			getFile : function(id) {
				var i;

				for (i = files.length - 1; i >= 0; i--) {
					if (files[i].id === id) {
						return files[i];
					}
				}
			},

			/**
			 * Removes a specific file.
			 *
			 * @method removeFile
			 * @param {plupload.File} file File to remove from queue.
			 */
			removeFile : function(file) {
				var i;

				for (i = files.length - 1; i >= 0; i--) {
					if (files[i].id === file.id) {
						return this.splice(i, 1)[0];
					}
				}
			},

			/**
			 * Removes part of the queue and returns the files removed. This will also trigger the FilesRemoved and QueueChanged events.
			 *
			 * @method splice
			 * @param {Number} start (Optional) Start index to remove from.
			 * @param {Number} length (Optional) Lengh of items to remove.
			 * @return {Array} Array of files that was removed.
			 */
			splice : function(start, length) {
				var removed;

				// Splice and trigger events
				removed = files.splice(start === undef ? 0 : start, length === undef ? files.length : length);

				this.trigger("FilesRemoved", removed);
				this.trigger("QueueChanged");

				return removed;
			},

			/**
			 * Dispatches the specified event name and it's arguments to all listeners.
			 *
			 *
			 * @method trigger
			 * @param {String} name Event name to fire.
			 * @param {Object..} Multiple arguments to pass along to the listener functions.
			 */
			trigger : function(name) {
				var list = events[name.toLowerCase()], i, args;

				// console.log(name, arguments);

				if (list) {
					// Replace name with sender in args
					args = Array.prototype.slice.call(arguments);
					args[0] = this;

					// Dispatch event to all listeners
					for (i = 0; i < list.length; i++) {
						// Fire event, break chain if false is returned
						if (list[i].func.apply(list[i].scope, args) === false) {
							return false;
						}
					}
				}

				return true;
			},

			/**
			 * Adds an event listener by name.
			 *
			 * @method bind
			 * @param {String} name Event name to listen for.
			 * @param {function} func Function to call ones the event gets fired.
			 * @param {Object} scope Optional scope to execute the specified function in.
			 */
			bind : function(name, func, scope) {
				var list;

				name = name.toLowerCase();
				list = events[name] || [];
				list.push({func : func, scope : scope || this});
				events[name] = list;
			},

			/**
			 * Removes the specified event listener.
			 *
			 * @method unbind
			 * @param {String} name Name of event to remove.
			 * @param {function} func Function to remove from listener.
			 */
			unbind : function(name) {
				name = name.toLowerCase();

				var list = events[name], i, func = arguments[1];

				if (list) {
					if (func !== undef) {
						for (i = list.length - 1; i >= 0; i--) {
							if (list[i].func === func) {
								list.splice(i, 1);
									break;
							}
						}
					} else {
						list = [];
					}

					// delete event list if it has become empty
					if (!list.length) {
						delete events[name];
					}
				}
			},

			/**
			 * Removes all event listeners.
			 *
			 * @method unbindAll
			 */
			unbindAll : function() {
				var self = this;

				plupload.each(events, function(list, name) {
					self.unbind(name);
				});
			},

			/**
			 * Destroys Plupload instance and cleans after itself.
			 *
			 * @method destroy
			 */
			destroy : function() {							
				this.trigger('Destroy');

				// Clean-up after uploader itself
				this.unbindAll();
			}

			/**
			 * Fires when the current RunTime has been initialized.
			 *
			 * @event Init
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires after the init event incase you need to perform actions there.
			 *
			 * @event PostInit
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires when the silverlight/flash or other shim needs to move.
			 *
			 * @event Refresh
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires when the overall state is being changed for the upload queue.
			 *
			 * @event StateChanged
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires when a file is to be uploaded by the runtime.
			 *
			 * @event UploadFile
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File to be uploaded.
			 */

			/**
			 * Fires when just before a file is uploaded. This event enables you to override settings
			 * on the uploader instance before the file is uploaded.
			 *
			 * @event BeforeUpload
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File to be uploaded.
			 */

			/**
			 * Fires when the file queue is changed. In other words when files are added/removed to the files array of the uploader instance.
			 *
			 * @event QueueChanged
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */

			/**
			 * Fires while a file is being uploaded. Use this event to update the current file upload progress.
			 *
			 * @event UploadProgress
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File that is currently being uploaded.
			 */

			/**
			 * Fires while a file was removed from queue.
			 *
			 * @event FilesRemoved
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Array} files Array of files that got removed.
			 */

			/**
			 * Fires while when the user selects files to upload.
			 *
			 * @event FilesAdded
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Array} files Array of file objects that was added to queue/selected by the user.
			 */

			/**
			 * Fires when a file is successfully uploaded.
			 *
			 * @event FileUploaded
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File that was uploaded.
			 * @param {Object} response Object with response properties.
			 */

			/**
			 * Fires when file chunk is uploaded.
			 *
			 * @event ChunkUploaded
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {plupload.File} file File that the chunk was uploaded for.
			 * @param {Object} response Object with response properties.
			 */

			/**
			 * Fires when all files in a queue are uploaded.
			 *
			 * @event UploadComplete
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Array} files Array of file objects that was added to queue/selected by the user.
			 */

			/**
			 * Fires when a error occurs.
			 *
			 * @event Error
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 * @param {Object} error Contains code, message and sometimes file and other details.
			 */

			 /**
			 * Fires when destroy method is called.
			 *
			 * @event Destroy
			 * @param {plupload.Uploader} uploader Uploader instance sending the event.
			 */
		});
	};

	/**
	 * File instance.
	 *
	 * @class plupload.File
	 * @param {String} name Name of the file.
	 * @param {Number} size File size.
	 */

	/**
	 * Constructs a new file instance.
	 *
	 * @constructor
	 * @method File
	 * @param {String} id Unique file id.
	 * @param {String} name File name.
	 * @param {Number} size File size in bytes.
	 */
	plupload.File = function(id, name, size) {
		var self = this; // Setup alias for self to reduce code size when it's compressed

		/**
		 * File id this is a globally unique id for the specific file.
		 *
		 * @property id
		 * @type String
		 */
		self.id = id;

		/**
		 * File name for example "myfile.gif".
		 *
		 * @property name
		 * @type String
		 */
		self.name = name;

		/**
		 * File size in bytes.
		 *
		 * @property size
		 * @type Number
		 */
		self.size = size;

		/**
		 * Number of bytes uploaded of the files total size.
		 *
		 * @property loaded
		 * @type Number
		 */
		self.loaded = 0;

		/**
		 * Number of percentage uploaded of the file.
		 *
		 * @property percent
		 * @type Number
		 */
		self.percent = 0;

		/**
		 * Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
		 *
		 * @property status
		 * @type Number
		 * @see plupload
		 */
		self.status = 0;
	};

	/**
	 * Runtime class gets implemented by each upload runtime.
	 *
	 * @class plupload.Runtime
	 * @static
	 */
	plupload.Runtime = function() {
		/**
		 * Returns a list of supported features for the runtime.
		 *
		 * @return {Object} Name/value object with supported features.
		 */
		this.getFeatures = function() {
		};

		/**
		 * Initializes the upload runtime. This method should add necessary items to the DOM and register events needed for operation. 
		 *
		 * @method init
		 * @param {plupload.Uploader} uploader Uploader instance that needs to be initialized.
		 * @param {function} callback Callback function to execute when the runtime initializes or fails to initialize. If it succeeds an object with a parameter name success will be set to true.
		 */
		this.init = function(uploader, callback) {
		};
	};

	/**
	 * Runtime class gets implemented by each upload runtime.
	 *
	 * @class plupload.QueueProgress
	 */

	/**
	 * Constructs a queue progress.
	 *
	 * @constructor
	 * @method QueueProgress
	 */
	 plupload.QueueProgress = function() {
		var self = this; // Setup alias for self to reduce code size when it's compressed

		/**
		 * Total queue file size.
		 *
		 * @property size
		 * @type Number
		 */
		self.size = 0;

		/**
		 * Total bytes uploaded.
		 *
		 * @property loaded
		 * @type Number
		 */
		self.loaded = 0;

		/**
		 * Number of files uploaded.
		 *
		 * @property uploaded
		 * @type Number
		 */
		self.uploaded = 0;

		/**
		 * Number of files failed to upload.
		 *
		 * @property failed
		 * @type Number
		 */
		self.failed = 0;

		/**
		 * Number of files yet to be uploaded.
		 *
		 * @property queued
		 * @type Number
		 */
		self.queued = 0;

		/**
		 * Total percent of the uploaded bytes.
		 *
		 * @property percent
		 * @type Number
		 */
		self.percent = 0;

		/**
		 * Bytes uploaded per second.
		 *
		 * @property bytesPerSec
		 * @type Number
		 */
		self.bytesPerSec = 0;

		/**
		 * Resets the progress to it's initial values.
		 *
		 * @method reset
		 */
		self.reset = function() {
			self.size = self.loaded = self.uploaded = self.failed = self.queued = self.percent = self.bytesPerSec = 0;
		};
	};

	// Create runtimes namespace
	plupload.runtimes = {};

	// Expose plupload namespace
	window.plupload = plupload;
})();


/*1.4.3.2*/
(function(){var f=0,l=[],n={},j={},a={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},m=/[<>&\"\']/g,b,c=window.setTimeout,d={},e;function h(){this.returnValue=false}function k(){this.cancelBubble=true}(function(o){var p=o.split(/,/),q,s,r;for(q=0;q<p.length;q+=2){r=p[q+1].split(/ /);for(s=0;s<r.length;s++){j[r[s]]=p[q]}}})("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats,docx pptx xlsx,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/html,htm html xhtml,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/vnd.rn-realvideo,rv,text/plain,asc txt text diff log,application/octet-stream,exe");var g={VERSION:"1.4.3.2",STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,IMAGE_FORMAT_ERROR:-700,IMAGE_MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702,mimeTypes:j,extend:function(o){g.each(arguments,function(p,q){if(q>0){g.each(p,function(s,r){o[r]=s})}});return o},cleanName:function(o){var p,q;q=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"];for(p=0;p<q.length;p+=2){o=o.replace(q[p],q[p+1])}o=o.replace(/\s+/g,"_");o=o.replace(/[^a-z0-9_\-\.]+/gi,"");return o},addRuntime:function(o,p){p.name=o;l[o]=p;l.push(p);return p},guid:function(){var o=new Date().getTime().toString(32),p;for(p=0;p<5;p++){o+=Math.floor(Math.random()*65535).toString(32)}return(g.guidPrefix||"p")+o+(f++).toString(32)},buildUrl:function(p,o){var q="";g.each(o,function(s,r){q+=(q?"&":"")+encodeURIComponent(r)+"="+encodeURIComponent(s)});if(q){p+=(p.indexOf("?")>0?"&":"?")+q}return p},each:function(r,s){var q,p,o;if(r){q=r.length;if(q===b){for(p in r){if(r.hasOwnProperty(p)){if(s(r[p],p)===false){return}}}}else{for(o=0;o<q;o++){if(s(r[o],o)===false){return}}}}},formatSize:function(o){if(o===b||/\D/.test(o)){return g.translate("N/A")}if(o>1073741824){return Math.round(o/1073741824,1)+" GB"}if(o>1048576){return Math.round(o/1048576,1)+" MB"}if(o>1024){return Math.round(o/1024,1)+" KB"}return o+" b"},getPos:function(p,t){var u=0,s=0,w,v=document,q,r;p=p;t=t||v.body;function o(C){var A,B,z=0,D=0;if(C){B=C.getBoundingClientRect();A=v.compatMode==="CSS1Compat"?v.documentElement:v.body;z=B.left+A.scrollLeft;D=B.top+A.scrollTop}return{x:z,y:D}}if(p&&p.getBoundingClientRect&&(navigator.userAgent.indexOf("MSIE")>0&&v.documentMode!==8)){q=o(p);r=o(t);return{x:q.x-r.x,y:q.y-r.y}}w=p;while(w&&w!=t&&w.nodeType){u+=w.offsetLeft||0;s+=w.offsetTop||0;w=w.offsetParent}w=p.parentNode;while(w&&w!=t&&w.nodeType){u-=w.scrollLeft||0;s-=w.scrollTop||0;w=w.parentNode}return{x:u,y:s}},getSize:function(o){return{w:o.offsetWidth||o.clientWidth,h:o.offsetHeight||o.clientHeight}},parseSize:function(o){var p;if(typeof(o)=="string"){o=/^([0-9]+)([mgk]+)$/.exec(o.toLowerCase().replace(/[^0-9mkg]/g,""));p=o[2];o=+o[1];if(p=="g"){o*=1073741824}if(p=="m"){o*=1048576}if(p=="k"){o*=1024}}return o},xmlEncode:function(o){return o?(""+o).replace(m,function(p){return a[p]?"&"+a[p]+";":p}):o},toArray:function(q){var p,o=[];for(p=0;p<q.length;p++){o[p]=q[p]}return o},addI18n:function(o){return g.extend(n,o)},translate:function(o){return n[o]||o},isEmptyObj:function(o){if(o===b){return true}for(var p in o){return false}return true},hasClass:function(q,p){var o;if(q.className==""){return false}o=new RegExp("(^|\\s+)"+p+"(\\s+|$)");return o.test(q.className)},addClass:function(p,o){if(!g.hasClass(p,o)){p.className=p.className==""?o:p.className.replace(/\s+$/,"")+" "+o}},removeClass:function(q,p){var o=new RegExp("(^|\\s+)"+p+"(\\s+|$)");q.className=q.className.replace(o,function(s,r,t){return r===" "&&t===" "?" ":""})},getStyle:function(p,o){if(p.currentStyle){return p.currentStyle[o]}else{if(window.getComputedStyle){return window.getComputedStyle(p,null)[o]}}},addEvent:function(t,o,u){var s,r,q,p;p=arguments[3];o=o.toLowerCase();if(e===b){e="Plupload_"+g.guid()}if(t.attachEvent){s=function(){var v=window.event;if(!v.target){v.target=v.srcElement}v.preventDefault=h;v.stopPropagation=k;u(v)};t.attachEvent("on"+o,s)}else{if(t.addEventListener){s=u;t.addEventListener(o,s,false)}}if(t[e]===b){t[e]=g.guid()}if(!d.hasOwnProperty(t[e])){d[t[e]]={}}r=d[t[e]];if(!r.hasOwnProperty(o)){r[o]=[]}r[o].push({func:s,orig:u,key:p})},removeEvent:function(t,o){var r,u,q;if(typeof(arguments[2])=="function"){u=arguments[2]}else{q=arguments[2]}o=o.toLowerCase();if(t[e]&&d[t[e]]&&d[t[e]][o]){r=d[t[e]][o]}else{return}for(var p=r.length-1;p>=0;p--){if(r[p].key===q||r[p].orig===u){if(t.detachEvent){t.detachEvent("on"+o,r[p].func)}else{if(t.removeEventListener){t.removeEventListener(o,r[p].func,false)}}r[p].orig=null;r[p].func=null;r.splice(p,1);if(u!==b){break}}}if(!r.length){delete d[t[e]][o]}if(g.isEmptyObj(d[t[e]])){delete d[t[e]];try{delete t[e]}catch(s){t[e]=b}}},removeAllEvents:function(p){var o=arguments[1];if(p[e]===b||!p[e]){return}g.each(d[p[e]],function(r,q){g.removeEvent(p,q,o)})}};g.Uploader=function(r){var p={},u,t=[],q;u=new g.QueueProgress();r=g.extend({chunk_size:0,multipart:true,multi_selection:true,file_data_name:"file",filters:[]},r);function s(){var w,x=0,v;if(this.state==g.STARTED){for(v=0;v<t.length;v++){if(!w&&t[v].status==g.QUEUED){w=t[v];w.status=g.UPLOADING;this.trigger("BeforeUpload",w);this.trigger("UploadFile",w)}else{x++}}if(x==t.length){this.trigger("UploadComplete",t);this.stop()}}}function o(){var w,v;u.reset();for(w=0;w<t.length;w++){v=t[w];if(v.size!==b){u.size+=v.size;u.loaded+=v.loaded}else{u.size=b}if(v.status==g.DONE){u.uploaded++}else{if(v.status==g.FAILED){u.failed++}else{u.queued++}}}if(u.size===b){u.percent=t.length>0?Math.ceil(u.uploaded/t.length*100):0}else{u.bytesPerSec=Math.ceil(u.loaded/((+new Date()-q||1)/1000));u.percent=u.size>0?Math.ceil(u.loaded/u.size*100):0}}g.extend(this,{state:g.STOPPED,runtime:"",features:{},files:t,settings:r,total:u,id:g.guid(),init:function(){var A=this,B,x,w,z=0,y;if(typeof(r.preinit)=="function"){r.preinit(A)}else{g.each(r.preinit,function(D,C){A.bind(C,D)})}r.page_url=r.page_url||document.location.pathname.replace(/\/[^\/]+$/g,"/");if(!/^(\w+:\/\/|\/)/.test(r.url)){r.url=r.page_url+r.url}r.chunk_size=g.parseSize(r.chunk_size);r.max_file_size=g.parseSize(r.max_file_size);A.bind("FilesAdded",function(C,F){var E,D,H=0,I,G=r.filters;if(G&&G.length){I=[];g.each(G,function(J){g.each(J.extensions.split(/,/),function(K){if(/^\s*\*\s*$/.test(K)){I.push("\\.*")}else{I.push("\\."+K.replace(new RegExp("["+("/^$.*+?|()[]{}\\".replace(/./g,"\\$&"))+"]","g"),"\\$&"))}})});I=new RegExp(I.join("|")+"$","i")}for(E=0;E<F.length;E++){D=F[E];D.loaded=0;D.percent=0;D.status=g.QUEUED;if(I&&!I.test(D.name)){C.trigger("Error",{code:g.FILE_EXTENSION_ERROR,message:g.translate("File extension error."),file:D});continue}if(D.size!==b&&D.size>r.max_file_size){C.trigger("Error",{code:g.FILE_SIZE_ERROR,message:g.translate("File size error."),file:D});continue}t.push(D);H++}if(H){c(function(){A.trigger("QueueChanged");A.refresh()},1)}else{return false}});if(r.unique_names){A.bind("UploadFile",function(C,D){var F=D.name.match(/\.([^.]+)$/),E="tmp";if(F){E=F[1]}D.target_name=D.id+"."+E})}A.bind("UploadProgress",function(C,D){D.percent=D.size>0?Math.ceil(D.loaded/D.size*100):100;o()});A.bind("StateChanged",function(C){if(C.state==g.STARTED){q=(+new Date())}else{if(C.state==g.STOPPED){for(B=C.files.length-1;B>=0;B--){if(C.files[B].status==g.UPLOADING){C.files[B].status=g.QUEUED;o()}}}}});A.bind("QueueChanged",o);A.bind("Error",function(C,D){if(D.file){D.file.status=g.FAILED;o();if(C.state==g.STARTED){c(function(){s.call(A)},1)}}});A.bind("FileUploaded",function(C,D){D.status=g.DONE;D.loaded=D.size;C.trigger("UploadProgress",D);c(function(){s.call(A)},1)});if(r.runtimes){x=[];y=r.runtimes.split(/\s?,\s?/);for(B=0;B<y.length;B++){if(l[y[B]]){x.push(l[y[B]])}}}else{x=l}function v(){var F=x[z++],E,C,D;if(F){E=F.getFeatures();C=A.settings.required_features;if(C){C=C.split(",");for(D=0;D<C.length;D++){if(!E[C[D]]){v();return}}}F.init(A,function(G){if(G&&G.success){A.features=E;A.runtime=F.name;A.trigger("Init",{runtime:F.name});A.trigger("PostInit");A.refresh()}else{v()}})}else{A.trigger("Error",{code:g.INIT_ERROR,message:g.translate("Init error.")})}}v();if(typeof(r.init)=="function"){r.init(A)}else{g.each(r.init,function(D,C){A.bind(C,D)})}},refresh:function(){this.trigger("Refresh")},start:function(){if(this.state!=g.STARTED){this.state=g.STARTED;this.trigger("StateChanged");s.call(this)}},stop:function(){if(this.state!=g.STOPPED){this.state=g.STOPPED;this.trigger("StateChanged")}},getFile:function(w){var v;for(v=t.length-1;v>=0;v--){if(t[v].id===w){return t[v]}}},removeFile:function(w){var v;for(v=t.length-1;v>=0;v--){if(t[v].id===w.id){return this.splice(v,1)[0]}}},splice:function(x,v){var w;w=t.splice(x===b?0:x,v===b?t.length:v);this.trigger("FilesRemoved",w);this.trigger("QueueChanged");return w},trigger:function(w){var y=p[w.toLowerCase()],x,v;if(y){v=Array.prototype.slice.call(arguments);v[0]=this;for(x=0;x<y.length;x++){if(y[x].func.apply(y[x].scope,v)===false){return false}}}return true},bind:function(v,x,w){var y;v=v.toLowerCase();y=p[v]||[];y.push({func:x,scope:w||this});p[v]=y},unbind:function(v){v=v.toLowerCase();var y=p[v],w,x=arguments[1];if(y){if(x!==b){for(w=y.length-1;w>=0;w--){if(y[w].func===x){y.splice(w,1);break}}}else{y=[]}if(!y.length){delete p[v]}}},unbindAll:function(){var v=this;g.each(p,function(x,w){v.unbind(w)})},destroy:function(){this.trigger("Destroy");this.unbindAll()}})};g.File=function(r,p,q){var o=this;o.id=r;o.name=p;o.size=q;o.loaded=0;o.percent=0;o.status=0};g.Runtime=function(){this.getFeatures=function(){};this.init=function(o,p){}};g.QueueProgress=function(){var o=this;o.size=0;o.loaded=0;o.uploaded=0;o.failed=0;o.queued=0;o.percent=0;o.bytesPerSec=0;o.reset=function(){o.size=o.loaded=o.uploaded=o.failed=o.queued=o.percent=o.bytesPerSec=0}};g.runtimes={};window.plupload=g})();(function(){if(window.google&&google.gears){return}var a=null;if(typeof GearsFactory!="undefined"){a=new GearsFactory()}else{try{a=new ActiveXObject("Gears.Factory");if(a.getBuildInfo().indexOf("ie_mobile")!=-1){a.privateSetGlobalObject(this)}}catch(b){if((typeof navigator.mimeTypes!="undefined")&&navigator.mimeTypes["application/x-googlegears"]){a=document.createElement("object");a.style.display="none";a.width=0;a.height=0;a.type="application/x-googlegears";document.documentElement.appendChild(a)}}}if(!a){return}if(!window.google){window.google={}}if(!google.gears){google.gears={factory:a}}})();(function(e,b,c,d){var f={};function a(h,k,m){var g,j,l,o;j=google.gears.factory.create("beta.canvas");try{j.decode(h);if(!k.width){k.width=j.width}if(!k.height){k.height=j.height}o=Math.min(width/j.width,height/j.height);if(o<1||(o===1&&m==="image/jpeg")){j.resize(Math.round(j.width*o),Math.round(j.height*o));if(k.quality){return j.encode(m,{quality:k.quality/100})}return j.encode(m)}}catch(n){}return h}c.runtimes.Gears=c.addRuntime("gears",{getFeatures:function(){return{dragdrop:true,jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(j,l){var k;if(!e.google||!google.gears){return l({success:false})}try{k=google.gears.factory.create("beta.desktop")}catch(h){return l({success:false})}function g(o){var n,m,p=[],q;for(m=0;m<o.length;m++){n=o[m];q=c.guid();f[q]=n.blob;p.push(new c.File(q,n.name,n.blob.length))}j.trigger("FilesAdded",p)}j.bind("PostInit",function(){var n=j.settings,m=b.getElementById(n.drop_element);if(m){c.addEvent(m,"dragover",function(o){k.setDropEffect(o,"copy");o.preventDefault()},j.id);c.addEvent(m,"drop",function(p){var o=k.getDragData(p,"application/x-gears-files");if(o){g(o.files)}p.preventDefault()},j.id);m=0}c.addEvent(b.getElementById(n.browse_button),"click",function(s){var r=[],p,o,q;s.preventDefault();for(p=0;p<n.filters.length;p++){q=n.filters[p].extensions.split(",");for(o=0;o<q.length;o++){r.push("."+q[o])}}k.openFiles(g,{singleFile:!n.multi_selection,filter:r})},j.id)});j.bind("UploadFile",function(s,p){var u=0,t,q,r=0,o=s.settings.resize,m;if(o&&/\.(png|jpg|jpeg)$/i.test(p.name)){f[p.id]=a(f[p.id],o,/\.png$/i.test(p.name)?"image/png":"image/jpeg")}p.size=f[p.id].length;q=s.settings.chunk_size;m=q>0;t=Math.ceil(p.size/q);if(!m){q=p.size;t=1}function n(){var z,B,w=s.settings.multipart,v=0,A={name:p.target_name||p.name},x=s.settings.url;function y(D){var C,I="----pluploadboundary"+c.guid(),F="--",H="\r\n",E,G;if(w){z.setRequestHeader("Content-Type","multipart/form-data; boundary="+I);C=google.gears.factory.create("beta.blobbuilder");c.each(c.extend(A,s.settings.multipart_params),function(K,J){C.append(F+I+H+'Content-Disposition: form-data; name="'+J+'"'+H+H);C.append(K+H)});G=c.mimeTypes[p.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream";C.append(F+I+H+'Content-Disposition: form-data; name="'+s.settings.file_data_name+'"; filename="'+p.name+'"'+H+"Content-Type: "+G+H+H);C.append(D);C.append(H+F+I+F+H);E=C.getAsBlob();v=E.length-D.length;D=E}z.send(D)}if(p.status==c.DONE||p.status==c.FAILED||s.state==c.STOPPED){return}if(m){A.chunk=u;A.chunks=t}B=Math.min(q,p.size-(u*q));if(!w){x=c.buildUrl(s.settings.url,A)}z=google.gears.factory.create("beta.httprequest");z.open("POST",x);if(!w){z.setRequestHeader("Content-Disposition",'attachment; filename="'+p.name+'"');z.setRequestHeader("Content-Type","application/octet-stream")}c.each(s.settings.headers,function(D,C){z.setRequestHeader(C,D)});z.upload.onprogress=function(C){p.loaded=r+C.loaded-v;s.trigger("UploadProgress",p)};z.onreadystatechange=function(){var C;if(z.readyState==4){if(z.status==200){C={chunk:u,chunks:t,response:z.responseText,status:z.status};s.trigger("ChunkUploaded",p,C);if(C.cancelled){p.status=c.FAILED;return}r+=B;if(++u>=t){p.status=c.DONE;s.trigger("FileUploaded",p,{response:z.responseText,status:z.status})}else{n()}}else{s.trigger("Error",{code:c.HTTP_ERROR,message:c.translate("HTTP Error."),file:p,chunk:u,chunks:t,status:z.status})}}};if(u<t){y(f[p.id].slice(u*q,B))}}n()});j.bind("Destroy",function(m){var n,o,p={browseButton:m.settings.browse_button,dropElm:m.settings.drop_element};for(n in p){o=b.getElementById(p[n]);if(o){c.removeAllEvents(o,m.id)}}});l({success:true})}})})(window,document,plupload);(function(g,b,d,e){var a={},h={};function c(o){var n,m=typeof o,j,l,k;if(m==="string"){n="\bb\tt\nn\ff\rr\"\"''\\\\";return'"'+o.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g,function(r,q){var p=n.indexOf(q);if(p+1){return"\\"+n.charAt(p+1)}r=q.charCodeAt().toString(16);return"\\u"+"0000".substring(r.length)+r})+'"'}if(m=="object"){j=o.length!==e;n="";if(j){for(l=0;l<o.length;l++){if(n){n+=","}n+=c(o[l])}n="["+n+"]"}else{for(k in o){if(o.hasOwnProperty(k)){if(n){n+=","}n+=c(k)+":"+c(o[k])}}n="{"+n+"}"}return n}if(o===e){return"null"}return""+o}function f(s){var v=false,j=null,o=null,k,l,m,u,n,q=0;try{try{o=new ActiveXObject("AgControl.AgControl");if(o.IsVersionSupported(s)){v=true}o=null}catch(r){var p=navigator.plugins["Silverlight Plug-In"];if(p){k=p.description;if(k==="1.0.30226.2"){k="2.0.30226.2"}l=k.split(".");while(l.length>3){l.pop()}while(l.length<4){l.push(0)}m=s.split(".");while(m.length>4){m.pop()}do{u=parseInt(m[q],10);n=parseInt(l[q],10);q++}while(q<m.length&&u===n);if(u<=n&&!isNaN(u)){v=true}}}}catch(t){v=false}return v}d.silverlight={trigger:function(n,k){var m=a[n],l,j;if(m){j=d.toArray(arguments).slice(1);j[0]="Silverlight:"+k;setTimeout(function(){m.trigger.apply(m,j)},0)}}};d.runtimes.Silverlight=d.addRuntime("silverlight",{getFeatures:function(){return{jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(p,q){var o,m="",n=p.settings.filters,l,k=b.body;if(!f("2.0.31005.0")||(g.opera&&g.opera.buildNumber)){q({success:false});return}h[p.id]=false;a[p.id]=p;o=b.createElement("div");o.id=p.id+"_silverlight_container";d.extend(o.style,{position:"absolute",top:"0px",background:p.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100px",height:"100px",overflow:"hidden",opacity:p.settings.shim_bgcolor||b.documentMode>8?"":0.01});o.className="plupload silverlight";if(p.settings.container){k=b.getElementById(p.settings.container);if(d.getStyle(k,"position")==="static"){k.style.position="relative"}}k.appendChild(o);for(l=0;l<n.length;l++){m+=(m!=""?"|":"")+n[l].title+" | *."+n[l].extensions.replace(/,/g,";*.")}o.innerHTML='<object id="'+p.id+'_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="'+p.settings.silverlight_xap_url+'"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id='+p.id+",filter="+m+",multiselect="+p.settings.multi_selection+'"/></object>';function j(){return b.getElementById(p.id+"_silverlight").content.Upload}p.bind("Silverlight:Init",function(){var r,s={};if(h[p.id]){return}h[p.id]=true;p.bind("Silverlight:StartSelectFiles",function(t){r=[]});p.bind("Silverlight:SelectFile",function(t,w,u,v){var x;x=d.guid();s[x]=w;s[w]=x;r.push(new d.File(x,u,v))});p.bind("Silverlight:SelectSuccessful",function(){if(r.length){p.trigger("FilesAdded",r)}});p.bind("Silverlight:UploadChunkError",function(t,w,u,x,v){p.trigger("Error",{code:d.IO_ERROR,message:"IO Error.",details:v,file:t.getFile(s[w])})});p.bind("Silverlight:UploadFileProgress",function(t,x,u,w){var v=t.getFile(s[x]);if(v.status!=d.FAILED){v.size=w;v.loaded=u;t.trigger("UploadProgress",v)}});p.bind("Refresh",function(t){var u,v,w;u=b.getElementById(t.settings.browse_button);if(u){v=d.getPos(u,b.getElementById(t.settings.container));w=d.getSize(u);d.extend(b.getElementById(t.id+"_silverlight_container").style,{top:v.y+"px",left:v.x+"px",width:w.w+"px",height:w.h+"px"})}});p.bind("Silverlight:UploadChunkSuccessful",function(t,w,u,z,y){var x,v=t.getFile(s[w]);x={chunk:u,chunks:z,response:y};t.trigger("ChunkUploaded",v,x);if(v.status!=d.FAILED){j().UploadNextChunk()}if(u==z-1){v.status=d.DONE;t.trigger("FileUploaded",v,{response:y})}});p.bind("Silverlight:UploadSuccessful",function(t,w,u){var v=t.getFile(s[w]);v.status=d.DONE;t.trigger("FileUploaded",v,{response:u})});p.bind("FilesRemoved",function(t,v){var u;for(u=0;u<v.length;u++){j().RemoveFile(s[v[u].id])}});p.bind("UploadFile",function(t,v){var w=t.settings,u=w.resize||{};j().UploadFile(s[v.id],t.settings.url,c({name:v.target_name||v.name,mime:d.mimeTypes[v.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream",chunk_size:w.chunk_size,image_width:u.width,image_height:u.height,image_quality:u.quality||90,multipart:!!w.multipart,multipart_params:w.multipart_params||{},file_data_name:w.file_data_name,headers:w.headers}))});p.bind("Silverlight:MouseEnter",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.addClass(u,v)}});p.bind("Silverlight:MouseLeave",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.removeClass(u,v)}});p.bind("Silverlight:MouseLeftButtonDown",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.addClass(u,v);d.addEvent(b.body,"mouseup",function(){d.removeClass(u,v)})}});p.bind("Sliverlight:StartSelectFiles",function(t){var u,v;u=b.getElementById(p.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.removeClass(u,v)}});p.bind("Destroy",function(t){var u;d.removeAllEvents(b.body,t.id);delete h[t.id];delete a[t.id];u=b.getElementById(t.id+"_silverlight_container");if(u){k.removeChild(u)}});q({success:true})})}})})(window,document,plupload);(function(f,b,d,e){var a={},g={};function c(){var h;try{h=navigator.plugins["Shockwave Flash"];h=h.description}catch(k){try{h=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(j){h="0.0"}}h=h.match(/\d+/g);return parseFloat(h[0]+"."+h[1])}d.flash={trigger:function(k,h,j){setTimeout(function(){var n=a[k],m,l;if(n){n.trigger("Flash:"+h,j)}},0)}};d.runtimes.Flash=d.addRuntime("flash",{getFeatures:function(){return{jpgresize:true,pngresize:true,maxWidth:8091,maxHeight:8091,chunks:true,progress:true,multipart:true}},init:function(k,p){var o,j,l,q=0,h=b.body;if(c()<10){p({success:false});return}g[k.id]=false;a[k.id]=k;o=b.getElementById(k.settings.browse_button);j=b.createElement("div");j.id=k.id+"_flash_container";d.extend(j.style,{position:"absolute",top:"0px",background:k.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100%",height:"100%"});j.className="plupload flash";if(k.settings.container){h=b.getElementById(k.settings.container);if(d.getStyle(h,"position")==="static"){h.style.position="relative"}}h.appendChild(j);l="id="+escape(k.id);j.innerHTML='<object id="'+k.id+'_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="'+k.settings.flash_swf_url+'"><param name="movie" value="'+k.settings.flash_swf_url+'" /><param name="flashvars" value="'+l+'" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';function n(){return b.getElementById(k.id+"_flash")}function m(){if(q++>5000){p({success:false});return}if(!g[k.id]){setTimeout(m,1)}}m();o=j=null;k.bind("Flash:Init",function(){var s={},r;n().setFileFilters(k.settings.filters,k.settings.multi_selection);if(g[k.id]){return}g[k.id]=true;k.bind("UploadFile",function(t,v){var w=t.settings,u=k.settings.resize||{};n().uploadFile(s[v.id],w.url,{name:v.target_name||v.name,mime:d.mimeTypes[v.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream",chunk_size:w.chunk_size,width:u.width,height:u.height,quality:u.quality,multipart:w.multipart,multipart_params:w.multipart_params||{},file_data_name:w.file_data_name,format:/\.(jpg|jpeg)$/i.test(v.name)?"jpg":"png",headers:w.headers,urlstream_upload:w.urlstream_upload})});k.bind("Flash:UploadProcess",function(u,t){var v=u.getFile(s[t.id]);if(v.status!=d.FAILED){v.loaded=t.loaded;v.size=t.size;u.trigger("UploadProgress",v)}});k.bind("Flash:UploadChunkComplete",function(t,v){var w,u=t.getFile(s[v.id]);w={chunk:v.chunk,chunks:v.chunks,response:v.text};t.trigger("ChunkUploaded",u,w);if(u.status!=d.FAILED){n().uploadNextChunk()}if(v.chunk==v.chunks-1){u.status=d.DONE;t.trigger("FileUploaded",u,{response:v.text})}});k.bind("Flash:SelectFiles",function(t,w){var v,u,x=[],y;for(u=0;u<w.length;u++){v=w[u];y=d.guid();s[y]=v.id;s[v.id]=y;x.push(new d.File(y,v.name,v.size))}if(x.length){k.trigger("FilesAdded",x)}});k.bind("Flash:SecurityError",function(t,u){k.trigger("Error",{code:d.SECURITY_ERROR,message:d.translate("Security error."),details:u.message,file:k.getFile(s[u.id])})});k.bind("Flash:GenericError",function(t,u){k.trigger("Error",{code:d.GENERIC_ERROR,message:d.translate("Generic error."),details:u.message,file:k.getFile(s[u.id])})});k.bind("Flash:IOError",function(t,u){k.trigger("Error",{code:d.IO_ERROR,message:d.translate("IO error."),details:u.message,file:k.getFile(s[u.id])})});k.bind("Flash:ImageError",function(t,u){k.trigger("Error",{code:parseInt(u.code,10),message:d.translate("Image error."),file:k.getFile(s[u.id])})});k.bind("Flash:StageEvent:rollOver",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.addClass(u,v)}});k.bind("Flash:StageEvent:rollOut",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_hover;if(u&&v){d.removeClass(u,v)}});k.bind("Flash:StageEvent:mouseDown",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.addClass(u,v);d.addEvent(b.body,"mouseup",function(){d.removeClass(u,v)},t.id)}});k.bind("Flash:StageEvent:mouseUp",function(t){var u,v;u=b.getElementById(k.settings.browse_button);v=t.settings.browse_button_active;if(u&&v){d.removeClass(u,v)}});k.bind("QueueChanged",function(t){k.refresh()});k.bind("FilesRemoved",function(t,v){var u;for(u=0;u<v.length;u++){n().removeFile(s[v[u].id])}});k.bind("StateChanged",function(t){k.refresh()});k.bind("Refresh",function(t){var u,v,w;n().setFileFilters(k.settings.filters,k.settings.multi_selection);u=b.getElementById(t.settings.browse_button);if(u){v=d.getPos(u,b.getElementById(t.settings.container));w=d.getSize(u);d.extend(b.getElementById(t.id+"_flash_container").style,{top:v.y+"px",left:v.x+"px",width:w.w+"px",height:w.h+"px"})}});k.bind("Destroy",function(t){var u;d.removeAllEvents(b.body,t.id);delete g[t.id];delete a[t.id];u=b.getElementById(t.id+"_flash_container");if(u){h.removeChild(u)}});p({success:true})})}})})(window,document,plupload);(function(a){a.runtimes.BrowserPlus=a.addRuntime("browserplus",{getFeatures:function(){return{dragdrop:true,jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(g,j){var e=window.BrowserPlus,h={},d=g.settings,c=d.resize;function f(o){var n,m,k=[],l,p;for(m=0;m<o.length;m++){l=o[m];p=a.guid();h[p]=l;k.push(new a.File(p,l.name,l.size))}if(m){g.trigger("FilesAdded",k)}}function b(){g.bind("PostInit",function(){var n,l=d.drop_element,p=g.id+"_droptarget",k=document.getElementById(l),m;function q(s,r){e.DragAndDrop.AddDropTarget({id:s},function(t){e.DragAndDrop.AttachCallbacks({id:s,hover:function(u){if(!u&&r){r()}},drop:function(u){if(r){r()}f(u)}},function(){})})}function o(){document.getElementById(p).style.top="-1000px"}if(k){if(document.attachEvent&&(/MSIE/gi).test(navigator.userAgent)){n=document.createElement("div");n.setAttribute("id",p);a.extend(n.style,{position:"absolute",top:"-1000px",background:"red",filter:"alpha(opacity=0)",opacity:0});document.body.appendChild(n);a.addEvent(k,"dragenter",function(s){var r,t;r=document.getElementById(l);t=a.getPos(r);a.extend(document.getElementById(p).style,{top:t.y+"px",left:t.x+"px",width:r.offsetWidth+"px",height:r.offsetHeight+"px"})});q(p,o)}else{q(l)}}a.addEvent(document.getElementById(d.browse_button),"click",function(w){var u=[],s,r,v=d.filters,t;w.preventDefault();for(s=0;s<v.length;s++){t=v[s].extensions.split(",");for(r=0;r<t.length;r++){u.push(a.mimeTypes[t[r]])}}e.FileBrowse.OpenBrowseDialog({mimeTypes:u},function(x){if(x.success){f(x.value)}})});k=n=null});g.bind("UploadFile",function(n,k){var m=h[k.id],s={},l=n.settings.chunk_size,o,p=[];function r(t,v){var u;if(k.status==a.FAILED){return}s.name=k.target_name||k.name;if(l){s.chunk=""+t;s.chunks=""+v}u=p.shift();e.Uploader.upload({url:n.settings.url,files:{file:u},cookies:document.cookies,postvars:a.extend(s,n.settings.multipart_params),progressCallback:function(y){var x,w=0;o[t]=parseInt(y.filePercent*u.size/100,10);for(x=0;x<o.length;x++){w+=o[x]}k.loaded=w;n.trigger("UploadProgress",k)}},function(x){var w,y;if(x.success){w=x.value.statusCode;if(l){n.trigger("ChunkUploaded",k,{chunk:t,chunks:v,response:x.value.body,status:w})}if(p.length>0){r(++t,v)}else{k.status=a.DONE;n.trigger("FileUploaded",k,{response:x.value.body,status:w});if(w>=400){n.trigger("Error",{code:a.HTTP_ERROR,message:a.translate("HTTP Error."),file:k,status:w})}}}else{n.trigger("Error",{code:a.GENERIC_ERROR,message:a.translate("Generic Error."),file:k,details:x.error})}})}function q(t){k.size=t.size;if(l){e.FileAccess.chunk({file:t,chunkSize:l},function(w){if(w.success){var x=w.value,u=x.length;o=Array(u);for(var v=0;v<u;v++){o[v]=0;p.push(x[v])}r(0,u)}})}else{o=Array(1);p.push(t);r(0,1)}}if(c&&/\.(png|jpg|jpeg)$/i.test(k.name)){BrowserPlus.ImageAlter.transform({file:m,quality:c.quality||90,actions:[{scale:{maxwidth:c.width,maxheight:c.height}}]},function(t){if(t.success){q(t.value.file)}})}else{q(m)}});j({success:true})}if(e){e.init(function(l){var k=[{service:"Uploader",version:"3"},{service:"DragAndDrop",version:"1"},{service:"FileBrowse",version:"1"},{service:"FileAccess",version:"2"}];if(c){k.push({service:"ImageAlter",version:"4"})}if(l.success){e.require({services:k},function(m){if(m.success){b()}else{j()}})}else{j()}})}else{j()}}})})(plupload);(function(g,j,h,d){var f;if(g.Uint8Array&&g.ArrayBuffer&&!XMLHttpRequest.prototype.sendAsBinary){XMLHttpRequest.prototype.sendAsBinary=function(o){var m=new Uint8Array(o.length);for(var n=0;n<o.length;n++){m[n]=(o.charCodeAt(n)&255)}this.send(m.buffer)}}function l(n,o){var m;if("FileReader" in g){m=new FileReader();m.readAsDataURL(n);m.onload=function(){o(m.result)}}else{return o(n.getAsDataURL())}}function k(n,o){var m;if("FileReader" in g){m=new FileReader();m.readAsBinaryString(n);m.onload=function(){o(m.result)}}else{return o(n.getAsBinary())}}function c(q,o,r,t){var n,p,m,s;l(q,function(u){n=j.createElement("canvas");n.style.display="none";j.body.appendChild(n);p=n.getContext("2d");m=new Image();m.onerror=m.onabort=function(){t({success:false})};m.onload=function(){var z,v,x,w,y;if(!o.width){o.width=m.width}if(!o.height){o.height=m.height}s=Math.min(o.width/m.width,o.height/m.height);if(s<1||(s===1&&r==="image/jpeg")){z=Math.round(m.width*s);v=Math.round(m.height*s);n.width=z;n.height=v;p.drawImage(m,0,0,z,v);if(r==="image/jpeg"){w=new e(atob(u.substring(u.indexOf("base64,")+7)));if(w.headers&&w.headers.length){y=new a();if(y.init(w.get("exif")[0])){y.setExif("PixelXDimension",z);y.setExif("PixelYDimension",v);w.set("exif",y.getBinary())}}if(o.quality){try{u=n.toDataURL(r,o.quality/100)}catch(A){u=n.toDataURL(r)}}}else{u=n.toDataURL(r)}u=u.substring(u.indexOf("base64,")+7);u=atob(u);if(w.headers&&w.headers.length){u=w.restore(u);w.purge()}n.parentNode.removeChild(n);t({success:true,data:u})}else{t({success:false})}};m.src=u})}h.runtimes.Html5=h.addRuntime("html5",{getFeatures:function(){var r,n,q,o,m,p=g;n=q=o=m=false;if(p.XMLHttpRequest){r=new XMLHttpRequest();q=!!r.upload;n=!!(r.sendAsBinary||r.upload)}if(n){o=!!(File&&(File.prototype.getAsDataURL||p.FileReader)&&r.sendAsBinary);m=!!(File&&File.prototype.slice)}f=navigator.userAgent.indexOf("Safari")>0&&navigator.vendor.indexOf("Apple")!==-1;return{html5:n,dragdrop:p.mozInnerScreenX!==d||m||f,jpgresize:o,pngresize:o,multipart:o||!!p.FileReader||!!p.FormData,progress:q,chunks:m||o,canOpenDialog:navigator.userAgent.indexOf("WebKit")!==-1}},init:function(p,q){var m={},n;function o(v){var t,s,u=[],w,r={};for(s=0;s<v.length;s++){t=v[s];if(r[t.name]){continue}r[t.name]=true;w=h.guid();m[w]=t;u.push(new h.File(w,t.fileName,t.fileSize||t.size))}if(u.length){p.trigger("FilesAdded",u)}}n=this.getFeatures();if(!n.html5){q({success:false});return}p.bind("Init",function(v){var F,E,B=[],u,C,s=v.settings.filters,t,A,r=j.body,D;F=j.createElement("div");F.id=v.id+"_html5_container";h.extend(F.style,{position:"absolute",background:p.settings.shim_bgcolor||"transparent",width:"100px",height:"100px",overflow:"hidden",zIndex:99999,opacity:p.settings.shim_bgcolor?"":0});F.className="plupload html5";if(p.settings.container){r=j.getElementById(p.settings.container);if(h.getStyle(r,"position")==="static"){r.style.position="relative"}}r.appendChild(F);no_type_restriction:for(u=0;u<s.length;u++){t=s[u].extensions.split(/,/);for(C=0;C<t.length;C++){if(t[C]==="*"){B=[];break no_type_restriction}A=h.mimeTypes[t[C]];if(A){B.push(A)}}}F.innerHTML='<input id="'+p.id+'_html5" style="width:100%;height:100%;font-size:99px" type="file" accept="'+B.join(",")+'" '+(p.settings.multi_selection?'multiple="multiple"':"")+" />";D=j.getElementById(p.id+"_html5");D.onchange=function(){o(this.files);this.value=""};E=j.getElementById(v.settings.browse_button);if(E){var x=v.settings.browse_button_hover,z=v.settings.browse_button_active,w=v.features.canOpenDialog?E:F;if(x){h.addEvent(w,"mouseover",function(){h.addClass(E,x)},v.id);h.addEvent(w,"mouseout",function(){h.removeClass(E,x)},v.id)}if(z){h.addEvent(w,"mousedown",function(){h.addClass(E,z)},v.id);h.addEvent(j.body,"mouseup",function(){h.removeClass(E,z)},v.id)}if(v.features.canOpenDialog){h.addEvent(E,"click",function(y){j.getElementById(v.id+"_html5").click();y.preventDefault()},v.id)}}});p.bind("PostInit",function(){var r=j.getElementById(p.settings.drop_element);if(r){if(f){h.addEvent(r,"dragenter",function(v){var u,s,t;u=j.getElementById(p.id+"_drop");if(!u){u=j.createElement("input");u.setAttribute("type","file");u.setAttribute("id",p.id+"_drop");u.setAttribute("multiple","multiple");h.addEvent(u,"change",function(){o(this.files);h.removeEvent(u,"change",p.id);u.parentNode.removeChild(u)},p.id);r.appendChild(u)}s=h.getPos(r,j.getElementById(p.settings.container));t=h.getSize(r);if(h.getStyle(r,"position")==="static"){h.extend(r.style,{position:"relative"})}h.extend(u.style,{position:"absolute",display:"block",top:0,left:0,width:t.w+"px",height:t.h+"px",opacity:0})},p.id);return}h.addEvent(r,"dragover",function(s){s.preventDefault()},p.id);h.addEvent(r,"drop",function(t){var s=t.dataTransfer;if(s&&s.files){o(s.files)}t.preventDefault()},p.id)}});p.bind("Refresh",function(r){var s,u,v,w,t;s=j.getElementById(p.settings.browse_button);if(s){u=h.getPos(s,j.getElementById(r.settings.container));v=h.getSize(s);w=j.getElementById(p.id+"_html5_container");h.extend(w.style,{top:u.y+"px",left:u.x+"px",width:v.w+"px",height:v.h+"px"});if(p.features.canOpenDialog){t=parseInt(s.parentNode.style.zIndex,10);if(isNaN(t)){t=0}h.extend(s.style,{zIndex:t});if(h.getStyle(s,"position")==="static"){h.extend(s.style,{position:"relative"})}h.extend(w.style,{zIndex:t-1})}}});p.bind("UploadFile",function(r,t){var u=r.settings,w,s;function v(x){var A=0,z=0;function y(){var H=x,O,P,K,L,M=0,D="----pluploadboundary"+h.guid(),G,I,E,F="--",N="\r\n",J="",C,B=r.settings.url;if(t.status==h.DONE||t.status==h.FAILED||r.state==h.STOPPED){return}L={name:t.target_name||t.name};if(u.chunk_size&&n.chunks){G=u.chunk_size;K=Math.ceil(t.size/G);I=Math.min(G,t.size-(A*G));if(typeof(x)=="string"){H=x.substring(A*G,A*G+I)}else{H=x.slice(A*G,I)}L.chunk=A;L.chunks=K}else{I=t.size}O=new XMLHttpRequest();P=O.upload;if(P){P.onprogress=function(Q){t.loaded=Math.min(t.size,z+Q.loaded-M);r.trigger("UploadProgress",t)}}if(!r.settings.multipart||!n.multipart){B=h.buildUrl(r.settings.url,L)}else{L.name=t.target_name||t.name}O.open("post",B,true);O.onreadystatechange=function(){var Q,S;if(O.readyState==4){try{Q=O.status}catch(R){Q=0}if(Q>=400){r.trigger("Error",{code:h.HTTP_ERROR,message:h.translate("HTTP Error."),file:t,status:Q})}else{if(K){S={chunk:A,chunks:K,response:O.responseText,status:Q};r.trigger("ChunkUploaded",t,S);z+=I;if(S.cancelled){t.status=h.FAILED;return}t.loaded=Math.min(t.size,(A+1)*G)}else{t.loaded=t.size}r.trigger("UploadProgress",t);if(!K||++A>=K){t.status=h.DONE;r.trigger("FileUploaded",t,{response:O.responseText,status:Q});w=x=m[t.id]=null}else{y()}}O=H=E=J=null}};h.each(r.settings.headers,function(R,Q){O.setRequestHeader(Q,R)});if(r.settings.multipart&&n.multipart){if(!O.sendAsBinary){E=new FormData();h.each(h.extend(L,r.settings.multipart_params),function(R,Q){E.append(Q,R)});E.append(r.settings.file_data_name,H);O.send(E);return}O.setRequestHeader("Content-Type","multipart/form-data; boundary="+D);h.each(h.extend(L,r.settings.multipart_params),function(R,Q){J+=F+D+N+'Content-Disposition: form-data; name="'+Q+'"'+N+N;J+=unescape(encodeURIComponent(R))+N});C=h.mimeTypes[t.name.replace(/^.+\.([^.]+)/,"$1").toLowerCase()]||"application/octet-stream";J+=F+D+N+'Content-Disposition: form-data; name="'+r.settings.file_data_name+'"; filename="'+unescape(encodeURIComponent(t.name))+'"'+N+"Content-Type: "+C+N+N+H+N+F+D+F+N;M=J.length-H.length;H=J}else{O.setRequestHeader("Content-Type","application/octet-stream")}if(O.sendAsBinary){O.sendAsBinary(H)}else{O.send(H)}}y()}w=m[t.id];s=r.settings.resize;if(n.jpgresize){if(s&&/\.(png|jpg|jpeg)$/i.test(t.name)){c(w,s,/\.png$/i.test(t.name)?"image/png":"image/jpeg",function(x){if(x.success){t.size=x.data.length;v(x.data)}else{k(w,v)}})}else{k(w,v)}}else{v(w)}});p.bind("Destroy",function(r){var t,u,s=j.body,v={inputContainer:r.id+"_html5_container",inputFile:r.id+"_html5",browseButton:r.settings.browse_button,dropElm:r.settings.drop_element};for(t in v){u=j.getElementById(v[t]);if(u){h.removeAllEvents(u,r.id)}}h.removeAllEvents(j.body,r.id);if(r.settings.container){s=j.getElementById(r.settings.container)}s.removeChild(j.getElementById(v.inputContainer))});q({success:true})}});function b(){var p=false,n;function q(s,u){var r=p?0:-8*(u-1),v=0,t;for(t=0;t<u;t++){v|=(n.charCodeAt(s+t)<<Math.abs(r+t*8))}return v}function m(t,r,s){var s=arguments.length===3?s:n.length-r-1;n=n.substr(0,r)+t+n.substr(s+r)}function o(s,t,v){var w="",r=p?0:-8*(v-1),u;for(u=0;u<v;u++){w+=String.fromCharCode((t>>Math.abs(r+u*8))&255)}m(w,s,v)}return{II:function(r){if(r===d){return p}else{p=r}},init:function(r){p=false;n=r},SEGMENT:function(r,t,s){switch(arguments.length){case 1:return n.substr(r,n.length-r-1);case 2:return n.substr(r,t);case 3:m(s,r,t);break;default:return n}},BYTE:function(r){return q(r,1)},SHORT:function(r){return q(r,2)},LONG:function(r,s){if(s===d){return q(r,4)}else{o(r,s,4)}},SLONG:function(r){var s=q(r,4);return(s>2147483647?s-4294967296:s)},STRING:function(r,s){var t="";for(s+=r;r<s;r++){t+=String.fromCharCode(q(r,1))}return t}}}function e(r){var t={65505:{app:"EXIF",name:"APP1",signature:"Exif\0"},65506:{app:"ICC",name:"APP2",signature:"ICC_PROFILE\0"},65517:{app:"IPTC",name:"APP13",signature:"Photoshop 3.0\0"}},s=[],q,m,o=d,p=0,n;q=new b();q.init(r);if(q.SHORT(0)!==65496){return}m=2;n=Math.min(1048576,r.length);while(m<=n){o=q.SHORT(m);if(o>=65488&&o<=65495){m+=2;continue}if(o===65498||o===65497){break}p=q.SHORT(m+2)+2;if(t[o]&&q.STRING(m+4,t[o].signature.length)===t[o].signature){s.push({hex:o,app:t[o].app.toUpperCase(),name:t[o].name.toUpperCase(),start:m,length:p,segment:q.SEGMENT(m,p)})}m+=p}q.init(null);return{headers:s,restore:function(w){q.init(w);if(q.SHORT(0)!==65496){return false}m=q.SHORT(2)==65504?4+q.SHORT(4):2;for(var v=0,u=s.length;v<u;v++){q.SEGMENT(m,0,s[v].segment);m+=s[v].length}return q.SEGMENT()},get:function(w){var x=[];for(var v=0,u=s.length;v<u;v++){if(s[v].app===w.toUpperCase()){x.push(s[v].segment)}}return x},set:function(x,w){var y=[];if(typeof(w)==="string"){y.push(w)}else{y=w}for(var v=ii=0,u=s.length;v<u;v++){if(s[v].app===x.toUpperCase()){s[v].segment=y[ii];s[v].length=y[ii].length;ii++}if(ii>=y.length){break}}},purge:function(){s=[];q.init(null)}}}function a(){var p,m,n={},s;p=new b();m={tiff:{274:"Orientation",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer"},exif:{36864:"ExifVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",36867:"DateTimeOriginal",33434:"ExposureTime",33437:"FNumber",34855:"ISOSpeedRatings",37377:"ShutterSpeedValue",37378:"ApertureValue",37383:"MeteringMode",37384:"LightSource",37385:"Flash",41986:"ExposureMode",41987:"WhiteBalance",41990:"SceneCaptureType",41988:"DigitalZoomRatio",41992:"Contrast",41993:"Saturation",41994:"Sharpness"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude"}};s={ColorSpace:{1:"sRGB",0:"Uncalibrated"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{1:"Daylight",2:"Fliorescent",3:"Tungsten",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 -5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire.",1:"Flash fired.",5:"Strobe return light not detected.",7:"Strobe return light detected.",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},ExposureMode:{0:"Auto exposure",1:"Manual exposure",2:"Auto bracket"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},GPSLatitudeRef:{N:"North latitude",S:"South latitude"},GPSLongitudeRef:{E:"East longitude",W:"West longitude"}};function o(t,B){var v=p.SHORT(t),y,E,F,A,z,u,w,C,D=[],x={};for(y=0;y<v;y++){w=u=t+12*y+2;F=B[p.SHORT(w)];if(F===d){continue}A=p.SHORT(w+=2);z=p.LONG(w+=2);w+=4;D=[];switch(A){case 1:case 7:if(z>4){w=p.LONG(w)+n.tiffHeader}for(E=0;E<z;E++){D[E]=p.BYTE(w+E)}break;case 2:if(z>4){w=p.LONG(w)+n.tiffHeader}x[F]=p.STRING(w,z-1);continue;case 3:if(z>2){w=p.LONG(w)+n.tiffHeader}for(E=0;E<z;E++){D[E]=p.SHORT(w+E*2)}break;case 4:if(z>1){w=p.LONG(w)+n.tiffHeader}for(E=0;E<z;E++){D[E]=p.LONG(w+E*4)}break;case 5:w=p.LONG(w)+n.tiffHeader;for(E=0;E<z;E++){D[E]=p.LONG(w+E*4)/p.LONG(w+E*4+4)}break;case 9:w=p.LONG(w)+n.tiffHeader;for(E=0;E<z;E++){D[E]=p.SLONG(w+E*4)}break;case 10:w=p.LONG(w)+n.tiffHeader;for(E=0;E<z;E++){D[E]=p.SLONG(w+E*4)/p.SLONG(w+E*4+4)}break;default:continue}C=(z==1?D[0]:D);if(s.hasOwnProperty(F)&&typeof C!="object"){x[F]=s[F][C]}else{x[F]=C}}return x}function r(){var u=d,t=n.tiffHeader;p.II(p.SHORT(t)==18761);if(p.SHORT(t+=2)!==42){return false}n.IFD0=n.tiffHeader+p.LONG(t+=2);u=o(n.IFD0,m.tiff);n.exifIFD=("ExifIFDPointer" in u?n.tiffHeader+u.ExifIFDPointer:d);n.gpsIFD=("GPSInfoIFDPointer" in u?n.tiffHeader+u.GPSInfoIFDPointer:d);return true}function q(v,t,y){var A,x,w,z=0;if(typeof(t)==="string"){var u=m[v.toLowerCase()];for(hex in u){if(u[hex]===t){t=hex;break}}}A=n[v.toLowerCase()+"IFD"];x=p.SHORT(A);for(i=0;i<x;i++){w=A+12*i+2;if(p.SHORT(w)==t){z=w+8;break}}if(!z){return false}p.LONG(z,y);return true}return{init:function(t){n={tiffHeader:10};if(t===d||!t.length){return false}p.init(t);if(p.SHORT(0)===65505&&p.STRING(4,5).toUpperCase()==="EXIF\0"){return r()}return false},EXIF:function(){var t;t=o(n.exifIFD,m.exif);t.ExifVersion=String.fromCharCode(t.ExifVersion[0],t.ExifVersion[1],t.ExifVersion[2],t.ExifVersion[3]);return t},GPS:function(){var t;t=o(n.gpsIFD,m.gps);t.GPSVersionID=t.GPSVersionID.join(".");return t},setExif:function(t,u){if(t!=="PixelXDimension"&&t!=="PixelYDimension"){return false}return q("exif",t,u)},getBinary:function(){return p.SEGMENT()}}}})(window,document,plupload);(function(d,a,b,c){function e(f){return a.getElementById(f)}b.runtimes.Html4=b.addRuntime("html4",{getFeatures:function(){return{multipart:true,canOpenDialog:navigator.userAgent.indexOf("WebKit")!==-1}},init:function(f,g){f.bind("Init",function(p){var j=a.body,n,h="javascript",k,x,q,z=[],r=/MSIE/.test(navigator.userAgent),t=[],m=p.settings.filters,o,l,s,w;no_type_restriction:for(o=0;o<m.length;o++){l=m[o].extensions.split(/,/);for(w=0;w<l.length;w++){if(l[w]==="*"){t=[];break no_type_restriction}s=b.mimeTypes[l[w]];if(s){t.push(s)}}}t=t.join(",");function v(){var C,A,y,B;q=b.guid();z.push(q);C=a.createElement("form");C.setAttribute("id","form_"+q);C.setAttribute("method","post");C.setAttribute("enctype","multipart/form-data");C.setAttribute("encoding","multipart/form-data");C.setAttribute("target",p.id+"_iframe");C.style.position="absolute";A=a.createElement("input");A.setAttribute("id","input_"+q);A.setAttribute("type","file");A.setAttribute("accept",t);A.setAttribute("size",1);B=e(p.settings.browse_button);if(p.features.canOpenDialog&&B){b.addEvent(e(p.settings.browse_button),"click",function(D){A.click();D.preventDefault()},p.id)}b.extend(A.style,{width:"100%",height:"100%",opacity:0,fontSize:"99px"});b.extend(C.style,{overflow:"hidden"});y=p.settings.shim_bgcolor;if(y){C.style.background=y}if(r){b.extend(A.style,{filter:"alpha(opacity=0)"})}b.addEvent(A,"change",function(G){var E=G.target,D,F=[],H;if(E.value){e("form_"+q).style.top=-1048575+"px";D=E.value.replace(/\\/g,"/");D=D.substring(D.length,D.lastIndexOf("/")+1);F.push(new b.File(q,D));if(!p.features.canOpenDialog){b.removeAllEvents(C,p.id)}else{b.removeEvent(B,"click",p.id)}b.removeEvent(A,"change",p.id);v();if(F.length){f.trigger("FilesAdded",F)}}},p.id);C.appendChild(A);j.appendChild(C);p.refresh()}function u(){var y=a.createElement("div");y.innerHTML='<iframe id="'+p.id+'_iframe" name="'+p.id+'_iframe" src="'+h+':&quot;&quot;" style="display:none"></iframe>';n=y.firstChild;j.appendChild(n);b.addEvent(n,"load",function(D){var E=D.target,C,A;if(!k){return}try{C=E.contentWindow.document||E.contentDocument||d.frames[E.id].document}catch(B){p.trigger("Error",{code:b.SECURITY_ERROR,message:b.translate("Security error."),file:k});return}A=C.documentElement.innerText||C.documentElement.textContent;if(A){k.status=b.DONE;k.loaded=1025;k.percent=100;p.trigger("UploadProgress",k);p.trigger("FileUploaded",k,{response:A})}},p.id)}if(p.settings.container){j=e(p.settings.container);if(b.getStyle(j,"position")==="static"){j.style.position="relative"}}p.bind("UploadFile",function(y,B){var C,A;if(B.status==b.DONE||B.status==b.FAILED||y.state==b.STOPPED){return}C=e("form_"+B.id);A=e("input_"+B.id);A.setAttribute("name",y.settings.file_data_name);C.setAttribute("action",y.settings.url);b.each(b.extend({name:B.target_name||B.name},y.settings.multipart_params),function(F,D){var E=a.createElement("input");b.extend(E,{type:"hidden",name:D,value:F});C.insertBefore(E,C.firstChild)});k=B;e("form_"+q).style.top=-1048575+"px";C.submit();C.parentNode.removeChild(C)});p.bind("FileUploaded",function(y){y.refresh()});p.bind("StateChanged",function(y){if(y.state==b.STARTED){u()}if(y.state==b.STOPPED){d.setTimeout(function(){b.removeEvent(n,"load",y.id);n.parentNode.removeChild(n)},0)}});p.bind("Refresh",function(B){var G,C,D,E,y,H,I,F,A;G=e(B.settings.browse_button);if(G){y=b.getPos(G,e(B.settings.container));H=b.getSize(G);I=e("form_"+q);F=e("input_"+q);b.extend(I.style,{top:y.y+"px",left:y.x+"px",width:H.w+"px",height:H.h+"px"});if(B.features.canOpenDialog){A=parseInt(G.parentNode.style.zIndex,10);if(isNaN(A)){A=0}b.extend(G.style,{zIndex:A});if(b.getStyle(G,"position")==="static"){b.extend(G.style,{position:"relative"})}b.extend(I.style,{zIndex:A-1})}D=B.settings.browse_button_hover;E=B.settings.browse_button_active;C=B.features.canOpenDialog?G:I;if(D){b.addEvent(C,"mouseover",function(){b.addClass(G,D)},B.id);b.addEvent(C,"mouseout",function(){b.removeClass(G,D)},B.id)}if(E){b.addEvent(C,"mousedown",function(){b.addClass(G,E)},B.id);b.addEvent(a.body,"mouseup",function(){b.removeClass(G,E)},B.id)}}});f.bind("FilesRemoved",function(y,B){var A,C;for(A=0;A<B.length;A++){C=e("form_"+B[A].id);if(C){C.parentNode.removeChild(C)}}});f.bind("Destroy",function(y){var A,B,C,D={inputContainer:"form_"+q,inputFile:"input_"+q,browseButton:y.settings.browse_button};for(A in D){B=e(D[A]);if(B){b.removeAllEvents(B,y.id)}}b.removeAllEvents(a.body,y.id);b.each(z,function(F,E){C=e("form_"+F);if(C){j.removeChild(C)}})});v()});g({success:true})}})})(window,document,plupload);
/**
 * jquery.ui.plupload.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	
 * Optionally:
 *	jquery.ui.button.js
 *	jquery.ui.progressbar.js
 *	jquery.ui.sortable.js
 */

// JSLint defined globals
/*global window:false, document:false, plupload:false, jQuery:false */

(function(window, document, plupload, $, undef) {

var uploaders = {};	

function _(str) {
	return plupload.translate(str) || str;
}

function renderUI(obj) {		
	obj.html(
		'<div class="plupload_wrapper">' +
			'<div class="plupload_container">' +
				'<div class="plupload">' +

					'<div class="plupload_content">' +
						'<table class="plupload_filelist">' +
						'<tr class="plupload_filelist_header">' +
							'<td class="plupload_header_cell plupload_file_name" valign="middle">' + _('Filename') + '</td>' +
							'<td class="plupload_header_cell plupload_file_caption" valign="middle">' + _('Caption') + '</td>' +
							'<td class="plupload_header_cell plupload_file_status" valign="middle" style="display:none">' + _('Status') + '</td>' +
							'<td class="plupload_header_cell plupload_file_size" valign="middle" style="display:none">' + _('Size') + '</td>' +
							'<td class="plupload_header_cell plupload_file_action" valign="middle">' + _('Action') + '</td>' +
						'</tr>' +
						'</table>' +

						'<div class="plupload_scroll">' +
							'<table class="plupload_filelist_content"></table>' +
						'</div>' +

						'<table class="plupload_filelist">' +
						'<tr class="plupload_filelist_footer">' +
							'<td class="plupload_cell plupload_file_name">' +

								'<div class="plupload_buttons"><!-- Visible -->' +
									'<a class="plupload_button plupload_add">' + _('Add Files') + '</a>&nbsp;' +
								'</div>' +
              '</td>' +
              '<td class="plupload_cell plupload_file_caption">' +
									'<a class="plupload_start" >' + _('Start Upload') + '</a>&nbsp;' +

									'<div class="plupload_progress plupload_right">' +
										'<div class="plupload_progress_container"></div>' +
									'</div>' +

									'<div class="plupload_cell plupload_upload_status"></div>' +

									'<div class="plupload_clearer">&nbsp;</div>' +

							'</td>' +
							'<td class="plupload_file_status" style="display:none"><span class="plupload_total_status">0%</span></td>' +
							'<td class="plupload_file_size" style="display:none"><span class="plupload_total_file_size">0 kb</span></td>' +
							'<td class="plupload_file_action"></td>' +
						'</tr>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<input class="plupload_count" value="0" type="hidden">' +
		'</div>'
	);
}


$.widget("ui.plupload", {

	contents_bak: '',

	runtime: null,

	options: {
		browse_button_hover: 'ui-state-hover',
		browse_button_active: 'ui-state-active',

		// widget specific
		dragdrop : false, 
		multiple_queues: true, // re-use widget by default

		buttons: {
			browse: true,
			start: true,
			stop: false	
		},
		autostart: false,
		sortable: false,
		rename: false,
		max_file_count: 5 // unlimited
	},

	FILE_COUNT_ERROR: -9001,

	_create: function() {
		var self = this, id, uploader;

		id = this.element.attr('id');
		if (!id) {
			id = plupload.guid();
			this.element.attr('id', id);
		}
		this.id = id;

		// backup the elements initial state
		this.contents_bak = this.element.html();
		renderUI(this.element);

		// container, just in case
		this.container = $('.plupload_container', this.element).attr('id', id + '_container');	

		// list of files, may become sortable
		this.filelist = $('.plupload_filelist_content', this.container).attr('id', id + '_filelist');

		// buttons
		this.browse_button = $('.plupload_add', this.container).attr('id', id + '_browse');
		this.start_button = $('.plupload_start', this.container).attr('id', id + '_start');

		if ($.ui.button) {
			this.browse_button.button({
				icons: { primary: 'ui-icon-circle-plus' }
			});

      this.start_button.button({
				disabled: true,
			}).hide();
		}

		// all buttons are optional, so they can be disabled and hidden
		if (!this.options.buttons.browse) {
			this.browse_button.button('disable').hide();
			$('#' + id + self.runtime + '_container').hide();
		}

		if (!this.options.buttons.start) {
			this.start_button.button('disable').hide();
		}


		// progressbar
		this.progressbar = $('.plupload_progress_container', this.container);		

		if ($.ui.progressbar) {
			this.progressbar.progressbar();
		}

		// counter
		this.counter = $('.plupload_count', this.element)
			.attr({
				id: id + '_count',
				name: id + '_count'
			});

		// initialize uploader instance
		uploader = this.uploader = uploaders[id] = new plupload.Uploader($.extend({ 
			container: id ,
			browse_button: id + '_browse'
		}, this.options));


		uploader.bind('Init', function(up, res) {			
			if (!self.options.unique_names && self.options.rename) {
				self._enableRenaming();	
			}

			if (uploader.features.dragdrop && self.options.dragdrop) {
				self._enableDragAndDrop();	
			}

			self.container.attr('title', _('Add maximum upto 5 files here') );

			self.start_button.click(function(e) {
				if (!$(this).button('option', 'disabled')) {
					self.start();
				}
				e.preventDefault();
			});

		});


		// check if file count doesn't exceed the limit
		if (self.options.max_file_count) {
			uploader.bind('FilesAdded', function(up, files) {
				var length = files.length, removed = [];

				if (length > self.options.max_file_count) {
					removed = files.splice(self.options.max_file_count);

					up.trigger('Error', {
						code : self.FILE_COUNT_ERROR,
						message : _('File count error.'),
						file : removed
					});
				}
			});
		}

		// uploader internal events must run first 
		uploader.init();

		uploader.bind('FilesAdded', function(up, files) {
			self._trigger('selected', null, { up: up, files: files } );

			if (self.options.autostart) {
				self.start();
			}
		});

		uploader.bind('FilesRemoved', function(up, files) {
			self._trigger('removed', null, { up: up, files: files } );
		});

		uploader.bind('QueueChanged', function() {
			self._updateFileList();
		});

		uploader.bind('StateChanged', function() {
			self._handleState();
		});

		uploader.bind('UploadFile', function(up, file) {
			self._handleFileStatus(file);
		});

		uploader.bind('FileUploaded', function(up, file) {
			self._handleFileStatus(file);

			self._trigger('uploaded', null, { up: up, file: file } );
		});

		uploader.bind('UploadProgress', function(up, file) {
			// Set file specific progress
			$('#' + file.id + ' .plupload_file_status', self.element).html(file.percent + '%');

			self._handleFileStatus(file);
			self._updateTotalProgress();

			self._trigger('progress', null, { up: up, file: file } );
		});

		uploader.bind('UploadComplete', function(up, files) {			
			self._trigger('complete', null, { up: up, files: files } );
		});

		uploader.bind('Error', function(up, err) {			
			var file = err.file, message, details;

			if (file) {
				message = '<strong>' + err.message + '</strong>';
				details = err.details;

				if (details) {
					message += " <br /><i>" + err.details + "</i>";
				} else {

					switch (err.code) {
						case plupload.FILE_EXTENSION_ERROR:
							details = _("File: %s").replace('%s', file.name);
							break;

						case plupload.FILE_SIZE_ERROR:
							details = _("File: %f, size: %s, max file size: %m").replace(/%([fsm])/g, function($0, $1) {
								switch ($1) {
									case 'f': return file.name;
									case 's': return file.size;	
									case 'm': return plupload.parseSize(self.options.max_file_size);
								}
							});
							break;

						case self.FILE_COUNT_ERROR:
							details = _("Upload element accepts only %d file(s) at a time. Extra files were stripped.")
								.replace('%d', self.options.max_file_count);
							break;

						case plupload.IMAGE_FORMAT_ERROR :
							details = plupload.translate('Image format either wrong or not supported.');
							break;	

						case plupload.IMAGE_MEMORY_ERROR :
							details = plupload.translate('Runtime ran out of available memory.');
							break;

						case plupload.IMAGE_DIMENSIONS_ERROR :
							details = plupload.translate('Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.').replace(/%([swh])/g, function($0, $1) {
								switch ($1) {
									case 's': return up.runtime;
									case 'w': return up.features.maxWidth;	
									case 'h': return up.features.maxHeight;
								}
							});
							break;	

						case plupload.HTTP_ERROR:
							details = _("Upload URL might be wrong or doesn't exist");
							break;
					}
					message += " <br /><i>" + details + "</i>";
				}

				self.notify('error', message);
				self._trigger('error', null, { up: up, file: file, error: message } );
			}
		});
	},

	_setOption: function(key, value) {
		var self = this;

		if (key == 'buttons' && typeof(value) == 'object') {	
			value = $.extend(self.options.buttons, value);

			if (!value.browse) {
				self.browse_button.button('disable').hide();
				$('#' + self.id + self.runtime + '_container').hide();
			} else {
				self.browse_button.button('enable').show();
				$('#' + self.id + self.runtime + '_container').show();
			}

			if (!value.start) {
				self.start_button.button('disable').hide();
			} else {
				self.start_button.button('enable').hide();;
			}

			
		}

		self.uploader.settings[key] = value;	
	},


	start: function() {
		this.uploader.start();
		this._trigger('start', null);
	},

	stop: function() {
		this.uploader.stop();
		this._trigger('stop', null);
	},

	getFile: function(id) {
		var file;

		if (typeof id === 'number') {
			file = this.uploader.files[id];	
		} else {
			file = this.uploader.getFile(id);	
		}
		return file;
	},

	removeFile: function(id) {
		var file = this.getFile(id);
		if (file) {
			this.uploader.removeFile(file);
		}
	},

	clearQueue: function() {
		this.uploader.splice();
	},

	getUploader: function() {
		return this.uploader;
	},

	refresh: function() {
		this.uploader.refresh();
	},


	_handleState: function() {
		var self = this, uploader = this.uploader;

		if (uploader.state === plupload.STARTED) {

			$(self.start_button).button('disable');


			$('.plupload_upload_status', self.element).text(
				_('Uploaded %d/%d files').replace('%d/%d', uploader.total.uploaded+'/'+uploader.files.length)
			);

			$('.plupload_header_content', self.element).addClass('plupload_header_content_bw');

		} else {


			if (self.options.multiple_queues) {
				$(self.start_button).button('enable');

				$('.plupload_header_content', self.element).removeClass('plupload_header_content_bw');
			}

			self._updateFileList();
		}
	},


	_handleFileStatus: function(file) {
		var actionClass, iconClass;

		switch (file.status) {
			case plupload.DONE: 
				actionClass = 'plupload_done';
				iconClass = 'ui-icon ui-icon-circle-check';
				break;

			case plupload.FAILED:
				actionClass = 'ui-state-error plupload_failed';
				iconClass = 'ui-icon ui-icon-alert';
				break;

			case plupload.QUEUED:
				actionClass = 'plupload_delete';
				iconClass = 'ui-icon ui-icon-circle-minus ';
				break;

			case plupload.UPLOADING:
				actionClass = 'ui-state-highlight plupload_uploading';
				iconClass = 'ui-icon ui-icon-circle-arrow-w';

				// scroll uploading file into the view if its bottom boundary is out of it
				var scroller = $('.plupload_scroll', this.container),
					scrollTop = scroller.scrollTop(),
					scrollerHeight = scroller.height(),
					rowOffset = $('#' + file.id).position().top + $('#' + file.id).height();

				if (scrollerHeight < rowOffset) {
					scroller.scrollTop(scrollTop + rowOffset - scrollerHeight);
				}				
				break;
		}
		actionClass += ' ui-state-default plupload_file';

		$('#' + file.id)
			.attr('class', actionClass)
			.find('.ui-icon')
				.attr('class', iconClass);
	},


	_updateTotalProgress: function() {
		var uploader = this.uploader;

		this.progressbar.progressbar('value', uploader.total.percent);

		$('.plupload_total_status', this.element).html(uploader.total.percent + '%');

		$('.plupload_upload_status', this.element).text(
			_('Uploaded %d/%d files').replace('%d/%d', uploader.total.uploaded+'/'+uploader.files.length)
		);
	},


	_updateFileList: function() {
		var self = this, uploader = this.uploader, filelist = this.filelist, 
			count = 0, 
			id, prefix = this.id + '_',
			fields;

		// destroy sortable if enabled
		if ($.ui.sortable && this.options.sortable) {
			$('tbody', filelist).sortable('destroy');	
		}

		filelist.empty();

		$.each(uploader.files, function(i, file) {
			fields = '';
			id = prefix + count;

			if (file.status === plupload.DONE) {
				if (file.target_name) {
					fields += '<input type="hidden" name="' + id + '_tmpname" value="'+ plupload.xmlEncode(file.target_name)+'" />';
				}
				fields += '<input type="hidden" name="' + id + '_name" value="'+ plupload.xmlEncode(file.name)+'" />';
				fields += '<input type="hidden" name="' + id + '_status" value="' + (file.status === plupload.DONE ? 'done' : 'failed') + '" />';

				count++;
				self.counter.val(count);
			}
      var caption_val = get_caption_value('file_caption_' + file.id);
     
			filelist.append(
				'<tr class="plupload_file" id="' + file.id + '">' +
					'<td class="plupload_internal_cell plupload_file_name attachment_file_name"><span>' + file.name + '</span></td>' +
					'<td class="plupload_internal_cell plupload_file_caption">' +
              '<div class="caption_div" >' +
                '<input type="text" class="attachment_caption js_plupload_caption"' +
                    'placeholder="caption" id="file_caption_' + file.id + '"' + 
                    'value="' +  caption_val +  '"/>' +  
              '</div>' +
          '</td>' +
					'<td class="plupload_internal_cell plupload_file_status" style="display:none">' + file.percent + '%</td>' +
					'<td class="plupload_internal_cell plupload_file_size" style="display:none">' + plupload.formatSize(file.size) + '</td>' +
					'<td class="plupload_internal_cell plupload_file_action"><div class="ui-icon"></div>' + fields + '</td>' +
          '<td class="plupload_internal_cell_simple "><div class="ui-icon"></div>' + fields + '</td>' +
				'</tr>'
			);

			self._handleFileStatus(file);

			$('#' + file.id + '.plupload_delete .ui-icon, #' + file.id + '.plupload_done .ui-icon')
				.click(function(e) {
					$('#' + file.id).remove();
					uploader.removeFile(file);

					e.preventDefault();
				});

			self._trigger('updatelist', null, filelist);
		});


		$('.plupload_total_file_size', self.element).html(plupload.formatSize(uploader.total.size));

		if (uploader.total.queued === 0) {
			$('.ui-button-text', self.browse_button).text(_('Add Files'));
		} else {
			//$('.ui-button-text', self.browse_button).text(_('%d files added').replace('%d', uploader.total.queued));
			$('.ui-button-text', self.browse_button).text(_('Add More'));
		}


		if (uploader.files.length === (uploader.total.uploaded + uploader.total.failed)) {
			self.start_button.button('disable');
		} else {
			self.start_button.button('enable');
		}


		// Scroll to end of file list
		filelist[0].scrollTop = filelist[0].scrollHeight;

		self._updateTotalProgress();

		if (!uploader.files.length && uploader.features.dragdrop && uploader.settings.dragdrop) {
			// Re-add drag message if there are no files
			$('#' + id + '_filelist').append('<tr><td class="plupload_droptext">' + _("Drag files here.") + '</td></tr>');
		} else {
			// Otherwise re-initialize sortable
			if (self.options.sortable && $.ui.sortable) {
				 self._enableSortingList();	
			}
		}
	},


	_enableRenaming: function() {
		var self = this;

		$('.plupload_file_name span', this.filelist).live('click', function(e) {
			var targetSpan = $(e.target), file, parts, name, ext = "";

			// Get file name and split out name and extension
			file = self.uploader.getFile(targetSpan.parents('tr')[0].id);
			name = file.name;
			parts = /^(.+)(\.[^.]+)$/.exec(name);
			if (parts) {
				name = parts[1];
				ext = parts[2];
			}

			// Display input element
			targetSpan.hide().after('<input class="plupload_file_rename" type="text" />');
			targetSpan.next().val(name).focus().blur(function() {
				targetSpan.show().next().remove();
			}).keydown(function(e) {
				var targetInput = $(this);

				if ($.inArray(e.keyCode, [13, 27]) !== -1) {
					e.preventDefault();

					// Rename file and glue extension back on
					if (e.keyCode === 13) {
						file.name = targetInput.val() + ext;
						targetSpan.text(file.name);
					}
					targetInput.blur();
				}
			});
		});
	},


	_enableDragAndDrop: function() {
		this.filelist.append('<tr><td class="plupload_droptext">' + _("Drag files here.") + '</td></tr>');

		this.filelist.parent().attr('id', this.id + '_dropbox');

		this.uploader.settings.drop_element = this.options.drop_element = this.id + '_dropbox';
	},


	_enableSortingList: function() {
		var idxStart, self = this;

		if ($('tbody tr', this.filelist).length < 2) {
			return;	
		}

		$('tbody', this.filelist).sortable({
			containment: 'parent',
			items: '.plupload_delete',

			helper: function(e, el) {
				return el.clone(true).find('td:not(.plupload_file_name)').remove().end().css('width', '100%');
			},

			start: function(e, ui) {
				idxStart = $('tr', this).index(ui.item);
			},

			stop: function(e, ui) {
				var i, length, idx, files = [], idxStop = $('tr', this).index(ui.item);

				for (i = 0, length = self.uploader.files.length; i < length; i++) {

					if (i === idxStop) {
						idx = idxStart;
					} else if (i === idxStart) {
						idx = idxStop;
					} else {
						idx = i;
					}
					files[files.length] = self.uploader.files[idx];					
				}

				files.unshift(files.length);
				files.unshift(0);

				// re-populate files array				
				Array.prototype.splice.apply(self.uploader.files, files);	
			}
		});		
	},

	notify: function(type, message) {
		var popup = $(
			'<div class="plupload_message">' + 
				'<span class="plupload_message_close ui-icon ui-icon-circle-close" title="'+_('Close')+'"></span>' +
				'<p><span class="ui-icon"></span>' + message + '</p>' +
			'</div>'
		);

		popup
			.addClass('ui-state-' + (type === 'error' ? 'error' : 'highlight'))
			.find('p .ui-icon')
				.addClass('ui-icon-' + (type === 'error' ? 'alert' : 'info'))
				.end()
			.find('.plupload_message_close')
				.click(function() {
					popup.remove();	
				})
				.end()
			.appendTo('.plupload_header_content', this.container);
	},



	destroy: function() {
		// unbind all button events
		$('.plupload_button', this.element).unbind();

		// destroy buttons
		if ($.ui.button) {
			$('.plupload_add, .plupload_start, .plupload_stop', this.container)
				.button('destroy');
		}

		// destroy progressbar
		if ($.ui.progressbar) {
			 this.progressbar.progressbar('destroy');	
		}

		// destroy sortable behavior
		if ($.ui.sortable && this.options.sortable) {
			$('tbody', this.filelist).sortable('destroy');
		}

		// destroy uploader instance
		this.uploader.destroy();

		// restore the elements initial state
		this.element
			.empty()
			.html(this.contents_bak);
		this.contents_bak = '';

		$.Widget.prototype.destroy.apply(this);
	}
});


} (window, document, plupload, jQuery));


/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
* Thanks to: Seamus Leahy for adding deltaX and deltaY
*
* Version: 3.0.4
*
* Requires: 1.2.2+
*/

(function(d){function g(a){var b=a||window.event,i=[].slice.call(arguments,1),c=0,h=0,e=0;a=d.event.fix(b);a.type="mousewheel";if(a.wheelDelta)c=a.wheelDelta/120;if(a.detail)c=-a.detail/3;e=c;if(b.axis!==undefined&&b.axis===b.HORIZONTAL_AXIS){e=0;h=-1*c}if(b.wheelDeltaY!==undefined)e=b.wheelDeltaY/120;if(b.wheelDeltaX!==undefined)h=-1*b.wheelDeltaX/120;i.unshift(a,c,h,e);return d.event.handle.apply(this,i)}var f=["DOMMouseScroll","mousewheel"];d.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=
f.length;a;)this.addEventListener(f[--a],g,false);else this.onmousewheel=g},teardown:function(){if(this.removeEventListener)for(var a=f.length;a;)this.removeEventListener(f[--a],g,false);else this.onmousewheel=null}};d.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);
/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 * 
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 * 
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function(b){var m,t,u,f,D,j,E,n,z,A,q=0,e={},o=[],p=0,d={},l=[],G=null,v=new Image,J=/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,W=/[^\.]\.(swf)\s*$/i,K,L=1,y=0,s="",r,i,h=false,B=b.extend(b("<div/>")[0],{prop:0}),M=b.browser.msie&&b.browser.version<7&&!window.XMLHttpRequest,N=function(){t.hide();v.onerror=v.onload=null;G&&G.abort();m.empty()},O=function(){if(false===e.onError(o,q,e)){t.hide();h=false}else{e.titleShow=false;e.width="auto";e.height="auto";m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');
F()}},I=function(){var a=o[q],c,g,k,C,P,w;N();e=b.extend({},b.fn.fancybox.defaults,typeof b(a).data("fancybox")=="undefined"?e:b(a).data("fancybox"));w=e.onStart(o,q,e);if(w===false)h=false;else{if(typeof w=="object")e=b.extend(e,w);k=e.title||(a.nodeName?b(a).attr("title"):a.title)||"";if(a.nodeName&&!e.orig)e.orig=b(a).children("img:first").length?b(a).children("img:first"):b(a);if(k===""&&e.orig&&e.titleFromAlt)k=e.orig.attr("alt");c=e.href||(a.nodeName?b(a).attr("href"):a.href)||null;if(/^(?:javascript)/i.test(c)||
c=="#")c=null;if(e.type){g=e.type;if(!c)c=e.content}else if(e.content)g="html";else if(c)g=c.match(J)?"image":c.match(W)?"swf":b(a).hasClass("iframe")?"iframe":c.indexOf("#")===0?"inline":"ajax";if(g){if(g=="inline"){a=c.substr(c.indexOf("#"));g=b(a).length>0?"inline":"ajax"}e.type=g;e.href=c;e.title=k;if(e.autoDimensions)if(e.type=="html"||e.type=="inline"||e.type=="ajax"){e.width="auto";e.height="auto"}else e.autoDimensions=false;if(e.modal){e.overlayShow=true;e.hideOnOverlayClick=false;e.hideOnContentClick=
false;e.enableEscapeButton=false;e.showCloseButton=false}e.padding=parseInt(e.padding,10);e.margin=parseInt(e.margin,10);m.css("padding",e.padding+e.margin);b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change",function(){b(this).replaceWith(j.children())});switch(g){case "html":m.html(e.content);F();break;case "inline":if(b(a).parent().is("#fancybox-content")===true){h=false;break}b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup",function(){b(this).replaceWith(j.children())}).bind("fancybox-cancel",
function(){b(this).replaceWith(m.children())});b(a).appendTo(m);F();break;case "image":h=false;b.fancybox.showActivity();v=new Image;v.onerror=function(){O()};v.onload=function(){h=true;v.onerror=v.onload=null;e.width=v.width;e.height=v.height;b("<img />").attr({id:"fancybox-img",src:v.src,alt:e.title}).appendTo(m);Q()};v.src=c;break;case "swf":e.scrolling="no";C='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+e.width+'" height="'+e.height+'"><param name="movie" value="'+c+
'"></param>';P="";b.each(e.swf,function(x,H){C+='<param name="'+x+'" value="'+H+'"></param>';P+=" "+x+'="'+H+'"'});C+='<embed src="'+c+'" type="application/x-shockwave-flash" width="'+e.width+'" height="'+e.height+'"'+P+"></embed></object>";m.html(C);F();break;case "ajax":h=false;b.fancybox.showActivity();e.ajax.win=e.ajax.success;G=b.ajax(b.extend({},e.ajax,{url:c,data:e.ajax.data||{},error:function(x){x.status>0&&O()},success:function(x,H,R){if((typeof R=="object"?R:G).status==200){if(typeof e.ajax.win==
"function"){w=e.ajax.win(c,x,H,R);if(w===false){t.hide();return}else if(typeof w=="string"||typeof w=="object")x=w}m.html(x);F()}}}));break;case "iframe":Q()}}else O()}},F=function(){var a=e.width,c=e.height;a=a.toString().indexOf("%")>-1?parseInt((b(window).width()-e.margin*2)*parseFloat(a)/100,10)+"px":a=="auto"?"auto":a+"px";c=c.toString().indexOf("%")>-1?parseInt((b(window).height()-e.margin*2)*parseFloat(c)/100,10)+"px":c=="auto"?"auto":c+"px";m.wrapInner('<div style="width:'+a+";height:"+c+
";overflow: "+(e.scrolling=="auto"?"auto":e.scrolling=="yes"?"scroll":"hidden")+';position:relative;"></div>');e.width=m.width();e.height=m.height();Q()},Q=function(){var a,c;t.hide();if(f.is(":visible")&&false===d.onCleanup(l,p,d)){b.event.trigger("fancybox-cancel");h=false}else{h=true;b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");f.is(":visible")&&d.titlePosition!=="outside"&&f.css("height",f.height());l=o;p=q;d=e;if(d.overlayShow){u.css({"background-color":d.overlayColor,
opacity:d.overlayOpacity,cursor:d.hideOnOverlayClick?"pointer":"auto",height:b(document).height()});if(!u.is(":visible")){M&&b("select:not(#fancybox-tmp select)").filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one("fancybox-cleanup",function(){this.style.visibility="inherit"});u.show()}}else u.hide();i=X();s=d.title||"";y=0;n.empty().removeAttr("style").removeClass();if(d.titleShow!==false){if(b.isFunction(d.titleFormat))a=d.titleFormat(s,l,p,d);else a=s&&s.length?
d.titlePosition=="float"?'<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">'+s+'</td><td id="fancybox-title-float-right"></td></tr></table>':'<div id="fancybox-title-'+d.titlePosition+'">'+s+"</div>":false;s=a;if(!(!s||s==="")){n.addClass("fancybox-title-"+d.titlePosition).html(s).appendTo("body").show();switch(d.titlePosition){case "inside":n.css({width:i.width-d.padding*2,marginLeft:d.padding,marginRight:d.padding});
y=n.outerHeight(true);n.appendTo(D);i.height+=y;break;case "over":n.css({marginLeft:d.padding,width:i.width-d.padding*2,bottom:d.padding}).appendTo(D);break;case "float":n.css("left",parseInt((n.width()-i.width-40)/2,10)*-1).appendTo(f);break;default:n.css({width:i.width-d.padding*2,paddingLeft:d.padding,paddingRight:d.padding}).appendTo(f)}}}n.hide();if(f.is(":visible")){b(E.add(z).add(A)).hide();a=f.position();r={top:a.top,left:a.left,width:f.width(),height:f.height()};c=r.width==i.width&&r.height==
i.height;j.fadeTo(d.changeFade,0.3,function(){var g=function(){j.html(m.contents()).fadeTo(d.changeFade,1,S)};b.event.trigger("fancybox-change");j.empty().removeAttr("filter").css({"border-width":d.padding,width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2});if(c)g();else{B.prop=0;b(B).animate({prop:1},{duration:d.changeSpeed,easing:d.easingChange,step:T,complete:g})}})}else{f.removeAttr("style");j.css("border-width",d.padding);if(d.transitionIn=="elastic"){r=V();j.html(m.contents());
f.show();if(d.opacity)i.opacity=0;B.prop=0;b(B).animate({prop:1},{duration:d.speedIn,easing:d.easingIn,step:T,complete:S})}else{d.titlePosition=="inside"&&y>0&&n.show();j.css({width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2}).html(m.contents());f.css(i).fadeIn(d.transitionIn=="none"?0:d.speedIn,S)}}}},Y=function(){if(d.enableEscapeButton||d.enableKeyboardNav)b(document).bind("keydown.fb",function(a){if(a.keyCode==27&&d.enableEscapeButton){a.preventDefault();b.fancybox.close()}else if((a.keyCode==
37||a.keyCode==39)&&d.enableKeyboardNav&&a.target.tagName!=="INPUT"&&a.target.tagName!=="TEXTAREA"&&a.target.tagName!=="SELECT"){a.preventDefault();b.fancybox[a.keyCode==37?"prev":"next"]()}});if(d.showNavArrows){if(d.cyclic&&l.length>1||p!==0)z.show();if(d.cyclic&&l.length>1||p!=l.length-1)A.show()}else{z.hide();A.hide()}},S=function(){if(!b.support.opacity){j.get(0).style.removeAttribute("filter");f.get(0).style.removeAttribute("filter")}e.autoDimensions&&j.css("height","auto");f.css("height","auto");
s&&s.length&&n.show();d.showCloseButton&&E.show();Y();d.hideOnContentClick&&j.bind("click",b.fancybox.close);d.hideOnOverlayClick&&u.bind("click",b.fancybox.close);b(window).bind("resize.fb",b.fancybox.resize);d.centerOnScroll&&b(window).bind("scroll.fb",b.fancybox.center);if(d.type=="iframe")b('<iframe id="fancybox-frame" name="fancybox-frame'+(new Date).getTime()+'" frameborder="0" hspace="0" '+(b.browser.msie?'allowtransparency="true""':"")+' scrolling="'+e.scrolling+'" src="'+d.href+'"></iframe>').appendTo(j);
f.show();h=false;b.fancybox.center();d.onComplete(l,p,d);var a,c;if(l.length-1>p){a=l[p+1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}if(p>0){a=l[p-1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}},T=function(a){var c={width:parseInt(r.width+(i.width-r.width)*a,10),height:parseInt(r.height+(i.height-r.height)*a,10),top:parseInt(r.top+(i.top-r.top)*a,10),left:parseInt(r.left+(i.left-r.left)*a,10)};if(typeof i.opacity!=="undefined")c.opacity=a<0.5?0.5:a;f.css(c);
j.css({width:c.width-d.padding*2,height:c.height-y*a-d.padding*2})},U=function(){return[b(window).width()-d.margin*2,b(window).height()-d.margin*2,b(document).scrollLeft()+d.margin,b(document).scrollTop()+d.margin]},X=function(){var a=U(),c={},g=d.autoScale,k=d.padding*2;c.width=d.width.toString().indexOf("%")>-1?parseInt(a[0]*parseFloat(d.width)/100,10):d.width+k;c.height=d.height.toString().indexOf("%")>-1?parseInt(a[1]*parseFloat(d.height)/100,10):d.height+k;if(g&&(c.width>a[0]||c.height>a[1]))if(e.type==
"image"||e.type=="swf"){g=d.width/d.height;if(c.width>a[0]){c.width=a[0];c.height=parseInt((c.width-k)/g+k,10)}if(c.height>a[1]){c.height=a[1];c.width=parseInt((c.height-k)*g+k,10)}}else{c.width=Math.min(c.width,a[0]);c.height=Math.min(c.height,a[1])}c.top=parseInt(Math.max(a[3]-20,a[3]+(a[1]-c.height-40)*0.5),10);c.left=parseInt(Math.max(a[2]-20,a[2]+(a[0]-c.width-40)*0.5),10);return c},V=function(){var a=e.orig?b(e.orig):false,c={};if(a&&a.length){c=a.offset();c.top+=parseInt(a.css("paddingTop"),
10)||0;c.left+=parseInt(a.css("paddingLeft"),10)||0;c.top+=parseInt(a.css("border-top-width"),10)||0;c.left+=parseInt(a.css("border-left-width"),10)||0;c.width=a.width();c.height=a.height();c={width:c.width+d.padding*2,height:c.height+d.padding*2,top:c.top-d.padding-20,left:c.left-d.padding-20}}else{a=U();c={width:d.padding*2,height:d.padding*2,top:parseInt(a[3]+a[1]*0.5,10),left:parseInt(a[2]+a[0]*0.5,10)}}return c},Z=function(){if(t.is(":visible")){b("div",t).css("top",L*-40+"px");L=(L+1)%12}else clearInterval(K)};
b.fn.fancybox=function(a){if(!b(this).length)return this;b(this).data("fancybox",b.extend({},a,b.metadata?b(this).metadata():{})).unbind("click.fb").bind("click.fb",function(c){c.preventDefault();if(!h){h=true;b(this).blur();o=[];q=0;c=b(this).attr("rel")||"";if(!c||c==""||c==="nofollow")o.push(this);else{o=b("a[rel="+c+"], area[rel="+c+"]");q=o.index(this)}I()}});return this};b.fancybox=function(a,c){var g;if(!h){h=true;g=typeof c!=="undefined"?c:{};o=[];q=parseInt(g.index,10)||0;if(b.isArray(a)){for(var k=
0,C=a.length;k<C;k++)if(typeof a[k]=="object")b(a[k]).data("fancybox",b.extend({},g,a[k]));else a[k]=b({}).data("fancybox",b.extend({content:a[k]},g));o=jQuery.merge(o,a)}else{if(typeof a=="object")b(a).data("fancybox",b.extend({},g,a));else a=b({}).data("fancybox",b.extend({content:a},g));o.push(a)}if(q>o.length||q<0)q=0;I()}};b.fancybox.showActivity=function(){clearInterval(K);t.show();K=setInterval(Z,66)};b.fancybox.hideActivity=function(){t.hide()};b.fancybox.next=function(){return b.fancybox.pos(p+
1)};b.fancybox.prev=function(){return b.fancybox.pos(p-1)};b.fancybox.pos=function(a){if(!h){a=parseInt(a);o=l;if(a>-1&&a<l.length){q=a;I()}else if(d.cyclic&&l.length>1){q=a>=l.length?0:l.length-1;I()}}};b.fancybox.cancel=function(){if(!h){h=true;b.event.trigger("fancybox-cancel");N();e.onCancel(o,q,e);h=false}};b.fancybox.close=function(){function a(){u.fadeOut("fast");n.empty().hide();f.hide();b.event.trigger("fancybox-cleanup");j.empty();d.onClosed(l,p,d);l=e=[];p=q=0;d=e={};h=false}if(!(h||f.is(":hidden"))){h=
true;if(d&&false===d.onCleanup(l,p,d))h=false;else{N();b(E.add(z).add(A)).hide();b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");j.find("iframe").attr("src",M&&/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank");d.titlePosition!=="inside"&&n.empty();f.stop();if(d.transitionOut=="elastic"){r=V();var c=f.position();i={top:c.top,left:c.left,width:f.width(),height:f.height()};if(d.opacity)i.opacity=1;n.empty().hide();B.prop=1;
b(B).animate({prop:0},{duration:d.speedOut,easing:d.easingOut,step:T,complete:a})}else f.fadeOut(d.transitionOut=="none"?0:d.speedOut,a)}}};b.fancybox.resize=function(){u.is(":visible")&&u.css("height",b(document).height());b.fancybox.center(true)};b.fancybox.center=function(a){var c,g;if(!h){g=a===true?1:0;c=U();!g&&(f.width()>c[0]||f.height()>c[1])||f.stop().animate({top:parseInt(Math.max(c[3]-20,c[3]+(c[1]-j.height()-40)*0.5-d.padding)),left:parseInt(Math.max(c[2]-20,c[2]+(c[0]-j.width()-40)*0.5-
d.padding))},typeof a=="number"?a:200)}};b.fancybox.init=function(){if(!b("#fancybox-wrap").length){b("body").append(m=b('<div id="fancybox-tmp"></div>'),t=b('<div id="fancybox-loading"><div></div></div>'),u=b('<div id="fancybox-overlay"></div>'),f=b('<div id="fancybox-wrap"></div>'));D=b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);
D.append(j=b('<div id="fancybox-content"></div>'),E=b('<a id="fancybox-close"></a>'),n=b('<div id="fancybox-title"></div>'),z=b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),A=b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));E.click(b.fancybox.close);t.click(b.fancybox.cancel);z.click(function(a){a.preventDefault();b.fancybox.prev()});A.click(function(a){a.preventDefault();b.fancybox.next()});
b.fn.mousewheel&&f.bind("mousewheel.fb",function(a,c){if(h)a.preventDefault();else if(b(a.target).get(0).clientHeight==0||b(a.target).get(0).scrollHeight===b(a.target).get(0).clientHeight){a.preventDefault();b.fancybox[c>0?"prev":"next"]()}});b.support.opacity||f.addClass("fancybox-ie");if(M){t.addClass("fancybox-ie6");f.addClass("fancybox-ie6");b('<iframe id="fancybox-hide-sel-frame" src="'+(/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank")+'" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D)}}};
b.fn.fancybox.defaults={padding:10,margin:40,opacity:false,modal:false,cyclic:false,scrolling:"auto",width:560,height:340,autoScale:true,autoDimensions:true,centerOnScroll:false,ajax:{},swf:{wmode:"transparent"},hideOnOverlayClick:true,hideOnContentClick:false,overlayShow:true,overlayOpacity:0.7,overlayColor:"#777",titleShow:true,titlePosition:"float",titleFormat:null,titleFromAlt:false,transitionIn:"fade",transitionOut:"fade",speedIn:300,speedOut:300,changeSpeed:300,changeFade:"fast",easingIn:"swing",
easingOut:"swing",showCloseButton:true,showNavArrows:true,enableEscapeButton:true,enableKeyboardNav:true,onStart:function(){},onCancel:function(){},onComplete:function(){},onCleanup:function(){},onClosed:function(){},onError:function(){}};b(document).ready(function(){b.fancybox.init()})})(jQuery);
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(2($){$.c.f=2(p){p=$.d({g:"!@#$%^&*()+=[]\\\\\\\';,/{}|\\":<>?~`.- ",4:"",9:""},p);7 3.b(2(){5(p.G)p.4+="Q";5(p.w)p.4+="n";s=p.9.z(\'\');x(i=0;i<s.y;i++)5(p.g.h(s[i])!=-1)s[i]="\\\\"+s[i];p.9=s.O(\'|\');6 l=N M(p.9,\'E\');6 a=p.g+p.4;a=a.H(l,\'\');$(3).J(2(e){5(!e.r)k=o.q(e.K);L k=o.q(e.r);5(a.h(k)!=-1)e.j();5(e.u&&k==\'v\')e.j()});$(3).B(\'D\',2(){7 F})})};$.c.I=2(p){6 8="n";8+=8.P();p=$.d({4:8},p);7 3.b(2(){$(3).f(p)})};$.c.t=2(p){6 m="A";p=$.d({4:m},p);7 3.b(2(){$(3).f(p)})}})(C);',53,53,'||function|this|nchars|if|var|return|az|allow|ch|each|fn|extend||alphanumeric|ichars|indexOf||preventDefault||reg|nm|abcdefghijklmnopqrstuvwxyz|String||fromCharCode|charCode||alpha|ctrlKey||allcaps|for|length|split|1234567890|bind|jQuery|contextmenu|gi|false|nocaps|replace|numeric|keypress|which|else|RegExp|new|join|toUpperCase|ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('|'),0,{}));

/*
 * timeago: a jQuery plugin, version: 0.9.3 (2011-01-21)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
        distanceMillis = Math.abs(distanceMillis);
      }

      var seconds = distanceMillis / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(" "));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));
