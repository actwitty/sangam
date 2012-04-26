require 'curb'

LOCLAHOST_TOKEN = 'GQaU1m3VHYv/myGcyr9kDEWtibjo0UjF1o02JZPABH0='
SERVER_ENDPOINT = 'http://localhost:3000/crawled_user'
def create_crawled_user
  c = Curl::Easy.http_post(SERVER_ENDPOINT,
                         Curl::PostField.content('data', {:users => get_users, :auth_key=>'A1B2C3D4E5F6987654321ABCDEFGH'}),
                         Curl::PostField.content('authenticity_token', LOCLAHOST_TOKEN))
  puts c
end

def get_users
  array = []
  array <<  {:uid=>'972651', :provider=> 'twitter' , :full_name=> 'Pete Cashmore'}
  array <<  {:uid=>'972651', :provider=> 'twitter' , :full_name=> 'Pete Cashmore'}
  array <<  {:uid=>'43857071', :provider=> 'twitter' , :full_name=> 'Alok Srivastava'}
  array
end

create_crawled_user
