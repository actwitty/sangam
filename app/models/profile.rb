class Profile < ActiveRecord::Base

  belongs_to :user


   # validate presence of foreign key
  validates_presence_of :user

  # validate uniqueness of user_id as user_id has one and only one profile
  validates_uniqueness_of :user_id

  validates_existence_of :user      #works both ways
  

  def profile_enable_service(name)
    Rails.logger.info("[MODEL] [PROFILE] enable service #{name}")
    self[name + '_service_enabled'] = true
    self.save
  end


end




# == Schema Information
#
# Table name: profiles
#
#

