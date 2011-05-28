class EntityOwnership < ActiveRecord::Base

  belongs_to :owner, :class_name => "User"
  belongs_to :entity

  validates_existence_of :owner, :unless => Proc.new{|a| a.owner.nil?} \
  validates_existence_of :entity

end
