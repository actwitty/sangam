require 'rubygems'
require 'em-http-request'
require 'json'
require 'pp'
require 'fiber'
require 'em-synchrony'

ALCHEMY_URL="http://access.alchemyapi.com/calls/url/URLGetCategory"
ALCHEMY_API_KEY="98f6cdf9355987fa6a0100f5704c2bceccc19f4e"
Thread.abort_on_exception=true

class MyHttp
 
  #sites => ARRAY => [{:url => "http://gmai.com", :params => {}, :method => "get"}, ...] or
  #         HASH => {:url => "http://gmai.com", :params => {}, :method => "post" }
  def self.request(sites)
    http = nil
    pp "START OF EM FUNC" + Thread.current.inspect
    f = Fiber.current
    #q = Queue.new

    multi = EM::MultiRequest.new
    array = []
      
    if sites.class == Hash
      array << sites
      sites = array
    end  
 
    sites.each_with_index do |h, idx|
      h[:params] = {} if h[:params].nil?
      if h[:method] == "post"
        
        params = nil 
        if h[:params].class != Hash
          params = {:body => h[:params]}
        else
          if h[:params][:body].nil?
            params = {:body => h[:params]}
          else
            params = h[:params]
          end
        end

        req=multi.add(h[:handle], EventMachine::HttpRequest.new(h[:url]).post(params))
      else
        h[:params][:redirects] = 2 
        multi.add(h[:handle], EventMachine::HttpRequest.new(h[:url]).get(h[:params]))
      end
    end
    array = []  

    multi.callback{
      puts "CALLBACK STARTING #{Thread.current}"
      
      multi.responses[:callback].each do |k,v|
         pp "Callback"
         array << {:handle => k, :response => v.response, :header => v.response_header,:request => v.req }
      end
      
      multi.responses[:errback].each do |k,v|
        pp "**********************************************"
        pp  v.response
        #pp  v.req
        #pp multi.responses[:errback]
        array << {:handle => k, :response => v.response, :header => v.response_header, :request => v.req  }
      end
      #array = array[0] if array.size == 1
      f.resume(array)
      #q << array
    }
   
    #a = q.pop
    #return a
    Fiber.yield
  rescue => e
    puts("Rescue => #{e.message}")
  end
end


def event_machine_on
  Thread.new {
    EM.run {
      pp "inside event machine" + Thread.current.inspect
    }
  }
end

def test_fiber(link, &block)
 
  EM.next_tick {
    Fiber.new {
    #cb = Proc.new {puts "defer callback"}
    #op = Proc.new { Fiber.new {my_func(link)}.resume} 
    #EM.defer(op, cb)  
      my_func("http://www.ruby-doc.org/stdlib-1.9.3/libdoc/thread/rdoc/Queue.html")
    }.resume
  }

end

def my_func(link)
  response = MyHttp.request([{:url => ALCHEMY_URL, :params=>{'url'=>"#{link}",'apikey'=> ALCHEMY_API_KEY, 'outputMode'=> "json"}, :method => "post", :handle => "alchemy"}])
   #puts "In Callback => #{response[0][:response]} => #{Thread.current.inspect}  => #{Thread.list.size}"
   puts "AFTER SLEEP => #{Thread.current.inspect}  => #{Thread.list.size}"

rescue => e
  puts "RESCUE **** ERROR **** #{e.message}"
end

def test_threads
  EM.next_tick {
    25.times do |i| 
      Thread.new {
        my_func("http://www.ruby-doc.org/stdlib-1.9.3/libdoc/thread/rdoc/Queue.html")
        puts "In Event Machine   => #{Thread.current.inspect} => #{Thread.list.size} => Thread Count = #{i}"
      }
    end
  }
end
if __FILE__ == $0
  while true
    out = STDIN.readline
    out = out.gsub(/\n/,"")

    if !EM.reactor_running?
      event_machine_on
    end
    test = Proc.new {|x| pp "Block " + x.inspect}
    #test_fiber(out, &test)
    test_threads

    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end

