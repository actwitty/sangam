module Categorization
  module LinkCategorizers
    class << self
      SERVICES_MODULE = ::Categorization::LinkCategorizers::Services

      def categorize(params)
        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] => Entering => number of Text => #{params[:link_cat].keys.size}")

        index = 0
        req = []
        hash = {}

        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] #{params[:link_cat].inspect}")

        params[:link_cat].each do |k,v|
          element = params[:activities][v[0]][:post][:links][0][:element]

          #extract category from url ny checking
          category = extract_categories_from_url(k)
          if !category.blank?
            update_category(params, k, category)
            next
          end

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

        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] => Leaving")

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

          category = get_default_category(url) if category.blank?

          update_category(params, url, category)
        end
        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [PROCESS_REQUEST] Leaving")
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [PROCESS_REQUEST] **** RESCUE **** => #{e.message}")
      end


      def update_category(params, url, category)
        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [UPDATE_CATEGORY] Entering")
        if !category.blank?

            Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS]  [UPDATE_CATEGORY] url => #{url}, Category => #{category.inspect} ")
            params[:link_cat][url].each do |idx|
              activity = params[:activities][idx][:post]
              activity[:word] =  category[:name]
              activity[:category_id] =  category[:name]
              activity[:links][0][:category_id] = category[:name]
            end
        end
        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [UPDATE_CATEGORY] Leaving")
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [UPDATE_CATEGORY] **** RESCUE **** => #{e.message}")
      end

      def vote(categories)
         #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] entering")

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
         #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] leaving")
         return {}
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] **** RESCUE **** => #{e.message}")
        return {}
      end

       def get_default_category(url)
        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [GET_DEFAULT_CATEGORY] entering")

        category = {}
        u = URI.parse(url)
        cat = DEFAULT_URL_CATEGORIES[u.host]

        category[:name] = cat if !cat.blank?

        #Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [GET_DEFAULT_CATEGORY] leaving #{u.host} => #{category} ")
        category
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [GET_DEFAULT_CATEGORY] **** RESCUE **** => #{e.message}")
        return {}
       end

      def extract_categories_from_url(url)
        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [EXTRACT_CATEGORIES_FROM_URL] entering")

        category = {}
        a = url.split(/\/|\./)

        a.each do |attr|
          s = STEM_CATEGORIES[attr]
          if !s.blank?
            category = {:name => s, :score => 1.0}
            break
          end
        end

        Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS]  [EXTRACT_CATEGORIES_FROM_URL] leaving #{url} => #{category} ")
        category
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS]  [EXTRACT_CATEGORIES_FROM_URL] **** RESCUE **** => #{e.message}")
        return {}
      end
    end
  end
end