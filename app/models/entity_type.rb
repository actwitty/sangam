# == Schema Information
# Schema version: 20110609094335
#
# Table name: entity_types
#
#  id               :integer         not null, primary key
#  entity_id        :integer         not null
#  entity_type_uri  :string(255)
#  entity_type_name :string(255)     not null
#  created_at       :datetime
#  updated_at       :datetime
#

class EntityType < ActiveRecord::Base

  belongs_to :entity

  validates_existence_of :entity_id

  validates_presence_of :entity_type_uri, :entity_type_name

  validates_length_of :entity_type_uri, :in => 1..255
  validates_length_of :entity_type_name, :in => 1..255

  #TODO
  #validates_format_of :entity_type_value
end
