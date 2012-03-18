require 'digest/sha1'
require 'uri'
require 'cgi'

module SocialFetch
  module Services
    class Facebook

      FEED = "https://graph.facebook.com/"
      EPOCH_TIME = Time.utc(1970, 1, 1, 0, 0)


      #INPUT => {
      #          :user_id => 123,
      #          :uid => "234",
      #          :access_token => "gdjjsagjgds.."
      #          :token_secret => "jsdhfkjfhkj" or nil
      #          :first_time => true or false
      #         }
      #OUTPUT => array of messages from facebook in descending order of creation time in facebook specific format
      def self.pull_data(params)
        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] entering  #{params.inspect}")

        data_array = []

        #latest_msg_timestamp = params[:latest_msg_timestamp].strftime("%Y%m%dT%H%M")
         json = {'access_token' => "#{params[:access_token]}"}

        params[:first_time] == true ? limit =  AppConstants.max_import_first_time : limit = AppConstants.max_import_every_time
        query_array=   [
                          {"method"=>"GET",
                              "relative_url"=>"me/feed?limit=#{limit}"},
                          {"method"=>"GET",
                              "relative_url"=>"me/likes?limit=#{limit}"},
#                          {"method"=>"GET",
#                              "relative_url"=>"#{params[:uid]}/feed?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"},
#                          {"method"=>"GET",
#                              "relative_url"=>"#{params[:uid]}/likes?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"},
                       ]

        json['batch'] = query_array.to_json

        response = ::EmHttp::Http.em_post(FEED, json, "facebook")

        data_array = JSON.parse(response[0][:response])  if !response[0][:response].blank?

        array = []

        data_array.each do |attr|
          hash = JSON.parse(attr["body"])
          array.concat(hash["data"]) if !hash["data"].blank?
        end
        
        #sort to mix likes and post
        array.sort! do |x,y|
           y["created_time"] = EPOCH_TIME if  y["created_time"].blank? #sometimes blank created_time comes in facebook
           x["created_time"] = EPOCH_TIME if  x["created_time"].blank?
           y["created_time"] <=> x["created_time"]
        end

        Rails.logger.info("\n\n\n[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] leaving #{params.inspect} ")

        return array

      rescue  => e
         Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] **** RESCUE **** => #{e.message} for #{params.inspect}")
         return []
      end


        #     INPUT => {  :user_id => 123,
        #                 :uid => "234",
        #                 :latest_msg_timestamp => 1994-11-05T13:15:30Z ( ISO 8601) #its an example it will be utc time,
        #                 :latest_msg_id => "2342423432"
        #                 :blob => {} #single facebook data blob,
        #              }
        #     OUTPUT => {
        #                 :post => {
        #                             :status_at_source => AppConstants.status_private/public,[MANDATORY] [TELLS WHETHER TO STORE DATA FOR THIS MESSAGE OR NOT]
        #
        #                             :source_object_id => "2342", [MANDATORY]
        #
        #                             :source_name => "facebook", [MANDATORY]
        #
        #                             :source_uid => "12123232" #uid of user at facebook   [MANDATORY]
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
        #                                                                          # we are storing jsons to increase re-usability and simplicity in display functions
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
        #                                             :source_name => "facebook",
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

      def self.data_adaptor(params)

        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] entering #{params.inspect}")

        log = params.except(:blob)
        attr = params[:blob]

        activity = {}
        category = nil
        valid_post = false       #filter out meta activities like "john likes a post by smith "or "john is friends with smith"
                                 #.. this is auto-generated by facebook on user's time line'
        data = {}

        if validate_profile_feed_blob(params) == true

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] initial dump")

          activity = {
                       :source_object_id => attr["id"],
                       :source_name => "facebook",
                       :status => AppConstants.status_public,
                       :enrich => true,
                       :source_created_at => attr["created_time"].to_time.utc,
                       :source_uid => params[:uid],
                       :source_object_type => AppConstants.source_object_type_post,
                       :status_at_source => AppConstants.status_private_at_source
                     }

          ######################################### LOCATION ##################################################################
          location = get_location(attr)
          if !location.blank?
            activity[:location] = location
            valid_post = true
          end
          #########################################likes, musics. movies, books etc############################################

          category = get_category(attr)
          #either non-matching category during likes, books, music etc or not category came from facebook

          if !category.blank?
            activity[:source_object_type] = AppConstants.source_object_type_like
            valid_post = true
          else
            category = AppConstants.default_category
          end

          activity[:category_id] = category
          activity[:word] = SUMMARY_CATEGORIES[category]['channel']

          ########################################## Message #################################################################
          #first see if message has link .. get first link in message and categorize based on that
          #like, books, music etc does have message and links but it may change
          if !attr["message"].blank?
            activity[:text] = attr["message"]
            valid_post = true
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding message => #{attr["message"]} for #{log.inspect}")
          end

          ########################################## Link #################################################################
          links = get_links(attr)

          if !links.blank?
            activity[:links] = links

            #copy story as text if activity[:text] is blank
            #means attr["message"] is blank. even if attr["story"] is blank no probs
            if  activity[:text].blank?
              activity[:text] = attr["story"]  if attr["story"] !~ /Guhesh Ramanathan is now friends with/
              activity[:enrich] = false #no need to enrich the story
            end

            valid_post = true
          end

          ########################################## Action #################################################################
          actions = get_source_actions(attr)
          activity[:source_actions] = actions if !actions.blank?

          ########################################## Mentions #################################################################
          mentions = get_mentions(attr)
          if !mentions.blank?
            activity[:mentions] = mentions
            valid_post = true
          end

          ########################################## Tags #################################################################
          tags = get_tags(attr)
          if !tags.blank?
            activity[:tags] = tags
            valid_post = true
          end
          ########################################## finalize #################################################################
          #set the post in data if category, message or link or combination is present.. ignore story
          if valid_post == true
            data[:post] = activity
          else
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] Empty Data => Looks Like Meta Activity for  #{log.inspect}")
          end

        elsif !attr["from"].blank? and (attr["from"]["id"] == params[:uid])
          valid_post = false
          actions = get_source_actions(attr)

          data[:invalid_post]= {:source_actions => actions, :source_object_id =>attr["id"]} if !actions.blank?

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] Adding Actions => Old Post #{actions} for #{log.inspect}")

        else
          valid_post = false
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] Empty Data => Not a valid Post for #{log.inspect}")
        end

        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] leaving => #{log.inspect}")
        data
      rescue  => e
        Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] **** RESCUE **** => #{e.message} for #{params.inspect}")
        return {}
      end

      class << self
        private

        #INPUT => blob hash
        #OUTPUT => Location hash
        def get_location(blob)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_location] Entering")

          location = {}

          if !blob["place"].blank?

            loc = blob["place"]["location"]

            location ={
                        :lat => loc["latitude"] ,
                        :long => loc["longitude"],
                        :name => blob["place"]["name"],
                        :city => loc["city"],
                        :country => loc["country"],
                        :region => loc["region"],
                        :source_name => "facebook",
                        :source_object_id => blob["place"]["id"]
                      }

            #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_location] Location Found")
          else
            #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_location] Empty Location")
          end
          location

        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_location] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          return {}
        end

        #INPUT => blob hash
        #OUTPUT => Mention hash
        def get_mentions(blob)

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_mentions] Entering #{blob["message_tags"].inspect}")

          mentions = []

          if !blob["message_tags"].blank?
            blob["message_tags"].each do |index,array|
              array.each do |mention|
                mentions << {:source_uid => mention["id"], :name => mention["name"]}
              end
            end
          end

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_mentions] Leaving #{mentions.inspect}")
          mentions
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_mentions] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          []
        end

        #INPUT => blob hash
        #OUTPUT => Mention hash
        def get_tags(blob)

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_tags] Entering")

          tags = []

          tags = ::Api::Helpers::Parser.get_tags({:text =>blob["message"]}) if !blob["message"].blank?

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_tags] Leaving")
          tags
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_tags] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          []
        end
        #INPUT => blob hash
        #OUTPUT => Category ( "stories", "entertainment" ... or nil)
        def get_category(blob)

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_category] Entering")

          category = nil
          if !blob["category"].blank?

            str = blob["category"].downcase

            #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_category] adding categories #{str}")

            cat = MAP_CATEGORIES['facebook'][str]

            category = cat[0] if !cat.blank?

          end

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_category] Leaving")
          category

        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_category] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          return nil
        end


        #INPUT => blob hash
        #OUTPUT => link array
        def get_links(blob)

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_links] Entering")
          link = []

          if !blob["link"].blank?

            #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_links] adding link #{blob["link"]}")

            link = ::Api::Helpers::Parser.get_documents({:text => blob["link"]})

            #reset the mime to system type. give higher priority to mime found by our system
            mime = ::Api::Helpers::Parser.map_type_to_mime(blob["type"])

            link[0][:mime] = mime  if mime != AppConstants.mime_remote_link

            link[0][:description] = blob["description"]
            link[0][:title] = blob["name"]

            link[0][:provider] =~ /facebook.com/ ? link[0][:ignore] = true : link[0][:ignore] = false

            link[0][:source_object_id] = blob["object_id"]

            #extract image_url
            if !blob["picture"].blank?

              #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_links] CGI EXTRACTION #{cgi}")

              u = URI.unescape(blob["picture"])
              cgi = CGI::parse(u)

              #internal images are encoded in src(fbcdn) and external are encoded in
              url = cgi["url"]
              url = cgi["src"] if url.blank?


              if !cgi.blank? and !url.blank?
                #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_links] adding Picture Url #{link[0][:image_url]} ")

                link[0][:image_url] = url[0]
                link[0][:image_width] = cgi["w"][0] if !cgi["w"].blank?
                link[0][:image_height] = cgi["h"][0] if !cgi["h"].blank?
              end
            end
          end

          #attach embedded links also link array
          #duplicate document is removed in create_activity
          if !blob["message"].blank?

            embedded_links = ::Api::Helpers::Parser.get_documents({:text => blob["message"]})
            if link.blank?
              link = embedded_links if !embedded_links.blank?
            else
              embedded_links.each do |elem|
                #remove duplicates ..
                #give priority to attr[links] as they will be mostly resolved
                next if link[0][:url] == elem[:url]
                link << elem
              end
            end
          end

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_links] Leaving ")
          link
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_links] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          return []
        end

        #INPUT => blob hash
        #OUTPUT => Source Actions hash
        def get_source_actions(blob)
          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_source_actions] Entering")

          hash =  {}

          if !blob["likes"].blank? and (blob["likes"]["count"] > 0)
            friends = []
            array = blob["likes"]["data"][0..4]

            if !array.blank?
              array.each do |attr|
                friends << {:name => attr["name"], :id => attr["id"]}
              end
            end

            hash["likes"] =  {:count => blob["likes"]["count"], :meta => {:friends => friends }}
          end

          if !blob["comments"].blank? and (blob["comments"]["count"] > 0)

            friends = []
            array = blob["comments"]["data"][0..4]

            if !array.blank?
              array.each do |attr|
                friends << {:name => attr["from"]["name"], :id => attr["from"]["id"]}  if !attr["from"].blank?
              end
            end

            hash["comments"] =  {:count => blob["comments"]["count"], :meta => {:friends => friends}}
          end

          if !blob["shares"].blank? and (blob["shares"]["count"] > 0)
            hash["shares"] =  {:count => blob["shares"]["count"], :meta => {}}
          end

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_source_actions] Leaving #{hash}")

          hash
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [get_source_actions] **** RESCUE **** => #{e.message} for #{blob.inspect}")
          return {}
        end



        #     INPUT => {  :user_id => 123,
        #                 :uid => "234",
        #                 :latest_msg_timestamp => 1994-11-05T13:15:30Z ( ISO 8601) #its an example it will be utc time,
        #                 :latest_msg_id => "2342423432"
        #                 :blob => {} #single facebook data blob,
        #              }
        #OUTPUT =>  true (if valid post), false otherwise
        def validate_profile_feed_blob(params)

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [validate_profile_feed_blob] Entering")

          blob = params[:blob]

          #if from is present, then it should must be from owner
          if !blob["from"].blank?
            return false if (blob["from"]["id"] != params[:uid])
          end

          #if created_time is not present invalid
          if blob["created_time"].blank?
            return false
          end

          #if updated before  the "last_updated_at" then dont accept
          return false if params[:latest_msg_timestamp] >= blob["created_time"].to_time.utc

          #Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [validate_profile_feed_blob] leaving")

          true
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [validate_profile_feed_blob] **** RESCUE **** => #{e.message} for #{params.inspect}")
          return false
        end
      end

    end
  end
end
