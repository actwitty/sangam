/*************************************************/
/*
 *
 *
 */
function aw_api_ppm_input_fb_share(stream_info){

  var fb_url = "https://graph.facebook.com/me/feed?callback=?";
  //https://graph.facebook.com/me/feed?access_token=AAACdPveDhOsBAP1oFoJZCVfezCDPQSZAaHII37HZBta0g9zMYgZB2TOUZAXQ4DkQtRffhpbkq6BgMZCkE7dlcvVdW5SuJG0dEpD7AlKYeIcwZDZD&message=hello
  /* var share_url = aw_lib_get_base_url() + '/view?id=' + stream_info.post.id;
  var share_url = "www.rediff.com";
  var share_action_links = [{"text":"Rediff Blogger","href":"http://www.rediff.com"}];
   var prop  = {
                '.': ' ',
                '{text:Click here and see, }': { 'text': 'Visit us at', 'href': 'www.actwitty.com'}
              };
   var share_attachment ="{
                          'name':'ActWitty Blogger',
                          'href':'http://www.redif.com',
                          'caption':'Love this',
                          'properties': prop, 
                          'media': [
                                      {      
                                        'type': 'image', 
                                        'src': 'http://icanhascheezburger.files.wordpress.com/2009/03/funny-pictures-kitten-finished-his-milk-and-wants-a-cookie.jpg', 
                                        'href': 'http://icanhascheezburger.com/2009/03/30/funny-pictures-awlll-gone-cookie-now/'
                                      }, 
                                      {
                                        'type': 'image', 
                                        'src': 'http://photos.icanhascheezburger.com/completestore/2009/1/18/128768048603560273.jpg', 
                                        'href': 'http://ihasahotdog.com/upcoming/?pid=20869'
                                      }
                                  ]
                         }";
   */
  var fb_share_jsonp = { 
                          access_token : aw_api_ppm_facebook_get_signed_in_auth_token(),
                          message: 'This is a message',
                          picture: 'http://photos.icanhascheezburger.com/completestore/2009/1/18/128768048603560273.jpg', 
                          link: 'www.rediff.com',
                          name: 'This is the name',
                          caption: 'This is a caption',
                          description: 'This is a post description',
                          source: 'www.rediff.com'

                      };

  alert(JSON.stringify(fb_share_jsonp));
  
  $.ajax({
           crossDomain: true,
           data: fb_share_jsonp,
           dataType: "jsonp",
           url: fb_url,
           type: 'POST',
           success: function (data) {
                alert("done");
                alert(JSON.stringify(data));
               },
           error: function (data, e1, e2) {
                       alert("fail");
                   }
  });
}
