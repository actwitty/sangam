# == Schema Information
# Schema version: 20110609094335
#
# Table name: location_hubs
#
#  id                     :integer         not null, primary key
#  location_web_id        :integer
#  location_geo_id        :integer
#  location_unresolved_id :integer
#  created_at             :datetime
#  updated_at             :datetime
#

class LocationHub < ActiveRecord::Base
  belongs_to :location_web, :class_name => "Location", :touch => true
  belongs_to :location_geo, :class_name => "Location", :touch => true
  belongs_to :location_unresolved, :class_name => "Location", :touch => true

  validates_existence_of :location_web_id, :allow_nil => true
  validates_existence_of :location_geo_id, :allow_nil => true
  validates_existence_of :location_unresolved_id, :allow_nil => true

  validates_uniqueness_of   :location_web_id , :scope => [:location_geo_id, :location_unresolved_id], :allow_blank => true

  validates_uniqueness_of   :location_geo_id , :scope => [:location_web_id, :location_unresolved_id], :allow_blank => true

  validates_uniqueness_of   :location_unresolved_id , :scope => [:location_web_id, :location_geo_id], :allow_blank => true

end
