class CreateUnresolvedLocations < ActiveRecord::Migration
  def self.up
    create_table :unresolved_locations do |t|
      t.integer :location_id, :null => false
      t.string :unresolved_location_name, :null => false

      t.timestamps
    end
    add_index  :unresolved_locations, :location_id  , :unique => true
    add_index  :unresolved_locations, :unresolved_location_name , :unique => true
  end

  def self.down
    drop_table :unresolved_locations
  end
end
