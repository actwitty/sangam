class CreateActivities < ActiveRecord::Migration
  def self.up
    create_table :activities do |t|

      # activity_data_id in table where actual uniq activity name is stored === globally unique activity names
      t.integer :activity_word_id, :null => false

      t.text    :activity_text

      #activity_name should always be same activity_data_name == redundancy
      t.text    :activity_name, :null => false

      t.integer :author_id, :null => false

      t.integer :base_location_id


      t.integer :status, :null => false # Set by user on Actwitty. 0 => saved, 1 => public share, 2 => private
                                        # 3 => shared to group of people or group.When this value is 3,
                                        # we need to see access_visibility table to see the access


      t.integer :summary_id


      t.text    :source_object_id
      t.integer :status_at_source        # This value is set at source. 0 => saved, 1 => public share, 2 => private
                                      # 3 => shared to group of people or group.When this value is 3,
                                      # we need to see access_visibility table to see the access
      t.text    :source_name, :null => false            #"actwitty", "facebook", # "twitter",
                                                        # "G+", "DropBox", "Mobile +919980906102","a@b.com
      t.text    :source_uid   #uid os user at source

      t.text    :source_object_type, :default => AppConstants.source_object_type_post

      t.text    :category_type
      t.text    :category_id

      t.datetime :source_created_at, :default => Time.utc(1970, 1, 1, 0, 0).to_datetime

      t.boolean  :if_json,  :default => false
      t.timestamps
    end

       add_index :activities, :summary_id

       add_index :activities, :activity_name

       add_index :activities, :author_id

       add_index :activities, :base_location_id

       add_index :activities, :activity_word_id

       add_index :activities,  :status

       add_index :activities, :updated_at

       add_index :activities, :source_object_id

       add_index :activities, :source_name

       add_index :activities, :status_at_source

       add_index :activities, :source_object_type

       add_index :activities, :category_type

       add_index :activities, :source_created_at

       add_index :activities, [:source_object_id, :source_name, :author_id], :unique => true,
                              :name => "index_activities_msg_id_source_author"
  end

  def self.down
    drop_table :activities
  end
end
