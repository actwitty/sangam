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
        Rails.logger.info("[LIB] [API] [ADMIN] [DELETE_USER] leaving #{params.inspect}")
      rescue => e
        Rails.logger.error("[LIB] [API] [ADMIN] [DELETE_USER] **** RESCUE **** #{e.message} For #{params.inspect}")
      end
    end
  end
end