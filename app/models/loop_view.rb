# == Schema Information
# Schema version: 20110501125312
#
# Table name: loop_views
#
#  id          :integer(4)      not null, primary key
#  created_at  :datetime
#  updated_at  :datetime
#  activity_id :integer(4)
#  loop_id     :integer(4)
#  entity_id   :integer(4)
#  post_id     :integer(4)
#

class LoopView < ActiveRecord::Base
  
  belongs_to :activity 
  belongs_to :entity 
  belongs_to :post 
  belongs_to :loop 

end
