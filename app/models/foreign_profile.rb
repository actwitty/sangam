# == Schema Information
# Schema version: 20110616040229
#
# Table name: foreign_profiles
#
#  id                   :integer         not null, primary key
#  name                 :string(255)
#  screen_name          :string(255)
#  first_name           :string(255)
#  last_name            :string(255)
#  dob                  :string(255)
#  image                :string(255)
#  url                  :string(255)
#  gender               :string(255)
#  email                :string(255)
#  hometown             :string(255)
#  location             :string(255)
#  timezone             :float
#  locale               :string(255)
#  foreign_updated_time :string(255)
#  authentication_id    :integer
#  created_at           :datetime
#  updated_at           :datetime
#

class ForeignProfile < ActiveRecord::Base
  belongs_to :authentication



  def import_facebook(foreign_data)
    Rails.logger.info("[CNTRL][import_facebook] #{foreign_data}")
    self.name = foreign_data["name"]
    self.first_name = foreign_data["first_name"]
    self.last_name = foreign_data["last_name"]
    self.image = "http://graph.facebook.com/#{foreign_data["id"]}/picture?type=square"
    self.url = foreign_data["link"]
    self.gender = foreign_data["gender"]
    self.email = foreign_data["email"]
    self.location = foreign_data["location"]["name"]
    self.dob = foreign_data["birthday"]
    self.hometown = foreign_data["hometown"]["name"]
    self.timezone = foreign_data["timezone"]
    self.locale = foreign_data["locale"]



    Rails.logger.info("[CNTRL][import_facebook] Just before Save")
    self.save!
    Rails.logger.info("[CNTRL][import_facebook] Just after Save")
  end


  def import_twitter(foreign_data)
    Rails.logger.info("[CNTRL][import_twitter] #{foreign_data}")
    self.name = foreign_data["name"]
    self.image = foreign_data["profile_image_url"]
    self.location = foreign_data["location"]
    self.screen_name = foreign_data["screen_name"]
    self.locale = foreign_data["lang"]
    self.url = foreign_data["url"]
    Rails.logger.info("[CNTRL][import_facebook] Just before Save")
    self.save!
    Rails.logger.info("[CNTRL][import_facebook] Just after Save")
  end



end
