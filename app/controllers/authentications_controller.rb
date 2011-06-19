class AuthenticationsController < ApplicationController
  def auth_signin
    # @authentications = current_user.authentications if current_user
    provider = params['provider']
    uid = params['uid']
    @welcome_username="user"
    @welcome_user_picture="TODO some default image"
    if !provider.nil? && !uid.nil? && !provider.empty? && !uid.empty?
      authentication = Authentication.find_by_provider_and_uid(provider, uid)
      @welcome_username = authentication.foreign_profile.name
      @welcome_user_picture = authentication.foreign_profile.image
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


    if omniauth.nil?
      #TODO: Send back to sign in
      puts "authentication failed redirect to sign in"
      redirect_to "/"
    end

    provider = params['provider']
    uid = omniauth['uid']

    already_existing_auth = Authentication.find_by_provider_and_uid(provider, uid)

    if already_existing_auth.nil?
      puts "No such authentication exists"
      if user_signed_in?
        puts "User is signed in"
        any_existing_auth_for_same_provider = current_user.authentications.find_by_provider(provider)
        if any_existing_auth_for_same_provider.nil?
          puts "Handle a new authentication"
          authentication=Authentication.create(:provider=>provider,
                                               :uid=>uid,
                                               :token=> omniauth['credentials']['token'],
                                               :secret=> omniauth['credentials']['secret'],
                                               :user_id=>current_user.id)
          data = omniauth['extra']['user_hash']

          unless data.nil?
            authentication.foreign_profile = ForeignProfile.new
            authentication.foreign_profile.send("import_#{provider}",data)
          end
          #redirect back to where you came from

          redirect_to session[:return_to] || '/'
        else
          puts "There is already some other authentication added for provider : " + provider
          redirect_to session[:return_to] || '/'
        end
      else
        puts "Creating a new authentication for unknown user"
        #save unassociated authentication
        authentication = Authentication.create(:provider => provider,
                                               :uid => uid,
                                               :token=> omniauth['credentials']['token'],
                                               :secret=> omniauth['credentials']['secret'])
        data = omniauth['extra']['user_hash']

        unless data.nil?
          authentication.foreign_profile = ForeignProfile.new
        end
        flash[:notice] = "You need to sign in/sign up to enable this " + provider + " direct login"

        #if validation does not exist and user is not signed in do not allow access
        redirect_to :controller => 'authentications',
                    :action => 'auth_signin',
                      :provider => provider,
                      :uid => uid,
                      :key => authentication.salt
      end
    else
      #save latest auth token
      puts "Renew tokens for existing auth"
      already_existing_auth.token = omniauth['credentials']['token']
      already_existing_auth.secret =omniauth['credentials']['secret']

      if user_signed_in?
        puts "Add auth to the user and let user continue"
        if already_existing_auth.user_id.nil?
          already_existing_auth.user_id =  current_user.id
          already_existing_auth.save
          redirect_to session[:return_to] || '/'
        else
          if already_existing_auth.user_id == current_user.id
            puts "New tokens added for user"
            already_existing_auth.save
          end
          redirect_to session[:return_to] || '/'
        end
      else
        if already_existing_auth.user_id.nil?
          puts "Auth created user unknown"
          already_existing_auth.save
          redirect_to :controller => 'authentications',
                        :action => 'auth_signin',
                          :provider => provider,
                          :uid => uid,
                          :key => already_existing_auth.salt

        else
           # I know the user, allow him to get in
          sign_in_and_redirect(:user, already_existing_auth.user)
        end
      end
    end

  end


end
