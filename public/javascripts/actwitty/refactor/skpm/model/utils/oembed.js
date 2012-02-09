/********************************************************************************************/
/*
 *
 *
 */
var aw_local_oembed_map = { 
                            "youtube": [/youtube\.com\/watch.+v=[\w-]+/i , "http://www.youtube.com/oembed"],
                            "flickr": [/flickr\.com\/photos\/.+/i , "http://flickr.com/services/oembed?format=json"],
                            "viddler": [/viddler\.com\/.+/i , "http://lab.viddler.com/services/oembed/?format=json"],
                            "blip": [/blip\.tv\/.+/i , "http://blip.tv/oembed/"],
                            "hulu": [/hulu\.com\/watch\/.+/i , "http://www.hulu.com/api/oembed.json"],
                            "vimeo": [/vimeo\.com\/.+/i , "http://vimeo.com/api/oembed.json"],
                            "dailymotion": [/dailymotion\.com\/.+/i , "http://www.dailymotion.com/api/oembed/"],
                            "scribd": [/scribd\.com\/.+/i , "http://www.scribd.com/services/oembed"],
                            "slideshare": [/slideshare\.net\/.+/i , "http://www.slideshare.net/api/oembed/1"]
                          };


/************************************************************/
/*
 *
 *
 */
function aw_check_oembed(url){
  for(var service in aw_local_oembed_map) {
    if(aw_local_oembed_map[service][0].test(url)) stack.push(aw_local_oembed_map[service][1]);
  }

}
