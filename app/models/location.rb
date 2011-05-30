# == Schema Information
# Schema version: 20110528065055
#
# Table name: locations
#
#  id            :integer(4)      not null, primary key
#  location_type :integer(4)      not null
#  created_at    :datetime
#  updated_at    :datetime
#

class Location < ActiveRecord::Base

  has_many :hubs, :dependent => :nullify

  has_many :activities, :through => :hubs
  has_many :activity_dicts, :through => :hubs
  has_many :entities, :through => :hubs
  has_many :users, :through => :hubs

  #all urls should be destroyed
  has_one :web_location, :dependent => :destroy
  has_one :geo_location, :dependent => :destroy
  has_one :unresolved_location, :dependent => :destroy

  validates_presence_of :location_type

  validates_numericality_of :location_type,:only_integer => true,:greater_than_or_equal_to => 1,:less_than_or_equal_to => 2

end
