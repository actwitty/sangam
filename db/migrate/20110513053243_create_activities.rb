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

      t.timestamps
    end

       add_index :activities, [:summary_id, :blank_text]

       add_index :activities, [:summary_id, :base_location_id]

       add_index :activities, [:author_id, :status, :meta_activity]

       add_index :activities, [:summary_id, :activity_word_id, :activity_name],
                 :name => "index_activities_on_summary_word_activity_name"

       add_index :activities, [:author_id, :activity_word_id, :status]

       add_index :activities, [:author_id, :base_location_id, :status]

       add_index :activities, [:author_id, :source_name, :status]

       add_index :activities, [:activity_word_id, :base_location_id, :source_name, :status],
                 :name => "index_activities_on_word_loc_source_status"

       add_index :activities, [:source_name, :status]

       add_index :activities, [:base_location_id, :status]

       add_index :activities, [:activity_word_id, :status]

       add_index :activities, :updated_at

       add_index :activities, [:id, :author_id]

       add_index :activities, [:id, :enriched]

  end

  def self.down

      remove_index :activities, [:summary_id, :blank_text]

      remove_index :activities, [:summary_id, :base_location_id]

      remove_index :activities, [:author_id, :status, :meta_activity]

      remove_index :activities, :name => "index_activities_on_summary_word_activity_name"

      remove_index :activities, [:author_id, :activity_word_id, :status]

      remove_index :activities, [:author_id, :base_location_id, :status]

      remove_index :activities, [:author_id, :source_name, :status]

      remove_index :activities, :name => "index_activities_on_word_loc_source_status"

      remove_index :activities, [:source_name, :status]

      remove_index :activities, [:base_location_id, :status]

      remove_index :activities, [:activity_word_id, :status]

      remove_index :activities, :updated_at

      remove_index :activities, [:id, :author_id]

      remove_index :activities, [:id, :enriched]

      drop_table :activities
  end
end
