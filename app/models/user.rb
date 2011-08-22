class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable


  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable,:token_authenticatable,
         :lockable,:confirmable , :omniauthable
          #,:devise_create_users

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :full_name

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
  before_validation :strip_fields, :on => :create

  validates :email, :email_format => true
  validates_presence_of :profile, :unless => proc {|user| user.confirmed_at.nil?}

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
    auths.each do |auth|
         uid_based_list[auth.uid] = {:user_id => auth.user.id, :following => 0}
         user_id_list[auth.user_id] = auth.uid
    end

    friends_list = Contact.all(:select => "friend_id", :conditions=> ['user_id = ? and friend_id in (?)',
                                                                            id,
                                                                            user_id_list.keys]).map(&:friend_id)



    friends_list.each do |friend|
         uid_based_list[user_id_list[friend]][:following] = 1
    end

    puts  uid_based_list
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
    unless search.blank?
      select("id,full_name,photo_small_url").order("full_name").
                  where( ['users.email = ?
                            or full_name ILIKE ?', search,
                                                   "%#{search}%"])
    else
      select("id,full_name,photo_small_url").order("full_name")
    end
  end

  include TextFormatter
  #INPUT user_id => 123
  #sort_order => 1 (lexicographical) or  2 (based on updated)
  #returns hash of : {:name => "eating" ,:id => 123 }
  #   OR
  #    {} if invalid user
  def get_user_activities( user_id, sort_order)

     Rails.logger.debug("[MODEL] [User] [get_user_activities] entering ")

     h = Activity.where(:author_id => user_id, :status => AppConstants.status_public, :meta_activity => false).
         group(:activity_word_id, :activity_name).order("MAX(updated_at)  DESC").count

     word_array = []

     h.each do |k,v|
