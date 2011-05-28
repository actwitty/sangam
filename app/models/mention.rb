class Mention < ActiveRecord::Base

  belongs_to :user
  belongs_to :activity

  validates_existence_of :user
  validates_existence_of :activity

  validates_uniqueness_of :activity_id, :scope => :user_id

  validates_numericality_of :mention_count,:only_integer => true,:greater_than_or_equal_to => 1
end
