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
    #these 3 index satisfies user filter requiremens
    add_index :hubs,  [ :activity_word_id, :user_id]
    add_index :hubs,  [ :entity_id,        :user_id]
    add_index :hubs,  [ :location_id,      :user_id]

    #these satisfies all location based queries
    add_index :hubs,  [ :user_id, :activity_word_id, :entity_id] , :name => "index_hubs_on_user_activity_entity"
    add_index :hubs,  [ :activity_word_id, :entity_id]

    #remaining  indexes
    add_index :hubs,  [:entity_id , :activity_id]
    add_index :hubs,  :activity_id

    add_index :hubs, [:user_id, :summary_id]
    add_index :hubs, :summary_id

    add_index :hubs, :updated_at
    add_index :hubs, :created_at

    add_index :hubs, [:source_name, :user_id,  :activity_word_id],:name => "index_hubs_on_source_user_word"
    add_index :hubs, [:source_name, :activity_word_id]

    #TODO modify ass needed

  end

  def self.down
    #these 3 index satisfies user filter requiremens
    remove_index :hubs,  [ :activity_word_id, :user_id]
    remove_index :hubs,  [ :entity_id, :user_id]
    remove_index :hubs,  [ :location_id,:user_id]

    #these satisfies all location based queries
    remove_index :hubs,  :name => "index_hubs_on_user_activity_entity"
    remove_index :hubs,  [ :activity_word_id, :entity_id]

    #remaining  indexes
    remove_index :hubs,  [:entity_id , :activity_id]
    remove_index :hubs,  :activity_id

    remove_index :hubs, [:user_id, :summary_id]
    remove_index :hubs, :summary_id

    remove_index :hubs, :updated_at

    remove_index :hubs, :created_at

    remove_index :hubs, :name => "index_hubs_on_source_user_word"
    remove_index :hubs, [:source_name, :activity_word_id]


    #TODO modify as needed

    drop_table :hubs
  end
end
