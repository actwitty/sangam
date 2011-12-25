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

      t.integer :comments_count, :default => 0
      t.integer :documents_count, :default => 0
      t.integer :tags_count, :default => 0
      t.integer :activities, :campaigns_count, :default => 0

      t.integer :campaign_types, :null => false         # 1 to 7 or nil #at present each bit represent on campaign type. bit 0 => like,
                                        # bit 1=>support,bit 2=> :join

      t.integer :status, :null => false                 # 0 => saved, 1 => public share, 2 => private
                                        # 3 => shared to group of people or group.When this value is 3,
                                        # we need to see access_visibility table to see the access

      t.text    :source_name, :null => false            #"actwitty", "facebook", # "twitter",
                                        # "G+", "DropBox", "Mobile +919980906102","a@b.com

      t.text    :sub_title                 #Length sub_title_length

      t.integer :summary_id

      t.boolean :enriched
      t.boolean :meta_activity
      t.boolean :blank_text

      t.text :social_counters_array

      t.text  :source_msg_id
      t.text  :category_type
      t.text  :category_id

      t.datetime  :backup_created_timestamp, :default => nil

      t.timestamps
    end

       add_index :activities, :summary_id

       add_index :activities, :activity_name
       add_index :activities, :author_id

       add_index :activities, :source_name

       add_index :activities, :base_location_id

       add_index :activities, :activity_word_id

       add_index :activities,  :status

       add_index :activities, :updated_at

       add_index :activities, :enriched

       add_index :activities, :blank_text

       add_index :activities, :meta_activity

       add_index :activities, :source_msg_id

       add_index :activities, :category_type

       add_index :activities, :backup_created_timestamp

       add_index :activities, [:source_msg_id, :source_name, :author_id], :unique => true,
                              :name => "index_activities_msg_id_source_author"
  end

  def self.down

       drop_table :activities
  end
end
