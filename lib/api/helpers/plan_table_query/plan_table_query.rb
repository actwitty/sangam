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

          h[:source_created_at.gteq] = params[:since] if !params[:since].blank?
          h[:source_created_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_activity_query] leaving - Query =  #{h.inspect}")
          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_activity_query]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
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

          h[:source_created_at.gteq] = params[:since] if !params[:since].blank?
          h[:source_created_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_hub_query] leaving - Query =  #{h.inspect}")

          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_hub_query]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
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

          h[:source_created_at.gteq] = params[:since] if !params[:since].blank?
          h[:source_created_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_document_query] Leaving - Query =  #{h.inspect}")

          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_document_query]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end

        def plan_source_action_query(params)
          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_source_action_query] Entering - Query  =  #{params.inspect}")
          h = {}

          h[:user_id] =  params[:user_id] if !params[:user_id].blank?
          h[:activity_id] =  params[:activity_id] if !params[:activity_id].blank?
          h[:summary_id] =  params[:summary_id] if !params[:summary_id].blank?

          h[:name] =  params[:name] if !params[:name].blank?
          h[:source_name] =  params[:source_name] if !params[:source_name].blank?

          h[:source_created_at.gteq] = params[:since] if !params[:since].blank?
          h[:source_created_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_source_action_query] Leaving - Query  =  #{params.inspect}")
          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_source_action_query]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end

        def plan_local_action_query(params)
          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_local_action_query] Entering - Query  =  #{params.inspect}")
          h = {}

          h[:author_id] =  params[:user_id] if !params[:user_id].blank?
          h[:summary_id] =  params[:summary_id] if !params[:summary_id].blank?

          h[:name] =  params[:name] if !params[:name].blank?

          h[:updated_at.gteq] = params[:since] if !params[:since].blank?
          h[:updated_at.lteq] = params[:till] if !params[:till].blank?

          Rails.logger.info("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_local_action_query] Leaving - Query  =  #{params.inspect}")
          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [PLAN_TABLE_QUERY] [plan_local_action_query]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end
      end
    end
  end
end
