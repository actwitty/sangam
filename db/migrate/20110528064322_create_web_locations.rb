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
    add_index :web_locations, [:location_id, :web_location_title, :web_location_url],
                              :name => "index_web_loc_on_loc_title_url"

    add_index :web_locations, [:web_location_title, :web_location_url], :name => "index_web_loc_on_title_url"
    add_index :web_locations, :web_location_url
  end

  def self.down

    remove_index  :web_locations, "index_web_loc_on_loc_title_url"
    remove_index  :web_locations, "index_web_loc_on_title_url"
    remove_index  :web_locations, :web_location_url

    drop_table :web_locations
  end
end
