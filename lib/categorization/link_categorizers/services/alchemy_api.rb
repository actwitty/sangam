module Categorization
  module LinkCategorizers
    module Services
      class AlchemyApi

        ALCHEMY_LINK_ENDPOINT="http://access.alchemyapi.com/calls/url/URLGetCategory"
        ALCHEMY_TEXT_ENDPOINT = "http://access.alchemyapi.com/calls/text/TextGetCategory"

        ALCHEMY_API_KEY="98f6cdf9355987fa6a0100f5704c2bceccc19f4e"
        #ALCHEMY_API_KEY="19f585889ffdc85973d4bb78754630bd4594fc40"
        #ALCHEMY_API_KEY = "3690ab39e581e48d6f48c000e3c3313f1e227e28" #this is main registered key

        ALCHEMY_BATCH_LIMIT = 1
        ALCHEMY_RATE_LIMIT = 1

        ALCHEMY_THRESHOLD_SCORE = 0.6


        class << self
          def make_request(content, handle)
            {
             :method => "post", :url => ALCHEMY_LINK_ENDPOINT,
             :params =>{
                        'url'=>"#{content}",
                        'apikey'=> ALCHEMY_API_KEY,
                        'outputMode'=> "json",
                        'sourceText'=>'cquery',
                        'cquery' => 'all DIV'    #paragraph section
                       },
             :handle => handle
            }
          end

          def categorize_link(links)
            Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [categorize_link]
                                entering => Number of link => #{links.size}")

            if links.blank?
              Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [categorize_link]  => Return blank as no links ")
              return {}
            end

            hash = {}
            response = []
            request_array = []

            links.each do |link|
              request_array << {:method => "post", :url => ALCHEMY_LINK_ENDPOINT, :params =>{'url'=>"#{link}",'apikey'=> ALCHEMY_API_KEY, 'outputMode'=> "json", 'sourceText' => "cleaned_or_raw"}, :handle => link }
            end

            #batch limit adjustment
            batch_arrays = request_array.enum_for(:each_slice,  ALCHEMY_BATCH_LIMIT).to_a

            #control Rate limit now
            rate_arrays = batch_arrays.enum_for(:each_slice,  ALCHEMY_RATE_LIMIT).to_a

            rate_arrays.each do |batch|
              batch.each do |array|
                resp = ::EmHttp::Http.request(array)
                response.concat(resp)
              end
              response.each do |attr|
                resp = process_response(attr[:response])
                #can check score here
                hash[attr[:handle]]= resp[0][:name] if !resp.blank?
              end
            end

            Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [categorize_link]=> #{hash.size}")

            hash
          rescue => e
            Rails.logger.error("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [AlchemyApi] [categorize_link] **** RESCUE **** => #{e.message}")
            return nil
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