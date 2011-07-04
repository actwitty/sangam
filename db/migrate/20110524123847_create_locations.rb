class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|

      t.integer   :location_type, :null => false    #Url => 1 , Geo location =2, [Url, GeoLocation] =>3, unknown ( only a name) => 4
      t.text     :location_name, :null => false

      t.string   :location_url

      t.decimal :location_lat, :precision => 10, :scale => 7
      t.decimal :location_long, :precision => 10, :scale => 7

      t.timestamps

    end

    add_index :locations, [:location_type, :location_name]
    add_index :locations, :location_name

    add_index :locations, [:location_lat,:location_long ], :unique => true
    add_index :locations, :location_long

    add_index :locations, :location_url, :unique => true

  end

  def self.down

    remove_index :locations, [:location_type, :location_name]
    remove_index :locations, :location_name

    remove_index :locations, [:location_lat,:location_long ], :unique => true
    remove_index :locations, :location_long

    remove_index :locations, :location_url

    drop_table :locations

  end
end
