class Location < ActiveRecord::Base

  include  ActionView::Helpers


  serialize       :social_counters_array, Array
  serialize       :analytics_summary, Hash

  geocoded_by :address, :latitude  => :location_lat, :longitude => :location_long # ActiveRecord

  has_many :hubs, :dependent => :nullify

  has_many :activities, :through => :hubs
  has_many :activity_words, :through => :hubs
  has_many :entities, :through => :hubs
  has_many :users, :through => :hubs


  has_many :web_joins, :class_name => "LocationHub", :foreign_key => :web_join_id, :dependent => :destroy
  has_many :geo_joins,:class_name => "LocationHub", :foreign_key => :geo_join_id, :dependent => :destroy
  has_many :unresolved_joins, :class_name => "LocationHub",:foreign_key => :unresolved_join_id, :dependent => :destroy

  has_many  :campaigns, :dependent => :destroy
  has_many  :summary_ranks, :dependent => :destroy

  #TODO the serializable base_location_data in activity is not delete with this..check
  has_many :base_activities, :foreign_key => :base_location_id, :class_name => "Activity", :dependent => :nullify

  validates_presence_of :location_type, :location_name
  validates_numericality_of :location_type, :greater_than_or_equal_to => AppConstants.location_type_web,
                            :less_than_or_equal_to => AppConstants.location_type_unresolved

  validates_length_of       :location_name , :in => 1..AppConstants.location_name_length

  validates_uniqueness_of   :location_url, :unless => Proc.new{|a|a.location_url.nil?}
  validates_length_of       :location_url, :in => 1..AppConstants.url_length , :unless => Proc.new{|a|a.location_url.nil?}
  validates_format_of       :location_url, :with =>  eval(AppConstants.url_validator),:unless => Proc.new{|a|a.location_url.nil?}

  validates_numericality_of :location_lat,
                            :greater_than_or_equal_to => -90 ,:less_than_or_equal_to => 90, :unless => Proc.new{|a|a.location_lat.nil?}
  validates_numericality_of :location_long,
                            :greater_than_or_equal_to => -180 ,:less_than_or_equal_to => 180, :unless => Proc.new{|a|a.location_long.nil?}

  validates_uniqueness_of   :location_lat, :scope => :location_long, :unless => Proc.new{|a|a.location_lat.nil?}

  before_save               :sanitize_data

  def sanitize_data
    self.location_name = sanitize(self.location_name) if !self.location_name.blank?
    Rails.logger.debug("[MODEL] [LOCATION] [sanitize_data] ")
  end

  class << self
    include TextFormatter
    include QueryPlanner
  end

  def self.create_location(location_hash ={})

    if !location_hash[:web_location].nil? and !location_hash[:web_location][:web_location_url].blank?

      new_hash = location_hash[:web_location]
      if ! (/^(http|https):\/\// =~ new_hash[:web_location_url])
         new_hash[:web_location_url] = "http://"  + new_hash[:web_location_url]
      end
      h = {:location_type => AppConstants.location_type_web, :location_url => new_hash[:web_location_url],
           :location_name => new_hash[:web_location_title]}

    elsif !location_hash[:geo_location].nil?

      new_hash = location_hash[:geo_location]
      h = {:location_type => AppConstants.location_type_geo, :location_lat => new_hash[:geo_latitude],
           :location_long => new_hash[:geo_longitude], :location_name => new_hash[:geo_name], :location_city => new_hash[:geo_city],
            :location_country => new_hash[:geo_country], :location_region => new_hash[:geo_region]}

    elsif !location_hash[:unresolved_location].nil?
      new_hash = location_hash[:unresolved_location]
      h = {:location_type => AppConstants.location_type_unresolved, :location_name => new_hash[:unresolved_location_name]}
    end
    l = Location.create!(h)

    rescue => e
      Rails.logger.info("Location => create_location => Rescue " +  e.message )
      l = nil
      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        h = h.except(:location_name, :location_city,:location_country, :location_region)
        l = Location.where(h).first
        Rails.logger.info("Location => create_location => Rescue => Uniq index found " + l.location_type.to_s)
      end
    return l
  end

  def self.search_location(search_hash= {})
    location_ids = {}

    if !search_hash[:web_location].nil? and  !search_hash[:web_location][:web_location_url].blank?
      web_hash = search_hash[:web_location]
      location_ids= Location.where("location_url LIKE :loc_url_http or
                                                    location_url LIKE :loc_url_https",
                                {:loc_url_http => "http://#{web_hash[:web_location_url]}%",
                                :loc_url_https => "https://#{web_hash[:web_location_url]}%"}).all

    elsif !search_hash[:geo_location].nil? and !search_hash[:geo_location][:geo_latitude].blank? and
                                          !search_hash[:geo_location][:geo_longitude].blank?
      geo_hash = search_hash[:geo_location]

      if geo_hash[:range].nil?
        location_ids= Location.where("location_lat = :geo_lat AND location_long = :geo_long",
               {:geo_lat => geo_hash[:geo_latitude],:geo_long => geo_hash[:geo_longitude]}).all
      else
        location_ids = Location.near([geo_hash[:geo_latitude], geo_hash[:geo_longitude]],geo_hash[:range]).all
        #location_ids= Location.where(:id => wls)
      end

    end

    return location_ids

  end

  #INPUT =>  {name => "mara" }
  #OUTPUT =>
  #              { :id => 1234, :type => 1, :url => "http://google.com", :name => "Google"},  #
  #              {   :id => 1234, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york", :city => "New York",
  #                 :country => "bangalore"},                                                      OR
  #              { :id => 1234, :type => 2, :name => "John's home"},
  #        ...]
  def self.search(params)

    Rails.logger.info("[MODEL] [LOCATION] [search] entering #{params.inspect}")
    array = []

    if !params[:name].blank?
      Location.where(['location_name ILIKE ?', "#{params[:name]}%"]).
            limit(AppConstants.max_number_of_locations).all.each do |attr|
             array << format_location(attr)
      end
    end

    Rails.logger.info("[MODEL] [LOCATION] [search] leaving #{params.inspect}")
    array

  end

  #Return an LOCATION Object or in case of other errors nil is returned
  def self.get_location(location_id)
    loc = Location.find(location_id)

    return loc
  rescue => e
    Rails.logger.info("Location => get_location " + e.message )
    return nil

  end


  #Joins two location eg. Web location at a {lat long}
  #or a name location at Web page
  # or a name location at a lat-long
  # Join can only happen between locations of different types
  # Ids SHOULD always be existing location in respective types
  #Returns NIL if any of the passed location does not exist. Otherwise returns the ID of join table
  # input format {:web_join_id => x , :geo_join_id => y, :unresolved_join_id => z}
  def self.join_locations(location_hash = {})

    #atleast 2 location need to joined
    if location_hash.size < 2
      Rails.logger.info("Location => join_locations -- Invalid Hash length ")
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


  #INPUT => {:location_id => 12435, :updated_at => nil or 1994-11-05T13:15:30Z ( ISO 8601), :current_user_id => 1234}
  #OUTPUT => { :id => 1234, :type => 1, :url => "http://google.com", :name => "Google"
  #                                                      OR
  #                 :id => 1234, :type => 2, :lat => 23.456, :long => 45.678, :name => "Time Square, New york", :city => "New York",
  #                 :country => "bangalore"
  #                                                      OR
  #                :id => 1234, :type => 2, :name => "John's home" ,
  #:stream => [{:post => .... }]# same as stream
  ##COMMENT => If updated_at parameter is sent, it means client already has entity info so, only stream part will be
  #sent.
  #COMMENT=> Near location search is pending
  def self.get_location_stream(params)

    h = {}
    Rails.logger.debug("[MODEL] [Location] [get_location_stream] entering")

    l = Location.where(:id => params[:location_id]).first
    if l.blank?
      Rails.logger.debug("[MODEL] [Location][get_location_stream] returning blank JSON")
      return {}
    end

    hash = format_location(l)
    #hash[:id] = l.id

    h[:updated_at.lt] = params[:updated_at] if !params[:updated_at].blank?

    h[:status]   = AppConstants.status_public

    h[:meta_activity] = false

    h[:location_id] = l.id

    h = pq_activity_filter(h)

    activity = Activity.where(h).limit(AppConstants.max_number_of_activities).group(:id).order("MAX(updated_at) DESC").count

    hash[:stream] = Activity.get_all_activity({:current_user_id => params[:current_user_id],:activity_ids => activity.keys})
    Rails.logger.debug("[MODEL] [Location] [get_location_stream] leaving")
    hash
  end
end





# == Schema Information
#
# Table name: locations
#
#  id                    :integer         not null, primary key
#  location_type         :integer         not null
#  location_name         :text            not null
#  location_url          :text
#  location_lat          :decimal(18, 15)
#  location_long         :decimal(18, 15)
#  social_counters_array :text
#  created_at            :datetime
#  updated_at            :datetime
#  analytics_summary     :text
#  location_city         :string(255)
#  location_country      :string(255)
#  location_region       :string(255)
#  rank                  :string(255)
#

