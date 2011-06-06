class CreateWebLocations < ActiveRecord::Migration
  def self.up
    create_table :web_locations do |t|
      t.integer :location_id, :null => false

      t.string  :web_location_url, :null => false
      t.string  :web_location_title
      t.text   :web_location_desc, :limit => 1024
      t.string  :web_location_image_url

      t.timestamps
    end
    add_index :web_locations, :location_id, :unique => true
    add_index :web_locations, :web_location_url, :unique => true
    add_index :web_locations, :web_location_title
  end

  def self.down
    remove_index  :web_locations, :location_id
    remove_index  :web_locations, :web_location_url
    remove_index  :web_locations, :web_location_title

    drop_table :web_locations
  end
end
