class CreateActivities < ActiveRecord::Migration
  def self.up
    create_table :activities do |t|

      # activity_data_id in table where actual uniq activity name is stored === globally unique activity names
      t.integer :activity_word_id, :null => false

      t.text   :activity_text

      #activity_name should always be same activity_data_name == redundancy
      t.string  :activity_name, :null => false

      t.integer  :author_id, :null => false

      t.integer :base_location_id

      t.integer :comments_count
      t.integer :documents_count

      t.integer :campaign_types
      t.integer :shared_status  #0 => saved, 1 => public share, 2 => private 3 => shared to group of people or group.
                                #when this value is 3, we need to see access_visibility table to see the access
      t.integer :access_visibility

      t.integer :source_type  #0 => actwitty, 1 => facebook, 2=> twitter, 3 => G+, 4 => DropBox, 5 => Mobile ...
      t.integer :source_id   # this table will store analytics related to respective social source for this post

      t.integer :summary_id

      t.boolean :enriched


      t.timestamps
    end

      add_index :activities, [:author_id, :activity_word_id]

      add_index :activities, [:activity_word_id, :activity_name]

      add_index :activities, [:author_id, :activity_name]

      add_index :activities, :updated_at

      add_index :activities, :base_location_id

      add_index :activities, [:id, :enriched]

      add_index :activities, [:author_id, :summary_id]

      add_index :activities, :summary_id

  end

  def self.down

      remove_index :activities, [:author_id, :activity_word_id]

      remove_index :activities, [:activity_word_id, :activity_name]

      remove_index :activities, [:author_id, :activity_name]

      remove_index :activities, :updated_at

      remove_index :activities, :base_location_id

      remove_index :activities, [:id, :enriched]

      remove_index :activities, [:author_id, :summary_id]

      remove_index :activities, :summary_id

      drop_table :activities
  end
end
