# == Schema Information
# Schema version: 20110502113130
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
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,:token_authenticatable,:lockable,:confirmable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  # relations #
  has_one :profile
  
  
  has_many :likes, :foreign_key => :author_id #these are the likes user did
  has_many :comments, :foreign_key => :author_id #these are the comments user is author
  
  has_many :comments, :foreign_key => :author_id #these are the comments user is author
  has_many :contacts, :foreign_key => :friend_id #these are the friends in the contacts table

  has_many :loops
  has_many :loop_memberships, :through => :loops

  has_many :hubs
  has_many :activities, :through => :hubs
  has_many :entities, :through => :hubs
  has_many :posts, :through => :hubs
  ####################################
  
  # Validations #
  before_validation :strip_fields, :on => :create
  validates_presence_of :username
  validates_length_of :username, :maximum => 32
  validates_uniqueness_of :username, :case_sensitive => false, :message => 'username is already registered'
  ######################################

  def strip_fields
    if username.present?
      username.strip!
      username.downcase!
    end
    
     if email.present?
      email.strip!
      email.downcase!
    end
  end
end
