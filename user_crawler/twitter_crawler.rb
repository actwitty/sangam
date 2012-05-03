require './common.rb'
require './emlib.rb'
require './oauth1.rb'


class TwitterCrawler
  class << self
    TWITTER_SUGGESTIONS = 'https://api.twitter.com/1/users/suggestions/'
    DATA_FILE = "data/users"

    private
    def call_em(requests)
      response = MyHttp.request(requests)
    end


    def create_oauth
      oauth = OauthUtil.new

      oauth.consumer_key='2E38F1bp3pmvGMW5hYUPtA'
      oauth.consumer_secret='DfqFIM0Y3Z9JWWruWfi5V4kirktL0CpQzhebW9FE'

      oauth.token_secret='440859440-UGWWkwH5WAebLkwncu8hCN5kcmNiKbKzvFUkZx3W'
      oauth.token = 'Hpqy3xEtp8zxLJEfZz3rNsMTg0Eg0Dx2qHHaLqOYDQ'
      oauth
    end

    #{:api => "suggestions/followers..", :options => {:category (for suggestions) => "music" ...}}
    def form_request(params)
      url = nil
      service_opts = nil
      url_hash = {}

      case params[:api]
        when "suggestions"
          service_opts = {'count' => 200}
          url =  "#{TWITTER_SUGGESTIONS}#{params[:options][:category]}.json"
      end

      if !url.nil?
        parsed_url = URI.parse(url)
        url_hash = {:parsed_url => parsed_url}
        url_hash[:service_opts] = service_opts if !service_opts.nil?

        oauth = create_oauth
        url = "#{ parsed_url.scheme}://#{parsed_url.host}#{ parsed_url.path }?#{ oauth.sign(url_hash).query_string }"
      end
      url
    end



    def handle_request(api, response)

      return [] if response.nil?

      array = []

      d = File.open(DATA_FILE, "a+")

      case api
        when "suggestions"

        response["users"].each do |user|
          u = extract_user(user,d)
          array << u if !u.blank?
        end

      end
      d.close
      array
    end

    def handle_file(type, file)

      return [] if file.nil?

      array = []
      d = File.open(DATA_FILE, "a+")

      case type
        when "suggestions"
          json = file.readline
          json = json.gsub(/\n/,"")

          hash = JSON.parse(json)

          hash["users"].each do |user|
            u = extract_user(user, d)
            array << u if !u.blank?
          end

      end
      d.close
      array
    end

    def extract_user(blob,file)
      h = {:uid => blob["id_str"], :provider => "twitter", :full_name => blob["name"], :photo => blob["profile_image_url"]}
      h[:location] = blob["location"] if !blob["location"].blank?
      file.puts(h) if !h.blank?
      h
    end


    public

    def process_request(params)

      if !EM.reactor_running?
        Thread.new {
          EM.run {
            pp "inside event machine" + Thread.current.inspect
          }
        }
      end
      EM.next_tick {
        Fiber.new {
          #array =  TwitterCrawler.process_request({:api => "suggestions", :options => {:catgeory => "sports"}})
          array = []
          hash = {}

          url =  form_request(params)

          if !url.nil?
            puts url

            response = call_em({:url =>url, :params => nil, :method => "get", :handle => 0})

            hash = JSON.parse(response[0][:response])  if !response[0][:response].blank?

            array = handle_request(params[:api], hash)
          end
          array
          puts array
        }.resume
      }
    end

    def process_file(params)
      array = []

      f = File.open("#{params[:file_name]}", "r")

      type = params[:file_name].split("_")[1]

      array= handle_file(type, f)



      array
    end
  end
end


if __FILE__ == $0
  while true
    out = STDIN.readline
    out = out.gsub(/\n/,"")
    #array = TwitterCrawler.process_request({:api => "suggestions",:options => {:category => "sports"}})
    array = TwitterCrawler.process_file({:file_name => "data/tech_suggestions"})
    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end

