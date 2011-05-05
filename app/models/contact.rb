# == Schema Information
# Schema version: 20110504095033
#
# Table name: contacts
#
#  id         :integer(4)      not null, primary key
#  status     :string(255)
#  pending    :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer(4)
#  friend_id  :integer(4)
#

class Contact < ActiveRecord::Base

  
  belongs_to :user
  belongs_to :friend, :class_name => 'User'
  
  has_many :loop_memberships
  has_many :loops, :through => :loop_memberships
  
  # validate presence of foreign keys 
  validates_presence_of :user
  validates_presence_of :friend

  #validate uniqueness of join
  validates_uniqueness_of :friend_id, :scope => :user_id

  validate :is_contact_created_for_self
  
  def is_contact_created_for_self
    if user_id == friend_id
      errors[:base] << 'Attempt to create a join to self failed.'
    end
  end
end
