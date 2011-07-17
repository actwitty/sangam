class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|

      t.integer :author_id, :null => false
      t.integer :activity_id, :null => false
      t.integer :father_id, :null => false
      t.text :text, :null =>false
      t.timestamps
    end

    add_index :comments, [ :author_id,  :activity_id]
    add_index :comments, :activity_id
    add_index :comments, :father_id, :unique => true
    add_index :comments, :updated_at
  end



  def self.down
    remove_index :comments, [ :author_id,  :activity_id]
    remove_index :comments, :activity_id
    remove_index :comments, :father_id
    remove_index :comments, :updated_at

    drop_table :comments
  end
end
