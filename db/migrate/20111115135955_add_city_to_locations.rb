class AddCityToLocations < ActiveRecord::Migration
  def self.up
    add_column :locations, :location_city, :text
    add_column :locations, :location_country, :text
    add_index :locations,  :location_city
    add_index :locations,  :location_country
  end

  def self.down
    remove_index :locations,  :location_city
    remove_index :locations,  :location_country
    remove_column :locations, :location_city
    remove_column :locations, :location_country
  end
end
