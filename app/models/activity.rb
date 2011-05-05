# == Schema Information
# Schema version: 20110501112607
#
# Table name: activities
#
#  id                   :integer(4)      not null, primary key
#  activity_name        :string(255)
#  activity_description :string(255)
#  activity_category    :string(255)
#  activity_abuse       :integer(4)
#  activity_quick_code  :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#

class Activity < ActiveRecord::Base
  
  has_many :hubs
  has_many :entities, :through => :hubs
  has_many :users, :through => :hubs
  has_many :posts, :through => :hubs

  has_many :loop_views
  has_many :loops, :through => :loop_views
  

end
