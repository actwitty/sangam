# == Schema Information
# Schema version: 20110530100149
#
# Table name: geo_locations
#
#  id            :integer(4)      not null, primary key
#  location_id   :integer(4)
#  geo_latitude  :decimal(10, 7)  not null
#  geo_longitude :decimal(10, 7)  not null
#  geo_name      :text            default(""), not null
#  created_at    :datetime
#  updated_at    :datetime
#

class GeoLocation < ActiveRecord::Base
  geocoded_by :address, :latitude  => :geo_latitude, :longitude => :geo_longitude # ActiveRecord

  belongs_to :location

  validates_existence_of :location_id

  validates_presence_of  :geo_latitude, :geo_longitude, :geo_name
  validates_numericality_of :geo_latitude, :greater_than_or_equal_to => -90 ,:less_than_or_equal_to => 90
  validates_numericality_of :geo_longitude, :greater_than_or_equal_to => -180 ,:less_than_or_equal_to => 180

  validates_uniqueness_of :location_id
  validates_uniqueness_of  :geo_latitude, :scope => :geo_longitude

  validates_length_of :geo_name, :in => 1..1024

  before_save :cant_change_location_lat_long_name
  after_save :log_confirmation

  protected


  def cant_change_location_lat_long_name

    if !new_record?
        Rails.logger.info("Trying to edit Geo Location - Not Allowed")
        raise ActiveRecord::RecordNotSaved.new(self)
    end
  end

  def log_confirmation
    puts "Geo Location Created"
    Rails.logger.info("Geo Location Created lat =  #{self.geo_latitude.to_s} long = self.geo_longitude.to_s
                      name = #{self.geo_name}" )
  end
end
