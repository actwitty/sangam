module Api
  module Helpers
    module PlanTableQuery
      class << self
        def plan_activity_query(params)

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_activity_query] entering #{params.inspect}")

          h = {}

          h[:id] =  params[:id] if !params[:id].blank?

          h[:author_id] = params[:user_id] if !params[:user_id].blank?

          h[:summary_id] = params[:summary_id] if !params[:summary_id].blank?

          h[:category_type] =   params[:category_type] if !params[:category_type].blank?

          h[:base_location_id] = params[:location_id] if !params[:location_id].blank?
          h[:base_location_id.not_eq] = nil if !params[:all_location].blank?

          h[:source_name] = params[:source_name] if !params[:source_name].blank?

          h[:status] = params[:status] if !params[:status].blank?

          h[:updated_at.gteq] = params[:since] if !params[:since].blank?
          h[:updated_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_activity_query] leaving - Query =  #{h.inspect}")
          h
        end

        def plan_hub_query( params)

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_hub_query] Entering - Query =  #{params.inspect}")
          h = {}

          h[:id] =  params[:id] if !params[:id].blank?

          h[:category_type] =   params[:category_type] if !params[:category_type].blank?

          h[:location_id] = params[:location_id] if !params[:location_id].blank?

          h[:entity_id] = params[:entity_id] if !params[:entity_id].blank?
          h[:entity_id.not_eq] = nil if !params[:all_entity].blank?

          h[:source_name] = params[:source_name] if !params[:source_name].blank?

          h[:user_id] = params[:user_id] if !params[:user_id].blank?

          h[:summary_id] = params[:summary_id] if !params[:summary_id].blank?

          h[:updated_at.gteq] = params[:since] if !params[:since].blank?
          h[:updated_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_hub_query] leaving - Query =  #{h.inspect}")

          h
        end
        def plan_document_query(params)

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_document_query] Entering - Query =  #{params.inspect}")
          h = {}

          h[:id] =  params[:id] if !params[:id].blank?

          #these 3 are mutually exclusive
          h[:owner_id] =  params[:user_id] if !params[:user_id].blank?
          h[:summary_id] =  params[:summary_id] if !params[:summary_id].blank?
          h[:activity_id] =  params[:activity_id] if !params[:activity_id].blank?

          h[:activity_word_id] = params[:activity_word_id] if !params[:activity_word_id].blank?
          h[:location_id] = params[:location_id] if !params[:location_id].blank?
          h[:source_name] = params[:source_name] if !params[:source_name].blank?

          h[:category] = params[:category] if !params[:category].blank?
          h[:status] = params[:status] if !params[:status].blank?

          h[:updated_at.gteq] = params[:since] if !params[:since].blank?
          h[:updated_at.lteq] = params[:till] if !params[:till].blank?
          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_document_query] Leaving - Query =  #{h.inspect}")
          h
        end
      end
    end
  end
end
