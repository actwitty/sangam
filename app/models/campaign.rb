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

  validates_uniqueness_of :author_id, :scope => [:activity_id, :campaign_name],  :unless => Proc.new {|a| a.activity_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:entity_id, :campaign_name], :unless => Proc.new {|a| a.entity_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:location_id, :campaign_name], :unless => Proc.new {|a| a.location_id.nil?}
  validates_uniqueness_of :father_id


  validates_presence_of :campaign_name, :campaign_value

  validates_length_of :campaign_name, :in => 1..255
  validates_numericality_of :campaign_value

  after_destroy :ensure_destroy_cleanup

  def ensure_destroy_cleanup
    #Delete to stop circular effect
    self.father.delete
  end

  class << self
    include ActivityTextFormatter
    # :author_id => 123
    # :campaign_name => "like"
    # :campaign_value => any integer index .. for example like =1 super-like  = 2 etc
    # :campaign_comment => "xbcxbcnxbcnx" or nil
    # :activity => {:user_id => 123, :activity_id => 234}
    #                OR
    # :entity => {:entity_id = 123}
    #                OR
    # :location => {:location_id => 123
    def create_campaign(params = {})
      new_hash = {}

      #NEED TO MAKE IT DRY
      if params.has_key?(:activity)

        options = params[:activity]
        user = User.find(options[:user_id])
        activity = Activity.find(options[:activity_id])
        #text = "<a href=/users/#{options[:user_id]}>#{user.username}s</a> <a href=/activities/#{options[:activity_id]}>#{activity.activity_name}</a>".html_safe
        text = "#{link_to_type(AppConstants.user_controller, AppConstants.campaign_username_class,user.username,
                  options[:user_id] )} #{link_to_type(AppConstants.activity_controller,
                                         AppConstants.campaign_activity_class,activity.activity_name,options[:activity_id] )}".html_safe
        params[:activity_id] = activity.id
        params.delete(:activity)

      elsif params.has_key?(:entity)

        options = params[:entity]
        entity = Entity.find(options[:entity_id])
        #text = "<a href=/entities/#{options[:entity_id]}>#{entity.entity_name}</a>".html_safe
        text = "#{link_to_type(AppConstants.entity_controller, AppConstants.campaign_entity_class,entity.entity_name,
                  options[:entity_id] )}".html_safe
        params[:entity_id] = entity.id
        params.delete(:entity)

      elsif params.has_key?(:location)
        options = params[:location]
        location = Location.find(options[:location_id])
        #text = "<a href=/entities/#{options[:location_id]}>#{location.location_name}</a>".html_safe
        text = "#{link_to_type(AppConstants.location_controller, AppConstants.campaign_location_class,location.location_name,
                  options[:location_id] )}".html_safe
        params[:location_id] = location.id
        params.delete(:location)
      end
      puts new_hash
      params[:father_id] =  Activity.create_activity(:author_id => params[:author_id], :activity => "&#{params[:campaign_name]}&" ,
                                         :text => text,:enrich => false).id

      campaign = Campaign.create!(params)
      return campaign
    rescue => e
      Rails.logger.error("Campaign => create_campaign => #{e.message} => #{params.to_s}")
      nil
    end
    def DeleteCampaign(campaign_id)
      campaign = Campaign.find(campaign_id)
      campaign.father.destroy
    end
  # :activity_id => 123
  #      OR
  # :entity_id => 123
  #     OR
  # :location_id => 123
  # OUTPUT = [["campaign_name", "campaign_value", "author_id"], count]
  #[["join", 2, 1679], 1]
  #[["like", 1, 1677], 1]
  #[["like", 2, 1679], 1]
  #[["support", 3, 1677], 1]

    def GetCampaign(params={})
      campaigns = Campaign.where( params).group(:campaign_name, :campaign_value, :author_id).order(:campaign_name).count
      campaigns.each do  |attr|
        puts attr.to_s
      end

    end
  end
end
