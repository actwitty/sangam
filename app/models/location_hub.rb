# == Schema Information
# Schema version: 20110616040229
#
# Table name: location_hubs
#
#  id                 :integer         not null, primary key
#  web_join_id        :integer
#  geo_join_id        :integer
#  unresolved_join_id :integer
#  created_at         :datetime
#  updated_at         :datetime
#

class LocationHub < ActiveRecord::Base
  belongs_to :web_join, :class_name => "Location", :touch => true
  belongs_to :geo_join, :class_name => "Location", :touch => true
  belongs_to :unresolved_join, :class_name => "Location", :touch => true

  validates_existence_of :web_join_id, :allow_nil => true
  validates_existence_of :geo_join_id, :allow_nil => true
  validates_existence_of :unresolved_join_id, :allow_nil => true

  validates_uniqueness_of   :web_join_id , :scope => [:geo_join_id, :unresolved_join_id], :allow_blank => true

  validates_uniqueness_of   :geo_join_id , :scope => [:web_join_id, :unresolved_join_id], :allow_blank => true

  validates_uniqueness_of   :unresolved_join_id , :scope => [:web_join_id, :geo_join_id], :allow_blank => true

end
