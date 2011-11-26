class AddDataToLocation < ActiveRecord::Migration
  def self.up
    add_column :locations, :analytics_summary, :text
    add_column :locations, :location_city, :string
    add_column :locations, :location_country, :string
    add_column :locations, :location_region, :string
    add_column :locations, :rank, :string

    add_index :locations,  :location_city
    add_index :locations,  :location_country
    add_index :locations,  :location_region
    add_index :locations,  :rank
  end

  def self.down

    remove_index :locations,  :location_city
    remove_index :locations,  :location_country
    remove_index :locations,  :location_region
    remove_index :locations,  :rank

    remove_column :locations, :location_region
    remove_column :locations, :location_country
    remove_column :locations, :location_city
    remove_column :locations, :analytics_summary
    remove_column :locations, :rank
  end
end
