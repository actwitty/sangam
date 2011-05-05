# == Schema Information
# Schema version: 20110504093513
#
# Table name: userboard_post_caches
#
#  id         :integer(4)      not null, primary key
#  post_id    :integer(4)
#  user_id    :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

class UserboardPostCache < ActiveRecord::Base
   validates_uniqueness_of :post_id, :scope => :user_id
end
