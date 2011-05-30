# == Schema Information
# Schema version: 20110530100149
#
# Table name: loops
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  user_id    :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

class Loop < ActiveRecord::Base
  
  belongs_to :user
  has_many :loop_memberships
  #validate foreign key reference
  validates_presence_of :user #again this can be skipped as the user is triggering this

  validates_existence_of :user_id
  validates_existence_of :user      #works both ways

  #validate the join
  validates_uniqueness_of :id, :scope => :user_id
end
