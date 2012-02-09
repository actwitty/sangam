require 'json'
require 'eventmachine'
require 'fiber'
class SocialAggregator < ActiveRecord::Base

  belongs_to :user

  validates_uniqueness_of :user_id, :scope => [:provider, :uid]
  validates_presence_of :user_id, :provider, :uid

  class << self

    EPOCH_TIME = Time.utc(1970, 1, 1, 0, 0)

    #INPUT {
    #       :user_id => 123,
    #       :provider => "facebook"/"twitter" [OPTIONAL -> If provider is absent, all services of user will be processed]
    #       :uid => 123 [OPTIONAL] it will process only that account of provide.. useful a lot when multiple accounts
    #                              of same provider
    #      }
    def pick_social_aggregation_request(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] entering #{params.inspect}")
      array = []

      start_reactor

      if params[:provider] =~ /#{AppConstants.test_service}/
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] TEST SERVICE")
        SocialAggregator.where(params).all.each do |attr|
          array << {:user_id => params[:user_id], :provider => attr.provider, :uid => attr.uid}
        end
      else
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] Authorized Service")
        Authentication.where(params).all.each do |attr|
          array << {:user_id => params[:user_id], :provider => attr.provider, :uid => attr.uid, :token => attr.token}
        end
      end


      if array.blank?
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] Request Invalid #{params.inspect}")
        return
      end

      EM.epoll
      EM.next_tick do
        Fiber.new {
            process_social_aggregation_request({:user_id => params[:user_id],:requests => array})
          }.resume
      end

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] leaving #{params.inspect}")
    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] **** RESCUE **** #{e.message} For #{params.inspect}")
    end

    handle_asynchronously :pick_social_aggregation_request

    def process_social_aggregation_request(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] entering #{params.inspect}")
      summary_ids = {}

      active_list = []
      new_request = {}
      num_of_week = 1

      params[:requests].each do |request|
        hash = setup_social_aggregation(request)

        if !hash.blank?

          if hash[:social_fetch].status == AppConstants.data_sync_new
            new_request[hash[:social_fetch].id] = true
          end

          #this sets the status so that deletion of this service does not happen till request is completed
          hash[:social_fetch].update_attributes(:status => AppConstants.data_sync_active)

          #store the objects to reset the status
          active_list << hash[:social_fetch].id

          #start the BIG GUY
          ids =  start_social_aggregation(hash)

          if !ids.blank?
            summary_ids = summary_ids.merge(ids)
          else
            new_request.delete(hash[:social_fetch].id)
          end
        end
      end

      #Now update analytics
      if !summary_ids.blank?

        if !new_request.blank?
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] Needs 5 Week Update #{params.inspect}")
          num_of_week = AppConstants.analytics_default_number_of_week
        end

        #update user analytics
        #SummaryRank.build_analytics(:user_id => params[:user_id], :action => AppConstants.analytics_update_user, :num_of_week => num_of_week)

        #update summaries analytics
        SummaryRank.build_analytics(:user_id => params[:user_id], :summary_id => summary_ids.keys,
                                    :action => AppConstants.analytics_update_summaries, :num_of_week => num_of_week)
      end

      #finally reset the status back to done for all those services
      SocialAggregator.update_all({:status => AppConstants.data_sync_done}, {:id => active_list}) if !active_list.blank?

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] leaving #{params.inspect}")

