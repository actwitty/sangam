# == Schema Information
# Schema version: 20110501112607
#
# Table name: loop_memberships
#
#  id         :integer(4)      not null, primary key
#  loop_id    :integer(4)
#  contact_id :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

class LoopMembership < ActiveRecord::Base

  belongs_to :loop 
  belongs_to :contact 

end
