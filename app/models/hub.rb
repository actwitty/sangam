# == Schema Information
# Schema version: 20110616040229
#
# Table name: hubs
#
#  id               :integer         not null, primary key
#  activity_id      :integer         not null
#  activity_name    :string(255)     not null
#  activity_word_id :integer         not null
#  entity_id        :integer
#  user_id          :integer         not null
#  location_id      :integer
#  created_at       :datetime
#  updated_at       :datetime
#

class Hub < ActiveRecord::Base
  belongs_to :user
  belongs_to :activity
  belongs_to :location
  belongs_to :entity
  belongs_to :activity_word

  validates_existence_of  :activity_id
  validates_existence_of  :activity_word_id
  validates_existence_of  :user_id
  validates_existence_of  :entity_id , :allow_nil => true
  validates_existence_of  :location_id , :allow_nil => true

  validates_presence_of :activity_name

  validates_length_of   :activity_name , :in => 1..255

end
