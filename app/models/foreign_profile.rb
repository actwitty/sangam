class ForeignProfile < ActiveRecord::Base
  belongs_to :authentication



  def import_facebook(foreign_data)
    Rails.logger.info("[CNTRL][import_facebook] Called.")
    Rails.logger.info("[CNTRL][import_facebook] #{foreign_data}")


    self.name = foreign_data["name"]
    self.first_name = foreign_data["first_name"]
    self.last_name = foreign_data["last_name"]
    self.image = "http://graph.facebook.com/#{foreign_data["id"]}/picture?type=square"
    self.url = foreign_data["link"]
    self.gender = foreign_data["gender"]
    self.email = foreign_data["email"]

    if !foreign_data["location"].nil? and !foreign_data["location"]["name"].nil?
      self.location = foreign_data["location"]["name"]
    end

    if !foreign_data["birthday"].nil?
      self.dob = foreign_data["birthday"]
    end

    if !foreign_data["hometown"].nil? and !foreign_data["hometown"]["name"].nil?
      self.hometown = foreign_data["hometown"]["name"]
    end
    
    if !foreign_data["timezone"].nil?
      self.timezone = foreign_data["timezone"]
    end
    
    if !self.locale = foreign_data["locale"].nil?
      self.locale = foreign_data["locale"]
    end



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


# == Schema Information
#
# Table name: foreign_profiles
#
#  id                   :integer         not null, primary key
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
#  authentication_id    :integer
#  dob                  :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#

