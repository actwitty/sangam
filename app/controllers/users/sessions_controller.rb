class Users::SessionsController < Devise::SessionsController

   def failure
       Rails.logger.info("[CNTRL] [SESSION] Failed to create session")
      @user = User.find_by_email(params[:user][:email])
      if !@user.nil?
          if !@user.confirmation_token.nil?
            @user.errors[:email]="email confirmation is pending, click on confirmation resend"
          elsif !@user.unlock_token.nil?
            @user.errors[:email]="account is locked, click on unlock account"
          else
            @user.errors[:email]="Invalid password, please retry"
          end
      else
        @user = User.new(:email => params[:user][:email])
        @user.errors[:email]="Invalid credentials, please retry"
      end
      clean_up_passwords(@user)
   end

  def create
    Rails.logger.info("[CNTRL] [SESSION] Session create request")
    if request.xhr?
      resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
      @user = resource
      set_flash_message(:notice, :signed_in) if is_navigational_format?
      sign_in(resource_name, resource)
      key=params[:user][:key]
      provider=params[:user][:provider]
      uid=params[:user][:uid]

      if !key.nil? && !provider.nil? && !uid.nil? && !key.empty? &&  !provider.empty? && !uid.empty?
        Rails.logger.info("[CNTRL] [SESSION] Foreign Auth Save Provider #{provider} uid #{uid} key #{key}")
        authentication=Authentication.find_or_create_by_provider_and_uid(provider, uid)
        unless authentication.nil?
          if authentication.salt = key && authentication.user_id.nil?
            authentication.user_id = current_user.id
            Rails.logger.info("[CNTRL] [SESSION] saving the user id: on foreign authentication" )
            authentication.save!
          end
        end
      end

      respond_to do |format|
        Rails.logger.info("[CNTRL] [SESSION] after sign in path: /home/show" )
        format.js   { render :js => "window.location = '#{after_sign_in_path_for(resource)}'" }
      end
    else
      #go on regular path for html requests
      super
    end

    rescue => e
      Rails.logger.error("[CNTRL] [SESSION] Error in User => Session => create => #{e}")
      respond_to do |format|
          format.js   { render :js => "window.location = '#{after_sign_in_path_for(resource)}'" }
      end

  end
  def new

        Rails.logger.info("*******************session new***************")
    if user_signed_in?
        redirect_to :controller => "home", :action => "alpha"
    else
        
        Rails.logger.info("-----------------session new start------------------")
        redirect_to "/"
        
        Rails.logger.info("-----------------session new end------------------")
    end
  end



end
