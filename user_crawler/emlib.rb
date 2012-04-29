require 'rubygems'
require 'em-http-request'
require 'json'
require 'pp'
require 'fiber'
require 'em-synchrony'

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


