# == Schema Information
# Schema version: 20110501132203
#
# Table name: comments
#
#  id               :integer(4)      not null, primary key
#  comment_text     :string(255)
#  attachment_url   :string(255)
#  attachment_url_s :string(255)
#  attachment_name  :string(255)
#  attachment_type  :string(255)
#  post_id          :integer(4)
#  created_at       :datetime
#  updated_at       :datetime
#  author_id        :integer(4)
#

class Comment < ActiveRecord::Base

  belongs_to :post 
  belongs_to :author, :class_name => 'User'
  
  validates_presence_of :post
end
