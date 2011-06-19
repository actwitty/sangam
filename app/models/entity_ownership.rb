# == Schema Information
# Schema version: 20110609094335
#
# Table name: entity_ownerships
#
#  id         :integer         not null, primary key
#  owner_id   :integer
#  entity_id  :integer         not null
#  created_at :datetime
#  updated_at :datetime
#

class EntityOwnership < ActiveRecord::Base

  belongs_to :owner, :class_name => "User"
  belongs_to :entity

  validates_existence_of :owner_id, :on => :create
  validates_existence_of :entity_id

  validates_uniqueness_of :entity_id, :scope => :owner_id, :unless => Proc.new{|a| a.owner.nil?}

  after_destroy :ensure_cleanup

  protected

  def ensure_cleanup
    puts "entity ownership destroyed #{self.entity_id}"
  end
end
