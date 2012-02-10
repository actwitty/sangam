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
     include TextFormatter
     include QueryPlanner
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
#      entity_hash.delete('mid') if !entity_hash['mid'].blank?
#      entity_hash.delete('name') if !entity_hash['name'].blank?
#      begin
#
#         #entity_hash[:type].each do |k|
#         if !entity_hash[:type].blank?
#           id = EntityType.create!(:entity_id => entity.id,:entity_type_uri => entity_hash[:type][:id],
#                                 :entity_type_name => entity_hash[:type][:name].downcase)
#         end
#         #end
#
#         #entity_hash.delete('type') if !entity_hash['type'].blank?
#
#         puts "==== #{entity.inspect}"
#         EntityOwnership.create!(:owner_id => owner_id, :entity_id => entity.id)
#
#      rescue => e
#        entity.destroy
#        puts "***** #{entity}"
#        entity_id = nil
#        Rails.logger.info("Entity => CreateEntity or CreateOwnership=> Type => Rescue " +  e.message )
#        return nil
#      end
      #entity
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
        where( ['entity_name ILIKE ?', "#{params[:name]}%"]).order("updated_at DESC").limit(AppConstants.max_number_of_entities).each do |attr|
              array << format_entity(attr)
        end
       end
      Rails.logger.info("[MODEL] [ENTITY] [SEARCH] leaving #{params}")
      array
    end


    #INPUT => {:entity_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601), :current_user_id => 1234}
    #OUTPUT => { :id => 12435, :image => "http://freebase.com",:description => "http://freebase.com"
    #:stream => [{:post => .... }]# same as stream
    ##COMMENT => If updated_at parameter is sent, it means client already has entity info so, only stream part will be
    #sent.
    ##COMMENT=> Wikipedia description is optional. Still need to get the proper url for description even for
    # freebase as new apis are changed
    def get_entity_stream(params)
      h = {}

      Rails.logger.debug("[MODEL] [Entity] [get_entity_stream] entering")

      e = Entity.where(:id => params[:entity_id]).first

      if e.blank?
        Rails.logger.debug("[MODEL] [Entity] [get_entity_stream] returning blank JSON")
        return {}
      end

      hash = format_entity(e)

      h[:entity_id] =  params[:entity_id]

      h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

      h = pq_hub_filter(h)

      activity = Hub.where(h).limit(AppConstants.max_number_of_activities).group(:activity_id).order("MAX(updated_at) DESC").count

      hash[:stream] = Activity.get_all_activity({:current_user_id => params[:current_user_id], :activity_ids => activity.keys})

      Rails.logger.debug("[MODEL] [Entity] [get_entity_stream] leaving")

      hash

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
#  created_at       :datetime
#  updated_at       :datetime
#

