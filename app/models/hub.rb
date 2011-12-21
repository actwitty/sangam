class Hub < ActiveRecord::Base
  belongs_to :user
  belongs_to :activity
  belongs_to :location
  belongs_to :entity #, :touch => true
  belongs_to :activity_word
  belongs_to :summary

  validates_existence_of  :activity_id
  validates_existence_of  :activity_word_id
  validates_existence_of  :user_id
  validates_existence_of  :summary_id

  validates_existence_of  :entity_id , :allow_nil => true
  validates_existence_of  :location_id , :allow_nil => true

  validates_presence_of   :source_name, :status

  validates_length_of     :source_name,  :in => 1..AppConstants.source_name_length

end




# == Schema Information
#
# Table name: hubs
#
#  id               :integer         not null, primary key
#  activity_id      :integer         not null
#  activity_word_id :integer         not null
#  entity_id        :integer
#  user_id          :integer         not null
#  location_id      :integer
#  summary_id       :integer         not null
#  source_name      :text            not null
#  status           :integer         not null
#  category_type    :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

