class AuthenticationsController < ApplicationController

  def auth_signin
    # @authentications = current_user.authentications if current_user
    # Added For Test Only One comment line is added
    provider = params['provider']
    uid = params['uid']
    @welcome_username="user"
    @welcome_user_picture="TODO some default image"
    if !provider.nil? && !uid.nil? && !provider.empty? && !uid.empty?
      authentication = Authentication.find_by_provider_and_uid(provider, uid)
      @welcome_username = authentication.foreign_profile.name
      @welcome_user_picture = authentication.foreign_profile.image
       redirect_to :controller => "home", :action => "alpha"
    end
  end

  def auth_signin_provider
    @key=''
    @provider=''
    @uid=''
    @profile_page = 1
    @page_mode="authentications_page"
    if !params.nil?
      if !params[:key].nil?
        @key=params[:key]
      end
      if !params[:provider].nil?
        @provider=params[:provider]
      end

      if !params[:uid].nil?
        @uid=params[:uid]
      end
    end


  end

  def auth_signup_provider
      provider = params['provider']


      @profile_page = 1
      @page_mode="authentications_page"

      Rails.logger.info("[CNTRL][Authentications][AUTH SIGNUP PVDR] Called")

      uid = params['uid']

      if !provider.nil? && !uid.nil? && !provider.empty? && !uid.empty?
        authentication = Authentication.find_by_provider_and_uid(provider, uid)
        unless authentication.nil?
          @welcome_username = authentication.foreign_profile.name
          @welcome_user_picture = authentication.foreign_profile.image
          @user= User.new
          @key  = params['key']
          @provider = provider
          @uid = uid
          @user.import_foreign_profile_to_user(authentication.foreign_profile)

          if @welcome_user_picture.nil?
            Rails.logger.info("[CNTRL][Authentications][AUTH SIGNUP PVDR] No User Picture From Provider")
            @welcome_user_picture = "/images/user.png"
          end

          Rails.logger.info("[CNTRL][Authentications] Provider picture #{@user_picture}")
        else
          Rails.logger.info("[CNTRL][Authentications][AUTH SIGNUP PVDR] Authentication fails")
          redirect_to "/"
        end
        Rails.logger.info("[CNTRL][Authentications][AUTH SIGNUP PVDR] Exiting")
      end
  end	

  def create

    #current_user.authentications.find_or_create_by_provider_and_uid(auth['provider'], auth['uid'])
    flash[:notice] = "Authentication successful."

  end

  def destroy
    @authentication = current_user.authentications.find(params[:id])
    @authentication.destroy
    flash[:notice] = "Successfully destroyed authentication."
    sign_in_and_redirect(:user, current_user)
  end

 def process_authentication

    omniauth = request.env["omniauth.auth"]
    Rails.logger.info("[CNTRL][Authentications] Auth process callback #{params} omniauth #{omniauth}")

    if omniauth.nil?
      #TODO: Send back to sign in
      Rails.logger.info("[CNTRL][Authentications] Omni auth is nil, back to home")
      redirect_to "/"
    end

    provider = params['provider']
    uid = omniauth['uid']

    already_existing_auth = Authentication.find_by_provider_and_uid(provider, uid)

    if already_existing_auth.nil?
      Rails.logger.info("[CNTRL][Authentications] A new foreign auth")
        if user_signed_in?
          Rails.logger.info("[CNTRL][Authentications] User is already signed in #{current_user.full_name}")
          any_existing_auth_for_same_provider = current_user.authentications.find_by_provider(provider)
          if any_existing_auth_for_same_provider.nil?
            Rails.logger.info("[CNTRL][Authentications] No existing auth for #{provider} for user")
            authentication=Authentication.create(:provider=>provider,
                                                 :uid=>uid,
                                                 :token=> omniauth['credentials']['token'],
                                                 :secret=> omniauth['credentials']['secret'],
                                                 :user_id=>current_user.id)
            data = omniauth['extra']['user_hash']
            unless data.nil?
              Rails.logger.info("[CNTRL][Authentications] Cache the new foreign profile")
              authentication.foreign_profile = ForeignProfile.new
              authentication.foreign_profile.send("import_#{provider}",data)
            end
            #redirect back to where you came from

            redirect_to session[:return_to] || '/'
          else
            Rails.logger.info("[CNTRL][Authentications] #{current_user.full_name} already has auth for #{provider}")
            redirect_to session[:return_to] || '/'
          end
        else
          # An existing authentication for no signed in user
          Rails.logger.info("[CNTRL][Authentications] User is not signed in but auth is new.")

          authentication = Authentication.create( :provider => provider,
                                                  :uid => uid,
                                                  :token=> omniauth['credentials']['token'],
                                                  :secret=> omniauth['credentials']['secret'])
          data = omniauth['extra']['user_hash']
          unless data.nil?
            Rails.logger.info("[CNTRL][Authentications] New foreign profile to cache for new auth no signin.")
            authentication.foreign_profile = ForeignProfile.new
            authentication.foreign_profile.send("import_#{provider}",data)
          end

          Rails.logger.info("[CNTRL][Authentications] Redirecting to auth signup page.")
          #if validation does not exist and user is not signed in do not allow access

          redirect_to :controller => 'authentications',
                      :action => 'auth_signup_provider',
                      :provider => provider,
                      :uid => uid,
                      :key => authentication.salt

        end
    else
      #save latest auth token
      Rails.logger.info("[CNTRL][Authentications] Renew credentials for an existing auth")
      already_existing_auth.token = omniauth['credentials']['token']
      already_existing_auth.secret = omniauth['credentials']['secret']

      if user_signed_in?
        Rails.logger.info("[CNTRL][Authentications] User already signed in for a new auth.")
        if already_existing_auth.user_id.nil?
          Rails.logger.info("[CNTRL][Authentications] User is being connected to auth")
          already_existing_auth.user_id =  current_user.id
          already_existing_auth.save!
          redirect_to session[:return_to] || '/'
        else

          if already_existing_auth.user_id == current_user.id
            Rails.logger.info("[CNTRL][Authentications] Auth token being updated for user")
            already_existing_auth.save!
          end
          Rails.logger.info("[CNTRL][Authentications] Going back to where we came from")
          redirect_to session[:return_to] || '/'
        end
      else
        Rails.logger.info("[CNTRL][Authentications] A new auth and user is not signed in.")
        if already_existing_auth.user_id.nil?
          Rails.logger.info("[CNTRL][Authentications] Auth is not associated to any user.")
          already_existing_auth.save!


         data = omniauth['extra']['user_hash']
          unless data.nil?
            Rails.logger.info("[CNTRL][Authentications] Foreign profile being saved for auth.")
            already_existing_auth.foreign_profile = ForeignProfile.new
            Rails.logger.info("[CNTRL][Authentications] Foreign profile import method call.")
            already_existing_auth.foreign_profile.send("import_#{provider}",data)
          end

          Rails.logger.info("[CNTRL][Authentications] Redirecting to auth sign in")
          redirect_to :controller => 'authentications',
                        :action => 'auth_signup_provider',
                          :provider => provider,
                          :uid => uid,
                          :key => already_existing_auth.salt

        else
           # I know the user, allow him to get in
          Rails.logger.info("[CNTRL][Authentications] Known auth, user sign in [user id : #{already_existing_auth.user_id}]")
          already_existing_auth.save!
          sign_in_and_redirect(:user, already_existing_auth.user)
        end
      end
    end
    rescue => e
      Rails.logger.error("[CNTRL][Authentications] Save raised exception : #{e}")
      redirect_to "/"

  end

end
