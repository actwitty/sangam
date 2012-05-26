class Users::RegistrationsController < Devise::RegistrationsController

  def create
    process_authentication=false
    Rails.logger.info("[CNTRL] [REGISTRATION] Registration called with params #{params}")
    build_resource
    
    new_user = resource
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
    new_user.password_confirmation = new_user.password

    
    authentication=Authentication.find_by_provider_and_uid(@provider, @uid)
    unless authentication.user_id.nil?
      tmp_user =  User.find_by_id(authentication.user_id)
      unless tmp_user.nil?
        #Copye everything to exsiting user and save on existing user
        tmp_user.username = new_user.username
        tmp_user.email = new_user.email
        tmp_user.photo_small_url = new_user.photo_small_url
        tmp_user.password = new_user.password
        tmp_user.password_confirmation = new_user.password_confirmation
        tmp_user.full_name = new_user.full_name
        tmp_user.dob = new_user.dob
        tmp_user.dob_str = new_user.dob_str
        tmp_user.gender = new_user.gender
        tmp_user.current_location = new_user.current_location
        tmp_user.current_geo_lat = new_user.current_geo_lat
        tmp_user.current_geo_long = new_user.current_geo_long
        new_user = tmp_user
        new_user.user_type = AppConstants.user_type_regular
      end
    end
    if new_user.save!
      if process_authentication
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
            user = new_user
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
      sign_in(resource_name, new_user)
      if request.xhr?
        respond_to do |format|
         Rails.logger.info("[CNTRL] [REGISTRATION] after sign in path: /home/sketch" )
        format.js   { render :js => "window.location = '#{after_sign_in_path_for(new_user)}'" }
        end
      end
     
    else
      Rails.logger.info("[CNTRL] [REGISTRATION] Error has occurred ")
      clean_up_passwords(new_user)
      tmp_user = User.new
      tmp_user.username = new_user.username
      tmp_user.email = new_user.email
      tmp_user.photo_small_url = new_user.photo_small_url
      tmp_user.password = new_user.password
      tmp_user.password_confirmation = new_user.password_confirmation
      tmp_user.full_name = new_user.full_name
      tmp_user.dob = new_user.dob
      tmp_user.dob_str = new_user.dob_str
      tmp_user.gender = new_user.gender
      tmp_user.current_location = new_user.current_location
      tmp_user.current_geo_lat = new_user.current_geo_lat
      tmp_user.current_geo_long = new_user.current_geo_long
      error_hash = new_user.errors.messages
      error_hash.each do |k, v|
        error_hash[k].each do| message |
          tmp_user.errors.add k,message
        end
      end
      @user = tmp_user
      respond_to do |format|
        format.html { render_with_scope :new }
        format.js
      end
  end
  rescue => e
    Rails.logger.error("[CNTRL] [REGISTRATION] Error in User => Registration => create => #{e}")
    clean_up_passwords(new_user)
    tmp_user = User.new
    tmp_user.username = new_user.username
    tmp_user.email = new_user.email
    tmp_user.photo_small_url = new_user.photo_small_url
    tmp_user.password = new_user.password
    tmp_user.password_confirmation = new_user.password_confirmation
    tmp_user.full_name = new_user.full_name
    tmp_user.dob = new_user.dob
    tmp_user.dob_str = new_user.dob_str
    tmp_user.gender = new_user.gender
    tmp_user.current_location = new_user.current_location
    tmp_user.current_geo_lat = new_user.current_geo_lat
    tmp_user.current_geo_long = new_user.current_geo_long
    error_hash = new_user.errors.messages
    error_hash.each do |k, v|
      error_hash[k].each do| message |
        tmp_user.errors.add k,message
      end
    end
    @user = tmp_user
    respond_to do |format|
      format.html { render_with_scope :new }
      format.js
     end

  end




end
