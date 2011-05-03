# == Schema Information
# Schema version: 20110501112607
#
# Table name: entities
#
#  id                                :integer(4)      not null, primary key
#  entity_name                       :string(255)
#  entity_type                       :string(255)
#  entity_url                        :string(255)
#  entity_location_lat               :integer(10)
#  entity_location_long              :integer(10)
#  entity_most_popular_location_lat  :integer(10)
#  entity_most_popular_location_long :integer(10)
#  entity_photo_l                    :string(255)
#  entity_photo_m                    :string(255)
#  entity_photo_s                    :string(255)
#  entity_desc                       :string(255)
#  entity_category                   :string(255)
#  entity_vote_ups                   :integer(4)
#  entity_vote_downs                 :integer(4)
#  entity_deal_id                    :integer(4)
#  entity_is_business_active         :boolean(1)
#  entity_announcements              :string(255)
#  entity_page_theme                 :string(255)
#  entity_active                     :boolean(1)
#  entity_abuse                      :integer(4)
#  entity_adult_check                :boolean(1)
#  entity_creator_name               :string(255)
#  entity_creator_id                 :integer(4)
#  entity_most_popular_name          :string(255)
#  entity_most_popular_name_id       :integer(4)
#  entity_closest_activity           :string(255)
#  created_at                        :datetime
#  updated_at                        :datetime
#

class Entity < ActiveRecord::Base

  has_many :hubs
  has_many :activities, :through => :hubs
  has_many :users, :through => :hubs
  has_many :posts, :through => :hubs 
  
  has_many :loop_views
  has_many :loops, :through => :loop_views

end
