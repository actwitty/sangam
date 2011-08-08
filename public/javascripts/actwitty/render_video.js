

 function render_video_internal( data, internal_id, new_tab_id)
 {
    var video_id = internal_id;
    var url = $.jYoutube((data.url));
 
    var video_html =  '<a class="youtubeLink" id="'+ video_id +'" href="#"><img src="'+url+'" height="100px" width="150px"/></a>';
    //the_big_json_tab_internal[video_id] = {box:box_id, tab:new_tab_id}
    return video_html;
 }
