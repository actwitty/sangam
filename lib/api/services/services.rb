module Api
  module Services
    class << self
      #ASSUMPTION => Authorization with respective service is done
      #
      #INPUT {
      #         :current_user_id => 123 [MANDATORY]
      #         :user_id => 123,[MANDATORY]
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #         :crawled_user => true [OPTIONAL]
      #
      #      }
      #OUTPUT => true [ON SUCCESS], false [ON FAILURE]

      def enable_service(params)
        Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] entering #{params.inspect}")

        if params[:user_id].blank? or params[:provider].blank? or params[:uid].blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] User or Provider or UID at provider cant be blank => #{params.inspect}")
          return false
        end

        if params[:user_id] != params[:current_user_id]
          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] Un-Authorized user => #{params.inspect}")
          return false
        end

        crawled_user = false
        crawled_user = true if !params[:crawled_user].blank?

        params = params.except(:current_user_id, :crawled_user)

        auth = Authentication.where(params).first

        if auth.blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] User has not Authorised the service #{params.inspect}")
          return false if params[:provider] != AppConstants.test_service
        end

        social_fetch = SocialAggregator.where(:user_id => params[:user_id],:provider => params[:provider], :uid => params[:uid]).first

        if !social_fetch.blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] Already Enabled this Service #{params.inspect} #{social_fetch.inspect}")
          return false
        end


        if crawled_user == false

          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] Regular User getting created")
          #create social fetch entry and set last_msg_timestamp to near epoch
          social_fetch = SocialAggregator.create!(:user_id => params[:user_id],
                                                  :provider => params[:provider], :uid => params[:uid],
                                                  :status => AppConstants.data_sync_new)
        else
          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] Crawled User getting created")
          social_fetch = SocialAggregator.create!(:user_id => params[:user_id],
                                                  :provider => params[:provider], :uid => params[:uid],
                                                  :status => AppConstants.data_sync_new)
        end

        SocialAggregator.schedule_job({:user_id => params[:user_id],:provider => params[:provider],:uid => params[:uid]})


        Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] leaving #{params.inspect}")
        return true

      rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [ENABLE_SERVICE] **** RESCUE **** #{e.message} For #{params.inspect}")
        return false
      end

      # COMMENT => Only delete service data and does not delete authentication records as without authentication
      #            there is no meaning of user being there
      # INPUT {
      #         :current_user_id => 123, (it should be id of requesting user)
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #      }
      def disable_service(params)
        Rails.logger.info("[LIB] [API] [SERVICES] [DISABLE_SERVICE] entering #{params.inspect}")

        sa = nil
        if params[:user_id].blank? or params[:provider].blank? or params[:uid].blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [DISABLE_SERVICE] User or Provider or UID at provider cant be blank => #{params.inspect}")
          return false
        end

        if params[:user_id] != params[:current_user_id]
          Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] Un-Authorized user => #{params.inspect}")
          return false
        end

        params = params.except(:current_user_id)
        sa = SocialAggregator.where(params).first

        if sa.blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [DISABLE_SERVICE] Invalid request - No such service entry #{params.inspect}")
          return false
        end

        if sa.status == AppConstants.data_sync_active
          Rails.logger.info("[LIB] [API] [SERVICES] [DISABLE_SERVICE] Service Busy #{params.inspect}")
          return false
        end

        sa.update_attributes(:status => AppConstants.data_sync_active)

        #Add these field in Activity - UID
        #check whether Social Aggregator should not depend on activity as destroy
        Activity.destroy_all(:author_id => params[:user_id], :source_name => params[:provider], :source_uid => params[:uid])

        #delete User specific summary rank as it has no association
        #so need to delete explicitly.. It will be rebuild below if a summary is left
        SummaryRank.delete_all(:user_id =>  params[:user_id])

        summaries= []
        #after all deletion of activities what will happen.. I guess summary rank wil also be destroyed
        #
        Summaries.where(:user_id => params[:user_id]).all.each do |attr|
          summaries << attr.id
        end

        if !summaries.blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [DISABLE_SERVICE] Updating Analytics #{params.inspect}")


          #update user analytics
          SummaryRank.build_analytics(:user_id => params[:user_id], :action => AppConstants.analytics_update_user,
                                      :num_of_week => AppConstants.analytics_default_number_of_week)

          #update summaries analytics
          SummaryRank.build_analytics(:user_id => params[:user_id], :summary_id => summaries,
                                    :action => AppConstants.analytics_update_summaries,
                                    :num_of_week => AppConstants.analytics_default_number_of_week)
        end
        sa.destroy_all

        Rails.logger.info("[LIB] [API] [SERVICES] [DISABLE_SERVICE] Leaving #{params.inspect}")

      rescue => e

        sa.update_attributes(:status => AppConstants.data_sync_done)

        Rails.logger.error("[LIB] [API] [SERVICES] [DISABLE_SERVICE] **** RESCUE **** #{e.message} For #{params}")
      end


      # INPUT {
      #         :user_id => 123
      #       },
      # OUTPUT [
      #          {:user_id => 123, :provider => "facebook" ,:uid => "2321321323" :status => 2 [ 1 -4 constants.yml data_sysnc_*]},
      #          {...},
      #          {...}
      #        ]

      def get_services(params)
        Rails.logger.info("[LIB] [API] [SERVICES] [GET_SERVICE] entering #{params.inspect}")

        if params[:user_id].blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [GET_SERVICE] User ID cant be blank => #{params.inspect}")
          return {}
        end

        array = []
        SocialAggregator.where(:user_id => params[:user_id]).all.each do |attr|
          hash =  ::Api::Helpers::FormatObject.format_social_aggregator({:object => attr})
          array << hash[:aggregator]
        end

        Rails.logger.info("[LIB] [API] [SERVICES] [GET_SERVICE] Leaving #{params.inspect}")
        array

      rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [GET_SERVICE] **** RESCUE **** #{e.message} For #{params.inspect}")
        return []
      end

      # INPUT {
      #         :user_id => 123
      #       },
      # OUTPUT
      #  data_sync_new:                            1   #can be deleted in this state
      #                       OR
      #  data_sync_active:                         2
      #                       OR
      #  data_sync_done:                           3   #can be deleted in this state

      def get_status(params)

        Rails.logger.info("[LIB] [API] [SERVICES] [get_status]Entering => user_id => #{params[:user_id]}")

        status = AppConstants.data_sync_new

        SocialAggregator.where(:user_id => params[:user_id]).all.each do |attr|
          if attr.status == AppConstants.data_sync_done
            return AppConstants.data_sync_done
          end

          if attr.status == AppConstants.data_sync_active
            status =AppConstants.data_sync_active
          end
        end

        Rails.logger.info("[LIB] [API] [SERVICES] [get_status] leaving #{params[:user_id]} => #{status}")
        status
      rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [get_status] **** RESCUE **** #{e.message} For #{params.inspect}")
        return AppConstants.user_service_status_idle
      end


      #ASSUMPTION => Service is already enabled
      #
      #INPUT {
      #         :current_user_id => 123
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #
      #      }
      #OUTPUT => true [ON SUCCESS], false [ON FAILURE]
      def inject_job(params)
        Rails.logger.info("[LIB] [API] [SERVICES] [INJECT_JOB] Entering #{params.inspect}")

        if params[:user_id].blank? or params[:provider].blank? or params[:uid].blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [INJECT_JOB] User or Provider or UID at provider cant be blank => #{params.inspect}")
          return false
        end

#        if params[:user_id] != params[:current_user_id]
#          Rails.logger.info("[LIB] [API] [SERVICES] [INJECT_JOB] Un-Authorized user => #{params.inspect}")
#          return false
#        end

        social_fetch = SocialAggregator.where(:user_id => params[:user_id],:provider => params[:provider], :uid => params[:uid]).first

        if social_fetch.blank?
          Rails.logger.info("[LIB] [API] [SERVICES] [INJECT_JOB] Service is not enabled #{params.inspect} #{social_fetch.inspect}")
          return false
        end

        #update the time time stamp for the job otherwise it will fail
        #[ISSUE][101][TECH][SERVER]Inject Job should update the time in social aggregator
        SocialAggregator.update_all({:next_update_timestamp => Time.now.utc}, {:id => social_fetch.id})

        SocialAggregator.schedule_job({:user_id => params[:user_id],:provider => params[:provider],:uid => params[:uid]})

        Rails.logger.info("[LIB] [API] [SERVICES] [INJECT_JOB] Entering #{params.inspect}")

        true
       rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [INJECT_JOB] **** RESCUE **** #{e.message} For #{params.inspect}")
        false
      end
    end
  end
end
