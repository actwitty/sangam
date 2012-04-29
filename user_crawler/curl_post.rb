require './common.rb'
require './emlib.rb'
require './oauth1.rb'
require 'curb'

class CurlPost
  class << self
    SERVER_ENDPOINT = 'http://cold-dusk-3254.herokuapp.com/crawled_user'
    DATA_FILE = "data/users"

    def create_crawled_user
      c = Curl::Easy.new(SERVER_ENDPOINT)
      c.http_post( Curl::PostField.content('data', {:users => get_users , :auth_key=>'A1B2C3D4E5F6987654321ABCDEFGH'}))
      c.perform
    end

    def get_users
      array = []
      f = File.open("data/users","r")
      a = f.readlines
      a.each {|l| array << eval(l)}
      array
    end
  end
end

def event_machine_on
  Thread.new {
    EM.run {
      pp "inside event machine" + Thread.current.inspect
    }
  }
end

if __FILE__ == $0
  while true
    out = STDIN.readline
    out = out.gsub(/\n/,"")

    if !EM.reactor_running?
      event_machine_on
    end
    
    EM.next_tick {
      Fiber.new { 
       CurlPost.create_crawled_user
      }.resume
    }

    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end

