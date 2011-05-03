# == Schema Information
# Schema version: 20110501130637
#
# Table name: loops
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  public     :boolean(1)
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer(4)
#

class Loop < ActiveRecord::Base

  belongs_to :user
  has_many :loop_memberships

end
