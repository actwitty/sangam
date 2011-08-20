class CreateHubs < ActiveRecord::Migration
  def self.up
    create_table :hubs do |t|
      #All Searches should on Ids

      t.integer :activity_id, :null => false

      t.integer :activity_word_id, :null => false

      #it can become null here => when entity gets deleted it will be  nullified which SHOULD NOT happen - no entity deletion
      #also possible that an activity does not have an entity
      t.integer :entity_id

      t.integer :user_id, :null => false

      #By default it should be set home location of user so ideally it should never be null as locations will not deleted
      #but if deleted then it can be nullfied
      t.integer :location_id

      t.integer :summary_id, :null => false

      t.text    :source_name, :null => false    #"actwitty", "facebook", # "twitter",
                                                # "G+", "DropBox", "Mobile +919980906102","a@b.com

      t.integer :status, :null => false     # 0 => saved, 1 => public share, 2 => private
                                            # 3 => shared to group of people or group.When this value is 3,
                                            # we need to see access_visibility table to see the access

      t.timestamps
    end

    add_index :hubs, :activity_id
    add_index :hubs, :entity_id
    add_index :hubs, :location_id
    add_index :hubs, :user_id

    add_index :hubs, [:summary_id, :entity_id]

    #add_index :hubs, [:activity_word_id, :location_id, :source_name, :entity_id, :user_id, :updated_at]

    add_index :hubs, :source_name
    add_index :hubs, :updated_at

  end

  def self.down
    remove_index :hubs, :activity_id
    remove_index :hubs, :entity_id
    remove_index :hubs, :location_id
    remove_index :hubs, :user_id

    remove_index :hubs, [:summary_id, :entity_id]

    #remove_index :hubs, [:activity_word_id, :location_id, :source_name, :entity_id, :user_id, :updated_at]

    remove_index :hubs, :source_name
    remove_index :hubs, :updated_at

    drop_table :hubs
  end
end
