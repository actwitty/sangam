################# CAUTION!!  Should Not call delete of entity as we are going to hold them fore ever as of now :) #################
class Entity < ActiveRecord::Base

  serialize :entity_doc, Hash

  # this nullify is in case some body deletes an entity for a reason . this SHOULD NOT happen though
  has_many      :hubs, :dependent => :nullify

  has_many      :activities, :through => :hubs
  has_many      :activity_words, :through => :hubs
  has_many      :locations, :through => :hubs
  has_many      :users, :through => :hubs

  has_one       :entity_ownership, :dependent => :destroy    #should destroy
  has_many      :entity_types, :dependent => :destroy
  has_one       :entity_document, :dependent => :destroy

  has_many       :campaigns, :dependent => :destroy

  validates_presence_of   :entity_name, :entity_guid, :entity_doc, :entity_image
  validates_uniqueness_of :entity_guid, :unique => true

  validates_length_of     :entity_name, :in => 1..255
  validates_length_of     :entity_guid, :in => 1..255
  validates_length_of     :entity_image, :in => 1..AppConstants.url_length

  #validates_format_of :entity_image, :with =>  eval(AppConstants.url_validator), :unless => Proc.new{|a| a.entity_image == AppConstants.entitiy_no_image}

  class << self

  #  {'guid'=>nil,         //unique id regarding entity   always present if content found in freebase
  #   'name'=>nil,      //name of entity   always present
  #   'mid'=>nil,        // machine ID       always present if content found on freebase
  #  '/common/topic/alias'=>[],      //alias name  optional array form
  #  '/common/topic/image'=>[{'id'=>nil}],  //image optional array of hashes. hash con
  #  'key'=>{'namespace'=>'/wikipedia/en_id','value'=>nil}   // wikipedia link in hash form value will contain wikipedia content id  optional
  #  'type'=>[{'id'=>nil,'name'=>nil}]  //type info   array of hashes  id=> /common/topic   name=>"Topic"}
  #
    def create_entities(owner_id = nil, entity_hash ={})

      entity_type = nil
      if !entity_hash.has_key?('mid') or entity_hash['mid'].nil?
        return nil
      end

      begin

      entity_hash['image'].blank? ? entity_image = AppConstants.entitiy_no_image : entity_image = entity_hash['image']

      #delete unnecessary information
      entity_hash.delete('image') if !entity_hash['image'].nil?
      entity_hash.delete('relevance:score') if !entity_hash['relevance:score'].nil?
      entity_hash.delete('/common/topic/image') if !entity_hash['/common/topic/image'].nil?
      entity_hash.delete('guid') if !entity_hash['guid'].nil?


      if !entity_hash['type'].blank?
        entity_type =  entity_hash['type']
        entity_hash.delete('type')
      end

      entity = Entity.create!(:entity_guid => entity_hash['mid'], :entity_name => entity_hash['name'].downcase,
                              :entity_doc => entity_hash, :entity_image => entity_image)


      rescue => e
        Rails.logger.info("Entity => CreateEntity => Rescue " +  e.message )
         #Validation Uniqueness fails
        if /has already been taken/ =~ e.message
          Rails.logger.info("Entity => CreateEntity => Rescue => Unique " +  e.message + " " + entity_hash['mid'] )
          entity = Entity.where(:entity_guid => entity_hash['mid']).first
          return entity
        end
      end
      entity_hash.delete('mid') if !entity_hash['mid'].blank?
      entity_hash.delete('name') if !entity_hash['name'].blank?
      begin

         entity_type.each do |entry|
         id = EntityType.create!(:entity_id => entity.id , :entity_type_uri => entry['id'],
                             :entity_type_name => entry['name'].downcase)
         end

         entity_hash.delete('type') if !entity_hash['type'].blank?

         puts "==== #{entity.inspect}"
         EntityOwnership.create!(:owner_id => owner_id, :entity_id => entity.id)

      rescue => e
        entity.destroy
        puts "***** #{entity}"
        entity_id = nil
        Rails.logger.info("Entity => CreateEntity or CreateOwnership=> Type => Rescue " +  e.message )
        return nil
      end


      return entity
    end

    #return relations .. use each, all, first to load object
    def find_entity_by_name(name)
      Entity.where(:entity_name => name.downcase)
    end

    #return object
    def find_entity_by_guid(guid)
      Entity.where(:entity_guid => guid).first
    end

    #return relations .. use each, all, first to load object
    def search_entity_by_type(type)
      Entity.joins(:entity_types).where(:entity_types => {:entity_type_name => type.downcase} )
    end
  end

end

# == Schema Information
#
# Table name: entities
#
#  id           :integer         not null, primary key
#  entity_name  :string(255)     not null
#  entity_guid  :string(255)     not null
#  entity_image :text            not null
#  entity_doc   :text            not null
#  created_at   :datetime
#  updated_at   :datetime
#

