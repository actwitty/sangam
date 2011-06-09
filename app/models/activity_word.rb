class ActivityWord < ActiveRecord::Base
  has_many :word_forms
  #should not get deleted
  has_many :activities, :dependent => :destroy
end
