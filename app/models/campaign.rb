class Campaign < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity

  belongs_to :entity
  belongs_to :location
  belongs_to :comment
  belongs_to :document

  belongs_to :father, :class_name => "Activity"

  validates_existence_of :author_id
  validates_existence_of :father_id

# These 5 validations is not needed as check for activity_id and document_id
# is done in create_comment explicitly

#  validates_existence_of :activity_id, :allow_nil => true
#  validates_existence_of :entity_id, :allow_nil => true
#  validates_existence_of :location_id, :allow_nil => true
#  validates_existence_of :comment_id, :allow_nil => true
#  validates_existence_of :document_id, :allow_nil => true

  validates_uniqueness_of :author_id, :scope => [:activity_id, :name],  :unless => Proc.new {|a| a.activity_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:entity_id, :name], :unless => Proc.new {|a| a.entity_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:location_id, :name], :unless => Proc.new {|a| a.location_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:comment_id, :name], :unless => Proc.new {|a| a.comment_id.nil?}
  validates_uniqueness_of :author_id, :scope => [:document_id, :name], :unless => Proc.new {|a| a.document_id.nil?}

  validates_uniqueness_of :father_id


  validates_presence_of :name, :value, :source_name, :status

  validates_length_of   :name, :in => 1..AppConstants.campaign_name_length

  validates_length_of   :source_name,    :in => 1..AppConstants.source_name_length

  validates_numericality_of :value

  after_destroy :ensure_destroy_cleanup

  def ensure_destroy_cleanup
    #Delete to stop circular effect
    puts "campaign delete"
    puts "#{self.id}"
    self.father.delete
  end

  class << self
    include TextFormatter
    # :author_id => 123
    # :name => "like"
    # :value => any integer index .. for example like =1 super-like  = 2 etc
    # :activity_id => 234
    #                OR
    # :entity_id > 123
    #                OR
    # :location_id => 123
    #                 OR
    # :comment_id  => 234

    def create_campaign(params = {})
      new_hash = {}
      object = nil
      user = nil
      resource_name = nil
      resource_type = nil

      #NEED TO MAKE IT DRY
      if params.has_key?(:activity_id)

        object = Activity.includes(:author).where(:id => params[:activity_id]).first
        user = object.author
        resource_name = object.activity_name[0..AppConstants.max_string_len_for_display]

      elsif params.has_key?(:entity_id)

        object = Entity.find(params[:entity_id])
        resource_name = object.entity_name[0..AppConstants.max_string_len_for_display]

      elsif params.has_key?(:comment_id)

        object = Comment.includes(:author).where(:id => params[:comment_id]).first
        user = object.author
        resource_name = object.text[0..AppConstants.max_string_len_for_display]

      elsif params.has_key?(:document_id)

        object = Document.includes(:owner).where(:id => params[:document_id]).first
        user = object.owner
        #no specific name for uploaded document as of now so nam is photo pr document
        if object.mime =~ /image/
          resource_type = "photo"
        else
          resource_type = "document"
        end

      elsif params.has_key?(:location_id)

        object = Location.find(params[:location_id])
        resource_name = object.location_name[0..AppConstants.max_string_len_for_display]
        if object.location_type == 1
          resource_type = "link"
        elsif object.location_type == 2
          resource_type = "place"
        else
          resource_type = "unknown"
        end
      end

      if object.nil?
        Rails.logger.error("Campaign => create_campaign => Failed => campaigned object #{object.to_s}")
        return nil
      end

      resource_name << "..." if !resource_name.blank? && (resource_name.length  > AppConstants.max_string_len_for_display)

      text   = {:model => "campaign",:campaign => params[:name], :object_type => object.class.to_s.downcase,
                :resource_name => resource_name,:resource_id => object.id }

      if !user.blank?
        text[:user] = user.full_name
        text[:user_id] = user.id
      end

      text[:resource_type] = resource_type if !resource_type.blank?

      text = text.to_yaml

      #Create Father activity
      params[:father_id] =  Activity.create_activity(:author_id => params[:author_id], :activity => "&#{params[:name]}&" ,
                                         :text => text,:enrich => false, :campaign_types => AppConstants.campaign_none).id

      #set mandatory parameters if missing
      params[:status] = AppConstants.state_public if params[:status].nil?
      params[:source_name] =  AppConstants.source_actwitty if params[:source_name].nil?

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
  # OUTPUT = [["name", "value", "author_id"], count]
  #[["join", 2, 1679], 1]
  #[["like", 1, 1677], 1]
  #[["like", 2, 1679], 1]
  #[["support", 3, 1677], 1]

    def get_campaign(params={})
      campaigns = Campaign.where( params).group(:name, :value, :author_id).order(:name).count
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
#  id          :integer         not null, primary key
#  author_id   :integer         not null
#  activity_id :integer
#  entity_id   :integer
#  location_id :integer
#  comment_id  :integer
#  document_id :integer
#  father_id   :integer         not null
#  name        :string(255)     not null
#  value       :integer         not null
#  created_at  :datetime
#  updated_at  :datetime
#

