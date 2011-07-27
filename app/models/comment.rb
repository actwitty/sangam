class Comment < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity,  :touch => true, :counter_cache => true
  belongs_to :document,  :touch => true, :counter_cache => true

  belongs_to :father, :class_name => "Activity"

# These two validation is not needed as check for activity_id and document_id
# is done in create_comment explicitly
#  validates_existence_of :activity_id, :allow_nil => true
#  validates_existence_of :document_id, :allow_nil => true

  validates_existence_of :author_id, :father_id

  validates_presence_of :text
  validates_length_of :text, :in => 1..AppConstants.comment_text_length

  has_many :campaigns, :dependent => :destroy

  after_destroy :ensure_destroy_cleanup
  after_create  :touch_hubs

  def touch_hubs
    Hub.where(:activity_id =>self.activity_id).all.each do |attr|
      attr.touch
    end
  end
  def ensure_destroy_cleanup
    #Delete to stop circular effect
    puts "comment destroyed"
    self.father.delete
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

      elsif params.has_key?(:document_id)

        object = Document.includes(:owner).where(:id => params[:document_id]).first
        user = object.owner
        if object.mime =~ /image/
          resource_type = "photo"
        else
          resource_type = "document"
        end
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
                                                    :text => text,:enrich => false).id

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
#  created_at  :datetime
#  updated_at  :datetime
#

