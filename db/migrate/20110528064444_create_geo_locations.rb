class CreateGeoLocations < ActiveRecord::Migration
  def self.up
    create_table :geo_locations do |t|
      t.integer  :location_id
      t.decimal :geo_latitude, :precision => 10, :scale => 7, :null => false
      t.decimal :geo_longitude, :precision => 10, :scale => 7, :null => false
      t.text    :geo_name, :null => false

      t.timestamps
    end

    add_index :geo_locations,:location_id, :unique => true
    add_index :geo_locations, [:geo_latitude,:geo_longitude ], :unique => true
    add_index :geo_locations, :geo_longitude
    add_index :geo_locations, :geo_name
  end

  def self.down
    remove_index :geo_locations, :location_id
    remove_index :geo_locations, [:geo_latitude,:geo_longitude]
    remove_index :geo_locations, :geo_longitude
    remove_index :geo_locations, :geo__name

    drop_table :geo_locations
  end
end