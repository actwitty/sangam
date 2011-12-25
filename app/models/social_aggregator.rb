require 'json'
require 'eventmachine'
require 'fiber'
class SocialAggregator < ActiveRecord::Base

  belongs_to :user

  validates_uniqueness_of :user_id, :scope => [:provider, :uid]
  class << self
    #INPUT => {:user_id => 123, :provider = "facebook"}

    EPOCH_TIME = Time.utc(1970, 1, 1, 0, 0)
    def create_social_data(params)

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] entering #{params}")

      new_activity = nil
      data_array = []
      aggregator = nil

      ###########################get authentication information of provider#####################################

      auth = Authentication.where(:user_id => params[:user_id], :provider => params[:provider]).first
      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] #{auth.inspect}")

      ############Find whether its first time data pull from provider. Set limit of pull accordingly ############

      limit = nil
      existing_data = {}

      #pull information regarding social fetch stats regrading particular user and provider
      social_fetch = SocialAggregator.where(:user_id => params[:user_id], :provider => params[:provider]).first

      #default settings for provider
      limit =  AppConstants.maximum_import_first_time
      latest_msg_timestamp = EPOCH_TIME

      if social_fetch.blank?
        #create social fetch entry and set last_msg_timestamp to near epoch
        social_fetch = SocialAggregator.create!(:user_id => params[:user_id],
                                                :provider => params[:provider], :uid => auth.uid)

        last_updated_at = EPOCH_TIME
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ====>>>>  first time  #{params.inspect}")
      else
        #set the last hit to provider. Social Fetch Stats is updated at every hit
        last_updated_at =  social_fetch.updated_at

        #this is the case when social data of user is pulled once but no data returned ..
        #may be he has not created any data at provider or some bug in our connection
        if social_fetch.latest_msg_timestamp > EPOCH_TIME
          #OVERIDE default settings for provider
          limit = AppConstants.maximum_import_every_time
          latest_msg_timestamp = social_fetch.latest_msg_timestamp
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ====>>>> regular update #{params.inspect}  " )
        else
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ====>>>>  first time  #{params.inspect}")
        end
      end


      #################################### Pull data from provider ##############################################
      time_diff = time_diff_in_minutes(last_updated_at)
      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] TIME DIFF =>>>>>>>>>>> #{time_diff}   #{AppConstants.maximum_time_diff_for_social_fetch}")

      if time_diff < AppConstants.maximum_time_diff_for_social_fetch
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] leaving Time EARLY #{params.inspect}")
        return nil
      end

      hash = {:user_id => auth.user_id, :uid => auth.uid, :provider => auth.provider, :access_token => auth.token,
              :limit => limit, :latest_msg_timestamp => latest_msg_timestamp, :social_fetch => social_fetch}

      EM.next_tick do
        Fiber.new {
          process_social_data(hash)
        }.resume

      end

      Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] leaving #{params.inspect}")
    rescue => e
      Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [CREATE_SOCIAL_DATA] ****ERROR OUTSIDE FIBER**** #{e.message} for #{params.inspect}")
      nil
    end


    private

      def process_social_data(params)

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] entering #{params}")

         new_activity = nil
         latest_msg_timestamp = EPOCH_TIME

         social_fetch = params[:social_fetch]

         social_fetch.touch

         data_array = SocialFetch.pull_data({:user_id => params[:user_id], :uid => params[:uid],:provider => params[:provider],
                                                :access_token => params[:access_token], :limit => params[:limit],
                                                :latest_msg_timestamp => params[:latest_msg_timestamp]} )


         if data_array.blank?
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] empty data returned #{params.inspect}")
            raise 'Blank Data Array Returned'
         end


         ########################## Convert and Categorize data ###################################################

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] now process the data
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
         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] #{activity.inspect}")
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

           h[:updated_at] = h[:created_at] if h[:updated_at].blank?

           new_activity = user.create_activity(h)

           #this will set the timestamp too at successful insert of activity
           if !new_activity.blank? and latest_msg_timestamp <  h[:created_at]
             latest_msg_timestamp = h[:created_at]
           end

         end

         #update the latest_msg_timestamp in stats
         if latest_msg_timestamp > EPOCH_TIME
            Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] TIMESTAMP #{latest_msg_timestamp} for  #{params.inspect}")
            social_fetch.update_attributes(:latest_msg_timestamp => latest_msg_timestamp)
         end

         Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] leaving #{params.inspect}")

         rescue => e
           Rails.logger.error("[MODEL] [SOCIAL_AGGREGATOR] [PROCESS_SOCIAL_DATA] ****ERROR INSIDE FIBER**** #{e.message} for #{params.inspect}")

           #destroy last new_activity. as they can't be valid after create as we are setting them to nil
           #so if they are non-null then they should be removed
           Activity.destroy_all(:id => new_activity[:post][:id]) if !new_activity.blank?

           #May be we can set Sync Error in Auth table and re-sync immediately .. but time being parking it

      end

      def  complete_link_info_present(link)
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] entering => #{link}")

        if link.blank?
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] blank link given => #{link}")
          return false
        end

        if !link[:url].blank? and !link[:description].blank? and !link[:name].blank? and !link[:image_url].blank?
          Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] Complete Link => #{link}")
          return true
        end
        Rails.logger.info("[MODEL] [SOCIAL_AGGREGATOR] [COMPLETE_LINK_INFO_PRESENT] incomplete link => #{link}")
        false
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
#  user_id              :integer
#  provider             :text
#  uid                  :text
#  latest_msg_timestamp :datetime        default(1978-12-15 09:10:00 UTC)
#  created_at           :datetime
#  updated_at           :datetime
#

