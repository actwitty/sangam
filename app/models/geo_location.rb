class GeoLocation < ActiveRecord::Base

  belongs_to :location

  validates_presence_of  :geo_latitude, :geo_longitude, :geo_name
  validates_numericality_of :geo_latitude, :greater_than_or_equal_to => -90 ,:less_than_or_equal_to => 90
  validates_numericality_of :geo_longitude, :greater_than_or_equal_to => -180 ,:less_than_or_equal_to => 180

  validates_uniqueness_of  :geo_latitude, :scope => :geo_longitude

  validates_length_of :geo_name, :in => 1..1024
end
