require 'json'
require 'eventmachine'
require 'fiber'
require 'job_scheduler/job_scheduler'
class SocialAggregator < ActiveRecord::Base

  belongs_to :user

  validates_uniqueness_of :user_id, :scope => [:provider, :uid]
  validates_presence_of :user_id, :provider, :uid

  class << self

    EPOCH_TIME = Time.utc(1970, 1, 1, 0, 0)

    #Schedule/Re-Schedule a Job
    #INPUT {
    #       :user_id => 123,
    #       :provider => "facebook"/"twitter" [OPTIONAL -> If provider is absent, all services of user will be processed]
    #       :uid => 123 [OPTIONAL] it will process only that account of provide.. useful a lot when multiple accounts
    #                              of same provider
    #      }
    def schedule_job(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SCHEDULE_JOB] Entering #{params.inspect}")

      if !params[:scheduled_time].blank?
        worker = ::JobScheduler::JobWorker.new(params)
        id = worker.enqueue!
        puts "****************************** #{id} *********************************"
      else
        SocialAggregator.delay.pick_social_aggregation_request(params)
      end

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SCHEDULE_JOB] Leaving #{params.inspect}")

    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [SCHEDULE_JOB] **** RESCUE **** #{e.message} For #{params.inspect}")
    end

    #INPUT {
    #       :user_id => 123,
    #       :provider => "facebook"/"twitter" [OPTIONAL -> If provider is absent, all services of user will be processed]
    #       :uid => 123 [OPTIONAL] it will process only that account of provide.. useful a lot when multiple accounts
    #                              of same provider
    #      }
    def pick_social_aggregation_request(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] entering #{params.inspect}")
      array = []

      if !EM.reactor_running?
        start_reactor
      end

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PICK_SOCIAL_AGGREGATION_REQUEST] Authorized Service")

      Authentication.where(params).all.each do |attr|
        hash = setup_social_aggregation(:user_id => params[:user_id], :provider => attr.provider, :uid => attr.uid,
                                        :access_token => attr.token, :token_secret => attr.secret)
        array << hash if !hash.blank?
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

    #handle_asynchronously :pick_social_aggregation_request

    def process_social_aggregation_request(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] entering #{params.inspect}")
      summary_ids = {}

      active_list = []
      new_request = {}
      num_of_week = 1

      params[:requests].each do |hash|
        if !hash.blank?

          if hash[:status] == AppConstants.data_sync_new
            new_request[hash[:social_aggregator_id]] = true
          end

          #this sets the status so that deletion of this service does not happen till request is completed
          SocialAggregator.update_all({:status => AppConstants.data_sync_active}, {:id => hash[:social_aggregator_id]})

          #store the objects to reset the status
          active_list << hash[:social_aggregator_id]

          #start the BIG GUY
          ids =  start_social_aggregation(hash)

          if !ids.blank?
            summary_ids = summary_ids.merge(ids)
          else
            new_request.delete(hash[:social_aggregator_id])
          end
        end
      end

      #Now update analytics
      if !summary_ids.blank?

        if !new_request.blank?
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] Needs 5 Week Update #{params.inspect}")
          num_of_week = AppConstants.analytics_default_number_of_week
        end

        Activity.remove_activity_more_than_limit(:user_id => params[:user_id])

        #update user analytics
        SummaryRank.build_analytics(:user_id => params[:user_id], :action => AppConstants.analytics_update_user, :num_of_week => num_of_week)

        #update summaries analytics
        SummaryRank.build_analytics(:user_id => params[:user_id], :summary_id => summary_ids.keys,
                                    :action => AppConstants.analytics_update_summaries, :num_of_week => 1)
      end

      #finally reset the status back to done for all those services
      SocialAggregator.update_all({:status => AppConstants.data_sync_done}, {:id => active_list}) if !active_list.blank?

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_AGGREGATION_REQUEST] leaving #{params.inspect}")

      #only for asynchronous testing
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

          }
        }
      end
    end

    private
      #INPUT => {:user_id => 123, :provider => "facebook",:uid => "1123123213", :token => "sdjshdjhdjshdjhdas"}
      def setup_social_aggregation(params)

        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] entering #{params}")

        #pull information regarding social fetch stats regrading particular user and provider
        sa = SocialAggregator.where(:user_id => params[:user_id], :provider => params[:provider], :uid => params[:uid]).first

        if sa.blank?

          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>>  SERVICE NOT REGISTERED  #{params.inspect}")
          return {}

        elsif Time.now.utc < sa.next_update_timestamp
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>>  TOO EARLY TO START AGAIN
                            Expected time => #{sa.next_update_timestamp} for #{params.inspect}")
          return {}
        elsif sa.status == AppConstants.data_sync_active
           Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>>  On Request Still Active =>
                            #{sa.next_update_timestamp} for #{params.inspect}")
          return {}
        else

          if sa.latest_msg_timestamp > EPOCH_TIME

            #OVERIDE default settings for provider
            storage_limit = sa.every_time_feed_storage
            first_time = false
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>> regular update #{params.inspect}  " )
          else
            #default settings for provider
            storage_limit =  sa.first_time_feed_storage
            first_time = true
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [SETUP_SOCIAL_AGGREGATION] ====>>>> first time update #{params.inspect}  " )
          end

          #this two cases are there to handle crawled user case
          if params[:access_token].blank?
            params[:access_token]=AppConstants.send("#{params[:provider]}_token")
          end

          if params[:token_secret].blank?
            params[:token_secret]=AppConstants.send("#{params[:provider]}_secret")
          end

          hash ={
                  :user_id => params[:user_id], :uid => params[:uid], :provider => params[:provider],
                  :access_token => params[:access_token], :token_secret => params[:token_secret],
                  :storage_limit => storage_limit, :latest_msg_timestamp => sa.latest_msg_timestamp, :first_time => first_time,
                  :latest_msg_id => sa.latest_msg_id, :social_aggregator_id => sa.id,
                  :status => sa.status, :update_interval => sa.update_interval
                }
        end

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
         latest_msg_id = ""

         data_array = SocialFetch.pull_data({:user_id => params[:user_id], :uid => params[:uid],:provider => params[:provider],
                                                :access_token => params[:access_token], :token_secret => params[:token_secret],
                                                :first_time => params[:first_time]} )

         if data_array.blank?
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] empty data returned #{params.inspect}")
            raise 'Blank Data Array Returned'
         end


         ########################## Convert and Categorize data ###################################################

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] now process the data
                    ======================= #{data_array.size} ====================== for #{params.inspect}")

         activity = []
         index_for_posts = 0
         index_for_likes = 0
         old_activities = {}
         summary_ids = {}

         #TODO need to remove those activities whose actions are removed and they are there in source_actions
         #lets pull the old activities' to update their actions
         Activity.select("id, source_object_id, summary_id").where(:author_id => params[:user_id], :source_name => params[:provider]).
                           order("source_created_at DESC").limit(params[:storage_limit]).all.each do |attr|
           old_activities[attr.source_object_id] = {:activity_id => attr.id, :summary_id => attr.summary_id}
         end

         #convert and categorize data
         data_array.each do |attr|

           data = SocialFetch.data_adaptor({:provider => params[:provider], :blob => attr, :uid => params[:uid],
                                          :latest_msg_timestamp => params[:latest_msg_timestamp], :latest_msg_id => params[:latest_msg_id] })
           if !data[:post].blank?

             #store likes separately
             if data[:post][:source_object_type] == AppConstants.source_object_type_like
               next if index_for_likes == params[:storage_limit]
               index_for_likes += 1

             else
               next if index_for_posts == params[:storage_limit]
               index_for_posts += 1
             end
             activity << data

           elsif !data[:invalid_post].blank?
             msg_id = data[:invalid_post][:source_object_id]

             if !old_activities[msg_id].blank?
               result = SourceAction.update_source_action(:activity_id => old_activities[msg_id][:activity_id],:new_source_action => data[:invalid_post][:source_actions] )
               summary_ids[old_activities[msg_id][:summary_id]] = true  if result == true
             end
           end
         end

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION]")

         Categorization.categorization_pipeline(activity)  if !activity.blank?

         ############################Create Activities in DB in reverse order #####################################
         ################ As data is pulled in updated order from provider, we have create in reverse order ######

         size = activity.size

         user = User.where(:id => params[:user_id]).first

         #store data from last... as that will be in ascending order.. and data will pulled in get_all_activity naturally
         #in descending order of updated_at DESC
         size.times do |idx|

           attr = activity[idx -1]

           #as of now we are not using provider's timestamp as our timestamp.
           #though we are making a record of provider's created_at
           #h =  attr[:post].except(:created_at, :updated_at)
           h =  attr[:post]

           new_activity = user.create_activity(h)

           if !new_activity.blank?
             #collect
             summary_ids[new_activity[:post][:summary_id]] = true

             #this will set the timestamp too at successful insert of activity
             if latest_msg_timestamp <  h[:source_created_at]
               latest_msg_timestamp = h[:source_created_at]
             end

             #this will set the source object id too at successful insert of activity
             if latest_msg_id <  h[:source_object_id]
               latest_msg_id = h[:source_object_id]
             end
           end

         end

         time = Time.now.utc + params[:update_interval]

         h = {:next_update_timestamp => time}

         #update the latest_msg_timestamp in stats
         if latest_msg_timestamp > EPOCH_TIME
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] TIMESTAMP #{latest_msg_timestamp} for  #{params.inspect}")

            h[:latest_msg_timestamp] = latest_msg_timestamp
            h[:latest_msg_id] = latest_msg_id
         end

         SocialAggregator.update_all(h, {:id => params[:social_aggregator_id]})

         SocialAggregator.schedule_job({:user_id => params[:user_id],:provider => params[:provider],:uid => params[:uid],
                                      :scheduled_time => time })


         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] leaving #{params.inspect}")

         return summary_ids
      rescue => e
         Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [START_SOCIAL_AGGREGATION] ****ERROR INSIDE FIBER**** #{e.message} for #{params.inspect}")

         #destroy last new_activity. as they can't be valid after create as we are setting them to nil
         #so if they are non-null then they should be removed
         Activity.destroy_all(:id => new_activity[:post][:id]) if !new_activity.blank?

         #this removes the enabled job for Social Aggregator if it fails even at first time
         #[ISSUE][102][TECH][SERVER]Failed Social Fetch for first time should disable_service and enable at re-login
         if params[:latest_msg_timestamp] == EPOCH_TIME
           SocialAggregator.destroy_all(:id => params[:social_aggregator_id])
         else
           time = Time.now.utc + params[:update_interval]
           SocialAggregator.schedule_job({:user_id => params[:user_id],:provider => params[:provider],:uid => params[:uid],
                                      :scheduled_time => time })
         end

         return {}
      end
   end
end













# == Schema Information
#
# Table name: social_aggregators
#
#  id                      :integer         not null, primary key
#  user_id                 :integer         not null
#  provider                :text            not null
#  uid                     :text            not null
#  latest_msg_timestamp    :datetime        default(1970-01-01 00:00:00 UTC)
#  latest_msg_id           :text            default("")
#  status                  :integer         default(1)
#  next_update_timestamp   :datetime        default(1970-01-01 00:00:00 UTC)
#  update_interval         :integer         default(600)
#  every_time_feed_storage :integer         default(2)
#  first_time_feed_storage :integer         default(2)
#  created_at              :datetime        not null
#  updated_at              :datetime        not null
#

