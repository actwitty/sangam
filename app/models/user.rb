require 'thread'
require 'plan_table_query'
require 'format_object'
require 'streams'



class User < ActiveRecord::Base

  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable,:token_authenticatable,
         :lockable , :omniauthable
          #,:devise_create_users
  attr_accessor :dob_str
  # Setup accessible (or protected) attributes for your model
  attr_accessible  :email, :username, :password,
                   :dob, :dob_str, :full_name, :gender,:photo_small_url,
                   :current_location, :current_geo_lat, :current_geo_long,
                   :password_confirmation, :remember_me, :user_type,
                   :country_code
				   #, :user_type  #user_type is only needed for ADMIN USER creation

  # relations #
  has_one :profile

  has_many :contacts
  has_many :friends, :foreign_key => :friend_id, :class_name => 'Contact' #these are the friends in the contacts table

  has_many :authentications


##### ALOK changed it  ##########################
  has_many :activities, :foreign_key => :author_id , :dependent => :destroy
  has_many :social_aggregators, :dependent => :destroy
  has_many :summary_ranks, :dependent => :destroy

  ##### ALOK changes ends here #####################

  # Validations #
  after_validation :validate_fields
  before_validation  :parse_dob

  #############################################################################
  #Executed before validation, converts a string date into MM/DD/YYYY date format
  def parse_dob

    unless  self.dob_str.nil?
      begin
        self.dob = Date.strptime(self.dob_str, '%m/%d/%Y')
      rescue ArgumentError
        Rails.logger.info("[MODEL] [USER] parse_dob received invalid DOB #{self.dob_str}")
        self.dob = nil
      end
    end

  end


  #############################################################################
  # Validation of fields while saving the user
  def validate_fields
    Rails.logger.info("[MODEL] [USER] BEFORE VALIDATION #{self.inspect}")
    
    if self.username.present?
      self.username.strip!
      self.username.downcase!
    end

    if self.full_name.present?
      self.full_name.strip!
    end

    Rails.logger.info("[MODEL][User][validate_fields] username: [#{self.username}] [#{self.username.size}]")
    username_validation = true
    gender_validation = true
    name_validation = true
    geo_validation = true
    dob_validation = true

    if self.username.blank?
      self.errors.add :username, "user name cannot be blank "
      Rails.logger.info("[MODEL][User][validate_fields] username cannot be blank")
      username_validation = false
    end


    unless self.username =~ /^[\w]{5,32}$/      #regex means /^[0-9a-z_]+$/
      self.errors.add :username, "user name can be alphanumeric, underscore with atleast 5 characters."
      Rails.logger.info("[MODEL][User][validate_fields] username can only be alphanumeric or _")
      username_validation = false
    end

    if username_validation
      test_user = User.find_by_username(self.username)
      unless test_user.nil?
        unless self.id == test_user.id
          self.errors.add :username, "user name has already been taken"
          Rails.logger.info("[MODEL][User][validate_fields] username has already been taken")
          username_validation = false
        end
      end
    end

    if !username_validation
      Rails.logger.info("[MODEL][User][validate_fields] username is bad")
    end
    
    Rails.logger.info("[MODEL][User][validate_fields][Gender] #{self.gender}")
    if self.gender.blank? or self.gender.nil?
      Rails.logger.info("[MODEL][User][validate_fields] Gender is nil")
      self.errors.add :gender, "gender cannot be blank"
      gender_validation = false
    else
      unless self.gender == "male" or self.gender == "female" or self.gender == "other"
        Rails.logger.info("[MODEL][User][validate_fields] Gender is invalid [#{self.gender}]")
        self.errors.add :gender, "gender can only be male/female/other"
        gender_validation = false
      end
    end


    Rails.logger.info("[MODEL][User][validate_fields][DoB] #{self.dob}")
    if self.dob.blank? or self.dob.nil?
      Rails.logger.info("[MODEL][User][validate_fields] DOB is nil")
      self.errors.add :dob, "date of birth cannot be blank"
      dob_validation = false
    end

    if self.full_name.blank? or self.full_name.nil?
      Rails.logger.info("[MODEL][User][validate_fields] Full Name is nil")
      self.errors.add :full_name, "name cannot be blank"
      name_validation = false
    else
      unless self.full_name =~ /^[a-zA-Z \.]{1,100}$/      #regex means /^[0-9a-z_]+$/
        self.errors.add :full_name, "name can only be english characters, space or dots "
        Rails.logger.info("[MODEL][User][validate_fields] name is not valid #{self.full_name} ")
        name_validation = false
      end
    end

    if self.current_location.blank? or self.current_geo_lat.blank? or self.current_geo_long.blank? or
       self.current_location.nil? or self.current_geo_lat.nil? or self.current_geo_long.nil?
      Rails.logger.info("[MODEL][User][validate_fields] Geo location lat/long is invalid ")
      self.errors.add :current_location, "select a valid geo location"
      geo_validation = false
    end
  
    Rails.logger.info("[MODEL][User][validate_fields] Gender Validation #{gender_validation}")
    if !username_validation or !gender_validation or !name_validation or !geo_validation or !dob_validation
      Rails.logger.info("[MODEL][User][validate_fields] atleast one validation failed ")
      return false
    end

    Rails.logger.info("[MODEL] [USER] AFTER VALIDATION #{self.inspect}")
    Rails.logger.info("[MODEL][User][validate_fields] Validations all good ")

    return true
  end


  # profile related api

  #############################################################################
  def password_required?
    (authentications.empty? || !password.blank?) && super
  end

  #############################################################################
  def get_pending_request_contacts
    users_list=nil
    friends_id_list = friends.select("user_id").where(:status =>
                                                  Contact.statusStringToKey['New']).map(&:user_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list
  end

  #############################################################################
  def get_raised_contact_requests_raised
    users_list=nil
    new_friends_id_list = contacts.select("user_id").where(:status =>
                                                  Contact.statusStringToKey['New']).map(&:user_id)

    if !new_friends_id_list.nil? && new_friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", new_friends_id_list )
    end
    return users_list
  end

  #############################################################################
  def get_contacts
    users_list=nil
    friends_id_list = contacts.select("friend_id").where(:status =>
                                                  Contact.statusStringToKey['Connected']).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list
  end

  #############################################################################
  def new_contact_request (friend_id)
    Contact.request_new(id, friend_id)
  end

  def accept_a_contact_request (friend_id)
    Contact.accept_new(id, friend_id)
  end

  def reject_a_contact_request(friend_id)
    Contact.reject_new(id, friend_id)
  end

  def disconnect_a_contact(friend_id)
   Contact.delete_contacts_from_both_ends(id, friend_id)
  end

  #############################################################################

  def get_provider_uids_of_friends(provider, uid_list)
   friends_id_list = contacts.select("friend_id").map(&:friend_id)

   Authentication.all(:select => "uid",:conditions=> ['user_id in (?) and uid in (?)',
                                                       friends_id_list, uid_list]).map(&:uid)

  end


  #############################################################################
  def get_uid_follow_status(provider, uid_list)

    auths = Authentication.all(:select => "uid, user_id", :conditions=> ['uid in (?)',
                                                                            uid_list])

    #TODO : Fix this properly
    uid_based_list = Hash.new
    user_id_list = Hash.new

    unless auths.nil?

      auths.each do |auth|
          uid_based_list[auth.uid] = {:user_id => auth.user_id, :following => 0}
          user_id_list[auth.user_id] = auth.uid
      end

      friends_list = Contact.all(:select => "friend_id", :conditions=> ['user_id = ? and friend_id in (?)',
                                                                            id,
                                                                            user_id_list.keys]).map(&:friend_id)


      friends_list.each do |friend|
         uid_based_list[user_id_list[friend]][:following] = 1
      end
    end

    return uid_based_list

  end


  #############################################################################

  def follow(friend_id)
    Contact.follow(id, friend_id)
  end

  #############################################################################
  def unfollow(friend_id)
    Contact.unfollow(id, friend_id)
  end

  #############################################################################
  def followers_count()
     friends.count()
  end

  #############################################################################
  def followings_count()
    contacts.count()
  end

  #############################################################################
  def check_follower(friend_id)
    contact=Contact.find_by_user_id_and_friend_id(id, friend_id)
    if contact.nil?

      return false
    else
      return true
    end
  end

  #############################################################################
  def get_subscribers(user_id)
    users_list = Array.new
    friends_id_list = Contact.select("user_id").where(:friend_id => user_id).map(&:user_id)
    if !friends_id_list.nil? && friends_id_list.count() != 0
    User.select("id,full_name,photo_small_url")
                        .where("id in (?)", friends_id_list ).each do  |attr|
                          users_list << { :id => attr.id,
                                          :name => attr.full_name,
                                          :photo => attr.photo_small_url }


      end
    end
    response = {:user => users_list}
  end

  #############################################################################
  def get_subscriptions(user_id)
    users_list = Array.new
    friends_id_list = Contact.select("friend_id").where(:user_id => user_id).map(&:friend_id)
    if !friends_id_list.nil? && friends_id_list.count() != 0
      User.select("id,full_name,photo_small_url")
                        .where("id in (?)", friends_id_list ).each do  |attr|
                          users_list << { :id => attr.id,
                                          :name => attr.full_name,
                                          :photo => attr.photo_small_url }


      end
    end
    response = {:user => users_list}

  end

  #############################################################################
  def get_followers
    users_list = []
    friends_id_list = Contact.select("user_id").where(:friend_id => id).map(&:user_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list ).index_by(&:id)

      followings_as_well_list = Contact.select("friend_id").where("friend_id in (?)
                                                                and user_id = ?",
                                                                friends_id_list,
                                                                id ).map(&:friend_id)

      followings_as_well_list.each { |user_id|
                                      puts "USER ID => " + user_id.to_s
                                      unless users_list[user_id].nil?
                                        users_list[user_id]["following"] = 1
                                      end
                                    }


    end
    return users_list
  end

  #############################################################################
  def get_followings
    users_list=[]
    friends_id_list = Contact.select("friend_id").where(:user_id => id).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list

  end
  
  #############################################################################
  #INPUT => {:name => "sudh"}
  #OUTPUT => [ :id => 123, :image => "http://xyz.com", :name => "sudhanshu saxena" }
  def self.search(params)
    Rails.logger.info("[MODEL] [USER] search entering #{params.inspect}")
    array = []
    unless params[:name].blank?
      #user_type is added for ADMIN USER
      select("id,full_name,photo_small_url, user_type").order("full_name").
                  where( ['users.email = ?
                            or full_name ILIKE ?', params[:name],
                                                   "#{params[:name]}%"]).all.each do |attr|
        Rails.logger.info("[MODEL] [USER] [SEARCH] ============= #{attr}")
        #ADMIN USER
        h = {:id => attr.id, :image => attr.photo_small_url, :name => attr.full_name}
        array << h if attr.user_type.nil? ||  (attr.user_type == AppConstants.user_type_regular)

      end
    end
    Rails.logger.info("[MODEL] [USER] search leaving #{params.inspect}")
    array
  end

  #############################################################################
  def import_foreign_profile_to_user(foreign_profile)
    Rails.logger.info("[MODEL] [USER] [import_foreign_profile_to_user] called #{foreign_profile.inspect}")

    unless  foreign_profile.name.blank?
      self.full_name = foreign_profile.name
    end
    unless  foreign_profile.email.nil?
      self.email = foreign_profile.email
    end
    unless  foreign_profile.dob.blank?
      begin
        self.dob = Date.strptime(foreign_profile.dob, '%m/%d/%Y')
        Rails.logger.info("[MODEL] [USER] Create profile DOB #{foreign_profile.dob}")
      rescue ArgumentError
        Rails.logger.info("[MODEL] [USER] Create profile received invalid DOB #{foreign_profile.dob}")
        self.dob = nil
      end
    end

    unless  foreign_profile.image.blank?
      Rails.logger.info("[MODEL] [USER] from foreign profile copying image url #{foreign_profile.image}")
      self.photo_small_url = foreign_profile.image
    end

    unless  foreign_profile.gender.blank?
      self.gender = foreign_profile.gender
    end

    unless  foreign_profile.location.blank?
      Rails.logger.info("[MODEL] [USER] Create profile location #{foreign_profile.location}")
      self.current_location = foreign_profile.location
    end

  end

  #############################################################################
  def create_profile_from_foreign_profile(foreign_profile)
     Rails.logger.info("[MODEL] [USER] Create profile from foreign profile called")
     profile = Profile.new

     unless  foreign_profile.first_name.nil?
      profile.first_name = foreign_profile.first_name
     end

     unless  foreign_profile.name.nil?
      profile.last_name = foreign_profile.last_name
     end

     unless  foreign_profile.name.nil?
      self.full_name = foreign_profile.name
     end

     unless  foreign_profile.image.nil?
      profile.profile_photo_l = foreign_profile.image
      profile.profile_photo_s = foreign_profile.image
      profile.profile_photo_m = foreign_profile.image
     end

     unless  foreign_profile.gender.nil?
      profile.gender = foreign_profile.gender
      self.gender = foreign_profile.gender
     end

     unless  foreign_profile.location.nil?
      profile.current_location = foreign_profile.location
      profile.home_location = foreign_profile.location
     end

     unless  foreign_profile.dob.nil?
      begin
        profile.dob = Date.strptime(foreign_profile.dob, '%m/%d/%Y')
      rescue ArgumentError
        Rails.logger.info("[MODEL] [USER] Create profile received invalid DOB #{foreign_profile.dob}")
        profile.dob = nil
      end
     end


     Rails.logger.info("[MODEL] [USER] Created a profile object for user ")
     profile.user_id =  self.id
     profile.save!
     Rails.logger.info("[MODEL] [USER] Save profile from foreign profile")

  end

  #############################################################################
  #Make post to facebook
  def post_new_activity_to_facebook(params, new_activity)
    Rails.logger.debug("[MODEL] [USER] [post activity to facebook]") 
    if params[:fb].nil? or params[:fb] != 'true'
        return
    end

    provider="facebook"
    facebook_auth=Authentication.find_by_user_id_and_provider(self.id, provider)
    
    if facebook_auth.nil?
      return
    end

    begin
      Rails.logger.debug("[MODEL] [USER] [post activity to facebook] Posting to FB")
      graph = Koala::Facebook::GraphAPI.new(facebook_auth.token)
      graph.put_wall_post( new_activity[:post][:text], {
                          :name => "Posted at ActWitty",
                          :link => "http://www.actwitty.com/view/id=#{new_activity[:post][:id]}", 
                          :caption => "#{self.full_name} posted on #{new_activity[:post][:word][:name]}",
                        })  

    rescue Koala::Facebook::APIError
      Rails.logger.error("[MODEL] [USER] [post activity to facebook] Exception in fb koala") 
    end
  end

  #############################################################################
  #Make post to twitter
  def post_new_activity_to_twitter(params, new_activity)
   
    Rails.logger.error("[MODEL] [USER] [post activity to twitter] ") 
    if params[:tw].nil? or params[:tw] != 'true'
        return
    end

    provider="twitter"
    twitter_auth=Authentication.find_by_user_id_and_provider(self.id, provider)

    if twitter_auth.nil?
      return
    end
    Rails.logger.debug("[MODEL] [USER] [post activity to facebook] Posting to twitter")
    tweet_desc = "#{self.full_name } posted on #{new_activity[:post][:word][:name]} #{new_activity[:post][:text]}"
    url = "http://www.actwitty.com/view/id=#{new_activity[:post][:id]}"
    if tweet_desc.length > 134 - url.length
      tweet_desc = tweet_desc[0...(134 - url.length)] + '...'
    end
    tweet = "#{tweet_desc} #{url}"
    Twitter.update tweet

  end

  # INPUT => service provider name
  #
  #
  def enable_service_for_data_gathering(provider)
    if self.profile.nil?
      Rails.logger.info("[MODEL][USER] Adding authentication to enabled service, new profile")
      self.profile = Profile.new
      self.profile.profile_enable_service(provider)
    else
      Rails.logger.info("[MODEL][USER] Adding authentication to enabled service, existing profile")
      self.profile.profile_enable_service(provider)
    end
 end

  # OUTPUT =>
  #
  #
  #
  def get_service_user_ids()
    hash = {}
    Rails.logger.info("[MODEL][USER] get_service_user_ids")
    profile = self.profile
    Rails.logger.info("[MODEL][USER] get_service_user_ids Profile: #{profile.inspect}")
    authentications = self.authentications
    Rails.logger.info("[MODEL][USER] get_service_user_ids Profile: #{authentications.inspect}")

    self.authentications.each do |attr|
      field = "#{attr.provider}_service_enabled"
      if !profile[field].nil? &&
          profile[field] == true
        hash["#{attr.provider}"] = attr.uid
      end
    end

    hash

  end

  # Return true or false
  def get_invited_status
    authentications = Authentication.find_all_by_user_id(self.id)
    query_hash = {}
    authentications.each do |authentication|
      query_hash[authentication.provider] = authentication.uid
    end
    invite_status = Invite.check_if_invite_exists(query_hash)

    invite_status
  end
  #############################################################################

  #
  require 'api/api'
  include Api


  # private methods
  # private
end







# == Schema Information
#
# Table name: users
#
#  id                   :integer         not null, primary key
#  email                :string(255)
#  encrypted_password   :string(128)     default("")
#  reset_password_token :string(255)
#  remember_created_at  :datetime
#  sign_in_count        :integer         default(0)
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  failed_attempts      :integer         default(0)
#  unlock_token         :string(255)
#  locked_at            :datetime
#  authentication_token :string(255)
#  username             :string(255)
#  show_help            :boolean
#  disable_email        :boolean
#  full_name            :string(255)
#  photo_small_url      :string(255)
#  country_code         :string(255)
#  dob                  :date
#  gender               :string(255)
#  current_location     :string(255)
#  current_geo_lat      :decimal(, )
#  current_geo_long     :decimal(, )
#  user_type            :integer         default(0)
#  created_at           :datetime        not null
#  updated_at           :datetime        not null
#  invitation_token     :string(60)
#  invitation_sent_at   :datetime
#  invitation_limit     :integer
#  invited_by_id        :integer
#  invited_by_type      :string(255)
#

