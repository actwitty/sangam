
require 'nokogiri'
require 'json'

module Categorization
  module LinkCategorizers
    module Services

      SEMANTIC_PROXY_URL = "http://service.semanticproxy.com/processurl"

#      CALAIS_LICENSE_KEY = ['beuhp9a7nay6nxdku7j7zcxy', 'swcm89qzyvuttcv6jeskv85q', 'vqda4dmky3mnt3ygjjqdbxpt',
#                            'hfe94r47kpqr69enmvbs8sb6', '86v297e5xnqp5qw4bcc782n2', 'txv9e7gdvwwjctg6pwqpm3a3',
#                            'rkwtrhpb7dxv9bvypmwz8yvj', 'ayeayfcmcczp6sys6xfhh776', 'yzkdtbtnrvspywz4nehdyhg7',
#                            'dbj33hubrakj23czummr4kzx', 'v5mj9kcmwrnyzz7r27qawc2q']
      #CALAIS_LICENSE_KEY = 'swcm89qzyvuttcv6jeskv85q'  #cloud@actwitty.com
      #CALAIS_LICENSE_KEY = 'vqda4dmky3mnt3ygjjqdbxpt'  #alok@actwitty.com
      #CALAIS_LICENSE_KEY = 'hfe94r47kpqr69enmvbs8sb6'  #aloksrivastava78@gmail.com
      #CALAIS_LICENSE_KEY  = '86v297e5xnqp5qw4bcc782n2' #administrator@actwitty.com
      #CALAIS_LICENSE_KEY = 'txv9e7gdvwwjctg6pwqpm3a3'  #priyanjali.rai@gmail.com
      #CALAIS_LICENSE_KEY = 'rkwtrhpb7dxv9bvypmwz8yvj'  #no-reply@actwitty.com
      #CALAIS_LICENSE_KEY = 'ayeayfcmcczp6sys6xfhh776'  #sudhanshu@actwitty.com
      #CALAIS_LICENSE_KEY = 'yzkdtbtnrvspywz4nehdyhg7'  #sudhanshu.saxena@gmail.com
      #CALAIS_LICENSE_KEY = 'yzkdtbtnrvspywz4nehdyhg7'  #sher.blr.2011@gmail.com
      #CALAIS_LICENSE_KEY = 'yzkdtbtnrvspywz4nehdyhg7'  #cheetah.blr.2011@gmail.com
      CALAIS_RATE_LIMIT = 1 #QPS

      CALAIS_THRESHOLD_SCORE = 0.6
      OUTPUT_FORMAT = "json"

      class OpenCalais

        def self.get_key
          size = AppConstants.opencalais_api_key.size
          AppConstants.opencalais_api_key[Random.rand(size)]
        end

        def self.make_request(description, index)
          {:method => "get", :params => {},:handle => index,:url => SEMANTIC_PROXY_URL + "/" + get_key + "/" + OUTPUT_FORMAT + "/" + description }
        end


        def self.process_response(response)

          #Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [process_response] entering")

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

              if  !cat.blank? and v["score"].to_f > CALAIS_THRESHOLD_SCORE
                categories << {:name => cat[0] , :score => v["score"].to_f, :category => v["categoryName"]}
              end
            end
          end

          #Rails.logger.info("[MODULE] [CATEGORIZATION] [LINK_CATEGORIZER] [OpenCalais] [process_response] leaving =>
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
