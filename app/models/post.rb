# == Schema Information
# Schema version: 20110512124055
#
# Table name: posts
#
#  id            :integer(4)      not null, primary key
#  author_id     :integer(4)
#  activity_id   :integer(4)
#  activity_name :string(255)
#  post_text     :text
#  created_at    :datetime
#  updated_at    :datetime
#

class Post < ActiveRecord::Base

  belongs_to :author , :class_name => "User"

  validates_presence_of :author_id, :allow_nil => true
end
