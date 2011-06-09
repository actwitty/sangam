# == Schema Information
# Schema version: 20110528065055
#
# Table name: entity_ownerships
#
#  id         :integer(4)      not null, primary key
#  owner_id   :integer(4)
#  entity_id  :integer(4)      not null
#  created_at :datetime
#  updated_at :datetime
#

class EntityOwnership < ActiveRecord::Base

  belongs_to :owner, :class_name => "User"
  belongs_to :entity

  validates_existence_of :owner, :on => :create
  validates_existence_of :entity

  validates_uniqueness_of :entity_id, :scope => :owner_id, :unless => Proc.new{|a| a.owner.nil?}

  after_destroy :ensure_cleanup

  protected

  def ensure_cleanup
    puts "entity ownership destroyed #{self.entity_id}"
  end
end
