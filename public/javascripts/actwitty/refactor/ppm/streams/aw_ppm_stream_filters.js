
/*******************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_handle_filter_change(){
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_filter(){
  var filter_json =  { 
                        word_id     : $("#aw_js_ppm_stm_filter_chn_id").attr("value"),
                        entity_id   : $("#aw_js_ppm_stm_filter_mention_id").attr("value"),
                        location_id : $("#aw_js_ppm_stm_filter_location_id").attr("value")
                    }; 
  return filter_json;
}
/**********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_get_chn_filter_id(){
  return $("#aw_js_ppm_stm_filter_chn_id").attr("value");
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_apply_filter_to_view(){
  
  if(   $("#aw_js_ppm_stm_filter_chn_id").attr("value").length &&
        $("#aw_js_ppm_stm_filter_chn_text").attr("value").length){
        
        $(".aw_js_ppm_stm_chn_filter_text_on_view").html(  $("#aw_js_ppm_stm_filter_chn_text").val() );
        $("#aw_js_ppm_stm_page_label").html( $("#aw_js_ppm_stm_filter_chn_text").val() +  " streams");
        $("#aw_js_ppm_stm_chn_filter_delete").show();

    }else{
      $("#aw_js_ppm_stm_page_label").html( "streams" );
      $(".aw_js_ppm_stm_chn_filter_text_on_view").html( "All Channels" );
      $("#aw_js_ppm_stm_chn_filter_delete").hide();
    }
  
  if( $("#aw_js_ppm_stm_filter_mention_id").attr("value").length &&
      $("#aw_js_ppm_stm_filter_mention_text").attr("value").length){
        
        $(".aw_js_ppm_stm_mention_filter_text_on_view").html(  $("#aw_js_ppm_stm_filter_mention_text").val());
        $("#aw_js_ppm_stm_mention_filter_delete").show();

      }else{
        $(".aw_js_ppm_stm_mention_filter_text_on_view").html( "All Mentions" );
        $("#aw_js_ppm_stm_mention_filter_delete").hide();
      }
  if( $("#aw_js_ppm_stm_filter_location_id").attr("value").length &&
      $("#aw_js_ppm_stm_filter_location_text").attr("value").length){
       $(".aw_js_ppm_stm_location_filter_text_on_view").html($("#aw_js_ppm_stm_filter_location_text").val());
       $("#aw_js_ppm_stm_location_filter_delete").show();

      }else{
        $(".aw_js_ppm_stm_location_filter_text_on_view").html( "All Locations" );
        $("#aw_js_ppm_stm_location_filter_delete").hide();
      }
}

/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_change_mention_filter(element){
  $("#aw_js_ppm_stm_filter_mention_id").val(element.find(".aw_js_ppm_stm_mention_filter_changer_id").val());
  $("#aw_js_ppm_stm_filter_mention_text").val(element.find(".aw_js_ppm_stm_mention_filter_changer_name").val());
  aw_api_ppm_stm_main_handle_filter_change();
  aw_api_ppm_stm_modal_close("aw_js_ppm_stm_aw_modal_manager_related_mentions");
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_change_location_filter(element){
  $("#aw_js_ppm_stm_filter_location_id").val(element.find(".aw_js_ppm_stm_location_filter_changer_id").val());
  $("#aw_js_ppm_stm_filter_location_text").val(element.find(".aw_js_ppm_stm_location_filter_changer_name").val());
  aw_api_ppm_stm_main_handle_filter_change();
  aw_api_ppm_stm_modal_close("aw_js_ppm_stm_aw_modal_manager_related_locations");
}

/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_drop_mention_filter(){
  $("#aw_js_ppm_stm_filter_mention_id").val('');
  $("#aw_js_ppm_stm_filter_mention_text").val('');
  aw_api_ppm_stm_main_handle_filter_change();
}

/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_drop_location_filter(){
  $("#aw_js_ppm_stm_filter_location_id").val('');
  $("#aw_js_ppm_stm_filter_location_text").val('');
  aw_api_ppm_stm_main_handle_filter_change();
}
/********************************************/
/*
 *
 *
 */
function aw_api_ppm_stm_drop_channel_filter(){
  $("#aw_js_ppm_stm_filter_chn_id").val('');
  $("#aw_js_ppm_stm_filter_chn_text").val('');
  aw_api_ppm_stm_main_handle_filter_change();
}
