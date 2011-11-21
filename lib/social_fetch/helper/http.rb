module SocialFetch
  module Helper
    class Http
      class << self
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
          uri = URI.parse(url)
          req = Net::HTTP::Post.new(uri.path)
          req.set_form_data(params)

          res = Net::HTTP.start(uri.host, uri.port) do |http|
            http.request(req)
          end
          res
        end

      end
    end
  end
end
