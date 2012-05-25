module Api
  module UserCrawl
    class << self
      #INPUT
      #"  #COMES AS STRING
      #
      #  :users =>
      #           [
      #             {
      #               :provider => "twitter",
      #               :uid => "23232323",
      #               :full_name => "Alok Srivastava"
      #               :photo => "http://xyz.com/123"  [OPTIONAL]
      #               :location => "Bangalore" [OPTIONAL]
      #               :gender => "male" [OPTIONAL]
      #               :username => "mashable"[OPTIONAL]
      #               :category => "technology" OR "entertainment" etc #default stories
      #             },
      #           ],
      #  :auth_key => "hdkjshfkjsdhkhfksdfsdf"
      #
      #"

      def create_crawled_user(params)
        Rails.logger.info("[LIB] [API] [USER_CRAWL] [create_crawled_user] entering #{params.inspect}")

        if params.class == String
          params = params.gsub(/\'/,"")
          params = eval(params) #converts to hash
        end

        if params[:auth_key] != AppConstants.authorized_see_internals_secret_key
          raise "Not an Authorised Crawl Request"
        end

        params[:users].each do |attr|
          if attr[:provider].blank? or attr[:uid].blank?
            raise "Provider or UID at provider cant be blank"
          end

          full_name = attr[:full_name]
          s = nil

          a = Authentication.where({:uid => attr[:uid], :provider => attr[:provider]}).first

          if !a.blank?
            Rails.logger.info("[LIB] [API] [USER_CRAWL] [create_crawled_user] =>
                         :uid=> #{attr[:uid]}, :provider => #{attr[:provider]}  This user has already signed in" )
            next
          end

          #first check if passed username is available
          #make username and email based on time as they can be already in use by regular user.. so better let the
          #celebrity come and pick the available username and email manually

          if (!attr[:username].blank?) and attr[:username] =~ /^[\w]{5,32}$/
            a = User.where(:username => attr[:username]).first
            if a.blank?
              s = attr[:username]
            else
              s = nil
            end

          end

          if s.blank?
            s = Time.now.strftime("%Y%m%d%H%M%S%6N")
          end

          attr[:username]=s   #=> "Printed on 11/19/2007"
          attr[:email]= "crawled_user_#{s}@actwitty.com"

          if attr[:location].blank?
            attr[:location]= "Unknown"
          end

          if attr[:gender].blank?
            attr[:gender]= "other"
          end

          user =  User.new(:username => attr[:username],
                                 :full_name => full_name,
                                 :email => attr[:email],
                                 :password => "XJksaU72134kLS",
                                 :password_confirmation => "XJksaU72134kLS",
                                 :gender => attr[:gender],
                                 :current_location => attr[:location],
                                 :current_geo_lat => "0",
                                 :current_geo_long => "0",
                                 :dob => "01/01/1970",
                                 :user_type => AppConstants.user_type_crawled,
                                 :photo_small_url => attr[:photo]
                                 )

          user.save!

          authentication = Authentication.create!( :user_id => user.id, :provider => attr[:provider],:uid => attr[:uid])

          attr[:category] = AppConstants.default_category if attr[:category].blank?
          UserMetaInfo.create!(:user_id => user.id , :category => attr[:category], :user_type => user.user_type)

          #backdoor invite to user
          Invite.create_new_invite(attr[:provider], attr[:uid], true, true)
          #hacking the current user id
          ::Api::Services.enable_service({:user_id => user.id, :current_user_id => user.id,
                                          :provider => attr[:provider], :uid => attr[:uid],:crawled_user => true})
        end

        Rails.logger.info("[LIB] [API] [USER_CRAWL] [create_crawled_user] leaving #{params.inspect}")
      rescue => e
        Rails.logger.error("[LIB] [API] [USER_CRAWL] [create_crawled_user] **** RESCUE **** #{e.message} for #{params.inspect}")
      end
    end
  end
end
