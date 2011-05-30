# == Schema Information
# Schema version: 20110530100149
#
# Table name: unresolved_locations
#
#  id                       :integer(4)      not null, primary key
#  location_id              :integer(4)      not null
#  unresolved_location_name :string(255)     not null
#  created_at               :datetime
#  updated_at               :datetime
#

class UnresolvedLocation < ActiveRecord::Base
  belongs_to  :location

  validates_existence_of :location

  validates_presence_of :unresolved_location_name

  validates_length_of :unresolved_location_name, :maximum => 255

  validates_uniqueness_of :location_id, :unresolved_location_name
end
