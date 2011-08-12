

 function render_video_internal( data, internal_id, new_tab_id)
 {
    var video_id = internal_id;
    var url = $.jYoutube((data.url));
    var video_html =  '<li><a class="youtubeLink" id="'+ video_id +'" href="'+data.url+'"><img src="'+url+'" height="240px" width="250px"/></a></li>';
   
    //the_big_json_tab_internal[video_id] = {box:box_id, tab:new_tab_id}
    return video_html;
 }
