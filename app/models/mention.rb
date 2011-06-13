# == Schema Information
# Schema version: 20110609094335
#
# Table name: mentions
#
#  id          :integer         not null, primary key
#  activity_id :integer         not null
#  user_id     :integer         not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Mention < ActiveRecord::Base

  belongs_to :user
  belongs_to :activity

  validates_existence_of :user
  validates_existence_of :activity

  validates_uniqueness_of :activity_id, :scope => :user_id

  validates_numericality_of :mention_count,:only_integer => true,:greater_than_or_equal_to => 1
end