#        word_hash << {:name => k[1], :id => k[0]}
       word_array << {:name => k[1], :id => k[0]}
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

    if !h[:entity_id].blank?

      h[:user_id] = friend_objs.keys
      h = Hub.where(h).group(:user_id).order("MAX(updated_at) DESC").count

    else

      h[:status] = AppConstants.status_public
      h[:meta_activity] = false

      h[:base_location_id] = h[:location_id] if !h[:location_id].blank?
      h.delete(:location_id)

      h[:author_id] = friend_objs.keys

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

    h = Hub.where(h).group(:entity_id).limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(updated_at) DESC").count

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
      h = Hub.where(h).group(:location_id).limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(updated_at) DESC").count
    else
      h[:status] = AppConstants.status_public
      h[:meta_activity] = false

      h[:base_location_id] = h[:location_id] if !h[:location_id].blank?
      h.delete(:location_id)

      h[:author_id] = h[:user_id] if !h[:user_id].blank?
      h.delete(:user_id)
      h = Activity.where(h).group(:base_location_id).limit(AppConstants.max_number_of_a_type_in_summmary).order("MAX(updated_at) DESC").count
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

    params[:updated_at].blank? ? h[:updated_at.lt] = Time.now.utc : h[:updated_at.lt] = params[:updated_at]

    h[:status] =  AppConstants.status_saved

    h[:meta_activity] = false

    h[:base_location_id] = h[:location_id] if !h[:location_id].blank?
    h.delete(:location_id)

    h.delete(:entity_id) if !h[:entity_id].blank?   #remove entity_id as drafts can have

    h[:author_id] = self.id

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
  #                  :geo_location => {:geo_latitude => 23.6567, :geo_longitude => 120.3, :geo_name => "sj"}
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
  #              :status => 0 or 1 or 2 ( as set by client)
  #              :location=>{:type=>2, :lat=>#<BigDecimal:62b1fc8,'0.2345E2',18(18)>, :long=>#<BigDecimal:62b1de8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>315}
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
    a
  end

  #INPUT { :activity_id => 123,
  #        :status => 1
  #      }
  #OUTOUT => Same as create_activity
  ##COMMENT => Changes state from saved to publish or private state. Dont use this api to change from
  ##           private to public or vice versa .. its only from saved to public state as it destroys
  ##           the previous activity and re-creates the new one.
  ###          SAVED ACTIVITY CANT NOT be REVERTED back to PUBLISHED OR PRIVATE

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
    params[:documents].each do |attr|
      url << attr[:url]
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
    #TODO Social counters update when summary changes
    if a[:post][:summary_id] != prev_summary_id
      Summary.destroy_all(:id => prev_summary_id)
      s = Summary.where(:id => prev_summary_id).first
      if !s.blank?
        s.rebuild_a_summary
      end
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
  #   :enriched=>true, :summary_id=>9, :sub_title=>nil, :source_name=>"actwitty", :status=>1, :campaign_types=>1
  #  },
  # :location=>
  #  {
  #   :type=>2, :lat=>#<BigDecimal:9de78e0,'0.2345E2',18(18)>, :long=>#<BigDecimal:9de77c8,'0.4545E2',18(18)>, :name=>"marathalli", :id=>8
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

    h = process_filter_modified(params)

    if h.blank?
      Rails.logger.debug("[MODEL] [USER] [get_stream] Leaving => Blank has returned by process_filter => #{params.inspect}")
      return {}
    end

    #use HUB only if entity filter is there
    if !h[:entity_id].blank?

      # need to check this anyway  - For time being
      # we have to delete hub
      h.delete(:status)
      Rails.logger.debug("[MODEL] [USER] [get_stream] => Hub/Entity based filtering => #{h.inspect}")
      activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

    else

      h[:status] =  AppConstants.status_public

      h[:meta_activity] = false

      h[:base_location_id] = h[:location_id] if !h[:location_id].blank?
      h.delete(:location_id)

      h[:author_id] = h[:user_id] if !h[:user_id].blank?
      h.delete(:user_id)

      Rails.logger.debug("[MODEL] [USER] [get_stream] => Activity based filtering => #{h.inspect}")

      #show only public post.. Need to take care private and shared post
      activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count
    end

    array = get_all_activity(activity.keys)
    Rails.logger.debug("[MODEL] [USER] [get_stream] leaving")
    array
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
  def get_summary(params)

    Rails.logger.debug("[MODEL] [USER] [get_summary] entering")

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

    summary = Summary.includes(:user).where(h).limit(AppConstants.max_number_of_summmary).order("updated_at DESC").
        all.each do |attr|

        summaries[index] ={:id => attr.id,
                             :word => {:id => attr.activity_word_id, :name => attr.activity_name},
                             :time => attr.updated_at,
                             :user => {:id => attr.user_id, :full_name => attr.user.full_name, :photo => attr.user.photo_small_url},
                             :activity_count => attr.activities.size,
                             :document_count => attr.documents.size, :tag_count => attr.tags.size,
                             :social_counters => attr.social_counters_array, :theme_data => attr.theme_data,
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


    Document.where(:id => documents.keys).order("updated_at DESC").all.each do|attr|
      h = format_document(attr)
      documents[attr.id].each do |idx|
        summaries[idx][:documents] << h[:document]
      end
    end
    documents = {}

    Tag.where(:id => tags.keys).order("updated_at DESC").all.each do|attr|
      h = format_tag(attr)
      tags[attr.id].each do |idx|
        summaries[idx][:tags] << h[:tag]
      end
    end
    tags = {}

    Location.where(:id => locations.keys).order("updated_at DESC").all.each do|attr|
      h = format_location(attr)
      #h[:id] = attr.id
      locations[attr.id].each do |idx|
        summaries[idx][:locations] << h
      end
    end
    locations={}

    Entity.where(:id => entities.keys).order("updated_at DESC").all.each do|attr|
      entities[attr.id].each do |idx|
        #summaries[idx][:entities] << {:id => attr.id, :name => attr.entity_name, :image =>  attr.entity_image }
        summaries[idx][:entities] << format_entity(attr)
      end
    end
    entities ={}

    Activity.where(:id => activities.keys).order("updated_at DESC").all.each do|attr|
      activities[attr.id].each do |idx|
        summaries[idx][:recent_text] << attr.activity_text
      end
    end
    activities = {}

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

    Summary.includes(:user).where(:activity_word_id => friends.keys, :user_id => user).
          group(:user_id, :activity_word_id ).count.each do |k,v|
      activities[k[0]] = k[1]
    end

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

    params[:updated_at].blank? ? h[:updated_at.lt] = Time.now.utc : h[:updated_at.lt] = params[:updated_at]

    h[:status]   = AppConstants.status_public

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

    params[:updated_at].blank? ? h[:updated_at.lt] = Time.now.utc : h[:updated_at.lt] = params[:updated_at]

    activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

    hash[:stream] = get_all_activity(activity.keys)
    Rails.logger.debug("[MODEL] [USER] [get_entity_stream] leaving")
    hash

  end

  #INPUT => {:location_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601)
  #OUTPUT => { :id => 1234, :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :id => 1234, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
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

    params[:updated_at].blank? ? h[:updated_at.lt] = Time.now.utc : h[:updated_at.lt] = params[:updated_at]
    h[:status]   = AppConstants.status_public

    h[:meta_activity] = false

    h[:base_location_id] =  params[:location_id]

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

    campaign = Campaign.where(params).first

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
    user_campaigns = Campaign.where(params).group(:name).count

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
    puts a
    Rails.logger.debug("[MODEL] [USER] [create_comment] leaving")
    a

  end

  #COMMENT => to remove comment of current user
  #INPUT => comment_id =. 1234
  #OUTPUT =>  {:activity_id => 2345, :comment_count => 23}
  def remove_comment(comment_id)

    Rails.logger.debug("[MODEL] [USER] [remove_comment] entering")
    comment = Comment.where(:id => comment_id, :author_id => self.id).first

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

      activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

      h = {:activity_id => activity.keys,:category => params[:category] , :status =>  AppConstants.status_public }

    else

      h[:owner_id] = h[:user_id]  if !h[:user_id].blank?   #this will be true for page_state_user or page_state_all
      h.delete(:user_id)
      h[:category] = params[:category]
      h[:status] =  AppConstants.status_public

    end

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
  #     :url => "http://s3.amazonaws.com/a.jpg"
  #     :style => 1 or 2 or 3 # 1=> centered , 2=> tiled, 3 => stretched
  #
  #     :author_id => 123 #MANDATORY
  #     :summary_id => 234 #OPTIONAL
  #     :default => true/false #resets to default
  def update_theme(params)
    Rails.logger.debug("[MODEL] [USER] [update_theme] entering")
    a = Theme.update_theme(params)
    Rails.logger.debug("[MODEL] [USER] [update_theme] leaving")
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
  # private methods
  private


  def strip_fields
    if self.email.present?
       self.email.strip!
       self.email.downcase!
    end
    if self.username.present?
      self.username.strip!
      self.username.downcase!
    else
       self.username = self.email
    end
  end

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

       Rails.logger.debug("[MODEL] [USER] [process_filter] page state = page_state_all => #{params.inspect}")
       user = Contact.select("friend_id").where(:user_id => self.id).map(&:friend_id)
       user.blank? ? user = [self.id] : user << self.id
       h[:user_id] = user

    end

    #USER/ME Page
    if params[:page_type] == AppConstants.page_state_user

       Rails.logger.debug("[MODEL] [USER] [process_filter] page_state = page_state_user => #{params.inspect}")
       h[:user_id] = params[:user_id]

    end

    #DEFAULT IS PUBLIC => IN this page user and summary variables will be nil. So only on filters

    params[:updated_at].blank? ? h[:updated_at.lt] = Time.now.utc : h[:updated_at.lt] = params[:updated_at]
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
#  confirmation_token   :string(255)
#  confirmed_at         :datetime
#  confirmation_sent_at :datetime
#  failed_attempts      :integer         default(0)
#  unlock_token         :string(255)
#  locked_at            :datetime
#  authentication_token :string(255)
#  username             :string(255)
#  show_help            :boolean
#  disable_email        :boolean
#  full_name            :string(255)
#  photo_small_url      :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#  invitation_token     :string(60)
#  invitation_sent_at   :datetime
#  invitation_limit     :integer
#  invited_by_id        :integer
#  invited_by_type      :string(255)
#

