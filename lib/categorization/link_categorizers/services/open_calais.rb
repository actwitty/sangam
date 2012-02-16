
require 'nokogiri'
require 'json'

module Categorization
  module LinkCategorizers
    module Services

      SEMANTIC_PROXY_URL = "http://service.semanticproxy.com/processurl"

      CALAIS_LICENSE_KEY = 'beuhp9a7nay6nxdku7j7zcxy'
      #CALAIS_LICENSE_KEY = 'swcm89qzyvuttcv6jeskv85q'  #cloud@actwitty.com
      #CALAIS_LICENSE_KEY = 'vqda4dmky3mnt3ygjjqdbxpt'  #alok@actwitty.com
      #CALAIS_LICENSE_KEY = 'hfe94r47kpqr69enmvbs8sb6'  #aloksrivastava78@gmail.com
      #CALAIS_LICENSE_KEY  = '86v297e5xnqp5qw4bcc782n2' #administrator@actwitty.com
      #CALAIS_LICENSE_KEY = 'txv9e7gdvwwjctg6pwqpm3a3' #priyanjali.rai@gmail.com
      #CALAIS_LICENSE_KEY = 'rkwtrhpb7dxv9bvypmwz8yvj'  #no-reply@actwitty.com

      CALAIS_RATE_LIMIT = 1 #QPS

      CALAIS_THRESHOLD_SCORE = 0.6
      OUTPUT_FORMAT = "json"

      class OpenCalais

        def self.make_request(description, index)
          {:method => "get", :params => {},:handle => index,:url => SEMANTIC_PROXY_URL + "/" + CALAIS_LICENSE_KEY + "/" + OUTPUT_FORMAT + "/" + description }
        end

        #[]
        def self.categorize(requests)

          Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [categorize] entering")
          hash = {}
          response = []

          #rate limit adjustment
          request_array = requests.enum_for(:each_slice,  CALAIS_RATE_LIMIT).to_a
          request_array.each do |array|
            resp = ::EmHttp::Http.request(array)
            response.concat(resp)
          end

          response.each do |attr|
            resp = process_response(attr[:response])
            hash[attr[:handle]]= resp if !resp.blank?
          end

          Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [categorize] => Size => #{hash.size}")
          hash

        rescue => e
          Rails.logger.error("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [categorize] **** RESCUE **** => #{e.message}")
          return nil
        end


        def self.process_response(response)

          Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [process_response] entering")

          if response.blank?
            Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [process_response]
                              returning blank")
            return []
          end

          categories = []
          json = JSON.parse(response)

          json.each do |k,v|
            if  v["_typeGroup"] == "topics"
              cat = MAP_CATEGORIES['opencalais'][v["categoryName"].downcase]

              if  !cat.blank? and v["score"].to_f >= CALAIS_THRESHOLD_SCORE
                categories << {:name => cat[0] , :score => v["score"].to_f, :category => v["categoryName"]}
              end
            end
          end

          Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [process_response] leaving =>
                           #{categories}")
          categories
        rescue => e
          Rails.logger.error("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [process_response]
                             **** RESCUE **** => #{e.message}")
          return []
        end
      end
    end
  end
end
