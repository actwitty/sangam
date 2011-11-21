class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable


  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable,:token_authenticatable,
         :lockable , :omniauthable
          #,:devise_create_users
  attr_accessor :dob_str, :gender, :dob, :current_location, :current_geo_lat, :current_geo_long
  # Setup accessible (or protected) attributes for your model
  attr_accessible  :email, :username, :password,
                   :dob, :dob_str, :full_name, :gender,:photo_small_url,
                   :current_location, :current_geo_lat, :current_geo_long,
                   :password_confirmation, :remember_me
				   #, :user_type  #user_type is only needed for ADMIN USER creation

  # relations #
  has_one :profile

  has_many :contacts
  has_many :friends, :foreign_key => :friend_id, :class_name => 'Contact' #these are the friends in the contacts table

  has_many :authentications


##### ALOK changed it  ##########################
  has_many :activities, :foreign_key => :author_id , :dependent => :destroy
  has_many :documents, :foreign_key => :owner_id
  has_many :tags, :foreign_key => :author_id

  #CREATE & DESTROY for hub, hub association, mentions, campaigns, entity_ownerships,summaries location_ownerships  will happen from activity create & destroy
  #no explicit create & destroy is called by user for all these
  has_many :summaries #destroy will happen through activity

  has_many :hubs
  has_many :entities, :through => :hubs, :uniq => true
  has_many :locations, :through => :hubs, :uniq => true
  has_many :activity_words, :through => :hubs, :uniq => true

  has_many :mentions
  has_many :campaigns,:foreign_key => :author_id

  #Though it only removes the user foreign key in entity ownership. But User ID  &  Entities
  # will not be deleted as of now. Only user's docs and activities
  has_many :entity_ownerships, :foreign_key => :owner_id, :dependent => :nullify

  ##### ALOK changes ends here #####################

  # Validations #
  after_validation :validate_fields
  before_validation  :parse_dob

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


  def validate_fields
    Rails.logger.info("[MODEL] [USER] VALIDATION image -----------------------> #{self.photo_small_url}")
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

    if self.gender.blank?
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


    if self.dob.blank?
      Rails.logger.info("[MODEL][User][validate_fields] DOB is nil")
      self.errors.add :dob, "date of birth cannot be blank"
      dob_validation = false
    end

    if self.full_name.blank?
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

    if self.current_location.blank? or self.current_geo_lat.blank? or self.current_geo_long.blank?
      Rails.logger.info("[MODEL][User][validate_fields] Geo location lat/long is invalid ")
      self.errors.add :current_location, "select a valid geo location"
      geo_validation = false
    end

    if !username_validation or !gender_validation or !name_validation or !geo_validation or !dob_validation
      Rails.logger.info("[MODEL][User][validate_fields] atleast one validation failed ")
      return false
    end

    Rails.logger.info("[MODEL][User][validate_fields] Validations all good ")
    return true
  end


  # profile related api

  def password_required?
    (authentications.empty? || !password.blank?) && super
  end

  def get_pending_request_contacts
    users_list=nil
    friends_id_list = friends.select("user_id").where(:status =>
                                                  Contact.statusStringToKey['New']).map(&:user_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list
  end

  def get_raised_contact_requests_raised
    users_list=nil
    new_friends_id_list = contacts.select("user_id").where(:status =>
                                                  Contact.statusStringToKey['New']).map(&:user_id)

    if !new_friends_id_list.nil? && new_friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", new_friends_id_list )
    end
    return users_list
  end

  def get_contacts
    users_list=nil
    friends_id_list = contacts.select("friend_id").where(:status =>
                                                  Contact.statusStringToKey['Connected']).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list
  end

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


  def get_provider_uids_of_friends(provider, uid_list)
   friends_id_list = contacts.select("friend_id").map(&:friend_id)

   Authentication.all(:select => "uid",:conditions=> ['user_id in (?) and uid in (?)',
                                                       friends_id_list, uid_list]).map(&:uid)

  end


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



  def follow(friend_id)
    Contact.follow(id, friend_id)
  end

  def unfollow(friend_id)
    Contact.unfollow(id, friend_id)
  end

  def followers_count()
     friends.count()
  end

  def followings_count()
    contacts.count()
  end

  def check_follower(friend_id)
    contact=Contact.find_by_user_id_and_friend_id(id, friend_id)
    if contact.nil?

      return false
    else
      return true
    end
  end

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

  def get_followings
    users_list=[]
    friends_id_list = Contact.select("friend_id").where(:user_id => id).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list

  end

  def self.search(search)
    array = []
    unless search.blank?
      #user_type is added for ADMIN USER
      select("id,full_name,photo_small_url, user_type").order("full_name").
                  where( ['users.email = ?
                            or full_name ILIKE ?', search,
                                                   "%#{search}%"]).all.each do |attr|
        Rails.logger.info("[MODEL] [USER] [SEARCH] ============= #{attr}")
        #ADMIN USER
        array << attr if attr.user_type.nil? ||  (attr.user_type == AppConstants.user_type_regular)
      end
    end
    array
  end

  def import_foreign_profile_to_user(foreign_profile)
    Rails.logger.info("[MODEL] [USER] [import_foreign_profile_to_user] called #{foreign_profile}")

    unless  foreign_profile.name.blank?
      self.full_name = foreign_profile.name
    end
    unless  foreign_profile.email.nil?
      self.email = foreign_profile.email
    end
    unless  foreign_profile.dob.blank?
      begin
        self.dob = Date.strptime(foreign_profile.dob, '%m/%d/%Y')
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
      self.current_location = foreign_profile.location
    end

  end

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

  include TextFormatter
  include QueryPlanner
  #Alok Adding pusher support
  include PusherSvc

  #INPUT user_id => 123
  #sort_order => 1 (lexicographical) or  2 (based on updated)
  #returns hash of : {:name => "eating" ,:id => 123 }
  #   OR
  #    {} if invalid user
  def get_user_activities( user_id, sort_order)

     Rails.logger.debug("[MODEL] [User] [get_user_activities] entering ")

     h = Activity.where(:author_id => user_id, :status => AppConstants.status_public, :meta_activity => false).
         group(:summary_id, :activity_word_id, :activity_name).order("MAX(updated_at)  DESC").count

     word_array = []

     h.each do |k,v|
#        word_hash << {:name => k[1], :id => k[0]}
       word_array << {:name => k[2], :id => k[1], :summary_id => k[0]}
     end

     if !sort_order.blank? && sort_order == 1
        word_array = word_array.sort {|x, y| x[:name] <=> y[:name] }
     end
     Rails.logger.debug("[MODEL] [User] [get_user_activities] leaving ")
     word_array

  end

  #INPUT user_id => 123
  #sort_order => 1 (lexicographical) or  2 (based on updated)
  #OUTPUT hash of : {:name => "pizza" , :id => 123, :image =>  }
  #                            OR
  #                 {} if invalid user
  def get_user_entities(user_id, sort_order)

    Rails.logger.debug("[MODEL] [User] [get_user_entities] entering ")

    entity_array = []

    user = User.where(:id => user_id).first
    if user.nil?
      return {}
    end
    h = user.entities.order("updated_at DESC").each do |attr|
      #entity_hash <<  {:name => attr.entity_name,:id => attr.id, :image => attr.entity_image}
      entity_array << format_entity(attr)
    end

    if !sort_order.blank?  and sort_order == 1
      entity_array = entity_array.sort {|x, y| x[:name] <=> y[:name] }
    end
    Rails.logger.debug("[MODEL] [User] [get_user_entities] leaving ")
    entity_array


  end

  #INPUT user_id => 123
  #sort_order => 1 (lexicographical) or  2 (based on updated)
  #OUTPUT array of :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
  #                                                      OR
  #                 :type => 2, :name => "John's home"]
  #                                   OR
  #                                 {} if invalid user

  def get_user_locations( user_id, sort_order)

    Rails.logger.debug("[MODEL] [User] [get_user_locations] entering ")

    lh = []
    user = User.where(:id => user_id).first
    if user.nil?
      return {}
    end

    h = user.locations.order("updated_at DESC").each do |attr|
      l = format_location(attr)
#      l[:id] = attr.id
      lh <<  l
    end

    if !sort_order.blank?  and sort_order == 1
      lh = lh.sort {|x, y| x[:name] <=> y[:name] }
    end
    Rails.logger.debug("[MODEL] [User] [get_user_locations] leaving ")
    lh

    end

  #always current_user's id (logged in)
  #INPUT
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #OUTPUT array of {:id => 123, :name => "samarth" , :image => "images/234"}
  def get_related_friends(params)

    Rails.logger.debug("[MODEL] [User] [get_related_friends] entering ")
    friend_objs = {}

    users = get_followings

    if users.blank?
      Rails.logger.debug("[MODEL] [User] [get_related_friends] No User followings ")
      return {}
    end

    users.each do |attr|
      friend_objs[attr.id] = attr
    end

    h = {}
    h = process_filter(params[:filter])

    h[:user_id] = friend_objs.keys
    if !h[:entity_id].blank?

      h = pq_hub_filter(h)
      h = Hub.where(h).group(:user_id).order("MAX(updated_at) DESC").count

    else

      h[:status] = AppConstants.status_public
      h[:meta_activity] = false

      h = pq_activity_filter(h)
      h = Activity.where(h).group(:author_id).order("MAX(updated_at) DESC").count
    end


    friends = []
    h.each do |k,v|
      friends << {:id => friend_objs[k].id, :name => friend_objs[k].full_name,
                   :image => friend_objs[k].photo_small_url}
    end
    Rails.logger.debug("[MODEL] [User] [get_related_friends] leaving ")
    friends

  end

  #user_id => 123
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
  ##             OR 4(AppConstants.page_state_public)
  #returns array of {:id => 123, :name => "pizza" , :image => "entity/234"}
  def get_related_entities(params)

    Rails.logger.debug("[MODEL] [User] [get_related_entities] entering ")
    h = {}

    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_related_entities] Leaving => Blank has returned by process_filter => #{params}")
      return {}
    end

    h = pq_hub_filter(h)

    h = Hub.where(h).group(:entity_id).limit(AppConstants.max_number_of_activities).order("MAX(updated_at) DESC").count

    e = Entity.where(:id => h.keys).order("updated_at DESC").all

    entity_array = []

    e.each do |attr|
      #entity_array << {:id => k[0], :name => k[1], :image  =>  k[2]}
      entity_array << format_entity(attr)
    end
    Rails.logger.debug("[MODEL] [User] [get_related_entities] leaving ")
    entity_array

  end

  #INPUT
  #user_id => 123
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
  ##             OR 4(AppConstants.page_state_public)
  #:updated_at =>  nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT array of :id => 1234, :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :id => 1234, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
  #                 ,:city => "new york", :country => "usa"
  #                                                      OR
  #                 :id => 1234, :type => 2, :name => "John's home"
  def get_related_locations(params)

    Rails.logger.debug("[MODEL] [User] [get_related_locations] entering ")
    h = {}

    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_related_locations] Leaving => Blank has returned by process_filter => #{params}")
      return {}
    end

    lh = []

    if !h[:entity_id].blank?
      h = pq_hub_filter(h)
      h = Hub.where(h).group(:location_id).limit(AppConstants.max_number_of_activities).order("MAX(updated_at) DESC").count
    else
      h[:status] = AppConstants.status_public
      h[:meta_activity] = false

      h = pq_activity_filter(h)
      h = Activity.where(h).group(:base_location_id).limit(AppConstants.max_number_of_activities).order("MAX(updated_at) DESC").count
    end

    Location.where(:id => h.keys).order("updated_at DESC").all.each do |attr|
      l = format_location(attr)
      #l[:id] = attr.id
      lh <<  l
    end
    Rails.logger.debug("[MODEL] [User] [get_related_locations] leaving ")
    lh

  end


  #INPUT => AN array of activity_ids for which enriched is false
  def get_enriched_activities(activity_ids)
    Rails.logger.debug("[MODEL] [User] [get_enriched_activities] entering ")
    en = []

    Activity.includes(:author, :base_location).where(:id => activity_ids, :enriched => true).all.each do |attr|
      a = format_activity(attr)
      en << a
    end

    puts en
    Rails.logger.debug("[MODEL] [User] [get_enriched_activities] leaving ")
    en

  end

  #INPUT
  #:filter => {:word_id => 123,
  #            :source_name => "actwitty" or "twitter" or "dropbox" or "facebook" etc -CHECK constants,yml(SOURCE_NAME)
  #            :location_id => 789, :entity_id => 234 }
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT
  # See get_stream output
  def get_draft_activity(params)

    Rails.logger.debug("[MODEL] [USER] [get_draft_activity] entering")

    h = process_filter(params[:filter])

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h[:status] =  AppConstants.status_saved

    h[:meta_activity] = false

    h[:user_id] = self.id

    h = pq_activity_filter(h)

    activity = Activity.where(h).group(:id).order("MAX(updated_at) DESC").count

    array = get_all_activity(activity.keys)

    Rails.logger.debug("[MODEL] [User] [get_draft_activity] leaving ")

    array

  end


  #Removes all occurrences of an entity from an activity
  #INPUT => activity_id => 123, entity_id => 234
  #OUTPUT => Activity Blob
  def remove_entity_from_activity(activity_id, entity_id)
    Rails.logger.debug("[MODEL] [User] [remove_entity_from_activity] entering ")

    activity = Activity.where(:id => activity_id).first

    if !activity.activity_text.blank?
       text = unlink_an_entity(activity.activity_text,  entity_id)
       Activity.update_all({:activity_text=> text},{:id => activity_id})
    else
      Rails.logger.debug("[MODEL] [User] [remove_entity_from_activity] activity_text blank => LEAVING")
      activity = format_activity(activity)
      return activity
    end

    #Destroy Hub entries for that
    Hub.destroy_all(:activity_id => activity_id, :entity_id => entity_id)

    #Reset Summary for entity id
    if !activity.summary_id.nil?

      s = Summary.where(:id => activity.summary_id).first

      #Recreate Entity Array for given summary
      s.entity_array = []
      a = Hub.where(:summary_id => activity.summary_id, :entity_id.not_eq => nil).group(:entity_id).
              limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(created_at) DESC").count

      s.entity_array = a.keys if !a.blank?

      s.update_attributes(:entity_array => s.entity_array)
      #Summary.update_all({:entity_array => [s.entity_array]}, {:id => activity.summary_id})
    end
    s = Summary.where(:id => activity.summary_id).first

    activity = format_activity(activity)

    Rails.logger.debug("[MODEL] [User] [remove_entity_from_activity] leaving")
    activity
  rescue => e
    Rails.logger.error("[MODEL] [User] [remove_entity_from_activity] [rescue] => failed => #{e.message}")
    {}
  end

  # INPUT
  #    :word => activity word or phrase in activity box  [MANDATORY]
  #    :text =>   ""entity box + @@ + location box" or nil [OPTIONAL]
  #    :location => {
  #                  :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"
  #                  :geo_city => "bangalore", :geo_country => "india"}
  #                                      OR
  #                  :web_location =>{:web_location_url => "GOOGLE.com", :web_location_title => "hello"}
  #                                      OR
  #                  :unresolved_location =>{:unresolved_location_name => "xyxzw"}
  #                                      OR
  #                                     nil
  #                 } [OPTIONAL]
  #
  #    :documents => [{:caption => "abcd", :thumb_url => "https://s3.amazonaws.com/thumb_xyz.jpg"
  #                             :url => "https://s3.amazonaws.com/xyz.jpg" } ]#caption and thumb_url is optional in document
  #                  [OPTIONAL]
  #
  #    :campaign_types => 1 to 7  #  Need to set by client. At present each bit represent on campaign type.
  #                         bit 0 => like, bit 1=>support,bit 2=> :join  #defualt is 1 ( like).
  #                        Check CAMPAIGN_TYPES in constant.yml
  #                        [MANDATORY]
  #
  #    :status => 0 or 1   # 0 => saved, 1 => public share, #default => 1
  #                        #Need to set by client.
  #                        Check STATUS in constant.yml
  #                        [MANDATORY]
  #
  #    :source_name =>  "actwitty" or "twitter", or "facebook" or "gplus" or "dropbox" or "tumblr" or "posterous",
  #                      or custom email or mobile number #defualt is actwitty. Need to set by client.
  #                      Check SOURCE_NAME in constant.yml
  #                      [MANDATORY]
  #
  #    :sub_title => "hello sudha baby" or nil. Need to set by client.
  #                      [OPTIONAL]
  #
  #    :enrich => true (if want to enrich with entities ELSE false => make this when parent is true -- in our case )
  #                     [MANDATORY]
  #    :tags => [{:tag => "jump"}, {:tag => "india"}]
  #    :summary_category => "animals"  #as defined categories.yml   [OPTIONAL  - But always first time]
  #
  # OUTPUT => {:post=>{
  #              :text=>"pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
  #              :word=>{:id=>836, :name=>"eating"},
  #              :user=>{:id=>661, :full_name=>"lemony1 lime1",:photo=>"images/id_1"},
  #              :id=>1356,
  #              :time=>Thu, 14 Jul 2011 05:42:20 UTC +00:00},
  #              :enriched=>false,
  #              :campaign_types => 1 to 7 or nil #( as set by client) at present each bit represent on campaign type. bit 0 => like, bit 1=>support,bit 2=> :join
  #              :sub_title => "hello sudha baby" or nil
  #              :source_name => "actwitty"
  #              :source_msg_id => "232323232"
  #              :status => 0 or 1 or 2 ( as set by client)
  #              :location=>{:type=>2, :lat=>#<BigDecimal:62b1fc8,'0.2345E2',18(18)>, :long=>#<BigDecimal:62b1de8,'0.4545E2',18(18)>,
  #                       :name=>"marathalli", :id=>315, :city => "bangalore", :country => "India"}
  #             }

  def create_activity(params={})

    Rails.logger.debug("[MODEL] [User] [create_activity] entering ")

    params[:activity]= params[:word]
    params[:author_id] = self.id
    params[:meta_activity] = false

    obj = Activity.create_activity(params)
    if obj.blank?
      Rails.logger.error("[MODEL] [User] [create_activity] [ERROR] returning empty json ")
      return {}
    end
    a = format_activity(obj)
    puts a

    Rails.logger.debug("[MODEL] [User] [create_activity] leaving ")
    a
  end

  #INPUT
  #activity_id => 123
  def remove_activity(activity_id)

    Rails.logger.debug("[MODEL] [USER] [remove_activity] entering ")

    a = Activity.where(:id => activity_id, :author_id => self.id).first
    if a.blank?
      Rails.logger.debug("[MODEL] [User] [remove_activity] returning empty json ")
      return {}
    end
    a.destroy
    Rails.logger.debug("[MODEL] [User] [remove_activity] leaving ")
    a.attributes
  end

  #INPUT { :activity_id => 123,
  #        :status => 1
  #      }
  #OUTOUT => Same as create_activity
  ##COMMENT => Changes state from saved to publish or private state. Dont use this api to change from
  ##           private to public or vice versa .. its only from saved to public state as it destroys
  ##           the previous activity and re-creates the new one.
  ###          SAVED ACTIVITY CANT NOT be REVERTED back to PUBLISHED OR PRIVATE
  #TODO fix it
  def publish_activity(params)
    puts params[:update]
    Rails.logger.debug("[MODEL] [USER] [publish_activity] entering")

    a = remove_activity(params[:activity_id])

    if a.blank?
      Rails.logger.debug("[MODEL] [User] [publish_activity]  returning empty json ")
      return {}
    end

    params.delete(:activity_id)
    activity = create_activity(params)

    Rails.logger.debug("[MODEL] [USER] [publish_activity] leaving")
    activity

  end

  #INPUT { :activity_id => 123,
  #        REST ALL SAME PARAMETER AS create_activity
  #      }
  #OUTOUT => Same as create_activity
  ##COMMENT => It is used for normal edits of activities. State change can also happen BUT only from PUBLIC to
  ##           PRIVATE and VICE VERSA and NOT FROM SAVED to PUBLIC/PRIVATE
  ###          SAVED ACTIVITY CANT NOT be REVERTED back to PUBLISHED OR PRIVATE
  def update_activity(params)

    Rails.logger.debug("[MODEL] [User] [update_activity] entering ")

    a = Activity.where(:id => params[:activity_id]).first


    #false activity
    if a.blank?
      Rails.logger.debug("[MODEL] [User] [update_activity] [ERROR] returning empty json ")
      return {}
    end

    #store summary_id to see if summary id is not changed in update
    prev_summary_id = a.summary_id

    #delete existing documents which are not in input params
    url = []

    #collect params docs in array
    unless params[:documents].blank?
      params[:documents].each do |attr|
        url << attr[:url]
      end
    end

    #remove the existing activity docs if input params docs is blank
    destroy_ids = []
    delete_ids = []
    if url.blank?
       a.documents.clear if a.documents.size > 0
    else
      a.documents.each do |attr|
        url.include?(attr.url) ? delete_ids << attr.id : destroy_ids << attr.id
      end
      Document.destroy_all(:id => destroy_ids) if !destroy_ids.blank?
      Document.delete_all(:id => delete_ids) if !delete_ids.blank?
    end

    #delete existing tags
    a.tags.clear if a.tags.size > 0

    #delete related hubs
    a.hubs.clear

    #params.delete(:activity_id)
    params[:update] = true

    a = create_activity(params)

    #store summary_id to see if summary id is not changed in update
    if a[:post][:summary_id] != prev_summary_id

      #update Social counter with new summary_id
      if !a[:post][:social_counters].blank?
        SocialCounter.update_all({:summary_id => a[:post][:summary_id]},{:summary_id => prev_summary_id,
                                                                        :activity_id => a[:post][:id]})

        #Recreate Social Counter Array for given summary
        s = Summary.where(:id => a[:post][:summary_id]).first
        s.social_counters_array = []
        SocialCounter.where(:summary_id =>a[:post][:summary_id]).group(:source_name, :action).count.each do |k,v|
          s.social_counters_array << {:source_name => k[0], :action => k[1], :count => v}
        end
        s.update_attributes(s.attributes)
      end

    end

    #Now rebuild the older summary. New summary will be build during create activity.
    #Only we have social counters of old summary need to migrate to new one.. this is done in upper block
    Summary.reset_counters( prev_summary_id, :activities)
    s = Summary.where(:id => prev_summary_id).first
    if s.activities.size == 0
      s.destroy
    else
      s.rebuild_a_summary
    end


    Rails.logger.debug("[MODEL] [User] [update_activity] leaving ")
    a
  end

  #INPUT = Array of activity ids
  #OUTPUT =   See get_stream output
  def get_all_activity(activity_ids)

    Rails.logger.debug("[MODEL] [User] [get_all_activity] entering ")
    array = []
    index = 0
    hash = {}

    Activity.includes(:author, :base_location).where(:id => activity_ids).order("updated_at DESC").all.each do |attr|

      array << format_activity(attr)
      array[index][:comments] = {:count => attr.comments.size, :array => [] }
      array[index][:documents]= {:count => attr.documents.size, :array => []}
      array[index][:tags]=      {:count => attr.tags.size, :array => []}
      array[index][:campaigns]= []
      hash[attr.id] = index
      index = index + 1
    end

    #Commenting this whole blob. As per New UX only count is needed
