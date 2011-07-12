class Comment < ActiveRecord::Base

  belongs_to :author, :class_name => "User"
  belongs_to :activity

  belongs_to :father, :class_name => "Activity"

  validates_existence_of :activity_id, :author_id, :father_id

  validates_uniqueness_of :father_id
  validates_uniqueness_of :activity_id, :scope => :author_id

  validates_presence_of :text
  validates_length_of :text, :in => 1..AppConstants.comment_text_length

  has_many :campaigns, :dependent => :destroy

  after_destroy :ensure_destroy_cleanup

  def ensure_destroy_cleanup
    #Delete to stop circular effect
    self.father.delete
  end

end
