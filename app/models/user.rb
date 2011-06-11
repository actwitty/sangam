# == Schema Information
# Schema version: 20110609094335
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
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,:token_authenticatable,:lockable,:confirmable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  # relations #
  has_one :profile

  
  has_many :likes, :foreign_key => :author_id #these are the likes user did
  has_many :comments, :foreign_key => :author_id #these are the comments user is author
  
  has_many :comments, :foreign_key => :author_id #these are the comments user is author
  has_many :contacts
  has_many :friends, :foreign_key => :friend_id, :class_name => 'Contact' #these are the friends in the contacts table

  has_many :loops
  has_many :loop_memberships, :through => :loops

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
  validates_presence_of :username
  validates_length_of :username, :maximum => 32
  validates_uniqueness_of :username,
                          :case_sensitive => false,
                          :message => 'username is already registered'

  validates_presence_of :profile, :unless => proc {|user| user.confirmed_at.nil?}

  ######################################



  # profile related api
  def build_profile_on_confirmation

  end

  def update_profile

  end

  def get_pending_request_contacts
      users_new_list = User.find(:all,  :joins => :friends,
                                        :conditions => {
                                                        :contacts =>
                                                         {
                                                            :status => Contact.statusStringToKey['New'],
                                                            :friend_id => self.id }
                                                          })
      return users_new_list
  end

  def get_raised_contact_requests_raised
    users_initiated_req_list = User.find(:all,  :joins => :contacts,
                                        :conditions => {
                                                        :contacts =>
                                                         {
                                                            :status => Contact.statusStringToKey['New'],
                                                            :user_id => self.id }
                                                          })
      return users_initiated_req_list
  end


  def get_contacts
     users_connected_list = User.find(:all,  :joins => :contacts,
                                        :conditions => {
                                                        :contacts =>
                                                         {
                                                            :status => Contact.statusStringToKey['Connected'],
                                                            :user_id => self.id }
                                                          })
     return  users_connected_list
  end


  def new_contact_request (friend_id)
    contact = Contact.new(:user_id => self.id, :friend_id => friend_id)
    contact.request_new
  end

  def accept_a_contact_request (friend_id)
    contact = Contact.new(:user_id => self.id, :friend_id => friend_id)
    contact.accept_new

  end

  def reject_a_contact_request(friend_id)
    contact = Contact.new(:user_id => self.id, :friend_id => friend_id)
    contact.reject_new
  end

  def disconnect_a_contact(friend_id)
   contact = Contact.new(:user_id => self.id, :friend_id => friend_id)
   contact.delete_contacts_from_both_ends()
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
