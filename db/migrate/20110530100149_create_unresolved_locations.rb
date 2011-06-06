class CreateUnresolvedLocations < ActiveRecord::Migration
  def self.up
    create_table :unresolved_locations do |t|
      t.integer :location_id, :null => false
      t.string :unresolved_location_name, :null => false

      t.timestamps
    end

    add_index  :unresolved_locations, :location_id  , :unique => true
    add_index  :unresolved_locations, :unresolved_location_name
  end

  def self.down

    remove_index  :unresolved_locations, :location_id
    remove_index  :unresolved_locations, :unresolved_location_name
    drop_table :unresolved_locations
  end
end
