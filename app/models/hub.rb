# == Schema Information
# Schema version: 20110609094335
#
# Table name: hubs
#
#  id               :integer         not null, primary key
#  activity_id      :integer         not null
#  activity_name    :string(255)     not null
#  activity_dict_id :integer         not null
#  entity_id        :integer
#  entity_name      :string(255)
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

  validates_existence_of  :activity
  validates_existence_of  :activity_word
  validates_existence_of  :user
  validates_existence_of  :entity , :unless => Proc.new { |a| a.entity_id.nil? }
  validates_existence_of  :location , :unless => Proc.new { |a| a.location_id.nil? }

  validates_presence_of :activity_name

  validates_length_of   :activity_name , :in => 1..255
  validates_length_of   :entity_name, :maximum => 255, :unless => Proc.new {|a| a.entity_name.nil?}

end
