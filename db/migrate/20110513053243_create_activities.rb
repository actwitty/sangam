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

      t.integer :comments_count
      t.integer :documents_count

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


      t.timestamps
    end

      add_index :activities, [:author_id, :activity_word_id]

#      add_index :activities, [:activity_word_id, :activity_name]

      add_index :activities, [:author_id, :activity_name]

      add_index :activities, :updated_at

      add_index :activities, :base_location_id

      add_index :activities, [:id, :enriched]

      add_index :activities, [:author_id, :summary_id]

      add_index :activities, :summary_id

      add_index :activities, [ :status, :author_id]

      add_index :activities, [ :source_name, :author_id,  :activity_word_id],:name => "index_activities_on_source_author_word"

      add_index :activities, [:source_name, :activity_word_id]

  end

  def self.down

      remove_index :activities, [:author_id, :activity_word_id]

#      remove_index :activities, [:activity_word_id, :activity_name]

      remove_index :activities, [:author_id, :activity_name]

      remove_index :activities, :updated_at

      remove_index :activities, :base_location_id

      remove_index :activities, [:id, :enriched]

      remove_index :activities, [:author_id, :summary_id]

      remove_index :activities, :summary_id

      remove_index :activities, [ :status, :author_id]

      remove_index :activities, :name => "index_activities_on_source_author_word"

      remove_index :activities, [:source_name, :activity_word_id]

      drop_table :activities
  end
end
