# == Schema Information
# Schema version: 20110616040229
#
# Table name: campaigns
#
#  id               :integer         not null, primary key
#  author_id        :integer         not null
#  activity_id      :integer
#  entity_id        :integer
#  location_id      :integer
#  father_id        :integer         not null
#  campaign_name    :string(255)     not null
#  campaign_value   :string(32)      not null
#  campaign_comment :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

class Campaign < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity

  belongs_to :entity
  belongs_to :location

  belongs_to :father, :class_name => "Activity"

  validates_existence_of :author
  validates_existence_of :father
  validates_existence_of :activity, :allow_blank => true
  validates_existence_of :entity, :allow_blank => true
  validates_existence_of :location, :allow_blank => true

  validates_uniqueness_of :author_id, :scope => [:activity_id, :campaign_name]
  validates_uniqueness_of :author_id, :scope => [:entity_id, :campaign_name]
  validates_uniqueness_of :author_id, :scope => [:location_id, :campaign_name]
  validates_uniqueness_of :father_id


  validates_presence_of :campaign_name, :campaign_value

  validates_length_of :campaign_name, :in => 1..255
  validates_length_of :campaign_value, :in => 1..32
  validates_length_of :campaign_comment, :in => 1..255,  :allow_blank => true


end
