# == Schema Information
# Schema version: 20110609094335
#
# Table name: unresolved_locations
#
#  id                       :integer         not null, primary key
#  location_id              :integer         not null
#  unresolved_location_name :string(255)     not null
#  created_at               :datetime
#  updated_at               :datetime
#

class UnresolvedLocation < ActiveRecord::Base
  belongs_to  :location

  validates_existence_of :location

  validates_presence_of :unresolved_location_name

  validates_length_of :unresolved_location_name, :in =>1..255

  validates_uniqueness_of :location_id

  before_save :cant_change_location_name

  after_save :log_confirmation

  protected

  def cant_change_location_name

    if !new_record?
        Rails.logger.info("Trying to edit Unresolved Location - Not Allowed")
        raise ActiveRecord::RecordNotSaved.new(self)
    end
  end
  def log_confirmation
    puts "Unresolved Location Created"
    Rails.logger.info("Unresolved Location Created  name = #{self.unresolved_location_name}" )
  end
end
