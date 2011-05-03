# == Schema Information
# Schema version: 20110501123108
#
# Table name: contacts
#
#  id         :integer(4)      not null, primary key
#  status     :string(255)
#  pending    :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer(4)
#

class Contact < ActiveRecord::Base

  belongs_to :user 

  has_many :loop_memberships
  has_many :loops, :through => :loop_memberships

end
