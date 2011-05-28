################# CAUTION!!  Should Not call delete of entity as we are going to hold them fore ever as of now :) #################
class Entity < ActiveRecord::Base

  # this nullify is in case some body deletes an entity for a reason . this SHOULD NOT happen though
  has_many      :hubs, :dependent => :nullify

  has_many      :activities, :through => :hubs
  has_many      :activity_dicts, :through => :hubs
  has_many      :locations, :through => :hubs
  has_many      :users, :through => :hubs

  has_one       :entity_ownership, :dependent => :destroy    #should destroy
  has_many      :entity_types, :dependent => :destroy
  has_one       :entity_document, :dependent => :destroy

  validates_presence_of   :entity_name

  validates_length_of      :entity_name, :in => 1..255

end
