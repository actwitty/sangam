# == Schema Information
# Schema version: 20110616040229
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
  has_many :documents, :foreign_key => :owner_id, :dependent => :destroy


  #CREATE & DESTROY for hub, hub association, mentions, campaigns, entity_ownerships, location_ownerships  will happen from activity create & destroy
  #no explicit create & destroy is called by user for all these
  has_many :hubs
  has_many :entities, :through => :hubs, :uniq => true
  has_many :locations, :through => :hubs, :uniq => true
  has_many  :activity_words, :through => :hubs, :uniq => true

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

  def get_followers
    users_list = nil
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
    users_list=nil
    friends_id_list = Contact.select("friend_id").where(:user_id => id).map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.select("id,full_name,photo_small_url").where("id in (?)", friends_id_list )
    end
    return users_list

  end

  def self.search(search)
    if search
      select("id,full_name,photo_small_url").order("full_name").
                  where( ['users.email = ?
                            or full_name ILIKE ?', search,
                                                   "%#{search}%"])
    else
      select("id,full_name,photo_small_url").order("full_name")
    end
  end


  #sort_order => 1 (lexicographical)
  #sort_order => 2 (based on updated)
  #returns hash of : {:name => "eating" ,:id => 123 }
  def get_user_activities( sort_order)

     h = Activity.where(:author_id => self.id).group(:activity_word_id, :activity_name).
         order("MAX(updated_at)  DESC").count

     word_hash = []

     h.each do |k,v|
        word_hash << {:name => k[1], :id => k[0]}
     end

     if !sort_order.blank?  and sort_order == 1
        word_hash = word_hash.sort {|x, y| x[:name] <=> y[:name] }
     end
        word_hash
     end

  #sort_order => 1 (lexicographical)
  #sort_order => 2 (based on updated)
  #returns hash of : {:name => "pizza" , :id => 123 }
  def get_user_entities(sort_order)

    entity_hash = []

    h = entities.order("updated_at DESC").each do |attr|
      entity_hash <<  {:name => attr.entity_name,:id => attr.id}
    end

    if !sort_order.blank?  and sort_order == 1
      entity_hash = entity_hash.sort {|x, y| x[:name] <=> y[:name] }
    end
    entity_hash
  end

  include LocationRoutines

  #sort_order => 1 (lexicographical)
  #sort_order => 2 (based on updated)
  #returns: array of :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
  #                                                      OR
  #                 :type => 2, :name => "John's home"]

  def get_user_locations( sort_order)

    lh = []

    h = locations.order("updated_at DESC").each do |attr|
      l = location_hash(attr)
      l[:id] = attr.id
      lh <<  l
    end

    if !sort_order.blank?  and sort_order == 1
      lh = lh.sort {|x, y| x[:name] <=> y[:name] }
    end

    lh
    end

  #always current_user's id (logged in)
  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #returns array of {:id => 123, :name => "samarth" , :image => "images/234"}
  def get_related_friends(filter = {})

    friend_objs = {}

    users = get_contacts
    users.each do |attr|
      friend_objs[attr.id] = attr
    end

    h = {}
    h = process_filter(filter)
    h[:user_id] = friend_objs.keys
    h = Hub.where(h).group(:user_id).order("MAX(updated_at) DESC").count

    friends = []
    h.each do |k,v|
      friends << {:id => friend_objs[k].id, :name => friend_objs[k].full_name,
                   :image => friend_objs[k].photo_small_url}
    end
    friends
  end

  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #returns array of {:id => 123, :name => "pizza" , :image => "entity/234"}
  def get_related_entities(user_id, filter = {})
    h = {}
    h = process_filter(filter)
    h[:user_id] = user_id

    h = Hub.where(h).group(:entity_id).order("MAX(updated_at) DESC").count
    e = Entity.where(:id => h.keys).group(:id, :entity_name).order("MAX(updated_at) DESC").count

    entity_hash = []
    e.each do |k,v|
      entity_hash << {:id => k[0], :name => k[1]}
    end
    entity_hash
  end

  #filter => {:word_id => 123, :entity_id => 456, :location_id => 789 }
  #returns array of :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york"
  #                                                      OR
  #                 :type => 2, :name => "John's home"
  def get_related_locations(user_id, filter = {})
    h = {}
    h = process_filter(filter)
    h[:user_id] = user_id

    lh = []
    h = Hub.where(h).group(:location_id).order("MAX(updated_at) DESC").count
    Location.where(:id => h.keys).order("updated_at DESC").all.each do |attr|
      l = location_hash(attr)
      l[:id] = attr.id
      lh <<  l
    end
    lh
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
    h
    end

end
