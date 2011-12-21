module SocialFetch
  module Categorizer
    class AlchemyApi

      ALCHEMY_URL="http://access.alchemyapi.com/calls/url/URLGetCategory"
      #ALCHEMY_API_KEY="98f6cdf9355987fa6a0100f5704c2bceccc19f4e"
      ALCHEMY_API_KEY="19f585889ffdc85973d4bb78754630bd4594fc40" #aloksrivastava78@gmail.com


       class << self
         def categorize(link)

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [CATEGORIZER] [ALCHEMY_API] [CATEGORIZE] [categorize] entering #{link}")

            category = nil
            parameters={'url'=>"#{link}",'apikey'=> ALCHEMY_API_KEY, 'outputMode'=> "json"}

            response= SocialFetch::Helper::Http.post(ALCHEMY_URL,parameters)

            data=JSON.parse(response.body)

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [CATEGORIZER] [ALCHEMY_API] [CATEGORIZE] [categorize] info=> #{data.inspect} for #{link}")

            if data["category"].blank?
              Rails.logger.info("[LIB] [SOCIAL_FETCH] [CATEGORIZER] [ALCHEMY_API] [CATEGORIZE] [categorize]
                                   => Got blank category => Returning #{AppConstants.default_category} for #{link}")
              return AppConstants.default_category
            end
            if data["score"].blank? or data["score"].to_f < 0.6 #..we need to take care in future of how to use t his info

              Rails.logger.info("[LIB] [SOCIAL_FETCH] [CATEGORIZER] [ALCHEMY_API] [CATEGORIZE] [categorize]
                                   => Got Blank Score or Less Score => Returning #{AppConstants.default_category} for #{link}")
              #Actually need to resolve with algorithm or hit another service
              return AppConstants.default_category
            end

            category = MAP_CATEGORIES[data["category"]][0]
            category = AppConstants.default_category if category.blank? #this case can happen is mapping if categories failed

            Rails.logger.info("[LIB] [SOCIAL_FETCH] [CATEGORIZER] [ALCHEMY_API] [CATEGORIZE] [categorize] leaving
                                Returning #{category} for #{link}")


            category
         rescue => e
           Rails.logger.info("[LIB] [SOCIAL_FETCH] [CATEGORIZER] [ALCHEMY_API] [CATEGORIZE] [categorize] Rescue ****ERROR***
                                                    #{link}")
           return AppConstants.default_category
         end
       end
    end
  end
end
