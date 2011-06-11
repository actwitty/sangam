# == Schema Information
# Schema version: 20110609094335
#
# Table name: campaigns
#
#  id               :integer         not null, primary key
#  activity_id      :integer         not null
#  author_id        :integer         not null
#  campaign_name    :string(255)     not null
#  campaign_value   :string(32)      not null
#  campaign_comment :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

class Campaign < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity

  validates_existence_of :author
  validates_existence_of :activity

  validates_uniqueness_of :author_id, :scope => [:activity_id, :campaign_name]

  validates_presence_of :campaign_name, :campaign_value

  validates_length_of :campaign_name, :in => 1..255
  validates_length_of :campaign_value, :in => 1..32
  validates_length_of :campaign_comment, :in => 1..255,  :unless => Proc.new{|a| a.campaign_comment.nil?}
end
