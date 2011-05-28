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
