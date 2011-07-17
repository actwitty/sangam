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
