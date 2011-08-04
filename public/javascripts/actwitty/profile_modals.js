/*
 * Main json that will hold all the data for rendering of modal screen
 */
var modal_registration_prefix="JS_AW_MODAL_";
var the_big_modal_manager_json = {
    /* Related friends modal configuration */
    "JS_AW_MODAL_related_friends"  :  {
                                          renderer_fn:function aw_modal_related_friends_caller(win_id, trigger_id){
                                                  alert("calling related friends renderer");
                                                  //aw_modal_related_friends_renderer();
                                          },
                                          title:"Related Friends",
                                          top:20,
                                          left:20,
                                          width:300,
                                          height:300,
                                          data_json:{}

                                      },
    /* Related entities modal configuration */
    "JS_AW_MODAL_related_entities"  :  {
                                          renderer_fn:function aw_modal_related_friends_caller(){
                                                  alert("calling related entities renderer");
                                                  //aw_modal_related_friends_renderer();
                                          },
                                          title:"Related Entities",
                                          top:20,
                                          left:20,
                                          width:300,
                                          height:300,
                                          data_json:{}

                                      },
    /* Related locations modal configuration */
     "JS_AW_MODAL_related_locations"  :  {
                                          renderer_fn:function aw_modal_related_friends_caller(){
                                                  alert("calling related locations renderer");
                                                  //aw_modal_related_friends_renderer();
                                          },
                                          title:"Related Locations",
                                          top:20,
                                          left:20,
                                          width:300,
                                          height:300,
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
        $(this).next().show();

        var modal_window = $(this).parent().find('.modal_window');
        var modal_bkg_mask = $(this).parent().find(".modal_mask");


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
             modal_bkg_mask.css({'top':config_json.top,'left':config_json.left});
           }
         }


        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
        //Set the popup window to center
        modal_window.css('top',  winH/2 - modal_window.height()/2);
        modal_window.css('left', winW/2 - modal_window.width()/2);
     
        //transition effect
        modal_window.fadeIn(2000); 

        var modal_window_id = modal_window.attr("id");
        
      
        if( registered_modal_id.length ){
          var ret_code = aw_modal_dialog_maker(registered_modal_id, modal_window_id, $(this).attr("id"));
          if(!ret_code){
            /*hide the parent of modal window box*/
            $(this).next().hide();
          }
        }else{
            $(this).next().hide();
        }
     
    });
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.js_modal_close').live("click", function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $(this).parent().parent().hide();
    });     
     
    /*
     * Click is made live with an intention to support image and video modals
     */
    $('.modal_mask').live("click",function () {
        $(this).parent().hide();
    });         
     
});


