require 'curb'
c = Curl::Easy.http_post("http://localhost:3000/crawled_user",
                         Curl::PostField.content('array', [{:uid=>'972651',:provider=> 'twitter' , :username=> 'mashable', :full_name=> 'Pete Cashmore', :auth_key=>'A1B2C3D4E5F6987654321ABCDEFGH',:authenticity_token=>'GQaU1m3VHYv/myGcyr9kDEWtibjo0UjF1o02JZPABH0='}]))
puts c
