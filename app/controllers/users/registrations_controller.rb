class Users::RegistrationsController < Devise::RegistrationsController



  def create
    process_authentication=false
    Rails.logger.info("[CNTRL] [REGISTRATION] Registration called with params #{params}")
    build_resource

    if !params.nil? && !params[:user].nil?
      key=params[:user][:key]
      provider=params[:user][:provider]
      uid=params[:user][:uid]
      Rails.logger.info("[CNTRL] [REGISTRATION] Into create #{provider} UID #{uid} Key #{key}")
      if !key.nil? && !provider.nil? && !uid.nil? && !key.empty? &&  !provider.empty? && !uid.empty?
        Rails.logger.info("[CNTRL] [REGISTRATION] Provider #{provider} UID #{uid} Key #{key}")
        process_authentication=true
      end
    end
    resource.password_confirmation = resource.password
    if resource.save!
      if process_authentication
        Rails.logger.info("[CNTRL] [REGISTRATION] Registration for authentication request")
        authentication=Authentication.find_by_provider_and_uid(provider, uid)
        unless authentication.nil?
          Rails.logger.info("[CNTRL] [REGISTRATION] Authentication is not nil")
          if authentication.salt == key && authentication.user_id.nil?
            user = resource
            authentication.user_id = user.id
            Rails.logger.info("[CNTRL] [REGISTRATION] Updating userid for authentication")
            authentication.save!
          end
        end

        user_for_pic=resource
        if provider == "facebook"
          user_for_pic.photo_small_url = "http://graph.facebook.com/#{uid}/picture/"
          user_for_pic.save!
        end

      end

      @user = resource

      if request.xhr?
        respond_to do |format|

          Rails.logger.info("[CNTRL] [REGISTRATION] XHR Request render confirmation wait")
          #  format.js   { render :js => "window.location = '#{after_sign_in_path_for(resource)}'" }
          format.js   { render :js => "window.location = '/welcome/confirmation_wait?email=#{@user.email}'" }

        end

      end
     
    else
      Rails.logger.info("[CNTRL] [REGISTRATION] Error has occurred ")
      clean_up_passwords(resource)
      @user = resource
      puts @user.errors
      respond_to do |format|
        format.html { render_with_scope :new }
        format.js
      end
    end
  rescue => e
    Rails.logger.error("[CNTRL] [REGISTRATION] Error in User => Registration => create => #{e}")
    @user = resource
    puts @user.errors
    respond_to do |format|
      #format.html { render_with_scope :new }
      format.js   {  }
    end

  end


  def new
    super
    if !params.nil? && !params[:user].nil?
      key=params[:user][:key]
      provider=params[:user][:provider]
      uid=params[:user][:uid]
      if !key.nil? && !provider.nil? && !uid.nil?
        resource.set_provider_pending_context(provider, uid, key)
      end
    end
  end

end
