# == Schema Information
# Schema version: 20110501131650
#
# Table name: likes
#
#  id            :integer(4)      not null, primary key
#  like_positive :string(255)
#  post_id       :integer(4)
#  created_at    :datetime
#  updated_at    :datetime
#  author_id     :integer(4)
#

class Like < ActiveRecord::Base

  belongs_to :post
  belongs_to :author, :class_name => 'User'
    
  validates_presence_of :post
  validates_uniqueness_of :post_id, :scope => :author_id, :on => :create
end
