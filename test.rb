require "json"
require "uri"
require "pp"

Json = {
   "data" => [
      {
         "id" => "720637814_204024813013848",
         "from"=> {
            "name"=> "Alok Srivastava",
            "id"=> "720637814"
         },
         "message"=> "http://www.buzzfeed.com/mjs538/the-most-powerful-photos-of-2011",
         "picture"=> "http://external.ak.fbcdn.net/safe_image.php?d=AQB8ayFB6YPjWiVT&w=90&h=90&url=http\u00253A\u00252F\u00252Fs3-ak.buzzfed.com\u00252Fstatic\u00252Fcampaign_images\u00252Fweb04\u00252F2011\u00252F12\u00252F8\u00252F16\u00252Fthe-45-most-powerful-images-of-2011-15315-1323378607-16.jpg",
         "link"=> "http://www.buzzfeed.com/mjs538/the-most-powerful-photos-of-2011",
         "name"=> "The 45 Most Powerful Images Of 2011",
         "caption"=> "www.buzzfeed.com",
         "description"=> "The 45 Most Powerful Images Of 2011: What a year! Here's to 2012 being a more quiet and less destructive year...",
         "icon"=> "http://static.ak.fbcdn.net/rsrc.php/v1/yD/r/aS8ecmYRys0.gif",
         "actions"=> [
            {
               "name"=> "Comment",
               "link"=> "http://www.facebook.com/720637814/posts/204024813013848"
            },
            {
               "name"=> "Like",
               "link"=> "http://www.facebook.com/720637814/posts/204024813013848"
            }
         ],
         "privacy"=> {
            "description"=> "Only Me",
            "value"=> "SELF"
         },
         "type"=> "link",
         "created_time"=> "2011-12-09T07:42:35+0000",
         "updated_time"=> "2011-12-09T07:42:35+0000",
         "comments"=> {
            "count"=> 0
         }
      }
    ]
}

require 'cgi'
def test
  u = URI.unescape(Json["data"][0]["picture"])
  cgi = CGI::parse(u)
  pp cgi["url"][0]
  pp cgi["w"][0]
  pp cgi["h"][0]

end
test
