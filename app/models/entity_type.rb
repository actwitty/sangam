class EntityType < ActiveRecord::Base

  belongs_to :entity

  validates_existence_of :entity

  validates_presence_of :entity_type_uri, :entity_type_name

  validates_length_of :entity_type_uri, :in => 1..255
  validates_length_of :entity_type_name, :in => 1..255

  #TODO
  #validates_format_of :entity_type_value
end
