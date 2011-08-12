

$(document).ready(function() {  
 
    /*
     * Click is made live with an intention to support image and video modals
     */
    
    $('#cont-typ-fltr-images_disabled').live("click", function() {
      //alert("images cool");
      var html = '<div id="tabul" class="p-cstab_content  "></div>';
      $('.p-awp-post-stream').hide();
      $('#p-st-fltr-box').hide();
      $('#streams_tab').hide();
      $('#tabul_videos').hide();
      $('#tabul_videos').remove();
      $('#tabul').remove();
      $('#tabul').show();
      //alert("images cool1");
      $('#streams_main_bar').append(html);
      //alert("images cool2");
      aw_boxer_render_tabs("tabul", get_base_json_unit_test()); 
      //alert("images cool3");
    });
   
});




function aw_channels_render_image(win_id, trigger_id){
  var id = win_id + '_modal_div';
  var div = $("#" + win_id);
  data_id = trigger_id;  
  
  var img = get_image_context(data_id);
  var maxwd = 700;
  var maxht = 400;
  var mask_height = $(document).height();
  var mask_width = $(document).width();
  
  var margin_left = Math.abs(maxwd - img.width);
  var margin_top = Math.abs(maxht - img.height)/2;
  if (margin_top < 50)
  {
    margin_top = 50;
    //alert("margin check");
  }
  if (margin_left < 250)
  {
    margin_left = 300;
    //alert("margin check");
  }
  //var margin_top = 400;
  //alert(margin_top); 
  //alert(margin_left);

  var modal_window =   $('#' + win_id);
  //OnClick Modal
  modal_window.css({'width':img.width,'height':img.height+20});
  modal_window.css({'top':margin_top,'left':margin_left});
  //height:'+img.height+'px;width:'+img.width+'px;
  //margin-top:'+margin_top+'px;margin-left:'+margin_left+'px;
  var html = '<div  id="' + id + '">' +
             '<img id="source_image" src="/images/'+ img.source +'" style="height:20px;width:20px;">' +
             '<img id="modal_image" src="/images/'+ img.url +'" style="">' +
             '<div id="next_img">Next</div><div id="prev_img">Previous</div>' +
             '</div>';
 

    div.append(html);




    if ($("#" + data_id).next("div").attr("id")) 
    {    
      $('#next_img').live("click",function() {
          
      //alert(data_id);
      var next_id = $("#" + data_id).next("div").attr("id");
      //if (next_id)
      //{  
      var next_child_image = $("#" + next_id).children("img").attr("src");
      var next_source_image = $("#" + next_id).children("#source_image").attr("src");
      alert(next_source_image);
      alert("NExt if-if");
      var scale_image = new Image();
      scale_image.src = next_child_image;
      var width = scale_image.width;
      var height = scale_image.height;
     
      var margin_left = Math.abs(maxwd - width);
      var margin_top = Math.abs(maxht - height)/2;
      if (margin_top < 50)
      {
         margin_top = 50;
         //alert("margin check");
      }
      if (margin_left < 250)
      {
         margin_left = 300;
        //alert("margin check");
      }

      data_id = next_id;
      //alert(data_id);
      modal_window.css({'width':width,'height':height});
      modal_window.css({'top':margin_top,'left':margin_left});
      $("#modal_image").attr("src", next_child_image); 
      $("#source_image").attr("src", next_source_image); 
      /*}
      else
      {
        alert("next if-else");
      }
      */
      }); 
    }
    else
    {
      $('#next_img').live("click",function() {
      //alert(data_id);
      var next_id = $("#" + data_id).next("div").attr("id");
      
      if(next_id)
      {
      var next_child_image = $("#" + next_id).children("img").attr("src");
      var next_source_image = $("#" + next_id).children("#source_image").attr("src");
      alert("NEXT Else if"); 
      var scale_image = new Image();
      scale_image.src = next_child_image;
      var width = scale_image.width;
      var height = scale_image.height;
      var margin_left = Math.abs(maxwd - width);
      var margin_top = Math.abs(maxht - height)/2;
      if (margin_top < 50)
      {
         margin_top = 50;
         //alert("margin check");
      }
      if (margin_left < 250)
      {
        margin_left = 300;
        //alert("margin check");
      }
      data_id = next_id;
      modal_window.css({'width':width,'height':height});
      modal_window.css({'top':margin_top,'left':margin_left});
      $("#modal_image").attr("src", next_child_image); 
      $("#source_image").attr("src", next_source_image); 
      }
      else{
        alert("next-else-else");
      }
      }); 
     
   
}




    if ($("#" + data_id).prev("div").attr("id"))
    {  
      $('#prev_img').click(function() {
      //alert(prev_id); 
     
      //alert(data_id);
      var prev_id = $("#" + data_id).prev("div").attr("id");
      if (prev_id)
      {
      var prev_child_image = $("#" + prev_id).children("img").attr("src");
      var prev_source_image = $("#" + prev_id).children("#source_image").attr("src");
      alert("Prev if-if"); 
      var scale_image = new Image();
      scale_image.src = prev_child_image;
      var width = scale_image.width;
      var height = scale_image.height;
      data_id = prev_id;
      alert(data_id);
      var margin_left = Math.abs(maxwd - width);
      var margin_top = Math.abs(maxht - height)/2;
      if (margin_top < 50)
      {
         margin_top = 50;
         //alert("margin check");
      }
      if (margin_left < 250)
      {
        margin_left = 300;
        //alert("margin check");
      }
      modal_window.css({'width':width,'height':height});
      modal_window.css({'top':margin_top,'left':margin_left});
      $("#modal_image").attr("src", prev_child_image);
      $("#source_image").attr("src", prev_source_image); 
      }
      else
      {
        alert("prev-if-else");
      }
      });
     
    }
    else
    {
      
        $('#prev_img').click(function() {
        //alert(prev_id); 
       
        alert(data_id);
        var prev_id = $("#" + data_id).attr("id");
        if(prev_id)
        {
        var prev_child_image = $("#" + prev_id).children("img").attr("src");
        var prev_source_image = $("#" + prev_id).children("#source_image").attr("src");
        alert("Prev Else-if"); 
        var scale_image = new Image();
        scale_image.src = prev_child_image;
        var width = scale_image.width;
        var height = scale_image.height;
        var margin_left = Math.abs(maxwd - width);
        var margin_top = Math.abs(maxht - height)/2;
        if (margin_top < 50)
        {
           margin_top = 50;
           //alert("margin check");
        }
        if (margin_left < 250)
        {
          margin_left = 300;
          //alert("margin check");
        }
        data_id = prev_id;
        modal_window.css({'width':width,'height':height});
        modal_window.css({'top':margin_top,'left':margin_left});
        $("#modal_image").attr("src", prev_child_image);
        $("#source_image").attr("src", prev_source_image); 
        }
        else{
          alert("prev-else-else");
        }
        });
      
    }
  
  return true;
}


/*
 * Register handlers here
 */
$(document).ready(function() {  
  $(".js_image_tab_click").click(function(){
      /* Remove active from all tabs */
		  $(".js_image_tab_click").removeClass("active");


		  $(this).addClass("active"); //Add "active" class to selected tab
      
      var tab_id = $(this).attr("id");

      if(tab_id == "channels_image_tab_head"){
        $("#streams_image_main_bar").hide();
        $("#channels_image_main_bar").fadeIn();

      }else if(tab_id == "streams_image_tab_head"){
        $("#channels_image_main_bar").hide();
        $("#streams_image_main_bar").fadeIn();
          
      }


		  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active ID content
    return false;
  });
});

/*
 * Main render of images page
 */
function show_images_init(){
    var page_owner_id=$('#page_owner_id').attr("value");
    var session_owner_id=$('#session_owner_id').attr("value");
    
    
   
    /* At very start Hide all contents on page load */

      $("#channels_image_main_bar").show();
      $("#streams_image_main_bar").hide();
      $("#channels_left_side_bar").show();
      $("#channels_right_side_bar").show();
  	  $("ul.p-cstab_mm li:first").addClass("active").show();


}


