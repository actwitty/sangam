# == Schema Information
# Schema version: 20110609094335
#
# Table name: locations
#
#  id            :integer         not null, primary key
#  location_type :integer         not null
#  location_name :text            not null
#  created_at    :datetime
#  updated_at    :datetime
#

class Location < ActiveRecord::Base

  has_many :hubs, :dependent => :nullify

  has_many :activities, :through => :hubs
  has_many :activity_words, :through => :hubs
  has_many :entities, :through => :hubs
  has_many :users, :through => :hubs

  #all urls should be destroyed
  has_one :web_location, :dependent => :destroy
  has_one :geo_location, :dependent => :destroy
  has_one :unresolved_location, :dependent => :destroy

  has_many :web_joins, :class_name => "LocationHub", :foreign_key => :web_join_id, :dependent => :destroy
  has_many :geo_joins,:class_name => "LocationHub", :foreign_key => :geo_join_id, :dependent => :destroy
  has_many :unresolved_joins, :class_name => "LocationHub",:foreign_key => :unresolved_join_id, :dependent => :destroy

  has_many  :campaigns, :dependent => :destroy

  validates_presence_of :location_type, :location_name

  validates_numericality_of :location_type, :greater_than_or_equal_to => 1 , :less_than_or_equal_to => 3

  validates_length_of :location_name , :in => 1..1024

  before_save :ensure_proper_location_type

  before_destroy :ensure_proper_clean_up

  protected

  def  ensure_proper_location_type
    Rails.logger.info("Location Save")
  end

  def ensure_proper_clean_up
    Rails.logger.info( "Location Destroy " + self.location_type.to_s)
  end


  #Return an LOCATION Object on New location creation or already existing location
  #In case of other errors nil is returned
  #Ned to make more DRY
  def self.CreateLocation(location_hash = {})

    if !location_hash[:web_location].nil? and !location_hash[:web_location][:web_location_url].blank?
      loc_type = 1
      new_hash = location_hash[:web_location]

      new_hash[:web_location_url]=new_hash[:web_location_url]

      if !new_hash[:web_location_url].nil?
        if ! (/^(http|https):\/\// =~ new_hash[:web_location_url])
          new_hash[:web_location_url] = "http://"  + new_hash[:web_location_url]
        end
      end

      klass = "WebLocation"
      assoc  = :web_location
      assocs = :web_locations
      uniq_hash = {:web_location_url => new_hash[:web_location_url]}
      text_data =  new_hash[:web_location_title]
    elsif !location_hash[:geo_location].nil?
      loc_type = 2
      new_hash = location_hash[:geo_location]
      klass = "GeoLocation"
      assoc  = :geo_location
      assocs = :geo_locations
      uniq_hash = {:geo_latitude => new_hash[:geo_latitude], :geo_longitude => new_hash[:geo_longitude]}
      text_data =  new_hash[:geo_name]
    elsif !location_hash[:unresolved_location].nil?
      loc_type = 3
      new_hash = location_hash[:unresolved_location]
      klass = "UnresolvedLocation"
      assoc  = :unresolved_location
      assocs = :unresolved_locations
      text_data =  new_hash[:unresolved_location_name]
      uniq_hash = {}
    end

    l = Location.create(:location_type => loc_type, :location_name => text_data)

    new_hash[:location_id] = l.id
    loc = klass.constantize.create!( new_hash)
    return l

    rescue => e
      Rails.logger.info("Location => CreateLocation => Rescue " +  e.message )
      l.destroy
      l = nil
      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        loc = Location.joins(assoc).where(assocs => uniq_hash)
        l = loc.first
        Rails.logger.info("Location => CreateLocation => Rescue => Uniq index found " + l.location_type.to_s)
      end
    return l

  end

  #Return an LOCATION Object or in case of other errors nil is returned
  def self.GetLocation(location_id)
    loc = Location.find(location_id)

    return loc
  rescue => e
    Rails.logger.info("Location => GetLocation " + e.message )
    return nil

  end

  #Returns a list of location as relation always
  # Searches on URL - Sub domain search not there as of now due to performance issue with MySQL Inno db
  #Searches on Lat-Long
  #Searches on Lat-Long with a Range
  def self.SearchLocation(search_hash= {})

    if !search_hash[:web_location].nil? and  !search_hash[:web_location][:web_location_url].blank?
      web_hash = search_hash[:web_location]
      location_ids= Location.joins(:web_location).where("web_location_url LIKE :loc_url_http or
                                                    web_location_url LIKE :loc_url_https",
                                {:loc_url_http => "http://#{web_hash[:web_location_url]}%",
                                :loc_url_https => "https://#{web_hash[:web_location_url]}%"})

    elsif !search_hash[:geo_location].nil? and !search_hash[:geo_location][:geo_latitude].blank? and
                                          !search_hash[:geo_location][:geo_longitude].blank?
      geo_hash = search_hash[:geo_location]

      if geo_hash[:range].nil?
        location_ids= Location.joins(:geo_location).where("geo_latitude = :geo_lat AND geo_longitude = :geo_long",
               {:geo_lat => geo_hash[:geo_latitude],:geo_long => geo_hash[:geo_longitude]})
      else
        wls = GeoLocation.near([geo_hash[:geo_latitude], geo_hash[:geo_longitude]],geo_hash[:range])
        location_ids= Location.joins(:geo_location).where(:geo_locations => {:id => wls})
      end

    end

    return location_ids

  end
  #Joins two location eg. Web location at a {lat long}
  #or a name location at Web page
  # or a name location at a lat-long
  # Join can only happen between locations of different types
  # Ids SHOULD always be existing location in respective types
  #Returns NIL if any of the passed location does not exist. Otherwise returns the ID of join table
  # input format {:web_join_id => x , :geo_join_id => y, :unresolved_join_id => z}
  def self.JoinLocations(location_hash = {})

    #atleast 2 location need to joined
    if location_hash.size < 2
      Rails.logger.info("Location => JoinLocations -- Invalid Hash length ")
      return nil
    end
    assoc_name = [:web_join_id,  :geo_join_id, :unresolved_join_id]

    #in
    assoc_name.each do |value|
      if !location_hash.has_key?(value)
          location_hash[value] = nil
      end
    end
    loc_join = LocationHub.create!(location_hash)
    puts location_hash
    return loc_join

  rescue => e
    Rails.logger.info("Location => JoinTable " + e.message)
    #Validation Uniqueness fails
    if /has already been taken/ =~ e.message
      loc_rel = LocationHub.where(location_hash)
      loc_join = loc_rel.first
      Rails.logger.info("Location => JoinLocation => Rescue => Uniq index found " )
    end
    return loc_join
  end
  #Input is location object
   def self.SearchJoin(location)
     assoc = [:web_join_id, :geo_join_id, :unresolved_join_id]

     location_ids = LocationHub.where(assoc[location.location_type - 1] => location.id).all
     location_ids.each do |attr|
       puts attr.web_join_id.to_s + " " + attr.geo_join_id.to_s + " " + attr.unresolved_join_id.to_s
     end
   end
end
