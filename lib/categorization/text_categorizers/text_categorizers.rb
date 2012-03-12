require 'services/alchemy_api'
require 'services/open_calais'

module Categorization
  module TextCategorizers
    class << self
      SERVICES_MODULE = ::Categorization::TextCategorizers::Services

      def categorize(params)
        Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] => Entering => number of Text => #{params[:text_cat].keys.size}")

        index = 0
        req = []
        hash = {}

        #Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] #{params[:text_cat].inspect}")

        params[:text_cat].each do |k,v|
          if !v[:text].blank?

            req << SERVICES_MODULE::OpenCalais.make_request(v[:text], "opencalais:#{k}") #service:idx creates uniq handle on service + index
            req << SERVICES_MODULE::AlchemyApi.make_request(v[:text], "alchemyapi:#{k}") #service:idx creates uniq handle on service + index
            index += 1

            if index == AppConstants.categorization_concurrency_limit
              process_request(params,req)
              req, index = [],0
            end
          end
        end

        if !req.blank?
          process_request(params,req)
        end

        #Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] => Leaving")

      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] **** RESCUE **** => #{e.message}")
      end

      def process_request(params,requests)

        #Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [PROCESS_REQUEST] entering")
        index,hash = 0, {}

        response = ::EmHttp::Http.request(requests)

        response.each do |resp|

          arr = resp[:handle].split(":",2)     #spilt into service and idx in params
          index = Integer(arr[1])
          hash[index] = [] if hash[index].blank?

          if arr[0] == "alchemyapi"
            cat = SERVICES_MODULE::AlchemyApi.process_response(resp[:response])
          else
            cat = SERVICES_MODULE::OpenCalais.process_response(resp[:response])
          end
          Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [PROCESS_REQUEST] #{cat.inspect}")
          hash[index].concat(cat)

        end

        hash.each do |idx, categories|

          category = vote(categories)
          if !category.blank?
            activity = params[:activities][idx][:post]
            activity[:word] =  category[:name]
            activity[:category_id] =  category[:name]
          end
        end
        #Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [PROCESS_REQUEST] Leaving")
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [PROCESS_REQUEST] **** RESCUE **** => #{e.message}")
      end

      def vote(categories)
         #Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [VOTE] entering #{categories.inspect}")

         score = 0
         if !categories.blank?
           index = 0
           categories.each_with_index do|attr, idx|
             if attr[:score] > score
               index = idx
               score = attr[:score]
             end
           end
           return categories[index]
         end
         #Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [VOTE] leaving")
         return {}
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [VOTE] **** RESCUE **** => #{e.message}")
        return {}
      end
    end
  end
end