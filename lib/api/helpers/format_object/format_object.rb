require "format_analytics/analytics"

module Api
  module Helpers
    module FormatObject
      class << self

        ##format a Service Present in Social Aggregator to generic form.
        #
        #INPUT => {
        #           :hash => {analytics_snapshot} #check api/summaries/summaries.rb      ,
        #           :enabled_services => ["facebook", "twitter"]#[OPTIONAL]
        #         }
        def format_analytics(params)
          #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_analytics] entering")

          return params[:hash] if params[:enabled_services].blank?
          hash = {}

          #convert array of enabled services to hash
          params[:enabled_services].each do |service|
            hash[service.to_sym] = true
          end

          klass = "::Api::Helpers::FormatObject::FormatAnalytics::Analytics".camelize.constantize
          params[:hash].each do |k,v|
            v = klass.send("format_analytics_#{k}", {:hash => v, :enabled_services => hash}) if k != :timestamp
            params[:hash].delete(k) if v.blank? #delete individual hash => weeks, posts, documents, locations, entities, local_actions, source_actions
          end

          params[:hash] = {} if params[:hash].size <=1 #only timestamp is remaining

          #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_analytics] leaving")
          params[:hash]

        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_analytics]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end

        ##format a Service Present in Social Aggregator to generic form.
        #
        #INPUT => {
        #           :object => aggregator
        #         }
        def format_social_aggregator(params)
          #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_social_aggregator] entering ")

          aggregator = params[:object]

          hash = {}

          hash[:aggregator] = {:user_id => aggregator.user_id, :provider => aggregator.provider, :uid => aggregator.uid, :status => aggregator.status}

          #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_social_aggregator] leaving ")
          hash
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_social_aggregator]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end


        ##format a entity object to generic form.
        ##Takes care of source privacy.. can be made finer privacy control
        ##COMMENT - Parent is needed as we need to get the context of message to which this entity belongs.
        ##          This is because entities are shared across various messages
        #
        #INPUT => {
        #           :parent => parent [object of message to which entity belongs .. like Hub object] [Mandatory]
        #         }
        def format_entity(params)

          #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_entity] entering #{params[:parent].status_at_source.inspect}")

          h = {}

          entity = params[:parent].entity

          #special for entities sources verified by private services and getting actual entities
          params[:privacy] = true if  params[:privacy].nil?

          if params[:parent].status_at_source == AppConstants.status_private_at_source and params[:privacy] == true

            h[:entity] = {:id => entity.id}

          else
            guid = entity.entity_guid.split("/" + entity.entity_svc)

            h[:entity] = {
                  :id => entity.id,
                  :name => entity.entity_name,
                  :image => AppConstants.entity_image_url_base + guid[1],
                  :description => AppConstants.entity_desc_url_base + guid[1],
                  :type => entity.entity_type_name
            }

          end
          h[:entity][:source_name] = params[:parent].source_name
          h[:entity][:source_msg_id] = params[:parent].source_msg_id
          #Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_entity] leaving #{h.inspect}")
          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_entity]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end



        ##format a location object to generic form.
        ##Takes care of source privacy.. can be made finer privacy control
        ##COMMENT - Parent is needed as we need to get the context of message to which this location belongs.
        ##          This is because locations are shared across various messages
        #
        #INPUT => {
        #           :parent => parent [object of message to which location belongs .. like Hub or Activity object] [Mandatory]
        #         }
        def format_location(params)

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT]  [format_location] entering #{params[:parent].status_at_source.inspect}")

          h = {}

          loc = params[:parent].base_location

          if loc.blank?
            return {}
          end

          if params[:parent].status_at_source == AppConstants.status_private_at_source
            h[:location] = {:id => loc.id}

          else
            h[:location] = {:id => loc.id, :lat => loc.location_lat, :long => loc.location_long,
                   :name => loc.location_name, :city => loc.location_city, :country => loc.location_country,
                   :region => loc.location_region,  :source_object_id => loc.source_object_id}

          end
          h[:location][:source_name] = params[:parent].source_name
          h[:location][:source_msg_id] = params[:parent].source_object_id

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_location] leaving  #{h.inspect}" )
          h
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_location]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end


        ##format activity object to generic form to compatible format for sending outside
        ##Takes care of source privacy.. can be made finer privacy control
        ##COMMENT - Activity Object is needed as it is contains all context needed
        ##          and its not shared
        #
        #INPUT => {
        #           :object => activity [object of message] [Mandatory]
        #         }
        def format_activity(params)

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_activity] entering #{params[:object].status_at_source.inspect}")

          hash = {}

          activity = params[:object]

          if activity.blank?
            return {}
          end

          author = activity.author

          hash[:post]={
                :id => activity.id,
                :user => {:id => author.id, :full_name => author.full_name, :photo => author.photo_small_url, :username => author.username},
                :time => activity.source_created_at,
                :summary_id => activity.summary_id,
                :source_object_id => activity.source_object_id,
                :source_object_type => activity.source_object_type,
                :source_name => activity.source_name
              }

          if params[:object].status_at_source == AppConstants.status_private_at_source

          else
            hash[:post][:text] = activity.activity_text
            hash[:post][:if_json]  =  activity.if_json
          end
          hash[:post][:category_data] = format_summary_category({:category_id => activity.category_id}) if !activity.category_id.blank?

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_activity] leaving #{hash.inspect}")

          hash
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_activity]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end


        ##format document object to generic form to compatible format for sending outside
        ##Takes care of source privacy.. can be made finer privacy control
        ##COMMENT - Document Object is needed as it is contains all context needed
        ##          and its not shared
        #
        #INPUT => {
        #           :object => document [object of message] [Mandatory]
        #         }
        def format_document(params)

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_document] entering #{params[:object].status_at_source.inspect}")

          hash = {}

          document = params[:object]

          if document.blank?
            return {}
          end

          hash[:document] = {
            :id => document.id, :source_name => document.source_name, :source_object_id => document.source_object_id,
            :source_msg_id => document.source_msg_id, :type => document.category
          }

          if params[:object].status_at_source == AppConstants.status_private_at_source

          else
            if document.uploaded == false
              if !document.web_link.blank?
                h =  format_web_link({:object => document.web_link})
                hash[:document] = hash[:document].merge(h[:web_link])
              end
            else
              hash[:document][:url] = document.url
            end
          end

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_document] leaving  #{hash.inspect}")

          hash
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_document]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end


        ##format tag object to generic form to compatible format for sending outside
        ##Takes care of source privacy.. can be made finer privacy control
        ##COMMENT - Tag Object is needed as it is contains all context needed
        ##          and its not shared
        #
        #INPUT => {
        #           :object => tag [object of message] [Mandatory]
        #         }
        def format_tag(params)

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_tag] entering #{params[:object].status_at_source.inspect}")
          hash = {}

          tag = params[:object]

          if tag.blank?
            return {}
          end

          hash[:tag] = {
                    :id => tag.id,
                    :source_name => tag.source_name,
                    :source_msg_id => tag.source_msg_id
              }
          if params[:object].status_at_source == AppConstants.status_private_at_source

          else
            hash[:tag][:name] =  tag.name
          end

          ##Rails.logger.info("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_tag] leaving  #{hash.inspect}")
          hash
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_tag]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end


        ##format category id to generic form to compatible format for sending outside
        ##No need for privacy layer as it will sent through some core object like Activity
        #and not directly
        #INPUT => {
        #           :category_id => category_id  [Mandatory]
        #         }
        def format_summary_category(params)
          h = {}
          category_id = params[:category_id]
          h = {
                :id => category_id,
                :name => SUMMARY_CATEGORIES[category_id]['name'],
                :type => SUMMARY_CATEGORIES[category_id]['type'],
                :hierarchy => SUMMARY_CATEGORIES[category_id]['hierarchy'],
                :default_channel => SUMMARY_CATEGORIES[category_id]['channel']
              }
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_summary_category]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end

        ##format web link object to generic form to compatible format for sending outside
        ##No need for privacy layer as it will sent through some core object like Document
        #and not directly
        #INPUT => {
        #           :object => web_link  [Mandatory] [a Web link model object]
        #         }
        def format_web_link(params)
          hash = {}

          web_link = params[:object]

          if web_link.blank?
            return {}
          end

          hash[:web_link] = {
             :url => web_link.url,
             :url_description => web_link.description,
             :url_category => web_link.category_id,
             :url_title => web_link.title,
             :url_image => web_link.image_url,
             :url_provider => web_link.provider
          }
          hash
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_web_link]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end


        ##format short web link object to generic form to compatible format for sending outside
        ##No need for privacy layer as it will sent through some core object like Document
        #and not directly
        #INPUT => {
        #           :object => short_web_link  [Mandatory] [Short Web link model object]
        #         }
        def format_short_web_link(params)
          hash = {}

          short_web_link = params[:object]

          if short_web_link.blank?
            return {}
          end

          hash = format_web_link({:object => short_web_link.web_link})
          hash
        rescue => e
          Rails.logger.error("[LIB] [API] [HELPERS] [FORMAT_OBJECT] [format_short_web_link]  **** RESCUE **** #{e.message} For #{params.inspect}")
          {}
        end
      end
    end
  end
end
