class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|

      t.integer   :location_type, :null => false    #Url => 1 , Geo location =2, [Url, GeoLocation] =>3, unknown ( only a name) => 4
      t.text     :location_name, :null => false
      t.timestamps

    end

    add_index :locations, [:location_type, :location_name]
    add_index :locations, :location_name

  end

  def self.down

    remove_index :locations, [:location_type, :location_name]
    remove_index :locations, :location_name
    drop_table :locations

  end
end
