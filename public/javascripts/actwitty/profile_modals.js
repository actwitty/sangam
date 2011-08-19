/*
 * Main json that will hold all the data for rendering of modal screen
 */
var modal_registration_prefix="JS_AW_MODAL_";


var the_big_modal_manager_json = {
    /* Related friends modal configuration */
    "JS_AW_MODAL_related_friends"  :  {
                                          renderer_fn:function aw_modal_related_friends_caller(win_id, trigger_id){
                                            return aw_friends_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Friends",
                                          top:20,
                                          left:20,
                                          width:800,
                                          height:300,
                                          data_json:{},

                                      },
    /* Related entities modal configuration */
    "JS_AW_MODAL_related_entities"  :  {
                                          renderer_fn:function aw_modal_related_entities_caller(win_id, trigger_id){
                                            return aw_entities_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Entities",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* All entities modal configuration */
    "JS_AW_MODAL_all_entities"  :  {
                                          renderer_fn:function aw_modal_all_entities_caller(win_id, trigger_id){
                                            return aw_entities_render_all_modal(win_id, trigger_id);
                                          },
                                          title:"All Entities",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
                                      
    /* Related locations modal configuration */
     "JS_AW_MODAL_related_locations"  :  {
                                          renderer_fn:function aw_modal_related_locations_caller(win_id, trigger_id){
                                            return aw_locations_render_related_modal(win_id, trigger_id);
                                          },
                                          title:"Related Locations",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                      },
    /* All locations modal configuration */
     "JS_AW_MODAL_all_locations"  :  {
                                          renderer_fn:function aw_modal_all_locations_caller(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_locations_render_all_modal(win_id, trigger_id);
                                          },
                                          title:"All Locations",
                                          top:50,
                                          left:200,
                                          width:850,
                                          height:700,
                                          data_json:{}

                                     
                                     },
    /* All channels modal configuration */
    "JS_AW_MODAL_all_channels" : {
                                          renderer_fn:function aw_modal_all_channels_caller(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_channels_render_all_modal(win_id, trigger_id);
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:300,
                                          width:650,
                                          height:400,
                                          data_json:{}

                                     
                                   },
     "JS_AW_MODAL_image" : {
                                          renderer_fn:function aw_modal_image(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_channels_render_image(win_id, trigger_id);
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:350,
                                          width:450,
                                          height:200,
                                          data_json:{}

                                     
                                   },
    "JS_AW_MODAL_like" : {
                                          renderer_fn:function aw_modal_like(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_channels_render_like(win_id, trigger_id);
                                          },
                                          title:"All Channels",
                                          top:50,
                                          left:350,
                                          width:450,
                                          height:200,
                                          data_json:{}

                                     
                                   },
    "JS_AW_MODAL_share" : {
                                          renderer_fn:function aw_modal_share(win_id, trigger_id){
                                            //alert("calling related locations renderer");
                                            return aw_render_share_externally(win_id, trigger_id);
                                          },
                                          title:"Share the post",
                                          top:50,
                                          left:350,
                                          width:450,
                                          height:200,
                                          data_json:{}

                                     
                                   }             
                                  };



/*
 * set the data json for the modal
 */
function aw_modal_set_data( registered_modal_id, json_data){
  if(the_big_modal_manager_json[registered_modal_id]){
    the_big_modal_manager_json[registered_modal_id].data_json = json_data;
  }else{
    alert("There is a problem in caching modal rendering data. \n Actwitty is trying to solve the problem");
  }
}
/*
 * get data json for the modal
 */
function aw_modal_get_data( registered_modal_id){
  if(the_big_modal_manager_json[registered_modal_id]){
    return the_big_modal_manager_json[registered_modal_id].data_json;
  }else{
    return {};
  }
}

/*
 * Call the target renderer of internal modal
 */
function aw_modal_dialog_maker(registered_modal_id, container_window_id, trigger_id){
  if(the_big_modal_manager_json[registered_modal_id]){
    if(the_big_modal_manager_json[registered_modal_id].renderer_fn){
      return the_big_modal_manager_json[registered_modal_id].renderer_fn(container_window_id,trigger_id);
    }else{
      return false;
    }
    
  }else{
    alert("There is a problem in rendering modal screen. \n Actwitty is trying to solve the problem");
    return false;
  }
}


function aw_modal_close(registered_modal_id){
  $('#modal_box_window_id').empty();
  $("#modal_box_id").hide();
  $('#modal_box_window_id').hide();
  $('#modal_box_mask_id').hide();

}
/*
 * Register modal handler on init
 */
$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.js_modal_dialog_link').live("click", function(e) {
        //Cancel the link behavior
        e.preventDefault();
        //Get the A tag
        /* show the modal dialogs parent window*/
        //alert("clicked");

        var modal_window =   $('#modal_box_window_id');
        var modal_bkg_mask = $('#modal_box_mask_id');


        $("#modal_box_id").show();

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
              && this.substring(0,modal_registration_prefix.length) == modal_registration_prefix){
              registered_modal_id = this;
            }    
        });
        
         if( registered_modal_id.length ){
           var config_json = the_big_modal_manager_json[registered_modal_id];
           if(config_json){
             modal_window.css({'width':config_json.width,'height':config_json.height});
             modal_window.css({'top':config_json.top,'left':config_json.left});
           }
         }else{
              //Set the popup window to center
              modal_window.css('top',  winH/2 - modal_window.height()/2);
              modal_window.css('left', winW/2 - modal_window.width()/2);
         }


        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
     
     
        //transition effect
        modal_window.fadeIn(2000); 

        if( registered_modal_id.length ){
          var ret_code = aw_modal_dialog_maker(registered_modal_id, "modal_box_window_id", $(this).attr("id"));
          if(!ret_code){
            /*hide the parent of modal window box*/
            $("#modal_box_id").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
          }
        }else{
            $("#modal_box_id").hide();
            $('#modal_box_window_id').hide();
            $('#modal_box_mask_id').hide();
        }
     
    });
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.js_modal_close').live("click", function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $('#modal_box_window_id').empty();
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
        $("#modal_box_id").hide();
    });     
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.modal_mask').live("click",function () {
        $('#modal_box_window_id').empty();
        $("#modal_box_id").hide();
        $('#modal_box_window_id').hide();
        $('#modal_box_mask_id').hide();
    });         
     
});


