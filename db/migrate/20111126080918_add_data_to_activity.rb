class AddDataToActivity < ActiveRecord::Migration
  def self.up
    add_column :activities, :source_msg_id, :string
    add_column :activities, :category_type, :string
    add_column :activities, :category_id, :string

    add_index :activities, :source_msg_id
    add_index :activities, [:author_id, :category_type, :base_location_id ],
              :name => "index_activities_on_author_category_location"
    add_index :activities, :category_type

  end

  def self.down
    remove_index :activities, :name => "index_activities_on_author_category_location"
    remove_index :activities, :source_msg_id
    remove_index :activities, :category_type

    remove_column  :activities, :category_id
    remove_column :activities, :category_type
    remove_column :activities, :source_msg_id
  end
end
