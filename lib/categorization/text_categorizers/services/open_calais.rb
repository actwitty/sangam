
require 'nokogiri'
require 'json'

module Categorization
  module TextCategorizers
    module Services

      CALAIS_URL = "http://api.opencalais.com/enlighten/rest/"
      CALAIS_LICENSE_KEY = 'beuhp9a7nay6nxdku7j7zcxy'
      CALAIS_RATE_LIMIT = 1 #QPS

      CALAIS_THRESHOLD_SCORE = 0.9

      class OpenCalais

        def self.make_request(content, index)
          xml = params_xml
          {:method => "post", :params => {"content" => content,"licenseID" => CALAIS_LICENSE_KEY ,"paramsXML" => xml },
                   :handle => index, :url => CALAIS_URL}
        end

        #[]
        def self.categorize(requests)

          Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [categorize] entering")
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

          Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [categorize] => Size => #{hash.size}")
          hash

        rescue => e
          Rails.logger.error("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [categorize] **** RESCUE ****=> #{e.message}")
          return nil
        end


        def self.process_response(response)

          Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [process_response] entering")

          if response.blank?
            Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [process_response]
                              returning blank")
            return []
          end

          categories = []
          json = JSON.parse(response)

          json.each do |k,v|

            if  v["_typeGroup"] == "topics"
              cat = MAP_CATEGORIES['opencalais'][v["categoryName"].downcase]

              score = 0
              score = v["score"].to_f if !v["score"].blank?
              if  !cat.blank? and score >= CALAIS_THRESHOLD_SCORE
                categories << {:name => cat[0] , :score => score.to_f, :category => v["categoryName"]}
              end
            end
          end

          Rails.logger.info("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [process_response] leaving =>
                           #{categories}")
          categories
        rescue => e
          Rails.logger.error("[MODULE] [CATEGORIZATION] [CATEGORIZER] [OpenCalais] [process_response]
                             **** RESCUE **** => #{e.message}")
          return []
        end

        def self.params_xml
          #check_params
          document = Nokogiri::XML::Document.new

          params_node = Nokogiri::XML::Node.new('c:params', document)
          params_node['xmlns:c'] = 'http://s.opencalais.com/1/pred/'
          params_node['xmlns:rdf'] = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'

          processing_node = Nokogiri::XML::Node.new('c:processingDirectives', document)
          processing_node['c:contentType'] = 'text/raw'
          processing_node['c:outputFormat'] = 'application/json'
          processing_node['c:calculateRelevanceScore'] = 'true'
          processing_node['c:reltagBaseURL'] ="GenericRelations"

          user_node = Nokogiri::XML::Node.new('c:userDirectives', document)
          user_node['c:allowDistribution'] = 'true'
          user_node['c:allowSearch'] = 'true'
          user_node['c:externalID'] = '3434344'
          user_node['c:submitter'] = 'actwitty'

          params_node << processing_node
          params_node << user_node

          external_node = Nokogiri::XML::Node.new('c:externalMetadata', document)
          params_node << external_node

          xml = params_node.to_xml(:indent => 2)
          xml
        end
      end
    end
  end
end
