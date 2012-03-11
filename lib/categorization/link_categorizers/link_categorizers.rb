module Categorization
  module LinkCategorizers
    class << self
      SERVICES_MODULE = ::Categorization::LinkCategorizers::Services

      def categorize(params)
        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] => Entering => number of Text => #{params[:link_cat].keys.size}")

        index = 0
        req = []
        hash = {}

        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] #{params[:link_cat].inspect}")

        params[:link_cat].each do |k,v|
          element = params[:activities][v[0]][:post][:links][0][:element]
          req << SERVICES_MODULE::OpenCalais.make_request(k, "opencalais:#{k}") #service:idx creates uniq handle on service + index
          req << SERVICES_MODULE::AlchemyApi.make_request(k, "alchemyapi:#{k}", element ) #service:idx creates uniq handle on service + index

          index += 1

          if index == AppConstants.categorization_concurrency_limit
            process_request(params,req)
            req, index = [],0
          end
        end

        if !req.blank?
          process_request(params,req)
        end

        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] => Leaving")

      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] **** RESCUE **** => #{e.message}")
      end

      def process_request(params,requests)

        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [PROCESS_REQUEST] entering")

        index,hash = 0, {}

        response = ::EmHttp::Http.request(requests)

        response.each do |resp|

          arr = resp[:handle].split(":",2)     #spilt into service and url
          hash[arr[1]] = [] if hash[arr[1]].blank?

          if arr[0] == "alchemyapi"
            cat = SERVICES_MODULE::AlchemyApi.process_response(resp[:response])
          else
            cat = SERVICES_MODULE::OpenCalais.process_response(resp[:response])
          end
          hash[arr[1]].concat(cat)

        end

        hash.each do |url, categories|

          category = vote(categories)
          if !category.blank?
            params[:link_cat][url].each do |idx|
              activity = params[:activities][idx][:post]
              activity[:word] =  category[:name]
              activity[:category_id] =  category[:name]
              activity[:links][0][:category_id] = category[:name]
            end
          end
        end
        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [PROCESS_REQUEST] Leaving")
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [PROCESS_REQUEST] **** RESCUE **** => #{e.message}")
      end


      def vote(categories)
         Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] entering")

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
         Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] leaving")
         return []
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] **** RESCUE **** => #{e.message}")
        return []
      end
    end
  end
end