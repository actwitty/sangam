class Comment < ActiveRecord::Base

  include  ActionView::Helpers

  belongs_to :author, :class_name => "User"
  belongs_to :activity,  :touch => true, :counter_cache => true
  belongs_to :document,  :touch => true, :counter_cache => true
  belongs_to :summary

  belongs_to :father, :class_name => "Activity"

# These two validation is not needed as check for activity_id and document_id
# is done in create_comment explicitly
#  validates_existence_of :activity_id, :allow_nil => true
#  validates_existence_of :document_id, :allow_nil => true
#  validates_existence_of :summary_id, :allow_nil => true

  validates_existence_of :author_id, :father_id

  validates_presence_of :text, :source_name, :status

  validates_length_of   :text, :in => 1..AppConstants.comment_text_length

  validates_length_of   :source_name,    :in => 1..AppConstants.source_name_length

  has_many              :campaigns, :dependent => :destroy

  after_destroy         :ensure_destroy_cleanup

  after_create          :touch_hubs

  before_save           :sanitize_data

  after_save            :update_analytics

  def sanitize_data
    Rails.logger.debug("[MODEL] [COMMENT] [sanitize_data] ")
    self.text = sanitize(self.text) if !self.text.blank?
  end

  def touch_hubs
    Hub.where(:activity_id =>self.activity_id).all.each do |attr|
      attr.touch
    end
  end

  def update_analytics
    Rails.logger.info("[MODEL] [COMMENT] [update_analytics] entering #{self.inspect}")
    if !self.summary_id.blank?
      SummaryRank.add_analytics({:fields => ["comments"], :summary_id => self.summary_id})
    end
    Rails.logger.info("[MODEL] [COMMENT] [update_analytics] leaving #{self.inspect}")
  end

  def ensure_destroy_cleanup
    #Delete to stop circular effect
    puts "comment destroyed"
    self.father.delete

    #also update the analytics
    update_analytics
  end

  class << self


    # :author_id => 123
    # :activity_id => 234
    #     OR
    # :document_id => 123
    # :text => "hello"

    def create_comment(params ={})

      object = nil
      user = nil
      resource_name = nil

      if params.has_key?(:activity_id)

        object = Activity.includes(:author).where(:id => params[:activity_id]).first
        user = object.author
        resource_name = object.activity_name[0..AppConstants.max_string_len_for_display]
        params[:summary_id] = object.summary_id

      elsif params.has_key?(:document_id)

        object = Document.includes(:owner).where(:id => params[:document_id]).first
        user = object.owner
        if object.mime =~ /image/
          resource_type = "photo"
        else
          resource_type = "document"
        end

        params[:summary_id] = object.summary_id

      end

      if user.nil? || object.nil?
        Rails.logger.info("Comments => create_comment => failed => Commented Author  =>  #{object.to_s}}")
        return nil
      end

      resource_name << "..." if resource_name.length  > AppConstants.max_string_len_for_display

      #create comment father activity in yaml
      text   = {:model => "comment",:object_type => object.class.to_s.downcase,:resource_name => resource_name,
                :resource_id => object.id, :user => user.full_name, :user_id => user.id }

      text[:resource_type] = resource_type if !resource_type.blank?

      text = text.to_yaml
      params[:father_id] =  Activity.create_activity(:author_id => params[:author_id],
                                                      :activity => "&#{AppConstants.default_comment_string}&" ,
                                                    :text => text,:enrich => false,:meta_activity => true,
                                                    :campaign_types => AppConstants.campaign_none).id

      #set mandatory parameters if missing
      params[:status] = AppConstants.status_public if params[:status].nil?
      params[:source_name] = AppConstants.source_actwitty_meta if params[:source_name].nil?

      obj = Comment.create!(params)
      puts obj.inspect
      return obj
    rescue => e
      Rails.logger.info("Comments => create_comment => #{e.message} =>  #{params.to_s}")
      nil
    end
  end
end





# == Schema Information
#
# Table name: comments
#
#  id          :integer         not null, primary key
#  author_id   :integer         not null
#  activity_id :integer
#  document_id :integer
#  father_id   :integer         not null
#  text        :text            not null
#  status      :integer         not null
#  source_name :text            not null
#  created_at  :datetime
#  updated_at  :datetime
#  summary_id  :integer
#

