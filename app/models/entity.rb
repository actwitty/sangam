################# CAUTION!!  Should Not call delete of entity as we are going to hold them fore ever as of now :) #################
class Entity < ActiveRecord::Base

  # this nullify is in case some body deletes an entity for a reason . this SHOULD NOT happen though
  has_many      :hubs, :dependent => :nullify

  has_many      :activities, :through => :hubs
  has_many      :activity_words, :through => :hubs
  has_many      :locations, :through => :hubs
  has_many      :users, :through => :hubs

#  has_one       :entity_ownership, :dependent => :destroy    #should destroy
#  has_many      :entity_types, :dependent => :destroy

  has_many       :campaigns, :dependent => :destroy

  validates_presence_of   :entity_name, :entity_guid
  validates_uniqueness_of :entity_guid, :unique => true


  class << self
  #  {:id => "/en/dropbox",         #unique id regarding entity always present=> /[SERVICE]/[OEM_ID]
  #   :name=> "Dropbox",      //name of entity   always present
  #   :type=> {:id=>"/music/artist" #service specific
  #            , :name=>"Musical Artist"}
  #   :svc => "freebase" }
  #
    def create_entities(entity_hash ={})

      entity_type = nil

      begin
        id = "/" + entity_hash[:svc] + entity_hash[:id]
        entity = Entity.create!(:entity_guid => id,
                                :entity_name => entity_hash[:name].downcase,
                                :entity_type_id => entity_hash[:type][:id],
                                :entity_type_name => entity_hash[:type][:name], :entity_svc => entity_hash[:svc])

        return entity
      rescue => e
        Rails.logger.error("[MODEL] [ENTITY] [CREATE_ENTITY] **** Rescue **** #{e.message} For #{entity_hash}" )

         #Validation Uniqueness fails
        if /has already been taken/ =~ e.message
          Rails.logger.info("[MODEL] [ENTITY] [CREATE_ENTITY]  => Rescue => UNIQUE INDEX FOUND " +  e.message + " " + entity_hash[:id] )
          entity = Entity.where(:entity_guid => id).first
          return entity
        end
      end
    end

    #INPUT => {:name => "foo"}
    #OUPUT => [
    #           {
    #             :id => entity.id, :name => "sachin tendulkar", :image => "http://xyz.com",:time => Thu, 14 Jul 2011 05:42:20 UTC +00:00,
    #             :description => "http://wikipedia.com/sachin_tendulkar",  :type => {'id' => '/cricket/athlete' , 'name' => 'athlete'}
    #          }
    #     ,...]
    def search(params)
      Rails.logger.info("[MODEL] [ENTITY] [SEARCH] entering #{params}")
      array = []
      if !params[:name].blank?
        where( ['entity_name ILIKE ?', "#{params[:name]}%"]).order("updated_at DESC").each do |attr|
              array << format_entity(attr)
        end
       end
      Rails.logger.info("[MODEL] [ENTITY] [SEARCH] leaving #{params}")
      array
    end
  end
end










# == Schema Information
#
# Table name: entities
#
#  id               :integer         not null, primary key
#  entity_name      :text            not null
#  entity_guid      :text            not null
#  entity_type_id   :text
#  entity_type_name :text
#  entity_svc       :text
#  created_at       :datetime        not null
#  updated_at       :datetime        not null
#

