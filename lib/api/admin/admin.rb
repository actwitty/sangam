module Api
  module Admin
    class << self
      #{
      #  :user_id => 123,
      #  :current_user_id => 123,
      #  :auth_key =>  "hdkjshfkjsdhkhfksdfsdf"[OPTIONAL == It is only used for Admin call(invite controller)  as a mode for authorization..]
      #}
      def delete_user(params)
        Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_USER] entering #{params.inspect}")

        delete_extra_activities

        return

        if params[:user_id].blank?
          raise  "User or Provider or UID at provider cant be blank"
        end

        if params[:auth_key].blank? and params[:user_id] != params[:current_user_id]
          raise "Un-Authorized user "
        end

        if !params[:auth_key].blank? and params[:auth_key] != AppConstants.authorized_see_internals_secret_key
          raise "Un-Authorised Admin User "
        end

        User.destroy_all(:id => params[:user_id])
        Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_USER] leaving #{params.inspect}")
      rescue => e
        Rails.logger.error("[LIB] [API] [ADMIN] [DELETE_USER] **** RESCUE **** #{e.message} For #{params.inspect}")
        false
      end

      def delete_extra_activities
        Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_EXTRA_ACTIVITIES] Entering")

        u = User.all

        u.each do |attr|
          Activity.remove_activity_more_than_limit(:user_id => attr.id)

          summaries = Summary.where(:user_id => attr.id).map(&:id)

           #update user analytics
          SummaryRank.build_analytics(:user_id => attr.id, :action => AppConstants.analytics_update_user, :num_of_week => 1)

          if !summaries.blank?
            #update summaries analytics
            SummaryRank.build_analytics(:user_id => attr.id, :summary_id => summaries,
                                    :action => AppConstants.analytics_update_summaries, :num_of_week => 1)
          end
        end

        Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_EXTRA_ACTIVITIES] Leaving")
      rescue => e
        Rails.logger.error("[LIB] [API] [ADMIN] [DELETE_EXTRA_ACTIVITIES] **** RESCUE **** #{e.message}")
      end
    end
  end
end