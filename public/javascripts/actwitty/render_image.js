var the_big_image_click_manager_json={};

function get_image_context(id){
  return the_big_image_click_manager_json[id];
}


  function render_image_internal( data, internal_id, new_tab_id){
    var image_id = internal_id;
    var scale_image = new Image();
    scale_image.src = data.img;
    /*
    theImage.load(function(){
    var imgwidth     = $(this).width;
    var imgheight    = $(this).height; 
    });
    */

    scale_image.width = data.width;
    scale_image.height = data.height;

		var wdt = scale_image.width;
		var ht = scale_image.height;
    //alert(wdt);
		var maxwdt = 150;
		var maxht = 100;
    var temp = 0;
    var w = 0;
    var h = 0;
    var top_margin = 0;
    var left_margin = 0;
    //alert(data.img.width());
    //var ID = $("#"+image_id).children("img").attr("id");
    //alert(ID);
    //alert($(this).children().attr("id"));
    //alert('#'+internal_id);
    var	xwidth = $('#' + internal_id);
	  //var	xheight = ($('#'+ID).height());
    //alert(wdt);
    //alert(data.img);
			
		if (scale_image.height < scale_image.width){
			if (scale_image.width > maxwdt){
				 tmp = Math.ceil(scale_image.width / maxwdt);
				 w = Math.ceil(scale_image.width / tmp);
				 h = Math.ceil(scale_image.height / tmp);
				 top_margin = ( maxht - h)/2;
				 left_margin = ( maxwdt - w)/2;
        //alert(data.img);  
			}
			else{
				
				if (scale_image.height > maxht){
					 tmp = Math.ceil(scale_image.height / maxht);
					 w = Math.ceil(scale_image.width / tmp);
					 h = Math.ceil(scale_image.height / tmp);
					 top_margin = ( maxht - h)/2;
					 left_margin = ( maxwdt - w)/2;
          //alert(data.img);  
				}
				else{
					h = scale_image.height;
					w = scale_image.width;
					top_margin = ( maxht - h)/2;
					left_margin = ( maxwdt - w)/2;
          //alert(data.img);  
				}
			}
		}
		else if (scale_image.height > scale_image.width){
			if (scale_image.height > maxht){
				 tmp = Math.ceil(scale_image.height / maxht);
				 w = Math.ceil(scale_image.width / tmp);
				 h = Math.ceil(scale_image.height / tmp);
				 top_margin = ( maxht - h)/2;
				 left_margin = ( maxwdt - w)/2;
        //alert(data.img);  
			}
			else{
				 h = scale_image.height;
				 w = scale_image.width;
				 top_margin = ( maxht - h)/2;
				 left_margin = ( maxwdt - w)/2;
        //alert(data.img);  
			}
		}

	  var image_html  = '<img src="/images/' +  data.img  + '"' +
                       'style="height:'+h+'px;width:'+w+'px;margin-top:'+top_margin+'px;margin-left:'+left_margin+'px;"' +
                       'class="imgsrc ' + data.jquery_class + ' " id="' + image_id + '">'+
                       '<img id="source_image" src="/images/'+ data.source +'" style="display:none;">';
    
    var click_id =  new_tab_id;
    $("#"+ new_tab_id ).addClass("js_modal_dialog_link");  
    $("#"+ new_tab_id ).addClass("JS_AW_MODAL_image"); 
    //alert($("#"+ new_tab_id ).next("div").attr("id"));
    //alert(new_tab_id);
    var img_div_window =   $('#' + new_tab_id);
    img_div_window.css({'width':150,'height':100});
    //alert(click_id);
    
    the_big_image_click_manager_json[click_id] = {
                                                    url: data.img,
                                                    source: data.source,
                                                    height: ht,
                                                    width:  wdt
                                                 };
                                                 
    return image_html;
  }
