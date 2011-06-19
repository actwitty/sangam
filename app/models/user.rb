# == Schema Information
# Schema version: 20110605183950
#
# Table name: users
#
#  id                   :integer(4)      not null, primary key
#  email                :string(255)
#  encrypted_password   :string(128)     default("")
#  reset_password_token :string(255)
#  remember_created_at  :datetime
#  sign_in_count        :integer(4)      default(0)
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  confirmation_token   :string(255)
#  confirmed_at         :datetime
#  confirmation_sent_at :datetime
#  failed_attempts      :integer(4)      default(0)
#  unlock_token         :string(255)
#  locked_at            :datetime
#  authentication_token :string(255)
#  username             :string(255)
#  show_help            :boolean(1)
#  disable_email        :boolean(1)
#  created_at           :datetime
#  updated_at           :datetime
#  invitation_token     :string(60)
#  invitation_sent_at   :datetime
#  invitation_limit     :integer(4)
#  invited_by_id        :integer(4)
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
  attr_accessible :email, :password, :password_confirmation, :remember_me

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
  has_many :entities, :through => :hubs
  has_many :locations, :through => :hubs
  has_many  :activity_words, :through => :hubs

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
                                                  Contact.statusStringToKey['New']).all().map(&:user_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.where("id in (?)", friends_id_list ).all
    end
    return users_list
  end


  def get_contacts
    users_list=nil
    friends_id_list = contacts.select("friend_id").where(:status =>
                                                  Contact.statusStringToKey['Connected']).all().map(&:friend_id)

    if !friends_id_list.nil? && friends_id_list.count() != 0
      users_list=User.where("id in (?)", friends_id_list ).all
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
   friends_id_list = contacts.select("friend_id").where(:status =>
                                                  Contact.statusStringToKey['Connected']).all().map(&:friend_id)

   Authentication.all(:select => "uid",:conditions=> ['user_id in (?) and uid in (?)',
                                                       friends_id_list, uid_list]).map(&:uid)

  end

  def self.search(search)
    if search
      all(:include => :profile,:order => "first_name" ,
          :conditions => ['users.email = ?
                            or first_name LIKE ?
                              or last_name LIKE ?', search,
                                              "%#{search}%",
                                              "%#{search}%"],
          :joins => :profile)
    else
     all(:include => :profile, :order => "profiles.first_name, profiles.last_name")
    end
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
end
