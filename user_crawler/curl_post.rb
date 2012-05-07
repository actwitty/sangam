require './common.rb'
require './emlib.rb'
require './oauth1.rb'
require 'curb'

class CurlPost
  class << self
    SERVER_ENDPOINT = 'http://actwitty-cedar.herokuapp.com/crawled_user'
    #SERVER_ENDPOINT = 'http://localhost:3000/crawled_user'
    DATA_FILE = "data/users"

    def create_crawled_user(server_endpoint, data_file)
      c = Curl::Easy.new(server_endpoint)
      c.http_post( Curl::PostField.content('data', {:users => get_users(data_file) , :auth_key=>'A1B2C3D4E5F6987654321ABCDEFGH'}))
      c.perform
    end

    def get_users(data_file)
      array = []
      f = File.open(data_file,"r")
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
    
    if ARGV.size != 2
      puts "Usage - ruby curl_post.rb <SERVER_ENDPOINT> <USER_LIST_FILE>"
      exit(1)
    end

    EM.next_tick {
      Fiber.new { 
      CurlPost.create_crawled_user(ARGV[0], ARGV[1])
      }.resume
    }

    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end

