module Api
  module Admin
    class << self
      #{:user_id => 123, :current_user_id => 123}
      def delete_user(params)
        Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_USER] entering #{params.inspect}")

        if params[:user_id].blank? or params[:provider].blank? or params[:uid].blank?
          Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_USER] User or Provider or UID at provider cant be blank => #{params.inspect}")
          return false
        end

        if params[:user_id] != params[:current_user_id]
          Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_USER] Un-Authorized user => #{params.inspect}")
          return false
        end

        User.destroy_all(:user_id => params[:user_id])
      end

      # INPUT {
      #         :current_user_id => 123, (it should be id of requesting user)
      #         :user_id => 123,
      #         :provider => "facebook"/"twitter" [MANDATORY]
      #         :uid => 123 [MANDATORY]
      #      }
      def delete_service(params)
        ::Api::Services.disable_service(params)
      end
    end
  end
end