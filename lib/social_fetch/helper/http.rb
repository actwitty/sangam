module SocialFetch
  module Helper
    class Http
      class << self
        Thread.abort_on_exception=true
        require "fiber"
        require 'em-http-request'

        def get(url)

          response = nil

          uri = URI.parse(url)
          http_session = Net::HTTP.new(uri.host, uri.port)
          http_session.use_ssl = true if uri.port == 443
          http_session.start { |http|
            request = Net::HTTP::Get.new(uri.request_uri)
            response = http.request(request)
          }
          response

        end

        def post(url,params)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [post] entering #{url} #{params.inspect}")

          uri = URI.parse(url)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [post] URI #{uri.inspect}  #{uri.path} #{uri.host} #{uri.port}")
          req = Net::HTTP::Post.new(uri.path)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [post] INITIAL REQUEST #{req.inspect}")
          req.set_form_data(params)

          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = true  #if uri.port == 443


          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [post] REQUEST #{req.inspect}")
          res = http.start do |http|
            http.request(req)
          end
          pp res
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [post] RESPONSE #{res.message.inspect}")
          res
        end

        def em_post(url, params, handle)

          array = [{:url => url, :params => params, :method => "post", :handle => handle}]
          request(array)

        end
        #sites => ARRAY => [{:url => "http://gmai.com", :params => {}, :method => "get", :handle => "12333"}, ...] or
        #         HASH => {:url => "http://gmai.com", :params => {}, :method => "post", :handle => "12333" }
        def request(sites)
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [REQUEST] #{sites.inspect}")
          http = nil

          f = Fiber.current

          multi = EM::MultiRequest.new
          sites.each do |h|
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [REQUEST] url => #{h[:url]} ,params => #{h[:params]}")

            h[:params] = {} if h[:params].blank?
            if h[:method] == "post"
              multi.add(h[:handle], EventMachine::HttpRequest.new(h[:url]).post({:body => h[:params] }))
            else
              multi.add(h[:handle], EventMachine::HttpRequest.new(h[:url]).get(h[:params]))
            end
          end

          array = []
          multi.callback{
            multi.responses[:callback].each do |k,v|
               Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [REQUEST] Callback")
               array << {:handle => k, :response => v.response}
            end
            multi.responses[:errback].each do |k,v|
              Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [REQUEST] ErrBack #{v.inspect}")
              array << {:handle => k, :response => v.response}
            end

            #can return blank array
            #array = array[0] if array.size == 1
            f.resume(array)
          }

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [REQUEST] leaving")
          Fiber.yield
        rescue => e
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [HELPER] [HTTP] [REQUEST] for Rescue => #{e.message}")
        end

      end
    end
  end
end