#    Comment.includes(:author).where(:activity_id => activity_ids).all.each do |attr|
#       h = format_comment(attr)
#       array[hash[attr.activity_id]][:comments][:array] << h[:comment]
#    end

    Document.where(:activity_id => activity_ids).all.each do |attr|
       h = format_document(attr)
       array[hash[attr.activity_id]][:documents][:array] << h[:document]
    end

    Tag.where(:activity_id => activity_ids).all.each do |attr|
       h = format_tag(attr)
       array[hash[attr.activity_id]][:tags][:array] << h[:tag]
    end

    campaign_hash = {}
    temp_hash = {}
    index = 0
    #Get all the campaigns grouped for those activity
    Campaign.where(:activity_id => activity_ids).group(:activity_id, :name).count.each do |k,v|

       h = {:name => k[1], :count => v , :user => false}
       campaign_hash[k[0]].nil? ? campaign_hash[k[0]] = [h] : campaign_hash[k[0]] << h
       temp_hash[{:id => k[0], :name => k[1]}] = campaign_hash[k[0]].count -1

    end

    #Get all the campaigns grouped for those activity by current user
    #Set user_id if user has acted on  campaign
    Campaign.where(:activity_id => activity_ids, :author_id => self.id).group(:activity_id, :name).count.
        each do |k,v|
        if !campaign_hash[k[0]].nil?
          campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user] =  true
          campaign_hash[k[0]][temp_hash[{:id => k[0], :name => k[1]}]][:user_id] =  self.id
       end
    end


    campaign_hash.each do |k,v|
      v.each do |entry|
       array[hash[k]][:campaigns] << entry
      end
    end

    Rails.logger.debug("[MODEL] [User] [get_all_activity] leaving")
    array
  end


  #COMMENT - Only returns public post which has summary
  #INPUT
  #:user_id => 123
  #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
  ##             OR 4(AppConstants.page_state_public)
  #:filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT
  #[
  # {
  # :post=>
  #  {
  #   :id=>11, :user=>{:id=>5, :full_name=>"lemony1 lime1", :photo=>"images/id_1"},
  #   :word=>{:id=>10, :name=>"eating"}, :time=>Sat, 30 Jul 2011 21:41:56 UTC +00:00,
  #   :text=>"<a href=# value=11 class=js_activity_entity>pizza</a>  with <a href=# value=5 class=js_activity_mention>Alok Srivastava</a>",
  #   :enriched=>true, :summary_id=>9, :sub_title=>nil, :source_name=>"actwitty", :status=>1, :campaign_types=>1,:source_msg_id => "12233",
  #  },
  # :location=>
  #  {
  #   :type=>2, :lat=>#<BigDecimal:9de78e0,'0.2345E2',18(18)>, :long=>#<BigDecimal:9de77c8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>8
  #   ,:city => "bangalore", :country => "india"
  #  },
  #  :comments=>
  #  {
  #   :count=>5, :array=>[]
  #  },
  #
  # #COMMENT => Tag type check in constants,yml #TAG TYPE
  # :tags =>
  #  {
  #   :count => 3,
  #   array => [{:id => 1, :name => "maradona", :type => 1, :ty :source_name=>"actwitty",  :status=>1},
  #             {:id => 3, :name => "sachin tendulkar", :type => 2, :ty :source_name=>"actwitty",  :status=>1}
  #             {:id => 2, :name => "kapil dev", :type => 3, :source_name=>"actwitty",  :status=>1}
  #  }
  #
  #
  ## COMMENT - In documents these fields are added and they will be returned too in streams
  ## COMMENT - :caption=> "abcds", :source_name=>"actwitty", :status=>1, :uploaded=>true
  ## COMMENT - uploaded field tells that document is uploaded doc or mentioned document. It is boolean
  ## COMMENT - category tell whether its image/video/audio/application  application represents generic documents and other types
  #
  # :documents=>
  #  {
  #   :count=>2,
  #   :array=>[
  #           {:id=>1, :name=>"xyz.jpg",:thumb_url => "https://s3.amazonaws.com/xyz_thumb.jpg", :url=>"https://s3.amazonaws.com/xyz.jpg",
  #                               :caption=>nil, :source_name=>"actwitty",  :status=>1, :uploaded=>true, :category => "image"},
  #           {:id=>2, :name=>"abc.jpg",:thumb_url => nil, :url=>"https://s3.amazonaws.com/abc.jpg", :caption=>nil, :source_name=>"actwitty",
  #                                                                    :status=>1, :uploaded=>true, :category => "image"}
  #           ]
  #  },
  # :campaigns=>
  #     [{:name=>"support", :count=>1, :user=>true, :user_id=>5}, {:name=>"like", :count=>2, :user=>false}]
  #}
  #]
  def get_stream(params ={})

    Rails.logger.debug("[MODEL] [USER] [get_stream] entering")

    stream = {}
    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_stream] Leaving => Blank has returned by process_filter => #{params.inspect}")
      return {}
    end

    #use HUB only if entity filter is there
    if !h[:entity_id].blank?

      # need to check this anyway  - For time being
      # we have to delete hub
      h = pq_hub_filter(h)
      Rails.logger.debug("[MODEL] [USER] [get_stream] => Hub/Entity based filtering => #{h.inspect}")
      activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

    else

      h[:status] =  AppConstants.status_public

      h[:meta_activity] = false

      h = pq_activity_filter(h)

      Rails.logger.debug("[MODEL] [USER] [get_stream] => Activity based filtering => #{h.inspect}")

      #show only public post.. Need to take care private and shared post
      activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count
    end

    array = get_all_activity(activity.keys)

    stream[:stream] = array

    if !h[:activity_word_id].blank?
        if params[:page_type] == AppConstants.page_state_user
           s = Summary.where(:user_id => params[:user_id],:activity_word_id => h[:activity_word_id]).first
           stream[:theme_data] = s.theme_data
        end
    end

    Rails.logger.debug("[MODEL] [USER] [get_stream] leaving")
    stream
  end


  #INPUT
  #user_id => 123 #If same as current use then mix streams with friends other wise only user
  #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
  ##             OR 4(AppConstants.page_state_public)
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT
  #[
  # {:id=>24,
  #
  # :word=>{:word_id=>44, :name=>"eating"},
  #
  # :time=>Thu, 21 Jul 2011 14:44:26 UTC +00:00,
  #
  # :user=>{:id=>39, :full_name=>"lemony3 lime3", :photo=>"images/id_3"}, :count=>1, :locations=>[],
  #
  # :activity_count => 23, :document_count =>12, :tag_count => 34,
  #
  # :documents=>[{:id=>30, :name=>"ddd.jpg", :url=>"https://s3.amazonaws.com/ddd.jpg",
  #           :thumb_url=>"https://s3.amazonaws.com/ddd_thumb.jpg", :caption=>nil, :source_name=>"actwitty",
  #            :status=>1, :uploaded=>true, :category => "image"}]
  #
  # :tags => [{:id => 1, :name => "maradona", :type => 1, :ty :source_name=>"actwitty",  :status=>1}]
  #
  # :entities=>[{:id=>24, :name=>"rahul dravid", :image=>"/m/02cb7_j"}],
  #
  # :recent_text=>["burger at <a href=/entities/24 class=\"activity_entity\">rahul dravid</a>"],
  #
  # :friends=>[{:id=>38, :full_name=>"lemony2 lime2", :photo=>"images/id_2"}]
  # }
  #]
  require "social_fetch/social_fetch"

  def get_summary(params)

    Rails.logger.debug("[MODEL] [USER] [get_summary] entering")

    #Below two lines are for testing
    #Activity.destroy_all(:author_id => self.id)
    SocialAggregator.create_social_data({:user_id => self.id, :provider => "facebook"})

    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_summary] Leaving => Blank has returned by process_filter => #{params.inspect}")
      return {}
    end

    documents= {}
    tags = {}
    activities = {}
    locations = {}
    entities = {}
    friends ={}
    subscribed = {}

    summaries = []
    index = 0

    h[:id] = h[:summary_id] if !h[:summary_id].blank?
    h.delete(:summary_id)
    user = h[:user_id]

    h = pq_summary_filter(h)

    summary = Summary.includes(:user).where(h).limit(AppConstants.max_number_of_summmary).order("updated_at DESC").
        all.each do |attr|

        summaries[index] ={:id => attr.id,
                             :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                             :time => attr.updated_at,
                             :user => {:id => attr.user_id, :full_name => attr.user.full_name,
                                       :photo => attr.user.photo_small_url, :user_type => attr.user.user_type}, #user type is added for ADMIN USER
                             :activity_count => attr.activities.size,
                             :document_count => attr.documents.size, :tag_count => attr.tags.size,
                             :social_counters => attr.social_counters_array, :theme_data => attr.theme_data,
                             :category => attr.category_data,
                             :locations => [], :documents => [], :tags => [],:entities => [], :recent_text => [], :friends => []
                              }
        attr.location_array.each {|idx| locations[idx].nil? ? locations[idx] = [index] : locations[idx] <<  index }
        attr.document_array.each {|idx| documents[idx].nil? ? documents[idx] = [index] : documents[idx] <<  index }
        attr.tag_array.each       {|idx| tags[idx].nil? ? tags[idx] = [index] : tags[idx] <<  index }
        attr.entity_array.each {|idx| entities[idx].nil? ? entities[idx] = [index] : entities[idx] <<  index }
        attr.activity_array.each {|idx| activities[idx].nil? ? activities[idx] = [index] : activities[idx] <<  index }

        subscribed[attr.id]  = index

        #creates the hash mapping words to respective index
        friends[attr.activity_word_id].nil? ? friends[attr.activity_word_id] = [index] : friends[attr.activity_word_id] << index
        index = index + 1
      end

    if !documents.keys.blank?
      Document.where(:id => documents.keys).order("updated_at DESC").all.each do|attr|
        h = format_document(attr)
        documents[attr.id].each do |idx|
          summaries[idx][:documents] << h[:document]
        end
      end
      documents = {}
    end

    if !tags.keys.blank?
      Tag.where(:id => tags.keys).order("updated_at DESC").all.each do|attr|
        h = format_tag(attr)
        tags[attr.id].each do |idx|
          summaries[idx][:tags] << h[:tag]
        end
      end
      tags = {}
    end

    if !locations.keys.blank?
      Location.where(:id => locations.keys).order("updated_at DESC").all.each do|attr|
        h = format_location(attr)
        #h[:id] = attr.id
        locations[attr.id].each do |idx|
          summaries[idx][:locations] << h
        end
      end
      locations={}
    end

    if !entities.keys.blank?
      Entity.where(:id => entities.keys).order("updated_at DESC").all.each do|attr|
        entities[attr.id].each do |idx|
          #summaries[idx][:entities] << {:id => attr.id, :name => attr.entity_name, :image =>  attr.entity_image }
          summaries[idx][:entities] << format_entity(attr)
        end
      end
      entities ={}
    end

    if !activities.keys.blank?
      Activity.where(:id => activities.keys).order("updated_at DESC").all.each do|attr|
        activities[attr.id].each do |idx|
          summaries[idx][:recent_text] << { :text => attr.activity_text, :time => attr.updated_at.utc}
        end
      end
      activities = {}
    end

    # Mark Summaries which user has not subscribed. This will be only applicable if page_state == all or public
    #TODO => Public summary marking is blocked as of now

    if (params[:user_id] != self.id)||(params[:page_type] == AppConstants.page_state_all)

      SummarySubscribe.where(:summary_id => subscribed.keys, :subscriber_id => self.id ).all.each do |attr|
        summaries[subscribed[attr.summary_id]][:subscribed] = true
      end

    end
    subscribed = {}

    #FETCH RELATED FRIEND

    #friends will only be fetched current use == visited user
    if params[:page_type] == AppConstants.page_state_all
      #user's friends are already populated in user ARRAY
      Rails.logger.debug("[MODEL] [USER] [get_summary] getting friends related friends - OTHERS MODE" )
      user.delete(self.id) if user.blank?
    else
      Rails.logger.debug("[MODEL] [USER] [get_summary] getting friends related friends - ME MODE" )
      #other wise get the user's followings and populate the related followings
      user = Contact.select("friend_id").where(:user_id => self.id).map(&:friend_id)
    end

    if (!user.blank?) && (!friends.keys.blank?)
      h  = {}
      h[:user_id] = user
      h[:activity_word_id] = friends.keys
      h = pq_summary_filter(h)

      Summary.includes(:user).where(h).group(:user_id, :activity_word_id ).count.each do |k,v|
        activities[k[0]] = k[1]
      end

      Rails.logger.debug("[MODEL] [USER] [get_summary] getting friends related friends - #{activities.keys.inspect} \n #{friends.keys.inspect}" )
      if !activities.keys.blank?
        User.where(:id => activities.keys).all.each do |attr|
          # activities[attr.id] => activity_word_id
          friends[activities[attr.id]].each do |idx|

            #dont show a friend in his own summary as related friend
            if summaries[idx][:user][:id] != attr.id

              if summaries[idx][:friends].size < AppConstants.max_number_of_a_type_in_summmary
                summaries[idx][:friends] << {:id => attr.id , :full_name => attr.full_name, :photo => attr.photo_small_url}
              end

            end

          end

        end
      end
    end

    Rails.logger.debug("[MODEL] [USER] [get_summary] leaving")
    #FETCHING RELATED FRIEND -- DONE
    summaries

  end


  #INPUT => {:word_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT => { :id => 12435, :name => "eating" ,
  #:stream => [{:post => .... }]# same as stream
  ##COMMENT => If updated_at parameter is sent, it means client already has entity info so, only stream part will be
  #sent.

  def get_activity_stream(params)
    h = {}

    Rails.logger.debug("[MODEL] [USER] [get_activity_stream] entering")

    a = ActivityWord.where(:id => params[:word_id]).first
    if a.blank?
      Rails.logger.debug("[MODEL] [USER] [get_activity_stream] returning blank JSON")
      return {}
    end

    hash ={:id => params[:word_id], :name => a.word_name }

    h[:activity_word_id] =  params[:word_id]

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h[:status]   = AppConstants.status_public

    h = pq_activity_filter(h)

    activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count

    hash[:stream] = get_all_activity(activity.keys)
    Rails.logger.debug("[MODEL] [USER] [get_activity_stream] leaving")
    hash
  end



  #INPUT => {:entity_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT => { :id => 12435, :image => "http://freebase.com",:description => "http://freebase.com"
  #:stream => [{:post => .... }]# same as stream
  ##COMMENT => If updated_at parameter is sent, it means client already has entity info so, only stream part will be
  #sent.
  ##COMMENT=> Wikipedia description is optional. Still need to get the proper url for description even for
  # freebase as new apis are changed
  def get_entity_stream(params)
    h = {}

    Rails.logger.debug("[MODEL] [USER] [get_entity_stream] entering")

    e = Entity.where(:id => params[:entity_id]).first
    if e.blank?
      Rails.logger.debug("[MODEL] [USER] [get_entity_stream] returning blank JSON")
      return {}
    end

    hash = format_entity(e)

    h[:entity_id] =  params[:entity_id]

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h = pq_hub_filter(h)

    activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

    hash[:stream] = get_all_activity(activity.keys)
    Rails.logger.debug("[MODEL] [USER] [get_entity_stream] leaving")
    hash

  end



  #INPUT => {:location_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT => { :id => 1234, :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :id => 1234, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york", :city => "New York",
  #                 :country => "bangalore"
  #                                                      OR
  #                :id => 1234, :type => 2, :name => "John's home" ,
  #:stream => [{:post => .... }]# same as stream
  ##COMMENT => If updated_at parameter is sent, it means client already has entity info so, only stream part will be
  #sent.
  ##COMMENT=> Near location search is pending
  def get_location_stream(params)

    h = {}
    Rails.logger.debug("[MODEL] [USER] [get_location_stream] entering")


    l = Location.where(:id => params[:location_id]).first
    if l.blank?
      Rails.logger.debug("[MODEL] [USER] [get_location_stream] returning blank JSON")
      return {}
    end

    hash = format_location(l)
    #hash[:id] = l.id

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h[:status]   = AppConstants.status_public

    h[:meta_activity] = false

    h[:location_id] = l.id

    h = pq_activity_filter(h)

    activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count

    hash[:stream] = get_all_activity(activity.keys)
    Rails.logger.debug("[MODEL] [USER] [get_location_stream] leaving")
    hash
  end
  #COMMENT => To Create a campaign
  #INPUT =>
  # :name => "like"
  # :value => any integer index .. for example like =1 super-like  = 2 etc . AT PRESENT not USED THOUGH
  # :activity_id => 234
  #                OR
  # :entity_id => 123
  #                OR
  # :location_id => 123}
  #                 OR
  # :comment_id => 234}
  #
  #OUTPUT => { :name => "like", :count => 23, :user => true, :user_id => 355}  #user_id is only present if :user => true
  #                                    OR
  #          {:name => "support", :count => 23, :user => false}
  def create_campaign(params = {})

    Rails.logger.debug("[MODEL] [USER] [create_campaign] entering")

    params[:author_id] = self.id

    obj = Campaign.create_campaign(params)
    if obj.blank?
      Rails.logger.debug("[MODEL] [USER] [create_campaign] leaving => returning blank json as campaign object is blank")
      return {}
    end
    params.except!(:value,:author_id, :father_id )

    h= Campaign.where( params).group(:name).count

    ch = {}
    ch[:count] = h.values[0].nil? ? 0 : h.values[0]

    ch[:name] = params[:name]

    ch[:user_id] = self.id
    ch[:user] = true

    puts ch
    Rails.logger.debug("[MODEL] [USER] [create_campaign] leaving")

    ch
  end

  #COMMENT => To Remove a campaign. Only for the current_user. Output is remaining count
  #INPUT => {
  #         :activity_id => 1234 # OR :entity_id = 123 OR :location_id => 123 OR :comment_id =>  234 OR :document_id => 2345
  #         :user_id => 234,
  #         :name => "like"
  #         }
  #OUTPUT => { :name => "like", :count => 23, :user => false}  #user will always be false as user can only delete his campaign
                                                               #which is unique in scope of activity and campaign name
  def remove_campaign(params)

    Rails.logger.debug("[MODEL] [USER] [remove_campaign] entering")

    params[:author_id] = params[:user_id]
    params.delete(:user_id)

    h = pq_campaign_filter(params)
    campaign = Campaign.where(h).first

    if campaign.nil?
      Rails.logger.debug("[MODEL] [USER] [remove_campaign] leaving => returning blank json")
      return {}
    end

    hash = campaign.attributes.except("value", "author_id", "father_id", "id", "created_at", "updated_at")

    campaign.father.destroy

    #group by campaign name for remaining count
    h= Campaign.where(hash).group(:name).count

    ch = {}

    #user will always be false as user can only delete his campaign
    #which is unique in scope of activity and campaign name
    ch[:user] = false
    ch[:count] = h.values[0].nil? ? 0 : h.values[0]
    ch[:name] = hash["name"]

    puts ch
    Rails.logger.debug("[MODEL] [USER] [remove_campaign] leaving")

    ch
  end

  #COMMENT => All types of campaigns of an activity
  #INPUT =>
  # :activity_id => 234
  #                OR
  # :entity_id = 123
  #                OR
  # :location_id => 123
  #                 OR
  # :comment_id =>  234
  #                  OR
  # :document_id => 2345}
  #OUTPUT => [
  #           { :name => "like", :count => 23, :user => true, :user_id => 355},  #user_id is only present if :user => true
  #           {:name => "support", :count => 23, :user => false}
  #          ]

  def get_all_campaign(params = {})

    Rails.logger.debug("[MODEL] [USER] [get_all_campaign] entering")

    hash = {}
    campaign = []
    all_campaigns = Campaign.where(params).group(:name).count

    params[:author_id] = self.id

    h = pq_campaign_filter(params)
    user_campaigns = Campaign.where(h).group(:name).count

    all_campaigns.each do |k,v|
      user_campaigns.has_key?(k) ? user = true : user = false
      hash = {:name => k, :count => v, :user => user }
      hash[:user_id] = self.id if user == true
      campaign << hash
    end

    puts campaign
    Rails.logger.debug("[MODEL] [USER] [get_all_campaign] leaving")

    campaign
  end



  #COMMENT => Get users in a campaign
  #INPUT =>
  # :name =>  "like" # or support or join etc
  # :activity_id => 234
  #                OR
  # :entity_id => 123
  #                OR
  # :location_id => 123
  #                 OR
  # :comment_id =>  234}
  #OUTPUT =>[
  #           { :id => 128, :full_name => "Abc Saxena", :photo => "/images/actwitty/default_user.gif" },
  #           { :id => 129, :full_name => "BBc Saxena", :photo => "/images/actwitty/default_user.gif" }
  #         ]
  def get_users_of_campaign(params)
    Rails.logger.debug("[MODEL] [USER] [get_users_of_campaign] entering")
    user = []
    Campaign.includes(:author).where(params ).order("updated_at DESC").all.each do |attr|
      user << {:id => attr.author.id, :full_name => attr.author.full_name, :photo => attr.author.photo_small_url }
    end
    Rails.logger.debug("[MODEL] [USER] [get_users_of_campaign] leaving")
    user
  end




  #COMMENT => to get a single activity of a user.
  #INPUT => activity_id = 123, :author_id => 234, :text => "helllo"
  #OUTPUT =>  {:comment=>{:id=>173, :user=>{:id=>747, :full_name=>"lemony2 lime2", :photo=>"images/id_2"},
  #                       :text=>"hello ", :time=>Thu, 14 Jul 2011 14:13:29 UTC +00:00}}
  def create_comment(params = {})

    Rails.logger.debug("[MODEL] [USER] [create_comment] entering")
    params[:author_id] = self.id

    obj = Comment.create_comment(params)
    if obj.blank?
      Rails.logger.debug("[MODEL] [USER] [create_comment] returning blank JSON")
      return {}
    end
    a = format_comment(obj)

    Rails.logger.debug("[MODEL] [USER] [create_comment] leaving")
    a

  end



  #COMMENT => to remove comment of current user
  #INPUT => comment_id =. 1234
  #OUTPUT =>  {:activity_id => 2345, :comment_count => 23}
  def remove_comment(comment_id)

    Rails.logger.debug("[MODEL] [USER] [remove_comment] entering")
    comment = Comment.where(:author_id => self.id, :id => comment_id).first

    activity_id = comment.activity_id

    if comment.nil?
      Rails.logger.debug("[MODEL] [USER] [load_all_comment]returning blank JSON")
      return {}
    end

    comment.destroy

    #group by campaign name for remaining count
    h= Comment.where(:activity_id => activity_id).count

    ch = {}
    ch[:activity_id] = activity_id
    ch[:comment_count] = h
    puts ch
    Rails.logger.debug("[MODEL] [USER] [remove_comment] leaving")
    ch
  end




  #INPUT => activity_id => 123
  #OUTPUT =>  [{:comment=>{:id=>173, :user=>{:id=>747, :full_name=>"lemony2 lime2", :photo=>"images/id_2"},
  #                       :text=>"hello ", :time=>Thu, 14 Jul 2011 14:13:29 UTC +00:00}}]
  def load_all_comment(activity_id)

    Rails.logger.debug("[MODEL] [USER] [load_all_comment] entering")

    array = []
    Comment.includes(:author).where(:activity_id => activity_id).each do |attr|
      a = format_comment(attr)
      array << a
    end

    puts array
    Rails.logger.debug("[MODEL] [USER] [load_all_comment] leaving")
    array
  end




  #INPUT => document_id
  #OUTPUT => deleted doc or blank {}
  def remove_document(document_id)

    Rails.logger.debug("[MODEL] [USER] [load_all_comment] entering")

    d = Document.where(:owner_id => self.id, :id => document_id).first

    if d.blank?
      Rails.logger.debug("[MODEL] [USER] [remove_document] returning blank JSON")
      return {}
    end

    d.destroy
    Document.reset_summary(d.summary_id)

    Rails.logger.debug("[MODEL] [USER] [load_all_comment] leaving")
    d
  end



  #COMMENT - Only returns public post which has summary
  #INPUT
  #user_id => 123 #If same as current use then mix streams with friends other wise only user
  #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
  #
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #:category => "image" or "video"

  def get_document_summary(params)

    Rails.logger.debug("[MODEL] [USER] [get_document_summary] entering")
    h = {}
    user = nil

    return {} if (params[:user_id].blank? || params[:category].blank?)

    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_document_summary] Leaving => Blank has returned by process_filter => #{params.inspect}")
      return {}
    end

    doc_hash = {}

    h[:id] = h[:summary_id] if !h[:summary_id].blank?
    h.delete(:summary_id)
    h = pq_summary_filter(h)

    Summary.includes(:user, :activity_word).where(h).order("updated_at DESC").limit(AppConstants.max_number_of_documents_pulled).all.each do |attr|
      if attr.document_array.size > 0
        doc_hash[attr.document_array[0]]= {
            :word => {:id => attr.activity_word_id, :name => attr.activity_name},
            :time => attr.updated_at,
            :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
            :count => attr.documents_count,
            :document => nil
        }
      end
    end

    #doc_hash.keys will give status_public docs as summary does not exist for saved docs
    h = {:id => doc_hash.keys, :category => params[:category]}

    Document.where(h).all.each do |attr|
      h = format_document(attr)
      doc_hash[attr.id][:document] = h[:document]
    end

    #TODO need to get saved docs too
    Rails.logger.debug("[MODEL] [USER] [get_document_summary] leaving")

    #delete those keys in which doc_hash[key][document] is still nil.
    #this is possible as summary does not contain info about about
    doc_hash.each do |k,v|
      doc_hash.delete(k) if doc_hash[k][:document].blank?
    end
    doc_hash.values
  end




  #COMMENT - Only returns public post which has summary
  #INPUT
  #:user_id => 123
  #:page_type => 1(AppConstants.page_state_user) OR 2(AppConstants.page_state_subscribed) OR 3(AppConstants.page_state_all)
  ##             OR 4(AppConstants.page_state_public)
  #:filter => {:word_id => 123,
  #            :source_name => "actwitty" or "twitter" or "dropbox" or "facebook" etc -CHECK constants,yml(SOURCE_NAME)
  #            :entity_id => 235,
  #            :location_id => 789, :entity_id => 234 }
  #:updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #:category => "image" or "video"

  def get_document_stream(params)

    Rails.logger.debug("[MODEL] [USER] [get_document_stream] entering")
    h = {}
    user = nil
    summary = nil

    if params[:category].blank?

      Rails.logger.debug("[MODEL] [USER] [get_document_stream] category cant be blank => return blank json => #{params.inspect}")
      return {}

    end

    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_document_stream] Leaving => Blank has returned by process_filter => #{params.inspect}")
      return {}
    end

    doc_array = []

    if !h[:entity_id].blank?

      Rails.logger.debug("[MODEL] [USER] [get_document_stream] => Hub/Entity based filtering => #{h.inspect}")

      h[:user_id] = user if !user.blank?   #this will be true for page_state_user or page_state_all

      h = pq_hub_filter(h)

      activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

      h = {:activity_id => activity.keys,:category => params[:category] , :status =>  AppConstants.status_public }

    else
     # pq_document_filter will fill owner_id. so commenting these two lines
     # h[:owner_id] = h[:user_id]  if !h[:user_id].blank?   #this will be true for page_state_user or page_state_all
     # h.delete(:user_id)
      h[:category] = params[:category]
      h[:status] =  AppConstants.status_public

    end

    h = pq_document_filter(h)

    Document.includes(:owner, :activity_word).where(h).order("updated_at DESC").
        limit(AppConstants.max_number_of_documents_pulled).all.each do |attr|

      h = format_document(attr)
      doc_array <<  {
                      :word => {:id => attr.activity_word_id, :name => attr.activity_word.word_name},
                      :time => attr.updated_at,
                      :user => {:id => attr.owner_id, :full_name => attr.owner.full_name, :photo => attr.owner.photo_small_url},
                      :document => h[:document]
                    }
    end

    Rails.logger.debug("[MODEL] [USER] [get_document_stream] leaving")
    doc_array
  end



  #INPUT  => {:source_name => "facebook", or ""google" etc
  #           :action => "share" or "like" etc
  #           :author_id => 123 [OPTIONAL]
  #
  #           :activity_id => 123 or nil
  #           :summary_id => 123 or nil
  #                 OR
  #           :location_id => 123 or nil
  #                 OR
  #           :entity_id => 234 or nil
  #                 OR
  #           :document_id => 456 or nil
  #
  #           :desc => "hello" [OPTIONAL]  => for view action, desc should be  "IP=>123.123.123.123, ISP=>abc, location =>bangalore, lat>23.45, long=>45.23"
  #                                           IP is MANDATORY FOR VIEW ACTION
  def create_social_counter(params)
    Rails.logger.debug("[MODEL] [USER] [create_social_counter] entering")
    a = SocialCounter.create_social_counter(params)
    if a.nil?
      return {}
    end
    a = format_social_counter(a)
    Rails.logger.debug("[MODEL] [USER] [create_social_counter] leaving")
    a
  end


  #INPUT
  #           :activity_id => 123 or nil
  #                 OR
  #           :summary_id => 123 or nil
  #                 OR
  #           :location_id => 123 or nil
  #                 OR
  #           :entity_id => 234 or nil
  #                 OR
  #           :document_id => 456 or nil
  #OUTPUT
  #          [{:source_name=>"twitter", :action=>"share", :count=>1}
  #            {:source_name=>"facebook", :action=>"share", :count=>2}]
  def get_social_counter(params)
    Rails.logger.debug("[MODEL] [USER] [get_social_counter] entering")
    a = SocialCounter.get_social_counter(params)
    Rails.logger.debug("[MODEL] [USER] [get_social_counter] leaving")
    a
  end


  #INPUT
  #     :fg_color =>"0xffffff23"  #RGBA
  #     :bg_color =>"0xffffff23"  #RGBA
  #              OR
  #     :document_id => 123
  #     :style => 1 or 2 or 3 # 1=> centered , 2=> tiled, 3 => stretched
  #
  #     :author_id => 123 #MANDATORY
  #     :summary_id => 234 #OPTIONAL
  #     :theme_type => 1 (AppConstants.theme_default) OR 2 (AppConstants.theme_color) OR 3 (AppConstants.theme_document)
  def create_theme(params)
    Rails.logger.debug("[MODEL] [USER] [create_theme] entering")
    params[:theme_type] =  AppConstants.theme_default if params[:theme_type].blank?
    a = Theme.create_theme(params)
    Rails.logger.debug("[MODEL] [USER] [create_theme] leaving")
    a
  end


  #INPUT
  # :summary_id => 123
  #OUTPUT
  # [{ :subscriber_name => "alok",:subscriber_id => 234,:subscriber_photo =>"http://a.com"}]
  def get_summary_subscribers(summary_id)
    Rails.logger.debug("[MODEL] [USER] [get_summary_subscribers] entering")
    a = SummarySubscribe.get_summary_subscribers(summary_id)
    Rails.logger.debug("[MODEL] [USER] [get_summary_subscribers] leaving")
    a
  end


  #INPUT
  #
  #OUTPUT
  # [{:summary_name => "eating", :summary_id => 123, :owner_name => "alok",:owner_id => 234,:owner_photo =>"http://a.com"}]
  def get_subscriber_summary
    Rails.logger.debug("[MODEL] [USER] [get_subscriber_summary] entering")
    a = SummarySubscribe.get_subscriber_summary(self.id)
    Rails.logger.debug("[MODEL] [USER] [get_subscriber_summary] leaving")
    a
  end


  #INPUT
  #{
  #summary_id => 234
  #}
  #OUTPUT
  # count
  def unsubscribe_summary(summary_id)
    params ={}
    Rails.logger.debug("[MODEL] [USER] [unsubscribe_summary] entering")
    params[:subscriber_id] = self.id
    params[:summary_id] = summary_id
    a = SummarySubscribe.unsubscribe_summary(params)
    Rails.logger.debug("[MODEL] [USER] [unsubscribe_summary] leaving")
    a
  end


  #INPUT
  #{
  #summary_id => 234
  #}
  #OUTPUT
  #objects
  def subscribe_summary(summary_id)
    params = {}
    Rails.logger.debug("[MODEL] [USER] [subscribe_summary] entering")
    params[:subscriber_id] = self.id
    params[:summary_id] = summary_id
    a = SummarySubscribe.subscribe_summary(params)
    Rails.logger.debug("[MODEL] [USER] [subscribe_summary] leaving")
    a
  end

  #INPUT => None
  #OUTPUT => Same as get_summary (all public summary)
  def get_recent_public_summary
    array = []
    get_summary({:page_type => AppConstants.page_state_subscribed, :updated_at => Time.now.utc}).each do |attr|
      #ADMIN USER blocking in global display of channels
      array << attr if attr[:user][:user_type].nil? ||  (attr[:user][:user_type] == AppConstants.user_type_regular)
    end
    array
  end

  #Checks if user_id is in followers list of self.user
  def check_if_subscribed(user_id)
    s = SummarySubscribe.where(:subscriber_id => user_id, :owner_id => self.id).first
    return false if s.blank?
    true
  end

  #Alok Adding pusher support
  def push_event_to_pusher(params)
    #Commenting for time being
     #pusher_event(params)
  end
  #Commenting for time being
  #handle_asynchronously :push_event_to_pusher

  #INPUT =>  summary_id => 123, :new_name => "foodie"
  #OUTPUT => SUMMARY ATTRIBUTES
  #{"activities_count"=>3, "activity_array"=>[342, 341, 340], "activity_name"=>"marry", "activity_word_id"=>424,
  #  "created_at"=>Sat, 29 Oct 2011 18:23:56 UTC +00:00, "document_array"=>[776, 775, 774, 773, 772, 771],
  # "documents_count"=>8, "entity_array"=>[], "id"=>158, "location_array"=>[162, 161],
  #"social_counters_array"=>[{:source_name=>"twitter", :action=>"share", :count=>1},
  #{:source_name=>"facebook", :action=>"share", :count=>2}], "tag_array"=>[365, 364, 363, 362, 361, 360],
  #"tags_count"=>6,
  #"theme_data"=>{:fg_color=>"0xffffff00", :bg_color=>"0xffffff00, :document_id=>nil, :url=>nil,:user_id=>407, :summary_id=>158, :theme_type=>1, :time=>2011-10-29 18:23:56 UTC}
  #"category_data" =>  {:id=>43, :name=>"pets and animals", :type=>"/animals", :user_id=>157, :summary_id=>120, :time=>2011-11-08 22:14:24 UTC}
  # "updated_at"=>Sat, 29 Oct 2011 18:23:57 UTC +00:00, "user_id"=>407}
  def update_summary(params)
    Rails.logger.debug("[MODEL] [USER] [update_summary] entering")
    params[:user_id] = self.id
    s = Summary.update_summary(params)
    Rails.logger.debug("[MODEL] [USER] [subscribe_summary] leaving")
    s
  end


  #INPUT => summary_id => 123
  #OUTPUT => {}
  def delete_summary(params)
    Rails.logger.info("[MODEL] [USER] [delete_summary] entering  " + params.to_s)
    params[:user_id] = self.id
    s = Summary.delete_summary(params)
    Rails.logger.info("[MODEL] [SUMMARY] [delete_summary] leaving  " + params.to_s)
    s
  end

  #INPUT => :activity_id => 123, :new_name => "foodie"
  #OUTPUT => updated activity
  #{"activity_name"=>"beating", "activity_text"=>"sachin tendulkar http://twitpic.com/123 http://www.vimeo.com/watch?444 pizza",
  # "activity_word_id"=>75, "author_id"=>57, "base_location_id"=>nil, "blank_text"=>false, "campaign_types"=>2,
  # "comments_count"=>0, "created_at"=>Sat, 29 Oct 2011 20:24:59 UTC +00:00, "documents_count"=>2,
  # "enriched"=>false, "id"=>67, "meta_activity"=>false, "social_counters_array"=>[{:source_name=>"facebook", :action=>"share", :count=>1}],
  #"source_name"=>"actwitty", "status"=>2, "sub_title"=>nil, "summary_id"=>36, "tags_count"=>2, "updated_at"=>Sat, 29 Oct 2011 20:25:00 UTC +00:00}
  def rename_activity_name(params)
    Rails.logger.info("[MODEL] [USER] [rename_activity_name] entering  " + params.to_s)
    params[:user_id] = self.id
    s = Summary.rename_activity_name(params)
    Rails.logger.info("[MODEL] [SUMMARY] [rename_activity_name] leaving  " + params.to_s)
    s
  end

  #INPUT => {:summary_id => 123, :category_id => "sports"}
  def update_summary_category(params)
    Rails.logger.info("[MODEL] [USER] [update_summary_category] entering  " + params.to_s)
    params[:user_id] = self.id
    s = SummaryCategory.update_summary_category(params)
    Rails.logger.info("[MODEL] [SUMMARY] [update_summary_category] leaving  " + params.to_s)
    s
  end

  #COMMENT - Return the most recent analytics SNAPSHOT of summary OR location or entity
  #INPUT => {:summary_id => 123 OR :location_id => 234 OR :entity_id => 234}
  #OUTPUT => {"posts" =>{:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45} #many new services can come this is Exemplary
  #           "comments" => {:total => 34, :actwitty => 20, :facebook => 14 }
  #           "likes" =>{:total => 123, :actwitty => 33, :facebook => 90 }
  #           "actions" =>  {:share => 24, :views => 90}
  #           "demographics" => {:total => 40,:male => 20, :female => 18, :others => 2,
  #                             :age_group => {"18-24" => {:total => 20,:male => 10, :female => 11, :others => 0},
  #                            "35-44" => {:total => 20,:male => 10, :female => 7, :others => 2}}}
  #                            See constants.yml for age_band
  #           "subscribers" => 345
  #           "documents" =>  {"total" => 160, "image" => 24, "video" => 90, "audio" => 46}
  #           "channel_ranks" => 234

  def get_analytics_summary(params)
    Rails.logger.info("[MODEL] [USER] [get_analytics_summary] entering  " + params.inspect)
    object = SummaryRank.get_analytics_summary(params)
    Rails.logger.info("[MODEL] [USER] [get_analytics_summary] leaving  " + params.inspect)
    object
  end

  #COMMENT - Return the 90 days analytics..
  #INPUT => {:summary_id => 123 OR :location_id => 234 OR :entity_id => 234,
  #         :fields => ["posts","likes", "comments"..]}
  #OUTPUT => {"posts" =>[{"11/11/2011"=>{:total => 95, :facebook => 20, :twitter => 30, :actwitty => 45}},..] #many new services can come this is Exemplary
  #           "comments" => [{"11/11/2011"=>{:total => 34, :actwitty => 20, :facebook => 14 }},...]
  #           "likes" => [{"11/11/2011"=>{:total => 123, :actwitty => 33, :facebook => 90 }}..]
  #           "actions" => [{"11/11/2011"=>{:share => 24, :views => 90}},..]
  #           "demographics" =>[{"11/11/2011"=> {:total => 40,:male => 20, :female => 18, :others => 2,
  #                             :age_group => {"18-24" => {:total => 20,:male => 10, :female => 11, :others => 0},
  #                            "35-44" => {:total => 20,:male => 10, :female => 7, :others => 2}}}},..]
  #                            See constants.yml for age_band
  #           "subscribers" => [{"11/11/2011"=>345},..]
  #           "documents" =>  [{"11/11/2011"=>{"total" => 160, "image" => 24, "video" => 90, "audio" => 46}},..]
  #           "channel_ranks" => [{"11/11/2011"=>234},..]

  def get_analytics(params)
    Rails.logger.info("[MODEL] [USER] [get_analytics] entering  " + params.inspect)
    object = SummaryRank.get_analytics(params)
    Rails.logger.info("[MODEL] [USER] [get_analytics] leaving  " + params.inspect)
    object
  end
  # private methods
  private




  def process_filter(filter)


    return {} if filter.nil?

    h = {}

    if !filter[:word_id].blank?
      h[:activity_word_id] = filter[:word_id]
    end
    if !filter[:location_id].blank?
      h[:location_id] = filter[:location_id]
    end
    if !filter[:entity_id].blank?
       h[:entity_id] = filter[:entity_id]
    end
    if !filter[:source_name].blank?
      h[:source_name] = filter[:source_name]
    end
    h
  end

  #If No User is given or No Page_Type is give always PUBLIC data will come
  #For Subscribed Page => Always self user subscription
  #For All page => Always self user followers channel
  #For User page => params[:user_id] is used.
  def process_filter_modified(params)


    h = {}
    user = nil
    summary = nil

    h = process_filter(params[:filter])

    #if no user is given, it means need public to view documents only on filters
    if params[:user_id].blank? || params[:page_type].blank?

      Rails.logger.debug("[MODEL] [USER] [process_filter] page_state = page_state_public as user or page_type is blank => #{params.inspect}")
      params[:page_type] = AppConstants.page_state_public

    end

    #Subscribed Page  => Always with self
    if params[:page_type] == AppConstants.page_state_subscribed
      #only Self can access the subscribed and of its known
      summary =  SummarySubscribe.where(:subscriber_id => self.id).group(:summary_id).count

      if summary.blank?
        Rails.logger.debug("[MODEL] [USER] [process_filter] page state = page_state_subscribed => No Subscriber=>
                             #{params.inspect}")
        return {}
      end

      h[:summary_id] = summary.keys
      Rails.logger.debug("[MODEL] [USER] [process_filter] page state = page_state_subscribed => #{self.inspect}")

    end

    #All Page => Always with self
    if params[:page_type] == AppConstants.page_state_all

##     Commenting as we did not want contact based all data now
       Rails.logger.debug("[MODEL] [USER] [process_filter] page state = page_state_all => #{params.inspect}")
       user = Contact.select("friend_id").where(:user_id => self.id).map(&:friend_id)
       user.blank? ? user = [self.id] : user << self.id
       h[:user_id] = user
 #     Rails.logger.debug("[MODEL] [USER] [process_filter] page state = page_state_all => #{params.inspect}")

       #get all categories of user
       #find users having similar categories - Ideally based on my high ranked channels
       #then If number of user is not enough fall back to more generic categories and then to latest updates
#        category = SummaryCategory.select(:category_type).where(:user_id=> self.id).map(&:category_type)
#        user = SummaryCategory.select(:user_id).where(:user_id.not_eq => self.id,:category_type=> category).map(&:user_id)
#        if user.blank? or user.size < AppConstants.max_number_of_users
#           cat = category_type.split()
#        end
    end

    #USER/ME Page
    if params[:page_type] == AppConstants.page_state_user

       Rails.logger.debug("[MODEL] [USER] [process_filter] page_state = page_state_user => #{params.inspect}")
       h[:user_id] = params[:user_id]

    end

    #DEFAULT IS PUBLIC => IN this page user and summary variables will be nil. So only on filters
    h[:updated_at] = params[:updated_at].to_time.utc  if !params[:updated_at].blank?

    h
  end



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
#  dob                  :date
#  gender               :string(255)
#  current_location     :string(255)
#  current_geo_lat      :decimal(, )
#  current_geo_long     :decimal(, )
#  created_at           :datetime
#  updated_at           :datetime
#  invitation_token     :string(60)
#  invitation_sent_at   :datetime
#  invitation_limit     :integer
#  invited_by_id        :integer
#  invited_by_type      :string(255)
#  user_type            :integer         default(0)
#

