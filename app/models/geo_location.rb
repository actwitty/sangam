# == Schema Information
# Schema version: 20110528065055
#
# Table name: geo_locations
#
#  id            :integer(4)      not null, primary key
#  geo_latitude  :decimal(10, 7)  not null
#  geo_longitude :decimal(10, 7)  not null
#  geo_name      :text            default(""), not null
#  created_at    :datetime
#  updated_at    :datetime
#

class GeoLocation < ActiveRecord::Base

  belongs_to :location

  validates_presence_of  :geo_latitude, :geo_longitude, :geo_name
  validates_numericality_of :geo_latitude, :greater_than_or_equal_to => -90 ,:less_than_or_equal_to => 90
  validates_numericality_of :geo_longitude, :greater_than_or_equal_to => -180 ,:less_than_or_equal_to => 180

  validates_uniqueness_of  :geo_latitude, :scope => :geo_longitude

  validates_length_of :geo_name, :in => 1..1024
end
