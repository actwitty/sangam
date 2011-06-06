class CreateLocationHubs < ActiveRecord::Migration
  def self.up
    create_table :location_hubs do |t|

      t.integer :location_web_id
      t.integer :location_geo_id
      t.integer :location_unresolved_id

      t.timestamps
    end

    add_index :location_hubs, [:location_web_id, :location_geo_id,:location_unresolved_id], :unique => true,
                              :name => "index_location_hub_on_web_geo_unresolved"
    add_index :location_hubs, [:location_geo_id,:location_unresolved_id],
                              :name => "index_location_hub_on_geo_unresolved"

    add_index :location_hubs,:location_unresolved_id

    add_index :location_hubs, [:location_web_id,:location_unresolved_id],
                              :name => "index_location_hub_on_web_unresolved"
  end

  def self.down

    remove_index :location_hubs, :name => "index_location_hub_on_web_geo_unresolved"
    remove_index :location_hubs, :name =>"index_location_hub_on_geo_unresolved"
    remove_index :location_hubs, :location_unresolved_id
    remove_index :location_hubs,  :name => "index_location_hub_on_web_unresolved"

    drop_table :location_hubs
  end
end
