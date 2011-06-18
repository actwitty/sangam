# == Schema Information
# Schema version: 20110609094335
#
# Table name: web_locations
#
#  id                     :integer         not null, primary key
#  location_id            :integer         not null
#  web_location_url       :string(255)     not null
#  web_location_title     :string(255)
#  web_location_desc      :text
#  web_location_image_url :string(255)
#  created_at             :datetime
#  updated_at             :datetime
#

class WebLocation < ActiveRecord::Base


  belongs_to :location


  validates_existence_of :location_id

  validates_presence_of :web_location_url

  validates_uniqueness_of :location_id
  validates_uniqueness_of :web_location_url

  validates_length_of :web_location_url, :in => 1..255

  validates_format_of :web_location_url, :with =>  eval(AppConstants.url_validator)

  validates_length_of :web_location_title, :maximum => 255, :allow_blank => true


  before_save :cant_change_web_join_url
  after_save  :log_confirmation

  protected

  def cant_change_web_join_url

    if !new_record?
      if self.location_id_changed? || self.web_location_url_changed?
        Rails.logger.info("Trying to edit" + (self.location_id_changed? ? " location_id":" web_location_url" ))
        raise ActiveRecord::RecordNotSaved.new(self)
      end
    end
  end

  def log_confirmation
    puts "Web Location Created"
    Rails.logger.info("Geo Location Created Url =  #{self.web_location_url} name = #{self.web_location_title}" )
  end

end
