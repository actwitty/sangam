module Api
  module Entities
    class << self

      #INPUT => {
      #           :user_id => 123
      #           :enabled_services => ["facebook', "twitter"...] #[OPTIONAL] Needed only when analytics of some services needs to blocked.. for privacy
      #         }
      #OUTPUT  : {
      #
      #              "technology"  =>  [
      #                                  {
      #                                     :count => 3
      #                                     :id => 123
      #
      #                                     :name => Pizza
      #                                     :image => ""http://freebase.com/pizza.jpg",
      #                                     :description => ""http://freebase.com/text.html",
      #
      #                                     :source_name => "twitter"
      #                                     :source_msg_id =>  "12233", [OBJECT ID OF POST]
      #                                 },
      #                                 {
      #                                     :count => 3
      #                                     :id => 124
      #                                     :source_name =>"facebook",
      #                                     :source_msg_id =>  "12234", [OBJECT ID OF POST]
      #                                 }
      #                             ]
      #              "sports" => [..]
      #           }
      def get_entities(params)

        Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES] entering ")

        if params[:user_id].blank?
          Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES] Blank User #{params.inspect}")
          return []
        end

        hash = {}
        index_hash = {}
        index = {}

        h = {:user_id => params[:user_id]}
        h[:source_name] = params[:enabled_services ] if !params[:enabled_services].blank?   #TODO not optimal at all as DB query

        Hub.includes(:entity, :activity_word).where(h).all.each do |attr|
          word = attr.activity_word.word_name

          hash[word] = [] if hash[word].blank?
          index_hash[word] = {} if index_hash[word].blank?
          index[word] = 0 if index[word].blank?

          if index_hash[word][attr.entity_id].blank?
            h = ::Api::Helpers::FormatObject.format_entity({:parent => attr, :privacy => true})
            h[:entity][:count] = 1

            index_hash[word][attr.entity_id] = index[word]

            hash[word][index[word]]= h[:entity]
            index[word] += 1
          else
            hash[word][index_hash[word][attr.entity_id]][:count] += 1
          end
        end

        hash.each do |k,v|
          v.sort! {|a,b| b[:count] <=> a[:count]}
        end

        Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES] leaving ")

        hash
      rescue => e
        Rails.logger.error("[LIB] [API] [ENTITIES] [GET_ENTITIES] **** ERROR **** #{e.message} for #{params.inspect}")
        {}
      end

      #INPUT => {
      #           :user_id => 123    [MANDATORY]
      #           :entity_ids => [1,2, 3, 4..] [MANDATORY] 50 MAXIMUM
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
        index_hash = {}
        index = {}

        params[:entity_ids] = params[:entity_ids][0..AppConstants.max_number_of_entities]

        Hub.includes(:entity).where(:user_id => params[:user_id], :entity_id => params[:entity_ids]).all.each do |attr|

          word = attr.activity_word.word_name

          hash[word] = [] if hash[word].blank?
          index_hash[word] = {} if index_hash[word].blank?
          index[word] = 0 if index[word].blank?

          if index_hash[word][attr.entity_id].blank?
            h = ::Api::Helpers::FormatObject.format_entity({:parent => attr, :privacy => false})
            h[:entity][:count] = 1

            index_hash[word][attr.entity_id] = index[word]

            hash[word][index[word]]= h[:entity]
            index[word] += 1
          else
            hash[word][index_hash[word][attr.entity_id]][:count] += 1
          end
        end

        hash.each do |k,v|
          v.sort! {|a,b| b[:count] <=> a[:count]}
        end

        Rails.logger.info("[LIB] [API] [ENTITIES] [GET_ENTITIES_VERIFIED] leaving ")

        hash
      rescue => e
        Rails.logger.error("[LIB] [API] [ENTITIES] [GET_ENTITIES_VERIFIED] **** ERROR **** #{e.message} for #{params.inspect}")
        {}
      end
    end
  end
end
