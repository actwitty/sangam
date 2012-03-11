module Api
  module Entities
    class << self

      #INPUT user_id => 123
      #OUTPUT  : [
      #
      #                   {
      #                       :count => 3
      #                       :id => 123
      #
      #                       :name => Pizza
      #                       :image => ""http://freebase.com/pizza.jpg",
      #                       :description => ""http://freebase.com/text.html",
      #
      #                       :source_name => "twitter"
      #                       :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                   },
      #                   {
      #                       :id => 124
      #                       :source_name =>"facebook",
      #                       :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #                   }
      #           ]
      def get_entities(params)

        Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES] entering ")

        if params[:user_id].blank?
          Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES] Blank User #{params.inspect}")
          return []
        end

        hash = {}

        Hub.includes(:entity).where(:user_id => params[:user_id]).all.each do |attr|

          if hash[attr.entity_id].blank?
            h = ::Api::Helpers::FormatObject.format_entity({:parent => attr})
            hash[attr.entity_id] = h[:entity]
            hash[attr.entity_id][:count] = 0
          end
          hash[attr.entity_id][:count] += 1
        end


        hash = hash.sort_by {|k,v| v[:count]}.reverse   if !hash.blank?
        Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES] leaving ")

        hash.values
      rescue => e
        Rails.logger.error("[LIB] [API] [ENTITIES] [GET_ENTITIES] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end

      #INPUT => {
      #           :user_id => 123    [MANDATORY]
      #           :entity_ids => [1,2, 3, 4..] [MANDATORY] 50 MAXIMUM - AppConstants.max_number_of_entities
      #         }
      #OUTPUT  : [
      #
      #                   {
      #                       :count => 3
      #                       :id => 123
      #
      #                       :name => Pizza
      #                       :image => ""http://freebase.com/pizza.jpg",
      #                       :description => ""http://freebase.com/text.html",
      #
      #                       :source_name => "facebook"  [PRIVATE SOURCE ENTITIES]
      #                       :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                   },
      #                   {..},
      #                   {..}
      #          ]

      def get_entities_verified(params)

        Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES_VERIFIED] entering ")

        if params[:user_id].blank? or params[:entity_ids].blank?
          Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES_VERIFIED] Blank User or IDs #{params.inspect}")
          return []
        end

        hash = {}

        params[:entity_ids] = params[:entity_ids][0..AppConstants.max_number_of_entities]

        Hub.includes(:entity).where(:user_id => params[:user_id], :entity_id => params[:entity_ids]).all.each do |attr|

          if hash[attr.entity_id].blank?
              h = ::Api::Helpers::FormatObject.format_entity({:parent => attr, :privacy => false})
              hash[attr.entity_id] = h[:entity]
              hash[attr.entity_id][:count] = 0
          end
            hash[attr.entity_id][:count] += 1
        end


          #hash = hash.sort_by {|k,v| v[:count]}.reverse   if !hash.blank?
          Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES_VERIFIED] leaving ")

          hash.values
      rescue => e
        Rails.logger.error("[LIB] [API] [ENTITIES] [GET_ENTITIES_VERIFIED] **** ERROR **** #{e.message} for #{params.inspect}")
        []
      end
    end
  end
end
