# == Schema Information
# Schema version: 20110605183950
#
# Table name: foreign_profiles
#
#  id                   :integer(4)      not null, primary key
#  name                 :string(255)
#  screen_name          :string(255)
#  first_name           :string(255)
#  last_name            :string(255)
#  image                :string(255)
#  url                  :string(255)
#  gender               :string(255)
#  email                :string(255)
#  hometown             :string(255)
#  location             :string(255)
#  timezone             :float
#  locale               :string(255)
#  foreign_updated_time :string(255)
#  authentication_id    :integer(4)
#  created_at           :datetime
#  updated_at           :datetime
#

class ForeignProfile < ActiveRecord::Base
  belongs_to :authentication



  def import_facebook(foreign_data)
    self.name = foreign_data["name"]
    self.first_name = foreign_data["first_name"]
    self.last_name = foreign_data["last_name"]
    self.image = "http://graph.facebook.com/" + foreign_data["id"] + "/picture/"
    self.url = foreign_data["link"]
    self.gender = foreign_data["gender"]
    self.email = foreign_data["email"]
    self.location = foreign_data["locaiton"]
    self.hometown = foreign_data["hometown"]
    self.timezone = foreign_data["timezone"]
    self.locale = foreign_data["locale"]


    self.save!
  end

  def import_twitter(foreign_data)
    self.name = foreign_data["name"]
    self.image = foreign_data["profile_image_url"]
    self.location = foreign_data["locaiton"]
    self.screen_name = foreign_data["screen_name"]
    self.locale = foreign_data["lang"]
    self.url = foreign_data["url"]

    self.save!
  end



end
