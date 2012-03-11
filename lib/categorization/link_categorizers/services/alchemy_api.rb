module Categorization
  module LinkCategorizers
    module Services
      class AlchemyApi

        ALCHEMY_LINK_ENDPOINT="http://access.alchemyapi.com/calls/url/URLGetCategory"
        ALCHEMY_TEXT_ENDPOINT = "http://access.alchemyapi.com/calls/text/TextGetCategory"

        #ALCHEMY_API_KEY="98f6cdf9355987fa6a0100f5704c2bceccc19f4e"
        #ALCHEMY_API_KEY="19f585889ffdc85973d4bb78754630bd4594fc40"
        ALCHEMY_API_KEY ="3690ab39e581e48d6f48c000e3c3313f1e227e28" #this is main registered key
        #ALCHEMY_API_KEY ="8395fee07786621120e9dd84be8f14f1c30d1648"

        ALCHEMY_BATCH_LIMIT = 1
        ALCHEMY_RATE_LIMIT = 1

        ALCHEMY_THRESHOLD_SCORE = 0.6


        class << self
          def make_request(content, handle, element)
            (element == nil) or (element == 'idiv') ? str = "DIV" : str = element.upcase
            {
             :method => "post", :url => ALCHEMY_LINK_ENDPOINT,
             :params =>{
                        'url'=>"#{content}",
                        'apikey'=> ALCHEMY_API_KEY,
                        'outputMode'=> "json",
                        'sourceText'=>"cquery",
                        'cquery' => "all #{str}"    #paragraph section
                       },
             :handle => handle
            }
          end

          def process_response(response)

            Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [process_response] entering")

            if response.blank?
              return []
            end

            json = JSON.parse(response)

            if json.blank? or  json["status"] == "ERROR"
              Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [process_response] returning blank response")
              return []
            end

            categories = []
            cat = MAP_CATEGORIES['alchemyapi'][json["category"].downcase]

            if !cat.blank? and json["score"].to_f >= ALCHEMY_THRESHOLD_SCORE
              categories <<  {:name => cat[0], :score => json["score"].to_f, :category => json["category"] }
            end

            Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [process_response] leaving => #{categories}")
            return categories
          rescue => e
            Rails.logger.error("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [process_json] **** RESCUE **** => #{e.message}")
            return []
          end
        end
      end
    end
  end
end