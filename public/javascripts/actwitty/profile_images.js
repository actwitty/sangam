

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

var the_big_image_channel_manager_json={};

function  get_channel_image_id(data){
  return "channel_image_ele_" + data.word.id + "_" + data.user.id;
}

function get_source_image_url(source){
  var source_img_url ="/images/alpha/at.jpg"; /* initialize with actwitty image source */
  if(source == "twitter"){
    source_img_url="/images/alpha/twitter.jpeg";
  }else if(source == "facebook"){
    source_img_url="/images/alpha/facebook.jpeg";
  }else if(source == "dropbox"){
    source_img_url="/images/alpha/dropbox.jpeg";
  }

  return source_img_url;
}
function aw_image_channel_renderer(div_id, data){
  /*
    [{"word":{"id":1,"name":"travel"},"time":"2011-08-12T06:29:55Z","user":{"id":1,"full_name":"Sudhanshu Saxena","photo":"/images/profile/default.png"},"count":3,"document":{"id":3,"url":"https://s3.amazonaws.com/TestCloudActwitty/test/1_1313061424036_Mario.jpeg","thumb_url":"https://s3.amazonaws.com/TestCloudActwitty/test/thumb_1_1313061427501_Mario.jpeg","caption":"Mario image","source_name":"actwitty","status":2,"uploaded":true,"category":"image","activity_id":11,"summary_id":1}}] */


  var channel_img_ele_id = get_channel_image_id(data);

  if( $("#" + channel_img_ele_id).length){
    /*something bad happened element is already rendered in DOM*/
    return;
  }
 
  /* set context to manage all clicks */
  the_big_image_channel_manager_json[channel_img_ele_id] = data;

  /* pickup url thumb if available*/
  var img_url= data.document.url;
  if( data.document.thumb_url.length){
    img_url =  data.document.url;
  }
  //aw_image_fit_to_size 
  var channel_img_id = channel_img_ele_id + '_img';

  
 var html = '<div class="mm-img-channel-parent-box" id="' + channel_img_ele_id + '">' +
             
                '<div class="mm-img-channel-src-box">' +
                  '<img src="' + get_source_image_url(data.document.source_name) + '"/>' +
                '</div>' +

                /* user box put up here */
                '<div class="mm-img-channel-user-box">' +
                  /* user image */
                  '<div class="mm-img-channel-user-image-box js_img_channel_user_click">' +
                    '<img  src="' + data.user.photo + '" />' +
                  '</div>' +

                  /* user name */
                  '<div class="mm-img-channel-user-name-box js_img_channel_user_click">' +
                    '<span>' +
                      data.user.full_name + 
                    '</span>' +
                  '</div>' +
                '</div>' +

              /* main image put up here */
              '<div class="mm-img-channel-img-box js_img_channel_main_click">' +
                  '<img id="' + channel_img_id + '" src="" class="js_channel_image_load" />' +
              '</div>' +

              

              /* user box put up here */
              '<div class="mm-img-channel-count-box js_img_channel_main_click">' +
                 '<span>' +
                    data.count + 
                  '</span>' +
              '</div>' +

              /* channels box put up here */
              '<div class="mm-img-channel-display-box js_img_channel_main_click">' +
                  '<span>' +
                    data.word.name + 
                  '</span>' +
              '</div>' +

            '</div>';
    
    $("#" + div_id).append(html);
    $("#" + channel_img_id).attr("src", img_url);


    $('#' + channel_img_id).one('load', function() {  
      var img = $(this);
      setTimeout(function(){
        alert("load image done");
        var image_json = {
                         width:img.width,
                         height:img.height
                       };
        var box_json = {
                         width:200,
                         height:150
                       };
                        
        var resize_json = aw_image_fit_to_size(image_json, box_json);
        alert(JSON.stringify(resize_json));
        img.attr("height", resize_json.height);
        img.attr("width", resize_json.width);

        img.show();
        var manager_id=img.closest(".mm-img-channel-parent-box").attr("id");
        //alert(JSON.stringify(the_big_image_channel_manager_json[manager_id]));
      }, 1000);
  }).each(function() {
    if(this.complete) $(this).load();
  });
            

    
}

/*
 * Register handlers here
 */
var g_is_image_channels_populated=false;
var g_is_image_streams_populated=false;

function append_image_channels(){
   var page_owner_id=$('#page_owner_id').attr("value");
   var friends_val = true;
   var updated_at_val = $('#more_streams_image_cookie').val();

   $.ajax({

            url: '/home/get_document_channel.json',
            type: 'GET',
            data: {
                    user_id : page_owner_id,
                    friend : friends_val,
                    updated_at : updated_at_val,
                    category : "image"
                  },
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                  //alert(JSON.stringify(data));
                  $.each(data, function(i,channel){

                  
                    /* div id and channel data*/
                    aw_image_channel_renderer("channels_image_display_list", channel);
                    /* set last image as cookie */
                    $('#more_streams_image_cookie').val(channel.time);
                  });
              },
            error:function(XMLHttpRequest,textStatus, errorThrown){ 
               alert('There has been a problem getting image summaries. \n ActWitty is trying to solve.');
            }
            }); 

}


$(document).ready(function() {  
  $(".js_image_tab_click").click(function(){
      /* Remove active from all tabs */
		  $(".js_image_tab_click").removeClass("active");


		  $(this).addClass("active"); //Add "active" class to selected tab
      
      var tab_id = $(this).attr("id");

      if(tab_id == "channels_image_tab_head"){
        $("#streams_image_main_bar").hide();
        $("#channels_image_main_bar").fadeIn();
        if(!g_is_image_channels_populated){
          append_image_channels();
          g_is_image_channels_populated = true;
        }

      }else if(tab_id == "streams_image_tab_head"){
        $("#channels_image_main_bar").hide();
        $("#streams_image_main_bar").fadeIn();
          
      }


		  var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active ID content
    return false;
  });
  
  $("#more_streams_image").click(function(){
    append_image_channels();
  });


  /****************************************************/
  /* jump to stream of current or remote user */
  $('.js_img_channel_main_click').live('click', function(){
    var manager_id=$(this).closest(".mm-img-channel-parent-box").attr("id");
    alert(JSON.stringify(the_big_image_channel_manager_json[manager_id]));
  });
    
  /* jump to user on click */
  $('.js_img_channel_user_click').live('click', function(){
    alert("clicked js_img_channel_user_click");
    var manager_id=$(this).closest(".mm-img-channel-parent-box").attr("id");
    alert(JSON.stringify(the_big_image_channel_manager_json[manager_id]));
  });

  
  /****************************************************/
  

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

      if(!g_is_image_channels_populated){
        the_big_image_channel_manager_json={};
        append_image_channels();
        g_is_image_channels_populated = true;
      }


}