#      only for asynchronous testing
#      user = User.where(:id => params[:user_id]).first
#      a = user.get_summary({:user_id => user.id})
#      puts a.inspect

    rescue => e

      #if  some active requests are there clean up them by resetting the status to done
      SocialAggregator.update_all({:status => AppConstants.data_sync_done}, {:id => active_list}) if !active_list.blank?

      Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] **** RESCUE **** #{e.message} For #{params.inspect} ")
    end



    Thread.abort_on_exception=true
    def start_reactor
      if !EM.reactor_running?
        Thread.new {
          Rails.logger.info("[CONFIG] [INITIALIZER] [REACTOR] Reactor running")
          EM.run {
            Rails.logger.flush
          }
        }
      end
    end

    private
      #INPUT => {:user_id => 123, :provider => "facebook",:uid => "1123123213", :token => "sdjshdjhdjshdjhdas"}
      def setup_social_aggregation(params)

        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] entering #{params}")

        last_updated_at = nil

        ############Find whether its first time data pull from provider. Set limit of pull accordingly ############

        limit = nil
        existing_data = {}

        #pull information regarding social fetch stats regrading particular user and provider
        social_fetch = SocialAggregator.where(:user_id => params[:user_id], :provider => params[:provider]).first

        #default settings for provider
        limit =  AppConstants.maximum_import_first_time
        latest_msg_timestamp = EPOCH_TIME

        if social_fetch.blank?

          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>>  SERVICE NOT REGISTERED  #{params.inspect}")
          return {}

        else

          #set the last hit to provider. Social Fetch Stats is updated at every hit
          last_updated_at =  social_fetch.updated_at

          if social_fetch.latest_msg_timestamp > EPOCH_TIME

            #OVERIDE default settings for provider
            limit = AppConstants.maximum_import_every_time
            latest_msg_timestamp = social_fetch.latest_msg_timestamp
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>> regular update #{params.inspect}  " )

          else
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>>  first time  #{params.inspect}")

          end
        end


        #################################### Pull data from provider ##############################################

        #if new registration then no need to check time_diff
        if social_fetch.status != AppConstants.data_sync_new

          time_diff = time_diff_in_minutes(last_updated_at)
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] TIME DIFF =>>>>>>>>>>> #{time_diff}   #{AppConstants.maximum_time_diff_for_social_fetch}")

          if time_diff < AppConstants.maximum_time_diff_for_social_fetch
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] leaving Time EARLY #{params.inspect}")
            return nil
          end

        else
        end

        hash = {:user_id => params[:user_id], :uid => params[:uid], :provider => params[:provider], :access_token => params[:token],
                :limit => limit, :latest_msg_timestamp => latest_msg_timestamp, :social_fetch => social_fetch}


        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] leaving #{params.inspect}")

        return hash
      rescue => e
        Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ****ERROR OUTSIDE FIBER**** #{e.message} for #{params.inspect}")
        nil
      end

      def start_social_aggregation(params)

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] entering #{params}")

         new_activity = nil
         latest_msg_timestamp = EPOCH_TIME

         social_fetch = params[:social_fetch]

         #already done by setting active status in calling function
         #social_fetch.touch

         data_array = SocialFetch.pull_data({:user_id => params[:user_id], :uid => params[:uid],:provider => params[:provider],
                                                :access_token => params[:access_token], :limit => params[:limit],
                                                :latest_msg_timestamp => params[:latest_msg_timestamp]} )


         if data_array.blank?
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] empty data returned #{params.inspect}")
            raise 'Blank Data Array Returned'
         end


         ########################## Convert and Categorize data ###################################################

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] now process the data
                    ======================= #{data_array.size} ====================== for #{params.inspect}")

         activity = []
         links = {}
         #convert and categorize data
         data_array.each do |attr|

           data = SocialFetch.data_adaptor({:provider => params[:provider], :blob => attr, :uid => params[:uid],
                                          :latest_msg_timestamp => params[:latest_msg_timestamp] })
           if !data.blank?
             activity << data
           end
         end
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION]")
         Categorization.categorization_pipeline(activity)  if !activity.blank?

         ############################Create Activities in DB in reverse order #####################################
         ################ As data is pulled in updated order from provider, we have create in reverse order ######

         size = activity.size

         user = User.where(:id => params[:user_id]).first

         summary_ids = {} #to update analytics

         #store data from last... as that will be in ascending order.. and data will pulled in get_all_activity naturally
         #in descending order of updated_at DESC
         size.times do |idx|

           attr = activity[idx -1]

           #as of now we are not using provider's timestamp as our timestamp.
           #though we are making a record of provider's created_at
           #h =  attr[:post].except(:created_at, :updated_at)
           h =  attr[:post]

           h[:created_at] = Time.now.utc if h[:created_at].blank?

           h[:updated_at] = h[:created_at] if h[:updated_at].blank?

           new_activity = user.create_activity(h)

           if !new_activity.blank?
             #collect
             summary_ids[new_activity[:post][:summary_id]] = true

             #this will set the timestamp too at successful insert of activity
             if latest_msg_timestamp <  h[:created_at]
               latest_msg_timestamp = h[:created_at]
             end
           end

         end

         #update the latest_msg_timestamp in stats
         if latest_msg_timestamp > EPOCH_TIME
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] TIMESTAMP #{latest_msg_timestamp} for  #{params.inspect}")
            social_fetch.update_attributes(:latest_msg_timestamp => latest_msg_timestamp)
         end


         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] leaving #{params.inspect}")

         return summary_ids
         rescue => e
           Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] ****ERROR INSIDE FIBER**** #{e.message} for #{params.inspect}")

           #destroy last new_activity. as they can't be valid after create as we are setting them to nil
           #so if they are non-null then they should be removed
           Activity.destroy_all(:id => new_activity[:post][:id]) if !new_activity.blank?

           return {}
      end

      def time_diff_in_minutes (time)
        diff_seconds = (Time.now - time).round
        diff_minutes = diff_seconds / 60
        diff_minutes
      end
  end
end









# == Schema Information
#
# Table name: social_aggregators
#
#  id                   :integer         not null, primary key
#  user_id              :integer         not null
#  provider             :text            not null
#  uid                  :text            not null
#  latest_msg_timestamp :datetime        default(1970-01-01 00:00:00 UTC)
#  status               :integer         default(1)
#  created_at           :datetime
#  updated_at           :datetime
#

