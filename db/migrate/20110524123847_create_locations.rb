class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|

      t.integer :location_type, :null => false    #Url => 1 , Geo location =2, [Url, GeoLocation] =>3, unknown ( only a name) => 4
      t.text    :location_name, :null => false

      t.text    :location_url

      t.decimal :location_lat, :precision => 18, :scale => 15
      t.decimal :location_long, :precision => 18, :scale => 15

      t.text    :social_counters_array

      t.text    :analytics_summary
      t.string  :location_city
      t.string  :location_country
      t.string  :location_region
      t.string  :rank
      t.integer :campaigns_count

      t.timestamps

    end

    add_index :locations, :location_type
    add_index :locations, :location_name

    add_index :locations, [:location_lat,:location_long ], :unique => true
    add_index :locations, :location_long

    add_index :locations, :location_url, :unique => true
    add_index :locations, :updated_at

    add_index :locations,  :location_city
    add_index :locations,  :location_country
    add_index :locations,  :location_region
    add_index :locations,  :rank

  end

  def self.down

    drop_table :locations

  end
end
