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

       add_index :activities, :base_location_id

       add_index :activities, [:author_id, :status, :meta_activity], :name => "index_activities_on_author_status_meta"

       add_index :activities, [:activity_word_id, :source_name, :updated_at, :status, :meta_activity, :base_location_id, :author_id ],
                               :name => "index_activities_on_word_source_time_status_meta_loc_author"

       add_index :activities, [:source_name, :updated_at, :status, :meta_activity, :base_location_id, :author_id ],
                               :name => "index_activities_on_source_time_status_meta_loc_author"

       add_index :activities, [:updated_at, :status, :meta_activity, :base_location_id, :author_id ],
                               :name => "index_activities_on_time_status_meta_loc_author"

       add_index :activities, [:activity_word_id, :source_name, :summary_id, :updated_at, :status, :meta_activity,:base_location_id],
                                :name => "index_activities_on_word_source_summary_time_status_meta_loc"

       add_index :activities, [:source_name, :summary_id, :updated_at, :status, :meta_activity,:base_location_id],
                                :name => "index_activities_on_source_summary_time_status_meta_loc"

       add_index :activities, [:summary_id, :updated_at, :status, :meta_activity,:base_location_id],
                                :name => "index_activities_on_summary_time_status_meta_loc"

       add_index :activities, [:id, :author_id]
       add_index :activities, [:id, :enriched]

  end

  def self.down

      remove_index :activities, [:summary_id, :blank_text]

      remove_index :activities, [:summary_id, :base_location_id]

      remove_index :activities, :base_location_id

      remove_index :activities, :name => "index_activities_on_author_status_meta"

      remove_index :activities, :name => "index_activities_on_word_source_time_status_meta_loc_author"

      remove_index :activities, :name => "index_activities_on_source_time_status_meta_loc_author"

      remove_index :activities, :name => "index_activities_on_time_status_meta_loc_author"

      remove_index :activities, :name => "index_activities_on_word_source_summary_time_status_meta_loc"

      remove_index :activities, :name => "index_activities_on_source_summary_time_status_meta_loc"

      remove_index :activities, :name => "index_activities_on_summary_time_status_meta_loc"

      remove_index :activities, [:id, :author_id]

      remove_index :activities, [:id, :enriched]

      drop_table :activities
  end
end
