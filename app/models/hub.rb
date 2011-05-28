class Hub < ActiveRecord::Base
  belongs_to :user
  belongs_to :activity
  belongs_to :location
  belongs_to :entity

  validates_existence_of  :activity
  validates_existence_of  :activity_dict
  validates_existence_of  :user
  validates_existence_of  :entity , :unless => Proc.new { |a| a.entity_id.nil? }
  validates_existence_of  :location , :unless => Proc.new { |a| a.location_id.nil? }

  validates_presence_of :activity_name

  validates_length_of   :activity_name , :in => 1..255
  validates_length_of   :entity_name, :maximum => 255, :unless => Proc.new {|a| a.entity_name.nil?}

end
