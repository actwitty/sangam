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
      #but if deleted then it can be nullified
      t.integer :location_id

      t.integer :summary_id, :null => false

      t.text    :source_name, :null => false    #"actwitty", "facebook", # "twitter",
                                                # "G+", "DropBox", "Mobile +919980906102","a@b.com

      t.integer :status, :null => false     # 0 => saved, 1 => public share, 2 => private
                                            # 3 => shared to group of people or group.When this value is 3,
                                            # we need to see access_visibility table to see the access
      t.text    :source_msg_id
      t.integer :status_at_source

      t.text    :category_type

      t.datetime :backup_created_timestamp, :default => Time.now.utc

      t.timestamps
    end

    add_index :hubs, :activity_id
    add_index :hubs, :user_id
    add_index :hubs, :summary_id

    add_index :hubs, :entity_id

    add_index :hubs, :location_id

    add_index :hubs, :activity_word_id

    add_index :hubs, :source_name
    add_index :hubs, :updated_at

    add_index :hubs, :category_type

    add_index :hubs, :source_msg_id

    add_index :hubs, :status_at_source

    add_index :hubs, :backup_created_timestamp
  end

  def self.down
    drop_table :hubs
  end
end
