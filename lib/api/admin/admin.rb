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
    end
  end
end