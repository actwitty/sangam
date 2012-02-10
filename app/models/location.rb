class Location < ActiveRecord::Base

  include  ActionView::Helpers

  geocoded_by :address, :latitude  => :location_lat, :longitude => :location_long # ActiveRecord

  has_many :hubs, :dependent => :nullify

  has_many :activities, :through => :hubs
  has_many :activity_words, :through => :hubs
  has_many :entities, :through => :hubs
  has_many :users, :through => :hubs

  has_many  :campaigns, :dependent => :destroy

  #TODO the serializable base_location_data in activity is not delete with this..check
  has_many :base_activities, :foreign_key => :base_location_id, :class_name => "Activity", :dependent => :nullify

  validates_presence_of     :location_type, :location_name, :source_name

  validates_uniqueness_of   :location_lat, :scope => [:location_long, :source_name],:unless => Proc.new{|a| a.location_lat.nil? or a.location_long.nil?}

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

    new_hash = location_hash
    h = {
          :location_type => AppConstants.location_type_geo,
          :location_lat => location_hash[:lat],:location_long => location_hash[:long],
          :location_name => location_hash[:name],:location_city => location_hash[:city],
          :location_country => location_hash[:country], :location_region => location_hash[:region],
          :source_name => location_hash[:source_name], :source_object_id => location_hash[:source_object_id]
        }

    l = Location.create!(h)

    rescue => e
      Rails.logger.error("[MODEL] [ENTITY] [CREATE_LOCATION] **** RESCUE **** #{e.message} For #{location_hash} "  )
      l = nil
      #Validation Uniqueness fails
      if /has already been taken/ =~ e.message
        h = h.except(:location_name, :location_city,:location_country, :location_region, :source_object_id)
        l = Location.where(h).first
        Rails.logger.info("MODEL] [ENTITY] [CREATE_LOCATION] Rescue => Uniq index found " + l.location_type.to_s)
      end
    return l
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
end










# == Schema Information
#
# Table name: locations
#
#  id               :integer         not null, primary key
#  location_type    :integer         not null
#  location_name    :text            not null
#  location_lat     :decimal(18, 15)
#  location_long    :decimal(18, 15)
#  location_city    :text
#  location_country :text
#  location_region  :text
#  source_name      :text
#  source_object_id :text
#  created_at       :datetime
#  updated_at       :datetime
#

