class CreateActivities < ActiveRecord::Migration
  def self.up
    create_table :activities do |t|
      # activity_data_id in table where actual uniq activity name is stored === globally unique activity names
      t.integer :activity_dict_id, :null => false

      t.text   :activity_text, :limit => "1024", :null => false

      #activity_name should always be same activity_data_name == redundancy
      t.string  :activity_name, :null => false

      t.integer   :author_id, :null => false
      t.integer :parent_id, :null => true

      t.string :ancestry
      t.integer :ancestry_depth,  :default => 0

      t.timestamps
    end

      add_index :activities, :ancestry
      add_index :activities, [:author_id, :activity_name,:activity_dict_id], :name => "index_activity_author_name_dict"

      add_index :activities, [:activity_name,:author_id]

      add_index :activities, [:activity_dict_id, :author_id]

      #TODO not needed - verify through query analyzer though :)
      add_index :activities, :author_id

      add_index :activities, :parent_id

  end

  def self.down

    remove_index :activities, :ancestry

    remove_index :activities,  "index_activity_author_name_dict"

    remove_index :activities, [:activity_name,:author_id]

    remove_index :activities, [:activity_dict_id, :author_id]

    remove_index :activities, :parent_id

    drop_table :activities
  end
end
