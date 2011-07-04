class CreateActivities < ActiveRecord::Migration
  def self.up
    create_table :activities do |t|
      # activity_data_id in table where actual uniq activity name is stored === globally unique activity names
      t.integer :activity_word_id, :null => false

      t.text   :activity_text, :null => false

      #activity_name should always be same activity_data_name == redundancy
      t.string  :activity_name, :null => false

      t.integer  :author_id, :null => false
      t.string   :author_full_name, :null => false
      t.string   :author_profile_photo, :null => false

      t.integer :parent_id

      t.integer :base_location_id
      t.text    :base_location_data

      t.string :ancestry
      t.integer :ancestry_depth,  :default => 0

      t.timestamps
    end

      add_index :activities, :ancestry
      add_index :activities, [:author_id, :activity_name,:activity_word_id], :name => "index_activity_author_name_dict"

      add_index :activities, [:activity_name,:author_id]

      add_index :activities, [:activity_word_id, :author_id]

      #TODO not needed - verify through query analyzer though :)
      add_index :activities, [:author_id, :parent_id]

      add_index :activities, :parent_id

      add_index :activities, :updated_at

      add_index :activities, :base_location_id

  end

  def self.down

    remove_index :activities, :ancestry

    remove_index :activities,  :name => "index_activity_author_name_dict"

    remove_index :activities, [:activity_name,:author_id]

    remove_index :activities, [:activity_word_id, :author_id]

    remove_index :activities, [:author_id, :parent_id]

    remove_index :activities, :parent_id

    remove_index :activities, :updated_at

    remove_index :activities, :base_location_id

    drop_table :activities
  end
end
