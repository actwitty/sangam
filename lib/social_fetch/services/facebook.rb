require 'digest/sha1'
require 'uri'
require 'cgi'

module SocialFetch
  module Services
    class Facebook

      class << self
        include TextFormatter
      end

      FEED = "https://graph.facebook.com/"

      #INPUT => {:user_id => 123, :uid => "234", :access_token => "gdjjsagjgds.."}
      #OUTPUT => array of messages from Facebook in descending order of creation time
      def self.pull_data(params)
        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] entering  #{params.inspect}")

        data_array = []

        latest_msg_timestamp = params[:latest_msg_timestamp].strftime("%Y%m%dT%H%M")

        json = {'access_token' => "#{params[:access_token]}"}

        query_array=   [
                          {"method"=>"GET",
                              "relative_url"=>"#{params[:uid]}/feed?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"},
                          {"method"=>"GET",
                              "relative_url"=>"#{params[:uid]}/likes?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"},
                          {"method"=>"GET",
                              "relative_url"=>"#{params[:uid]}/books?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"},
                          {"method"=>"GET",
                              "relative_url"=>"#{params[:uid]}/music?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"},
                          {"method"=>"GET",
                              "relative_url"=>"#{params[:uid]}/movies?limit=#{params[:limit]}&since=#{latest_msg_timestamp}"}
                        ]

        json['batch'] = query_array.to_json

        response = ::EmHttp::Http.em_post(FEED, json, "facebook")

        data_array = JSON.parse(response[0][:response])  if !response[0][:response].blank?

        array = []

        data_array.each do |attr|
          hash = JSON.parse(attr["body"])
          array.concat(hash["data"]) if !hash["data"].blank?
        end

        Rails.logger.info("\n\n\n[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] leaving #{params.inspect}")
        return array

      rescue  => e
         Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] **** RESCUE **** => #{e.message} for #{params.inspect}")
         return nil
      end


        #INPUT => {:user_id => 123, :uid => "234", :last_updated_at => Time.now.utc #its an example it will be utc time,
  #         :blob => {} #single facebook data blob,  }
  #OUTPUT => {
  #            :post => {
  #                      :status_at_source => AppConstants.status_private/public,[MANDATORY] [TELLS WHETHER TO STORE DATA FOR THIS MESSAGE OR NOT]
  #                      :source_object_id => "2342", [MANDATORY]
  #                      :source_name => "facebook", [MANDATORY]
  #                      :source_uid => "12123232" #uid of user at facebook   [MANDATORY]
  #                      :source_object_type => "post"/"like" AppConstants.source_object_type_post/like
  #                      :status => AppConstants.status_public, [MANDATORY]
  #                      :enrich => true/False, [MANDATORY]
  #                      :word => "stories", [MANDATORY]
  #                      :category_id => "stories",  [MANDATORY]
  #                      :created_at => ,1994-11-05T13:15:30Z, [MANDATORY]
  #                      :updated_at =>1994-11-05T13:15:30Z [OPTIONAL]
  #                      :text => "hello world http://timesofindia.com/123.cms"  [OPTIONAL]
  #                      :location] = { [OPTIONAL]
  #                                     :lat => 23.345 ,
  #                                     :long => 46.2334],
  #                                     :name => "MG Road",
  #                                     :city => "Bangalore",
  #                                     :country => "India",
  #                                     :region => "karnataka",
  #                                     :source_name => "facebook",
  #                                     :source_object_id =>"234666"
  #                                   }
  #                      :links => [ [OPTIONAL]
  #                                    {
  #                                     :url => "http://timesofindia.com/123.cms",
  #                                     :description => "Manmohan singh sleeping" [OPTIONAL],
  #                                     :title => "indian politics"[OPTIONAL],
  #                                     :mime => AppConstants.mime_remote_link,
  #                                     :provider => "timesofindia.com",
  #                                     :url_sha => "sedeidnksdskadnksdkasnk" [SHA KEY NEEDED TO OPTIMIZE CHECK OF URL,
  #                                     :ignore => true/false [THIS TELLS THAT IGNORE THIS LINK FOR CATEGORIZATION or RESOLUTION]
  #                                     :image_url => "http://timesofindia.com/123.jpg"
  #                                     :source_object_id => "12313123" #FOR UPLOADED OBJECTS
  #                                   }...
  #                              ]
  #                     }
  #          }

      def self.data_adaptor(params)

        log = params.except(:blob)
        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] entering #{params.inspect}")
        attr = params[:blob]

        activity = {}
        existing_data = params[:existing_data]
        category = nil
        valid_post = false
        data = {}
        embedded_links = []

        if validate_profile_feed_blob(params) == true

          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] initial dump #{attr.inspect}")

          activity = {
                       :source_object_id => attr["id"],
                       :source_name => "facebook",
                       :status => AppConstants.status_public,
                       :enrich => true,
                       :created_at => attr["created_time"].to_time.utc,
                       :source_uid => params[:uid],
                       :source_object_type => AppConstants.default_source_object_type,
                       :status_at_source => AppConstants.status_private_at_source
                     }

          #updated_time is not present for likes etc
          activity[:updated_at] = attr["updated_time"].to_time.utc  if !attr["updated_time"].blank?

          if !attr["place"].blank?
            loc = attr["place"]["location"]

            activity[:location] = {
                                    :lat => loc["latitude"] ,
                                    :long => loc["longitude"],
                                    :name => attr["place"]["name"],
                                    :city => loc["city"],
                                    :country => loc["country"],
                                    :region => loc["region"],
                                    :source_name => "facebook",
                                    :source_object_id => attr["place"]["id"]
                                  }
            valid_post = true
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding place #{log.inspect}")
          end

          #########################################likes, musics. movies, books etc############################################
          if !attr["category"].blank?

            activity[:source_object_type] = AppConstants.source_object_type_like

            str = attr["category"].downcase

            #arr = str.split('/')
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding categories #{str} #{params.inspect}")

            #**************if category is their other than nil, then no need to categorize this post***********#
            cat = MAP_CATEGORIES['facebook'][str]
            category = cat[0] if !cat.blank?
            valid_post = true

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding categories #{log.inspect}")
          end

          #either non-matching category during likes, books, music etc or not category came from facebook
          category = AppConstants.default_category if category.blank?

          activity[:category_id] =  category
          activity[:word] = SUMMARY_CATEGORIES[category]['channel']

          ########################################## Message #################################################################
          #first see if message has link .. get first link in message and categorize based on that
          #like, books, music etc does have message and links but it may change
          if !attr["message"].blank?
            activity[:text] = attr["message"]
            valid_post = true

            embedded_links = get_documents(attr["message"])

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding message => #{attr["message"]} for #{log.inspect}")
          end

          ########################################## Link #################################################################
          if !attr["link"].blank?
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] LINKKKKK #{attr["link"]}")
            link = get_documents(attr["link"])

            #reset the mime to system type. give higer priority to mimme found by our syste
            mime = convert_type_to_mime(attr["type"])
            link[0][:mime] = mime  if mime != AppConstants.mime_remote_link

            link[0][:description] = attr["description"]
            link[0][:title] = attr["name"]

            link[0][:provider] =~ /facebook.com/ ? link[0][:ignore] = true :  link[0][:ignore] = false

            link[0][:source_object_id] = attr["object_id"]

            activity[:links] = link

            #extract image_url
            if !attr["picture"].blank?
              u = URI.unescape(attr["picture"])
              cgi = CGI::parse(u)
              #internal images are encoded in src(fbcdn) and external are encoded in
              url = cgi["url"]
              url = cgi["src"] if url.blank?

              Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] CCGGIII #{cgi}")

              if !cgi.blank? and !url.blank?

                link[0][:image_url] = url[0]
                link[0][:image_width] = cgi["w"][0] if !cgi["w"].blank?
                link[0][:image_height] = cgi["h"][0] if !cgi["h"].blank?

                Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding Picture Url
                               #{link[0][:image_url]} for #{log.inspect}")
              end

            end

            #copy story as text if activity[:text] is blank
            #means attr["message"] is blank. even if attr["story"] is blank no probs
            if  activity[:text].blank?
              activity[:text] = attr["story"]
              activity[:enrich] = false #no need to enrich the story
            end

            valid_post = true
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] adding link #{attr["link"]} for #{log.inspect}")
          end

          #attach embedded links also link array
          #duplicate document is removed in create_activity
          if activity[:links].blank?
            activity[:links] = embedded_links if !embedded_links.blank?
          else
            embedded_links.each do |elem|
              #remove duplicates ..
              #give priority to attr[links] as they will be mostly resolved
              next if activity[:links][0][:url] == elem[:url]
              activity[:links] << elem
            end
          end

          #set the post in data if category, message or link or combination is present.. ignore story
          if valid_post == true
            data[:post] = activity
          else
            Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] empty data return #{log.inspect}")
          end

        else
          valid_post = false
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] blank data for #{log.inspect}")
        end

        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] leaving => #{log.inspect}")
        data
      rescue  => e
        Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] **** RESCUE **** => #{e.message} for #{params.inspect}")
        return nil
      end

      class << self
        private

        def convert_type_to_mime(type)
          case type
            when "photo"
              return AppConstants.mime_remote_image
            when "video"
              return AppConstants.mime_remote_video
            when "music"
              return AppConstants.mime_remote_music
            when "link"
              return AppConstants.mime_remote_link
            else
              return AppConstants.mime_remote_link
          end
        end

        def validate_profile_feed_blob(params)

          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [validate_profile_feed_blob] Entering")

          attr = params[:blob]

          #if from is present, then it should must be from owner
          if !attr["from"].blank?
            return false if (attr["from"]["id"] != params[:uid])
          end

          #if updated before  the "last_updated_at" then dont accept
          return false if params[:latest_msg_timestamp] >= attr["created_time"].to_time.utc


          #Avoid fetching data from sources which we are already supporting
          #like twitter, foursquare, actwitty (for msg shared on fb)
          if !attr["application"].blank?
            return false if (attr["application"]["name"].downcase) =~ /#{AppConstants.sources_local_list}/
          end

          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [validate_profile_feed_blob] leaving")

          true
        rescue  => e
          Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [validate_profile_feed_blob] **** RESCUE **** => #{e.message} for #{params.inspect}")
          return false
        end
      end

    end
  end
end
