module SocialFetch
  module Fetcher
    class Facebook

      FEED = "https://graph.facebook.com"

      #INPUT => {:user_id => 123, :uid => "234", :access_token => "gdjjsagjgds.."}
      #OUTPUT => array of messages from Facebook
      def self.pull_data(params)
        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] entering  #{params.inspect}")


        url = "#{FEED}/#{params[:uid]}/feed?access_token=#{params[:access_token]}&limit=#{params[:limit]}"
        response = ::SocialFetch::Helper::Http.get(url)

        if response.blank? || response.code != '200'
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] Invalid response #{response.inspect} #{params}")
          return nil
        end


        data_hash = JSON.parse(response.body)

        Rails.logger.info("\n\n\n[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] for #{params.inspect}")

        Rails.logger.info("\n\n\n[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] leaving ")

        return data_hash["data"]

      rescue  => e
         Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [pull_data] ERROR => #{e.message} for #{params.inspect}")
         return nil
      end


      #INPUT => {:user_id => 123, :uid => "234", :time => Time.now.utc #its an example it will be utc time,
      #         :blob => {} #single facebook data blob,  }
      #OUTPUT => {:post => {:source_msg_id => "2342",:source_name => "facebook",:status => AppConstants.status_public,
      #                      :enrich => true, :word => "stories", :summary_category => "stories",},
      #           :category => {:data => "http://google.com", :type => AppConstants.data_type_weburl} }

      def self.data_adaptor(params)

        log = params.except(:blob)
        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] entering #{log.inspect}")
        attr = params[:blob]

        activity = {}
        existing_data = params[:existing_data]
        data = {}

        if (attr["from"]["id"] == params[:uid]) and params[:time] < attr["created_time"].to_time.utc #existing_data[attr["id"]].blank?
          activity = {
                     :source_msg_id => attr["id"],:source_name => "facebook",:status => AppConstants.status_public,
                     :enrich => true, :word => SUMMARY_CATEGORIES[AppConstants.default_category]['channel'],
                     :summary_category => AppConstants.default_category,:created_at => attr["created_time"].to_time.utc,
                     :updated_at => attr["updated_time"].to_time.utc
                     }

          if !attr["place"].blank?
            loc = attr["place"]["location"]
            activity[:location] = {:geo_location => {:geo_latitude => loc[:latitude] , :geo_longitude => loc[:longitude],
                                                    :geo_name => attr["place"]["name"],:geo_city => loc[:city],
                                                    :geo_country => loc[:country], :geo_region => loc[:region]}}
          end


          #first see if message has link .. get first link in message and categorize based on that
          if !attr["message"].blank?
            data[:category] = SocialFetch::Helper::Parser.extract_data(attr["message"])
            activity[:text] = attr["message"]
          end

          #if category is blank or of type text then check if there a link is present in blob
          if data[:category].blank? or (data[:category][:type] == AppConstants.data_type_text)
            data[:category] = SocialFetch::Helper::Parser.extract_data(attr["link"]) if !attr["link"].blank?
          end

          #set the post in data if message or link or both is present
          data[:post] = activity if !data[:category].blank?

        else
          Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] blank data for #{log.inspect}")
        end

        Rails.logger.info("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] leaving => #{log.inspect}")
        data
      rescue  => e
        Rails.logger.error("[LIB] [SOCIAL_FETCH] [FETCHER] [FACEBOOK] [data_adaptor] rescue => ERROR => #{e.message} for #{log.inspect}")
        return nil
      end

    end
  end
end
