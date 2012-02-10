require 'services/alchemy_api'
require 'services/open_calais'

module Categorization
  module TextCategorizers
    class << self
      SERVICES_MODULE = ::Categorization::TextCategorizers::Services
      def categorize(params)

         Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] => Entering => number of Text => #{params[:text_cat].keys.size}")

         index = 0

         #move text which has entities for text categorization
         params[:activities].each do |attr|
             if !attr[:post][:entities].blank?
             params[:text_cat][index] = {:text => attr[:post][:text]}
           end
           index += 1
         end

         Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] #{params[:text_cat].inspect}")
         params[:text_cat].each do |k,v|

            if !v[:text].blank?

              activity = params[:activities][k][:post]

              categories = {}

              resp = vote(v[:text])
              categories = resp if !resp.blank?

              if !categories.blank?
                activity[:word] =  categories[:name]
                activity[:category_id] =  categories[:name]
              end
            end
         end
         Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [categorize] => Leaving")
      end

      def vote(text)
         Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [VOTE] entering")
         req = []
         score = 0
         req << SERVICES_MODULE::OpenCalais.make_request(text, "opencalais")
         req << SERVICES_MODULE::AlchemyApi.make_request(text, "alchemyapi")

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
         Rails.logger.info("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [VOTE] leaving")
         return []
      rescue => e
        Rails.logger.error("[LIB] [CATEGORIZATION] [TEXT_CATEGORIZERS] [VOTE] **** RESCUE **** => #{e.message}")
        return []
      end
    end
  end
end