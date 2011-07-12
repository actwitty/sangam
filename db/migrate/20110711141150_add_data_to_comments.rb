class AddDataToComments < ActiveRecord::Migration
  def self.up
    add_column :comments, :author_id, :integer, :null => false
    add_column :comments, :activity_id, :integer, :null => false
    add_column :comments, :father_id, :integer, :null => false
    add_column :comments, :text, :text, :null => false

    add_index :comments, [ :author_id,  :activity_id], :unique => true
    add_index :comments, :activity_id
    add_index :comments, :father_id, :unique => true
  end

  def self.down

    remove_index :comments, [:author_id, :activity_id]
    remove_index :comments, :activity_id
    remove_index :comments, :father_id

    remove_column :comments, :text
    remove_column :comments, :father_id
    remove_column :comments, :activity_id
    remove_column :comments, :author_id

  end
end
