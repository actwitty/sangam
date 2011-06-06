class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|

      t.integer   :location_type, :null => false    #Url => 1 , Geo location =2, [Url, GeoLocation] =>3, unknown ( only a name) => 4
      t.text     :location_name, :limit => 1024, :null => false
      t.timestamps

    end

    add_index :locations, :location_type
    add_index :locations, :location_name, :length => 1024

  end

  def self.down

    remove_index :locations, :location_type
    remove_index :locations, :location_name
    drop_table :locations

  end
end
