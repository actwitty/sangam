# == Schema Information
# Schema version: 20110504095033
#
# Table name: hubs
#
#  id          :integer(4)      not null, primary key
#  click_count :integer(4)
#  user_id     :integer(4)
#  post_id     :integer(4)
#  activity_id :integer(4)
#  created_at  :datetime
#  updated_at  :datetime
#  entity_id   :integer(4)
#

class Hub < ActiveRecord::Base
  
  belongs_to :user 
  belongs_to :post 
  belongs_to :activity 
  belongs_to :entity 
  
  
  # validate foreign key reference
  validates_presence_of :post   # we can think of disabling this as well
  validates_presence_of :user # can be blocked as the user is triggering this
  validates_presence_of :entity
  validates_presence_of :activity
  
  # making sure that there is a unique post to entity relation (removed user and activity as they don't define join)
  validates_uniqueness_of :post_id, :scope => [:entity_id]   #we may think of removing this condition to optimize
end
