

$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
    
    $('#cont-typ-fltr-images').live("click", function() {
      //alert("images cool");
      var html = '<div id="tabul" class="p-cstab_content  "></div>';
      $('.p-awp-post-stream').hide();
      $('#p-st-fltr-box').hide();
      $('#streams_tab').hide();
      $('#tabul_videos').hide();
      $('#tabul_videos').remove();
      //$('#tabul').remove();
      $('#tabul').show();
      //alert("images cool1");
      $('#streams_main_bar').append(html);
      //alert("images cool2");
      aw_boxer_render_tabs("tabul", get_base_json_unit_test()); 
      //alert("images cool3");
    });
   
});


/* Modal Window For Images */

function aw_channels_render_image(win_id, trigger_id){
  alert("aw_channels_render_all_images1212");
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  alert("aw_channels_render_all_images");


  var data_id = trigger_id;  
  //alert($("#" + data_id).next());
  //alert(data_id);
  var img = get_image_context(data_id);
  //alert(img);
  var maxwd = 450;
  var maxht = 200;
  var margin_left = Math.abs(maxwd - img.width);
  var margin_top = Math.abs(maxht - img.height);
  var modal_window =   $('#' + win_id);
  modal_window.css({'width':img.width,'height':img.height});
  modal_window.css({'margin_top':margin_top,'margin_left':margin_left});
  //height:'+img.height+'px;width:'+img.width+'px;
  //margin-top:'+margin_top+'px;margin-left:'+margin_left+'px;
  var html = '<div  id="' + id + '">' + '<img src="/images/'+ img.url +'" style="">' 
             '</div>';
  
  div.append(html);

  
  
  return true;
}

