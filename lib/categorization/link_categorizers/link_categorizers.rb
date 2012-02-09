module Categorization
  module LinkCategorizers
    class << self
      SERVICES_MODULE = ::Categorization::LinkCategorizers::Services
      def categorize(params)

         Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] => Entering => number of Text => #{params[:link_cat].keys.size}")

         params[:link_cat].each do |k,v|

           resp = vote(k)
           categories = {}
           categories = resp if !resp.blank?

           if !categories.blank?
             v.each do |idx|
               activity = params[:activities][idx][:post]
               activity[:word] =  categories[:name]
               activity[:category_id] =  categories[:name]

               activity[:links][0][:category_id] = categories[:name]
             end
           end
         end

         Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [categorize] => Leaving")
      end

      def vote(link)
         Rails.logger.info("[LIB] [CATEGORIZATION] [LINK_CATEGORIZERS] [VOTE] entering")
         req = []
         score = 0
         req << SERVICES_MODULE::OpenCalais.make_request(link, "opencalais")
         req << SERVICES_MODULE::AlchemyApi.make_request(link, "alchemyapi")

         response = ::EmHttp::Http.request(req)

         categories = []
         response.each do |resp|
           if resp[:handle] == "alchemyapi"
             cat = SERVICES_MODULE::AlchemyApi.process_response(resp[:response])
           else
             cat = SERVICES_MODULE::OpenCalais.process_response(resp[:response])
           end
           categories.concat(cat)
         end

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