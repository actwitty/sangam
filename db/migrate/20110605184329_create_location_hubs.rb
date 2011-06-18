class CreateLocationHubs < ActiveRecord::Migration
  def self.up
    create_table :location_hubs do |t|

      t.integer :web_join_id
      t.integer :geo_join_id
      t.integer :unresolved_join_id

      t.timestamps
    end

    add_index :location_hubs, [:web_join_id, :geo_join_id,:unresolved_join_id], :unique => true,
                              :name => "index_location_hub_on_web_geo_unresolved"
    add_index :location_hubs, [:geo_join_id,:unresolved_join_id],
                              :name => "index_location_hub_on_geo_unresolved"

    add_index :location_hubs,:unresolved_join_id

    add_index :location_hubs, [:web_join_id,:unresolved_join_id],
                              :name => "index_location_hub_on_web_unresolved"
  end

  def self.down

    remove_index :location_hubs, :name => "index_location_hub_on_web_geo_unresolved"
    remove_index :location_hubs, :name =>"index_location_hub_on_geo_unresolved"
    remove_index :location_hubs, :unresolved_join_id
    remove_index :location_hubs,  :name => "index_location_hub_on_web_unresolved"

    drop_table :location_hubs
  end
end
