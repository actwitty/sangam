class WebLocation < ActiveRecord::Base
  belongs_to :location

  validates_existence_of :location
  validates_presence_of :web_location_url

  validates_length_of :web_location_url, :maximum => 255
  validates_format_of :web_location_url, :with => URI::regexp(%w(http https))

  validates_length_of :web_location_image_url, :maximum => 255
  validates_format_of :web_location_image_url, :with => URI::regexp(%w(http https)),
                                            :unless => Proc.new {|a| a.web_location_image_url.nil?}

  validates_length_of :web_location_title, :maximum => 255, :unless => Proc.new {|a| a.web_location_title.nil? }
  validates_length_of :web_location_desc, :maximum => 1024, :unless => Proc.new {|a| a.web_location_desc.nil? }
end
