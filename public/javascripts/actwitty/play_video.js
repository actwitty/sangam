$(function () {
          //$("a.youtube").YouTubePopup({ autoplay: 0 });
           //alert("In Play_Video.JS");
           /*
           $(".js_aw_ntabs").live("click", function() {
                $(".youtubeLink").YouTubePopup({ youtubeId: 'http://www.youtube.com/watch?v=xcKn9BxTg1A', title: 'New Video Title' });
   
           });
           */
          $(".demo1").ytplaylist({addThumbs:true, autoPlay: false, playerWidth: '100',playerHeight: '100', thumbSize: 'large', showInline: true});

 });
