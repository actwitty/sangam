


$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
   
    $('#cont-typ-fltr-videos').live("click", function() {
      alert("video");
      var html = '<div id="tabul_videos" class="p-cstab_content"></div>';
      $('.p-awp-post-stream').hide();
      $('#p-st-fltr-box').hide();
      $('#streams_tab').hide();
      //$('#container').hide();
      $('#tabul').hide();
      $('#tabul').remove();
      $('#tabul_videos').remove();
      $('#tabul_videos').show();
      $('#streams_main_bar').append(html);
      aw_boxer_render_tabs("tabul_videos", get_base_json_unit_test_video());
    });
   
   
});    
