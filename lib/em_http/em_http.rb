require 'rubygems'
module EmHttp
  class Http
    class << self

      Thread.abort_on_exception=true
      require "fiber"
      require 'em-http-request'

      def em_post(url, params, handle)

        array = [{:url => url, :params => params, :method => "post", :handle => handle}]
        request(array)

      end

      #sites => ARRAY => [{:url => "http://gmai.com", :params => {}, :method => "get", :handle => "12333"}, ...] or
      #         HASH => {:url => "http://gmai.com", :params => {}, :method => "post", :handle => "12333" }
      def request(sites)
        Rails.logger.info("[LIB] [EMHTTP] [HTTP] [REQUEST] #{sites.inspect}")
        http = nil

        f = Fiber.current

        multi = EM::MultiRequest.new

        sites.each do |h|
          Rails.logger.info("[LIB] [EMHTTP] [HTTP] [REQUEST] url => #{h[:url]} ,params => #{h[:params]}")

          h[:params] = {} if h[:params].blank?

          if h[:method] == "post"

            params = nil
            if h[:params].class != Hash
              params = {:body => h[:params]}
            else
              if h[:params][:body].blank?
                params = {:body => h[:params]}
              else
                params = h[:params]
              end
            end
            multi.add(h[:handle], EventMachine::HttpRequest.new(h[:url]).post(params))
          else
            multi.add(h[:handle], EventMachine::HttpRequest.new(h[:url]).get(h[:params]))
          end
        end

        array = []
        multi.callback{
          multi.responses[:callback].each do |k,v|
             Rails.logger.info("[LIB] [EMHTTP] [HTTP] [REQUEST] Callback")
             array << {:handle => k, :response => v.response}
          end
          multi.responses[:errback].each do |k,v|
            Rails.logger.info("[LIB] [EMHTTP] [HTTP] [REQUEST] ErrBack #{v.inspect}")
            array << {:handle => k, :response => v.response}
          end

            #can return blank array
            #array = array[0] if array.size == 1
          f.resume(array)
        }

        Rails.logger.info("[LIB] [EMHTTP] [HTTP] [REQUEST] leaving")
        Fiber.yield
      rescue => e
        Rails.logger.info("[LIB] [EMHTTP] [REQUEST] for Rescue => #{e.message}")
      end

    end
  end
end

