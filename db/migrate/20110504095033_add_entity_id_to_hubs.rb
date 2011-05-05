class AddEntityIdToHubs < ActiveRecord::Migration
  def self.up
    add_column :hubs, :entity_id, :integer
  end

  def self.down
    remove_column :hubs, :entity_id
  end
end
