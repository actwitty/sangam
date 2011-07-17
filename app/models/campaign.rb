class Campaign < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity

  belongs_to :entity
  belongs_to :location
  belongs_to :comment

  belongs_to :father, :class_name => "Activity"

  validates_existence_of :author_id
  validates_existence_of :father_id

  validates_existence_of :activity_id, :allow_nil => true
  validates_existence_of :entity_id, :allow_nil => true
  validates_existence_of :location_id, :allow_nil => true
  validates_existence_of :comment_id, :allow_nil => true

  validates_uniqueness_of :author_id, :scope => [:activity_id, :campaign_name],  :unless => Proc.new {|a| a.activity_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:entity_id, :campaign_name], :unless => Proc.new {|a| a.entity_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:location_id, :campaign_name], :unless => Proc.new {|a| a.location_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:comment_id, :campaign_name], :unless => Proc.new {|a| a.comment_id.nil?}
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
    include TextFormatter
    # :author_id => 123
    # :campaign_name => "like"
    # :campaign_value => any integer index .. for example like =1 super-like  = 2 etc
    # :activity_id => 234
    #                OR
    # :entity_id > 123
    #                OR
    # :location_id => 123
    #                 OR
    # :comment_id  => 234

    def create_campaign(params = {})
      new_hash = {}

      #NEED TO MAKE IT DRY
      if params.has_key?(:activity_id)

        activity = Activity.includes(:author).where(:id => params[:activity_id]).first

        #text = "<a href=/users/#{options[:user_id]}>#{user.username}s</a> <a href=/activities/#{options[:activity_id]}>#{activity.activity_name}</a>".html_safe
        text = "#{link_to_type(AppConstants.user_controller, AppConstants.campaign_username_class,activity.author.full_name,
                  activity.author_id )} #{link_to_type(AppConstants.activity_controller,
                                         AppConstants.campaign_activity_class,activity.activity_name,params[:activity_id] )}".html_safe

      elsif params.has_key?(:entity_id)
        entity = Entity.find(params[:entity_id])
        #text = "<a href=/entities/#{options[:entity_id]}>#{entity.entity_name}</a>".html_safe
        text = "#{link_to_type(AppConstants.entity_controller, AppConstants.campaign_entity_class,entity.entity_name,
                  params[:entity_id] )}".html_safe

      elsif params.has_key?(:comment_id)

        comment = Comment.includes(:author).where(:id => params[:comment_id]).first
        text = "#{link_to_type(AppConstants.user_controller, AppConstants.campaign_username_class,comment.author.full_name,
                  comment.author_id )} #{link_to_type(AppConstants.comment_controller,
                                         AppConstants.campaign_comment_class,AppConstants.default_comment_string,
                                         params[:comment_id] )}".html_safe

      elsif params.has_key?(:location_id)
        location = Location.find(params[:location_id])
        #text = "<a href=/entities/#{options[:location_id]}>#{location.location_name}</a>".html_safe
        text = "#{link_to_type(AppConstants.location_controller, AppConstants.campaign_location_class,location.location_name,
                  params[:location_id] )}".html_safe
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
    def delete_campaign(campaign_id)
      campaign = Campaign.find(campaign_id)
      campaign.father.destroy
    end
  # :activity_id => 123
  #      OR
  # :entity_id => 123
  #     OR
  # :location_id => 123
  #     OR
  #  :comment_id => 123
  # OUTPUT = [["campaign_name", "campaign_value", "author_id"], count]
  #[["join", 2, 1679], 1]
  #[["like", 1, 1677], 1]
  #[["like", 2, 1679], 1]
  #[["support", 3, 1677], 1]

    def get_campaign(params={})
      campaigns = Campaign.where( params).group(:campaign_name, :campaign_value, :author_id).order(:campaign_name).count
      campaigns.each do  |attr|
        puts attr.to_s
      end

    end
  end
end


# == Schema Information
#
# Table name: campaigns
#
#  id             :integer         not null, primary key
#  author_id      :integer         not null
#  activity_id    :integer
#  entity_id      :integer
#  location_id    :integer
#  comment_id     :integer
#  father_id      :integer         not null
#  campaign_name  :string(255)     not null
#  campaign_value :integer         not null
#  created_at     :datetime
#  updated_at     :datetime
#

