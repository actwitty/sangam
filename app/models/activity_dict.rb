# == Schema Information
# Schema version: 20110530100149
#
# Table name: activity_dicts
#
#  id         :integer(4)      not null, primary key
#  dict_name  :string(255)     not null
#  created_at :datetime
#  updated_at :datetime
#

class ActivityDict < ActiveRecord::Base
  has_many :word_forms
  #should not get deleted
  has_many :activities, :dependent => :destroy
end
