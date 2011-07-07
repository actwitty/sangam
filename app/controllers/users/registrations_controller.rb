class Users::RegistrationsController < Devise::RegistrationsController

  def confirmation_wait

  end


  def create
    process_authentication=false
    Rails.logger.info( "create called with #{params}")
    build_resource

    if !params.nil? && !params[:user].nil?
      key=params[:user][:key]
      provider=params[:user][:provider]
      uid=params[:user][:uid]
      if !key.nil? && !provider.nil? && !uid.nil? && !key.empty? &&  !provider.empty? && !uid.empty?
        process_authentication=true
      end
    end


    resource.password_confirmation = resource.password

    if resource.save! 

      if process_authentication
        authentication=Authentication.find_by_provider_and_uid(provider, uid)
        unless authentication.nil?
          if authentication.salt = key && authentication.user_id.nil?
            user = resource
            authentication.user_id = user.id
            authentication.save
          end
        end
      end

      @user = resource

      if request.xhr?
        respond_to do |format|
          Rails.logger.info "xhr request, rendering partial confirmation wait"
          #  format.js   { render :js => "window.location = '#{after_sign_in_path_for(resource)}'" }
          format.js   { render :actionq => "confirmation_wait" }
        end

      end
     
    else
      clean_up_passwords(resource)
      @user = resource
      puts @user.errors
      respond_to do |format|
        format.html { render_with_scope :new }
        format.js   {  }
      end
    end
  rescue => e
    Rails.logger.info("Error in User => Registration => create => #{e}")
    puts "Error in User => Registration => create => #{e}"
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
