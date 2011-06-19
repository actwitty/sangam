# == Schema Information
# Schema version: 20110605183950
#
# Table name: profiles
#
#  id                  :integer(4)      not null, primary key
#  first_name          :string(255)
#  last_name           :string(255)
#  short_status        :string(255)
#  profile_photo_l     :string(255)
#  profile_photo_m     :string(255)
#  profile_photo_s     :string(255)
#  home_location       :string(255)
#  home_geo_lat        :integer(10)
#  home_geo_long       :integer(10)
#  current_location    :string(255)
#  current_geo_lat     :integer(10)
#  current_geo_long    :integer(10)
#  age                 :integer(4)
#  sex                 :string(255)
#  theme               :string(255)
#  dob                 :date
#  address             :string(255)
#  company_name        :string(255)
#  phone_number        :string(255)
#  mobile_number       :string(255)
#  work_area           :string(255)
#  interest            :string(255)
#  home_page           :string(255)
#  tag_string          :string(255)
#  email               :string(255)
#  searchable          :string(255)
#  verified_account    :boolean(1)
#  is_celebrity        :boolean(1)
#  abuse_count         :integer(4)
#  is_terms_accepted   :boolean(1)
#  is_privacy_accepted :boolean(1)
#  user_id             :integer(4)
#  created_at          :datetime
#  updated_at          :datetime
#

class Profile < ActiveRecord::Base

  belongs_to :user


   # validate presence of foreign key
  validates_presence_of :user

  # validate uniqueness of user_id as user_id has one and only one profile
  validates_uniqueness_of :user_id

  before_validation :strip_field

  # validate lengths

  validates :first_name, :presence => true, :length => { :maximum => 32 }
  validates_length_of :last_name,  :maximum => 32
  validates_length_of :mobile_number, :in => 7..32, :allow_nil => true
  validates_length_of :phone_number, :in => 7..32, :allow_nil => true
  validates_length_of :company_name, :maximum => 64, :allow_nil => true
  validates_length_of :work_area, :maximum => 64, :allow_nil => true
  validates_length_of :interest, :maximum => 128, :allow_nil => true
  validates_length_of :home_page, :maximum => 250, :allow_nil => true
  validates_length_of :home_location, :maximum => 128, :allow_nil => true
  validates_length_of :current_location, :maximum => 128, :allow_nil => true
  validates_length_of :short_status, :maximum => 200, :allow_nil => true


  #validate gender can only be one of three
  validates_inclusion_of :sex, :in => ['male','female','other'],:allow_nil => true
  validates_acceptance_of :is_terms_accepted,
                          :on => :create,
                          :accept => true,
                          :message => "Terms of service has to be accepted"
  validates_acceptance_of :is_privacy_accepted,
                          :on => :create,
                          :accept => true,
                          :message => "Privacy policy has to be accepted"

  #validate date of birth has already elapsed
  # gem 'date_validator'
  validates :dob, :date => { :before => Time.now, :after => Time.now - 125.year }, :allow_blank => true

  #validate float precisions to 4 places after decimal
  validates_format_of :current_geo_lat, :with => /^[0-9]+\.[0-9]{4}$/, :allow_blank => true
  validates_format_of :current_geo_long, :with => /^[0-9]+\.[0-9]{4}$/, :allow_blank => true
  validates_format_of :home_geo_lat, :with => /^[0-9]+\.[0-9]{4}$/, :allow_blank => true
  validates_format_of :home_geo_long, :with => /^[0-9]+\.[0-9]{4}$/, :allow_blank => true

  validates_existence_of :user      #works both ways

  def strip_field
        
     if email.present?
      email.strip!
      email.downcase!
    end
  end

  ############################################# 
  # add validate url from a universal validator
  # profile_photo_l
  # profile_photo_m
  # profile_photo_s
  # home_page
  ##############################################

end
