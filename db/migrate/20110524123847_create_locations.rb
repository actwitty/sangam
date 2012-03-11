class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|

      t.text    :location_name, :null => false

      t.decimal :location_lat, :precision => 18, :scale => 15
      t.decimal :location_long, :precision => 18, :scale => 15

      t.text    :location_city
      t.text    :location_country
      t.text    :location_region

      t.text    :source_name
      t.text    :source_object_id

      t.timestamps

    end

    add_index :locations, :location_name

    add_index :locations, [:location_lat,:location_long, :source_name ],:name => "index_location_on_lat_long_source",
                                                                        :unique => true
    add_index :locations, :location_long
    add_index :locations, :source_name

    add_index :locations, :updated_at

    add_index :locations,  :location_city
    add_index :locations,  :location_country
    add_index :locations,  :location_region

  end

  def self.down
    drop_table :locations
  end
end
