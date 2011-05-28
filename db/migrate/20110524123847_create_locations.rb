class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|

      t.integer   :location_type, :null => false    #Geo location, Url
      t.timestamps

    end

    add_index :locations, :location_type
  end

  def self.down
    remove_index :locations, :location_type

    drop_table :locations
  end
end
