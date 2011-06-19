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

  validates_existence_of :author_id
  validates_existence_of :father_id
  validates_existence_of :activity_id, :allow_nil => true
  validates_existence_of :entity_id, :allow_nil => true
  validates_existence_of :location_id, :allow_nil => true

  validates_uniqueness_of :author_id, :scope => [:activity_id, :campaign_name]
  validates_uniqueness_of :author_id, :scope => [:entity_id, :campaign_name]
  validates_uniqueness_of :author_id, :scope => [:location_id, :campaign_name]
  validates_uniqueness_of :father_id


  validates_presence_of :campaign_name, :campaign_value

  validates_length_of :campaign_name, :in => 1..255
  validates_length_of :campaign_value, :in => 1..32
  validates_length_of :campaign_comment, :in => 1..255,  :allow_blank => true


  # :author_id => 123
  # :campaign_name => "like"
  # :campaign_value => any integer index .. for example like =1 super-like  = 2 etc
  # :options = :activity => {:user_id => 123, :username => "xyz", :activity_id => 234,, :activity_name => "abc"}
  #                          OR
  #          :entity => {:entity_id = 123, :entity_name => "abc"}
  #                          OR
  #           :location => {:location_id => 123, :location_name => "abc""
  def CreateCampaign(params = {})

#    if params[:options].has_key?(:activity)
#
#      options = params[:options][:activity]
#      user = User.find(options[:user_id])
#      text = "<A href=/users/#{options[:user_id]}>#{user.username}</A>'s <A href=/activities/"
#    end
#    father =  Activity.CreateActivity(:author_id => params[:author_id], :activity => "&#{params[:campaign_name]}&" ,
#                                       :text => "<a href=/users/#{}",:enrich => false)
  end
end
