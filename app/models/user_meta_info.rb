class UserMetaInfo < ActiveRecord::Base
  belongs_to :user
  validates_existence_of :user
end
