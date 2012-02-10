module Api
  module Services
    class << self
      #ASSUMPTION => Authorization with respective service is done
      #
      #INPUT {
      #         :current_user_id => 123
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
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

        params = params.except(:current_user_id)

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

        #create social fetch entry and set last_msg_timestamp to near epoch
        social_fetch = SocialAggregator.create!(:user_id => params[:user_id],
                                                :provider => params[:provider], :uid => params[:uid],
                                                :status => AppConstants.data_sync_new)


        SocialAggregator.pick_social_aggregation_request(:user_id => params[:user_id],:provider => params[:provider],
                                                         :uid => params[:uid])


        Rails.logger.info("[LIB] [API] [SERVICES] [ENABLE_SERVICE] leaving #{params.inspect}")
        return true

      rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [ENABLE_SERVICE] **** RESCUE **** #{e.message} For #{params.inspect}")
        return false
      end


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
          hash =  ::Api::Helpers::FormatObject.format_social_aggregator({:aggregator => attr})
          array << hash[:aggregator]
        end

        Rails.logger.info("[LIB] [API] [SERVICES] [GET_SERVICE] Leaving #{params.inspect}")
        array

      rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [GET_SERVICE] **** RESCUE **** #{e.message} For #{params.inspect}")
        return []
      end

      #COMMENT => Used by CRON to periodically process user data
      def periodically_process_users

        Rails.logger.info("[LIB] [API] [SERVICES] [PERIODICALLY_PROCESS_USER] Entering #{params.inspect}")

        t = time.now

        array = []
        SocialAggregator.where(":now - updated_at >= :time_limit",
                               {:now => t,:time_limit => AppConstants.maximum_time_diff_for_social_fetch*60 } ).each do |attr|

          #we can add other parameters too make request directed to user's particular service
          #but as of now we want to process all of users registered account together so that analytics
          #remains at one timestamp for all services

          Rails.logger.info("[LIB] [API] [SERVICES] [PERIODICALLY_PROCESS_USER] going to queue #{attr.inspect}")
          array << {:user_id => attr.user_id}
        end

        array.each do|request|
          SocialAggregator.pick_social_aggregation_request(request)
        end

        Rails.logger.info("[LIB] [API] [SERVICES] [PERIODICALLY_PROCESS_USER] Leaving")
      rescue => e
        Rails.logger.error("[LIB] [API] [SERVICES] [PERIODICALLY_PROCESS_USER] **** RESCUE **** #{e.message} }")
      end
    end
  end
end