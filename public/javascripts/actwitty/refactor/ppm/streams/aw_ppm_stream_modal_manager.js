/*
 * Main json that will hold all the data for rendering of modal screen
 */
var aw_local_modal_reg_prefix="aw_js_ppm_stm_aw_modal_manager_";


var aw_local_modal_manager_registry = {
    /* Related friends modal configuration */
    "aw_js_ppm_stm_aw_modal_manager_related_people"  :  {
                                          renderer_fn:function aw_internal_modal_related_friends_caller(win_id, trigger_id){
                                            return true;
                                           // return aw_friends_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Friends",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{},

                                      },
    /* Related entities modal configuration */
    "aw_js_ppm_stm_aw_modal_manager_related_mentions"  :  {
                                          renderer_fn:function aw_internal_modal_related_mentions_caller(win_id, trigger_id){
                                            return true;
                                            //return aw_entities_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Entities",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* Related locations modal configuration */
     "aw_js_ppm_stm_aw_modal_manager_related_locations"  :  {
                                          renderer_fn:function aw_internal_modal_related_locations_caller(win_id, trigger_id){
                                            return true;
                                            //return aw_locations_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Locations",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* All channels modal configuration */
    "aw_js_ppm_stm_aw_modal_manager_all_channels" : {
                                          renderer_fn:function aw_internal_modal_all_channels_caller(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            //return aw_channels_render_all_modal(win_id, trigger_id);
                                            return true;
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                     
                                   },

    "aw_js_ppm_stm_aw_modal_manager_stream_likes" : {
                                          renderer_fn:function aw_internal_modal_like(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_api_ppm_stm_like_modal_renderer(win_id, trigger_id);
                                          },
                                          title:" Stream Likes",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}
                                     
                        }
                  };



/*
 * set the data json for the modal
 */
function aw_api_ppm_stm_modal_set_data( registered_modal_id, json_data){
  if(aw_local_modal_manager_registry[registered_modal_id]){
    aw_local_modal_manager_registry[registered_modal_id].data_json = json_data;
  }else{
    alert("There is a problem in caching modal rendering data. \n Actwitty is trying to solve the problem");
  }
}
/*
 * get data json for the modal
 */
function aw_api_ppm_stm_modal_get_data( registered_modal_id){
  if(aw_local_modal_manager_registry[registered_modal_id]){
    return aw_local_modal_manager_registry[registered_modal_id].data_json;
  }else{
    return {};
  }
}

/*
 * Call the target renderer of internal modal
 */
function aw_api_ppm_stm_dialog_maker(registered_modal_id, container_window_id, trigger_id){
  if(aw_local_modal_manager_registry[registered_modal_id]){
    if(aw_local_modal_manager_registry[registered_modal_id].renderer_fn){
      var ret_val =  aw_local_modal_manager_registry[registered_modal_id].renderer_fn(container_window_id,trigger_id);
      if ( ret_val == true){
        $("html,body").css("overflow","hidden");
      }
      return ret_val;
    }else{
      return false;
    }
    
  }else{
    alert("There is a fucking problem in rendering modal screen. \n Actwitty is trying to solve the problem");
    return false;
  }
}


function aw_api_ppm_stm_modal_close(registered_modal_id){
  $('#modal_box_window_id').empty();
  $("#modal_box_id").hide();
  $(".aw_js_ppm_stm_modal_close").hide();
  $('#modal_box_window_id').hide();
  $('#modal_box_mask_id').hide();
  $("html,body").css("overflow","auto");

}
/*
 * Register modal handler on init
 */
$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.aw_js_ppm_stm_modal_invoker').live("click", function(e) {
        //Cancel the link behavior
        e.preventDefault();
        //Get the A tag
        /* show the modal dialogs parent window*/
        //alert("clicked");

        var modal_window =   $('#modal_box_window_id');
        var modal_bkg_mask = $('#modal_box_mask_id');
        var modal_close = $('#modal_c');
        //alert(modal_window);

        $("#modal_box_id").show();
        $(".aw_js_ppm_stm_modal_close").show();

        //Get the screen height and width
        var mask_height = $(document).height();
        var mask_width = $(window).width();
        //Set height and width to mask to fill up the whole screen
        modal_bkg_mask.css({'width':mask_width,'height':mask_height});
        
        //transition effect     
        modal_bkg_mask.fadeIn(1000);    
        modal_bkg_mask.fadeTo("slow",0.8);  
    
        /* find the modal height and widhth*/
        var registered_modal_id = ""; 
        $($(this).attr('class').split(' ')).each(function() { 
          if (this !== '' 
              && this.substring(0,aw_local_modal_reg_prefix.length) == aw_local_modal_reg_prefix){
              registered_modal_id = this;
            }    
        });
        
         if( registered_modal_id.length ){
           var config_json = aw_local_modal_manager_registry[registered_modal_id];
           if(config_json){
             modal_window.css({'width':config_json.width,'height':config_json.height});
             modal_window.css({'top':config_json.top,'left':config_json.left});
             //alert("if"); 
             //modal_close.css({'width':config_json.width,'height':config_json.height});
             modal_close.css({'margin-top':config_json.top-10,'margin-left':config_json.width+config_json.left+4});

           }
         }else{
              //Set the popup window to center
              //alert("else"); 
              modal_window.css('top',  winH/2 - modal_window.height()/2);
              modal_window.css('left', winW/2 - modal_window.width()/2);

              modal_close.css('top',  winH/2 - modal_window.height()/2);
              modal_close.css('left', winW/2 - modal_window.width()/2);

         }


        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
     
     
        //transition effect
        modal_window.fadeIn(2000); 
        if( registered_modal_id.length ){
          var ret_code = aw_api_ppm_stm_dialog_maker(registered_modal_id, "modal_box_window_id", $(this).attr("id"));
          if(!ret_code){
            /*hide the parent of modal window box*/
            $("#modal_box_id").hide();
            $(".aw_js_ppm_stm_modal_close").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
            $("html,body").css("overflow","auto");
          }
        }else{
            $("#modal_box_id").hide();
            $(".aw_js_ppm_stm_modal_close").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
            $("html,body").css("overflow","auto");
        }
     
    });
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.aw_js_ppm_stm_modal_close').live("click", function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $('#modal_box_window_id').html('');
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("#modal_box_id").hide();
        $(".aw_js_ppm_stm_modal_close").hide();
        $("html,body").css("overflow","auto");
        return false;
    });     
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.modal_mask').live("click",function () {
        $('#modal_box_window_id').html('');
        $("#modal_box_id").hide();
        $(".aw_js_ppm_stm_modal_close").hide();
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("html,body").css("overflow","auto");
        return false;
    });         
     
});


