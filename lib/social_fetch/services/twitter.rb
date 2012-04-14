module SocialFetch
  module Services
    class Twitter
      class << self

        FEED = "https://api.twitter.com/1/statuses/user_timeline.json"

        #INPUT => {
        #          :user_id => 123,
        #          :uid => "234",
        #          :access_token => "gdjjsagjgds.."
        #          :token_secret => "jsdhfkjfhkj" or nil
        #          :first_time => true or false
        #         }
        #OUTPUT => array of messages from twitter in descending order of creation time in twitter specific format
        def pull_data(params)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [pull_data] entering  #{params.inspect}")

          data_array = []

#          access_token = '440859440-UGWWkwH5WAebLkwncu8hCN5kcmNiKbKzvFUkZx3W'
#          uid = "440859440"
#          token_secret = 'Hpqy3xEtp8zxLJEfZz3rNsMTg0Eg0Dx2qHHaLqOYDQ'

          access_token = params[:access_token]
          uid = params[:uid]
          token_secret = params[:token_secret]

          oauth = ::Oauth1::OauthUtil.new

          oauth.consumer_key=AppConstants.twitter_consumer_key
          oauth.consumer_secret=AppConstants.twitter_consumer_secret

          oauth.token_secret=token_secret
          oauth.token = access_token

          params[:first_time] == true ? limit =  AppConstants.max_import_first_time : limit = AppConstants.max_import_every_time

          service_opts = {'include_rts' => true, 'include_entities'=> true, 'count' => limit, 'user_id' => uid}

          parsed_url = URI.parse( FEED )

          hash = {:parsed_url => parsed_url, :service_opts => service_opts}

          url = "#{ parsed_url.scheme}://#{parsed_url.host}#{ parsed_url.path }?#{ oauth.sign(hash).query_string }"

          puts url
          response = ::EmHttp::Http.request([{:url => url, :params => {}, :method => "get", :handle => 0}])

          #puts response[0][:response].inspect

          data_array = JSON.parse(response[0][:response])  if !response[0][:response].blank?

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [pull_data] Leaving  #{params.inspect}")

          data_array
        rescue  => e
         Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [pull_data] **** RESCUE **** => #{e.message} for #{params.inspect}")
         return []
        end

        #     INPUT => {  :user_id => 123,
        #                 :uid => "234",
        #                 :latest_msg_timestamp => 1994-11-05T13:15:30Z ( ISO 8601) #its an example it will be utc time,
        #                 :latest_msg_id => "2342423432"
        #                 :blob => {} #single twitter data blob,
        #              }
        #     OUTPUT => {
        #                 :post => {
        #                             :status_at_source => AppConstants.status_private/public,[MANDATORY] [TELLS WHETHER TO STORE DATA FOR THIS MESSAGE OR NOT]
        #
        #                             :source_object_id => "2342", [MANDATORY]
        #
        #                             :source_name => "twitter", [MANDATORY]
        #
        #                             :source_uid => "12123232" #uid of user at twitter   [MANDATORY]
        #
        #                             :source_object_type => "post"/"like" AppConstants.source_object_type_post/like
        #
        #                             :status => AppConstants.status_public, [MANDATORY]
        #
        #                             :enrich => true/False, [MANDATORY]
        #
        #                             :word => "stories", [MANDATORY]
        #
        #                             :category_id => "stories",  [MANDATORY]
        #
        #                             :source_created_at => ,1994-11-05T13:15:30Z, [MANDATORY]
        #
        #                             :text => "hello world http://timesofindia.com/123.cms"  [OPTIONAL]
        #
        #                             :json_text => "text:ljk;sdlsd"  [OPTIONAL]   #retains json format of source blob for easy display like for twitter, g+
        #                                                                          #for which we are storing data
        #                                                                          #.. if json_text present use replace :text with json_text while storing
        #                                                                          # we are storing yamls to increase re-usability and simplicity in display functions
        #                                                                          #in client side while doing mash-up with source data ( for example from twitter
        #                                                                          #and twitter data from ou server )
        #
        #
        #                             :location = { [OPTIONAL]
        #                                             :lat => 23.345 ,
        #                                             :long => 46.2334],
        #                                             :name => "MG Road",
        #                                             :city => "Bangalore",
        #                                             :country => "India",
        #                                             :region => "karnataka",
        #                                             :source_name => "twitter",
        #                                             :source_object_id =>"234666"
        #                                         }
        #
        #                             :links => [ [OPTIONAL]
        #                                         {
        #                                           :url => "http://timesofindia.com/123.cms",
        #                                           :description => "Manmohan singh sleeping" [OPTIONAL],
        #                                           :title => "indian politics"[OPTIONAL],
        #                                           :mime => AppConstants.mime_remote_link,
        #                                           :provider => "timesofindia.com",
        #                                           :url_sha => "sedeidnksdskadnksdkasnk" [SHA KEY NEEDED TO OPTIMIZE CHECK OF URL,
        #                                           :ignore => true/false [THIS TELLS THAT IGNORE THIS LINK FOR CATEGORIZATION or RESOLUTION]
        #                                           :image_url => "http://timesofindia.com/123.jpg"
        #                                           :source_object_id => "12313123" #FOR UPLOADED OBJECTS
        #                                         }...
        #                                       ]
        #
        #                             :mentions => [
        #                                            {:source_uid => "232131232", :name => "John Doe}, ..
        #                                          ]
        #
        #                             :tags =>    [
        #                                            { :name => "pizza}, ..
        #                                         ]
        #
        #                             :source_actions => {
        #                                                  "likes" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
        #                                                  "comments" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
        #                                                  "shares" => {:count => 20,:meta => {}},
        #                                                  "retweets" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
        #                                                },
        #                          }
        #               }
        #
        #                                               OR #FOR OLD POST WITH ACTIONS
        #               {
        #                 :invalid_post => {
        #                                     :source_actions => {
        #                                                           "likes" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
        #                                                           "comments" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
        #                                                           "shares" => {:count => 20,:meta => {}},
        #                                                           "retweets" => {:count => 20,:meta => {:friends => [{:name => "alok",:id => "23232313"}...]}},
        #                                                       },  [MANDATORY]
        #                                    :source_object_id => "2342", [MANDATORY]
        #                                  }
        #             }
        #                                            OR #META ACTIVITIES => "John likes Mac's post => We are not Processing this
        #                              {} #blank
        def data_adaptor(params)
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] entering ")

          log = params.except(:blob)
          attr = params[:blob]

          activity = {}
          data = {}

          if validate_profile_feed_blob(params) == true

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] initial dump")

            activity = {
                         :source_object_id => attr["id_str"],
                         :source_name => "twitter",
                         :status => AppConstants.status_public,
                         :enrich => true,
                         :source_created_at => attr["created_at"].to_time.utc,
                         :source_uid => params[:uid],
                       }
            attr["retweeted"] == false ? activity[:source_object_type] = AppConstants.source_object_type_tweet : activity[:source_object_type] = AppConstants.source_object_type_retweet

            if !attr["user"].blank? and attr["user"]["protected"] == true
              activity[:status_at_source] = AppConstants.status_private_at_source
            else
              activity[:status_at_source] = AppConstants.status_public_at_source
            end

            activity[:category_id] = AppConstants.default_category
            activity[:word] = AppConstants.default_category

            source_actions = get_source_actions(attr)
            activity[:source_actions] =  source_actions if !source_actions.blank?

            links = get_links(attr)
            activity[:links] = links  if !links.blank?

            location = get_location(attr)
            activity[:location] = location  if !location.blank?

            tags = get_tags(attr)
            activity[:tags] = tags  if !tags.blank?

            mentions = get_mentions(attr)
            activity[:mentions] = mentions  if !mentions.blank?

            #do this at last as we are trimming the entities hash in blob in links, tags, mentions
            activity[:text] = attr["text"]
            activity[:json_text] = get_json(attr)

            data[:post] = activity

          elsif !attr["user"].blank? and (attr["user"]["id_str"] == params[:uid])
            actions = get_source_actions(attr)

            data[:invalid_post]= {:source_actions => actions, :source_object_id =>attr["id"]} if !actions.blank?

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] Adding Actions => Old Post #{actions} for #{log.inspect}")

          else
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] Empty Data => Not a valid Post for #{log.inspect}")
          end

          data
        rescue  => e
           Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [data_adaptor] **** RESCUE **** => #{e.message} for #{attr.inspect}")
           {}
        end


      private
        #INPUT => blob hash
        #OUTPUT => Array of link hash
        def get_links(blob)
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_links] Entering")
          return [] if blob["entities"].blank?

          links = []
          if !blob["entities"]["urls"].blank?
            blob["entities"]["urls"].each do |attr|

              !attr["expanded_url"].blank? ? link =  attr["expanded_url"] : link =  attr["url"]
              array = ::Api::Helpers::Parser.get_documents({:text => link})

              next if array.blank?

              if  array[0][:url] =~ /twitter.com\/[\w\/]+\/photo\/\w+/
                array[0][:ignore] = true
                array[0][:mime] = ::Api::Helpers::Parser.map_type_to_mime("photo") #override mime
              else
                array[0][:ignore] = false
              end

              array[0][:source_object_id] = attr["id_str"]

              #delete the url as we want reduce the size of entity hash..
              #to store it in yaml text.. we need there is only indices
              attr.delete("display_url")
              attr.delete("expanded_url")
              attr.delete("url")

              links << array[0]
            end
          end

          if !blob["entities"]["media"].blank?
            blob["entities"]["media"].each do |attr|
              !attr["expanded_url"].blank? ? link =  attr["expanded_url"] : link =  attr["url"]
              array = ::Api::Helpers::Parser.get_documents({:text => link})

              array[0][:mime] = ::Api::Helpers::Parser.map_type_to_mime(attr["type"]) #override mime

              array[0][:image_width] = attr["sizes"]["small"]["w"] if !attr["sizes"]["small"].blank?
              array[0][:image_height] = attr["sizes"]["small"]["h"] if !attr["sizes"]["small"].blank?

              array[0][:ignore] = true #ignore categorization of images
              array[0][:source_object_id] = attr["id_str"]

              #delete the url as we want reduce the size of entity hash..
              #to store it in yaml text.. we need there is only indices
              #only leave url as it might need to display image
              attr.delete("display_url")
              attr.delete("expanded_url")
              attr.delete("media_url")
              attr.delete("media_url_https")
              attr.delete("sizes")
              attr.delete("type")
              attr.delete("id")
              attr.delete("id_str")
              links << array[0]

            end
          end

          if links.blank?
            blob["entities"].delete("urls")
            blob["entities"].delete("media")
          end

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_links] Leaving")
          links
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_links] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          []
        end


        #INPUT => blob hash
        #OUTPUT => Tags hash
        def get_tags(blob)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_tags] Entering")

          return [] if blob["entities"].blank?

          tags = []
          if !blob["entities"]["hashtags"].blank?
            blob["entities"]["hashtags"].each do |attr|
              tags << {:name => attr["text"]}

              #delete entries so that entities hash redusces in size to store in yaml text
              #only keep indices
              attr.delete("text")
            end

          end

          blob["entities"].delete("hashtags") if tags.blank?

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_tags] Leaving")

          tags
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_tags] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          []
        end


        #INPUT => blob hash
        #OUTPUT => Mention hash
        def get_mentions(blob)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_mentions] Entering")

          return [] if blob["entities"].blank?

          mentions = []
          if !blob["entities"]["user_mentions"].blank?
            blob["entities"]["user_mentions"].each do |attr|
              mentions << {:source_uid => attr["id_str"],:name => attr["name"]}

              #delete entries so that entities hash redusces in size to store in yaml text
              #only keep indices
              attr.delete("name")
              attr.delete("screen_name")
              attr.delete("id")
              attr.delete("id_str")
            end
           end

          blob["entities"].delete("user_mentions") if mentions.blank?

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_mentions] Leaving")
          mentions
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_mentions] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          []
        end

        #INPUT => blob hash
        #OUTPUT => Source Action Hash
        def get_source_actions(blob)
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_source_actions] Entering ")

          hash = {}

          if blob["retweeted_status"].blank? and (blob["retweeted"] == false) and (blob["retweet_count"] > 0 )
            hash =  {"retweets" => {:count => blob["retweet_count"], :meta => {}} }
          end
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_source_actions] Leaving")

          hash
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_source_actions] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          {}
        end

        #INPUT => blob hash
        #OUTPUT => Location hash
        def get_location(blob)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_location] Entering")

          return {} if blob["place"].blank?

          index,lat,long= 0,0,0
          location = {}

          #consider last set of co-ordinates => [..., [ [], [], [], [] ]]
          if !blob["place"]["bounding_box"].blank?
            blob["place"]["bounding_box"]["coordinates"].each do |array|

              index,lat,long= 0,0,0
              array.each do |attr|
                lat += attr[0]
                long +=attr[1]
                index += 1
              end
            end

              lat = lat/index
              long = long/index

              location ={
                            :lat => lat ,
                            :long => long,
                            :name => blob["place"]["full_name"],
                            :country => blob["place"]["country"],
                            :source_name => "twitter",
                            :source_object_id => blob["place"]["id"]
                          }

            end
            #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_location] Leaving")
            location
          rescue  => e
            Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_location] **** RESCUE **** => #{e.message} for #{blob.inspect}")
            {}
          end

        #INPUT => blob
        #OUTPUT => {  "retweeted" => true or false #tell whether tweet is retweeted or originated
        #             "text" => "jdjsaajdhjhd hasdk",
        #             "entities" => {
        #                             "urls" => [{"indices" => [23, 22]},...],
        #                             "user_mentions" =>  [{"indices" => [40, 45]},...],
        #                             "hashtags => [{"indices" => [90, 97]},...],
        #                             "media" => [{"indices" => [23, 22], "url" => "http://t.co/sdsasda"},...]
        #                           }
        #            "retweeted_status => {  #[OPTIONAL] #only present if its retweeted tweet. contains information of tweet's original user
        #                                   "id" => 121221, "name" => "Jeff Thomson", "screen_name" => "jeff_thom", "photo_image_url"=> "http://twitter.com/photo/1"
        #                                 }
        #           "retweet_count" => 23 #shows actual retweet count => for retweeted tweet, it the count should not belong to user who is retweeting. it belongs to user who originated tweet
        def get_json(blob)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_yaml] Entering")
          h = {}

          h["retweeted"] = blob["retweeted"]
          h["text"] = blob["text"]
          h["entities"] = blob["entities"] if !blob["entities"].blank?

          attr = blob["user"]

          if !blob["retweeted_status"].blank?
            attr = blob["retweeted_status"]["user"]
            h["retweeted_status"] = {}
            h["retweeted_status"]["user"] =  {"id_str" => attr["id_str"], "name" =>  attr["name"],
                         "screen_name" => attr["screen_name"], "profile_image_url" => attr["profile_image_url"],
                         "protected" =>  attr["protected"]}

          end

          h["retweet_count"] = blob["retweet_count"]
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_yaml] Leaving")

          h.to_json
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [get_yaml] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          blob["text"]
        end

        def validate_profile_feed_blob(params)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [validate_profile_feed_blob] Entering")

          #if updated before  the "last_updated_at" then dont accept
          return false if params[:latest_msg_timestamp] >= params[:blob]["created_at"].to_time.utc

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [validate_profile_feed_blob] Leaving")
          true
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [TWITTER] [validate_profile_feed_blob] **** RESCUE **** => #{e.message} for #{params.inspect}")
          false
        end
      end
    end
  end
end
