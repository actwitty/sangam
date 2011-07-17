class Comment < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity,  :touch => true, :counter_cache => true

  belongs_to :father, :class_name => "Activity"

  validates_existence_of :activity_id, :author_id, :father_id

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
    # :text => "hello"

    def create_comment(params ={})
      params[:father_id] =  Activity.create_activity(:author_id => params[:author_id],
                                                      :activity => "&#{AppConstants.default_comment_string}&" ,
                                                    :text => params[:text],:enrich => false).id

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
#  activity_id :integer         not null
#  father_id   :integer         not null
#  text        :text            not null
#  created_at  :datetime
#  updated_at  :datetime
#

