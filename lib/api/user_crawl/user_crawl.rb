module Api
  module UserCrawl
    class << self
      #INPUT
      #{
      #  :users =>
      #           [
      #             {
      #               :provider => "twitter",
      #               :uid => "23232323",
      #               :full_name => "Alok Srivastava"
      #               :photo => "http://xyz.com/123"  [OPTIONAL]
      #               :location => "Bangalore" [OPTIONAL]
      #               :username => "mashable" [OPTIONAL]
      #               :gender => "male" [OPTIONAL]
      #               :email => pete@gmail.com
      #             },
      #           ],
      #  :auth_key => "hdkjshfkjsdhkhfksdfsdf"
      #}

      def create_user(params)
        Rails.logger.info("[LIB] [API] [USER_CRAWL] [create_user] entering #{params.inspect}")


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
            if !a.token.blank?
              raise "This user has already signed in"
            end
          end

          if attr[:username].blank?
            s = Time.now.strftime("%Y%m%d%H%M%S")
            attr[:username]=t.strftime("%Y%m%d%H%M%S")   #=> "Printed on 11/19/2007"
          end

          if attr[:current_location].blank?
            attr[:current_location]= "Unknown"
          end

          if attr[:gender].blank?
            attr[:gender]= "male"
          end

          if attr[:email].blank?
            s = Time.now.strftime("%Y%m%d%H%M%S") if s.blank?
            attr[:email]= "#{s}@actwitty.com"
          end

          user =  User.new(:username => attr[:username],
                                 :full_name => full_name,
                                 :email => attr[:email],
                                 :password => "XJksaU72134kLS",
                                 :password_confirmation => "XJksaU72134kLS",
                                 :gender => attr[:gender],
                                 :current_location => attr[:current_location],
                                 :current_geo_lat => "0",
                                 :current_geo_long => "0",
                                 :dob => "01/01/1970",
                                 :user_type => AppConstants.user_type_crawled,
                                 :photo_small_url => attr[:photo]
                                 )

          user.save!

          authentication = Authentication.create!( :user_id => user.id, :provider => attr[:provider],:uid => attr[:uid])

          #hacking the current user id
          ::Api::Services.enable_service({:user_id => user.id, :current_user_id => user.id,
                                          :provider => attr[:provider], :uid => attr[:uid],:crawled_user => true})
        end

        Rails.logger.info("[LIB] [API] [USER_CRAWL] [create_user] leaving #{params.inspect}")
      rescue => e
        Rails.logger.error("[LIB] [API] [USER_CRAWL] [create_user] **** RESCUE **** #{e.message} for #{params.inspect}")
      end
    end
  end
end