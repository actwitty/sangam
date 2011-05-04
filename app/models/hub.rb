# == Schema Information
# Schema version: 20110504100106
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

end
