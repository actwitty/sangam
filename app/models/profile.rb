# == Schema Information
# Schema version: 20110501112607
#
# Table name: profiles
#
#  id               :integer(4)      not null, primary key
#  first_name       :string(255)
#  last_name        :string(255)
#  nick_name        :string(255)
#  short_status     :string(255)
#  profile_photo_l  :string(255)
#  profile_photo_m  :string(255)
#  profile_photo_s  :string(255)
#  home_location    :string(255)
#  home_geo_lat     :integer(10)
#  home_geo_long    :integer(10)
#  current_location :string(255)
#  current_geo_lat  :integer(10)
#  current_geo_long :integer(10)
#  age              :integer(4)
#  sex              :string(255)
#  theme            :string(255)
#  dob              :date
#  address          :string(255)
#  company_name     :string(255)
#  phone_number     :string(255)
#  mobile_number    :string(255)
#  favorite_pal     :string(255)
#  work_area        :string(255)
#  interest         :string(255)
#  home_page        :string(255)
#  twitter_id       :string(255)
#  facebook_id      :string(255)
#  google_id        :string(255)
#  open_id          :string(255)
#  tag_string       :string(255)
#  email            :string(255)
#  searchable       :string(255)
#  verified_account :boolean(1)
#  is_celebrity     :boolean(1)
#  abuse_count      :integer(4)
#  user_id          :integer(4)
#  created_at       :datetime
#  updated_at       :datetime
#

class Profile < ActiveRecord::Base
  
  belongs_to :user

end
