module Api
  module UserOpen
    class << self
      #INPUT
      #HASH
      #            {
      #               :provider => "twitter",
      #               :uid => "23232323",
      #               :full_name => "Alok Srivastava"
      #               :email => "alok@actwitty.com" [MANDATORY]
      #               :photo => "http://xyz.com/123"  [OPTIONAL]
      #               :location => "Bangalore" [OPTIONAL]
      #               :gender => "male" [OPTIONAL]
      #               :username => "mashable"[OPTIONAL]
      #             },
      #

      def create_open_user(params)
        Rails.logger.info("[LIB] [API] [USER_OPEN] [create_open_user] entering #{params.inspect}")

        if params[:provider].blank? or params[:uid].blank? or params[:email].blank?
          raise "Provider or UID at provider cant be blank"
        end

        time = Time.now.strftime("%Y%m%d%H%M%S%6N")

        a = Authentication.where({:uid => params[:uid], :provider => params[:provider]}).first

        if !a.blank?
          raise ":uid=> #{params[:uid]}, :provider => #{params[:provider]}  This user has already signed in"
        end

        #first check if passed username is available
        #make username and email based on time as they can be already in use by regular user..
        if (!params[:username].blank?) and params[:username] =~ /^[\w]{5,32}$/
          a = User.where(:username => params[:username]).first
          if !a.blank? #reset to time as it already exist
            params[:username] =  time
          end
        else
          params[:username] =  time # :username is blank then set to time
        end

        if !params[:email].blank?
          a = User.where(:email => params[:email]).first
          if !a.blank? #reset to time as it already exist
            params[:email] = "open_user_#{time}@actwitty.com"
          end
        else
          params[:email] =  "open_user_#{time}@actwitty.com" # :email is blank then set to time
        end

        if params[:location].blank?
          params[:location]= "Unknown"
        end

        if params[:gender].blank?
          params[:gender]= "other"
        end

        if params[:dob].blank?
          params[:dob]= "01/01/1970"
        end

        user =  User.new(:username => params[:username],
                                 :full_name => params[:full_name],
                                 :email => params[:email],
                                 :password => "XJksaU72134kLS",
                                 :password_confirmation => "XJksaU72134kLS",
                                 :gender => params[:gender],
                                 :current_location => params[:location],
                                 :current_geo_lat => "0",
                                 :current_geo_long => "0",
                                 :dob => params[:dob],
                                 :user_type => AppConstants.user_type_open,
                                 :photo_small_url => params[:photo]
                                 )

        user.save!

        authentication = Authentication.create!( :user_id => user.id, :provider => params[:provider],:uid => params[:uid])

        #backdoor invite to user
        Invite.create_new_invite(params[:provider], params[:uid], true, true)

        #hacking the current user id
        ::Api::Services.enable_service({:user_id => user.id, :current_user_id => user.id,
                                          :provider => params[:provider], :uid => params[:uid],:crawled_user => true})


        Rails.logger.info("[LIB] [API] [USER_OPEN] [create_open_user] leaving #{params.inspect}")
      rescue => e
        Rails.logger.error("[LIB] [API] [USER_OPEN] [create_open_user] **** RESCUE **** #{e.message} for #{params.inspect}")
      end
    end
  end
end