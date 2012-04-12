module TextExtraction
  module Services
    class AlchemyApi

      ALCHEMY_EXTRACT_ENDPOINT="http://access.alchemyapi.com/calls/url/URLGetText"

      #ALCHEMY_API_KEY="98f6cdf9355987fa6a0100f5704c2bceccc19f4e"
      #ALCHEMY_API_KEY="19f585889ffdc85973d4bb78754630bd4594fc40"

      ALCHEMY_BATCH_LIMIT = 1
      ALCHEMY_RATE_LIMIT = 5

      ALCHEMY_THRESHOLD_SCORE = 0.6

      class << self

         def extract_text(links)
            Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text]
                                entering => Number of link => #{links.size}")

            if links.blank?
              Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text] => Return blank as no links ")
              return {}
            end

            hash = {}
            response = []
            request_array = []

            links.each do |link|
              request_array << {:method => "post", :url => ALCHEMY_EXTRACT_ENDPOINT, :params =>{'url'=>"#{link}",
                                                    'apikey'=> AppConstants.alchemy_api_key,
                                                    'outputMode'=> "json"}, :handle => link }
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
                hash[resp[0][:url]]= resp[0] if !resp.blank?
              end
            end

            Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text]=> #{hash.size}")

            hash
         rescue => e
            Rails.logger.error("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text] **** RESCUE **** => #{e.message}")
            return nil
         end

         def process_response(response)

            Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text] entering")

            if response.blank?
              return []
            end

            json = JSON.parse(response)

            if json.blank? or  json["status"] == "ERROR"
              Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text] [process_response] returning blank response")
              return []
            end

            extract = []

            if !json["text"].blank?
              extract <<  {:description => json["text"], :url => json["url"] }
            end

            Rails.logger.info("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text] [process_response] leaving => #{json["url"]}")
            return extract
         rescue => e
            Rails.logger.error("[MODULE] [TEXT_EXTRACTION] [AlchemyApi] [extract_text] [process_response] **** RESCUE **** => #{e.message}")
            return []
         end
      end
    end
  end
end