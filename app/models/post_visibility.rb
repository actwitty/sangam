# == Schema Information
# Schema version: 20110501112607
#
# Table name: post_visibilities
#
#  id         :integer(4)      not null, primary key
#  hidden     :boolean(1)
#  post_id    :integer(4)
#  contact_id :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

class PostVisibility < ActiveRecord::Base

  belongs_to :contact
  belongs_to :post

  validates_uniqueness_of :post_id, :scope => :contact_id
end
