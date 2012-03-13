class Users::RegistrationsController < Devise::RegistrationsController


  def create
    process_authentication=false
    Rails.logger.info("[CNTRL] [REGISTRATION] Registration called with params #{params}")
    build_resource
    @key=''
    @provider=''
    @uid=''
    if !params.nil? && !params[:user].nil?
      @key=params[:user][:key]
      @provider=params[:user][:provider]
      @uid=params[:user][:uid]
      Rails.logger.info("[CNTRL] [REGISTRATION] Into create #{@provider} UID #{@uid} Key #{@key}")
      if !@key.nil? && !@provider.nil? && !@uid.nil? && !@key.empty? &&  !@provider.empty? && !@uid.empty?
        Rails.logger.info("[CNTRL] [REGISTRATION] Provider #{@provider} UID #{@uid} Key #{@key}")
        process_authentication=true
      end
    end
    resource.password_confirmation = resource.password
    if resource.save!
      if process_authentication
        Rails.logger.info("[CNTRL] [REGISTRATION] Registration for authentication request")
        authentication=Authentication.find_by_provider_and_uid(@provider, @uid)
        
        query_hash = {}
        query_hash[@provider] = @uid
        
        invite_status = Invite.check_if_invite_exists(query_hash)
        if invite_status 
          Invite.mark_invite_accepted(@provider, @uid)
        end



        unless authentication.nil?
          Rails.logger.info("[CNTRL] [REGISTRATION] Authentication is not nil")
          if authentication.salt == @key && authentication.user_id.nil?
            user = resource
            authentication.user_id = user.id
            Rails.logger.info("[CNTRL] [REGISTRATION] Updating userid for authentication")
            begin
              authentication.save!
            rescue Exception => e
              Rails.logger.error("[CNTRL][REGISTRATION] Authentication save failed #{e.message}")
            end
            if invite_status  
              enable_hash = {
                              :user_id => user.id,
                              :provider => @provider,
                              :uid => @uid
                            }
              user.enable_service(enable_hash)
            end
          end
        end
      end
      sign_in(resource_name, resource)
      if request.xhr?
        respond_to do |format|
         Rails.logger.info("[CNTRL] [REGISTRATION] after sign in path: /home/sketch" )
        format.js   { render :js => "window.location = '#{after_sign_in_path_for(resource)}'" }
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

    respond_to do |format|
      #format.html { render_with_scope :new }
      format.js   {  }
    end

  end




end
