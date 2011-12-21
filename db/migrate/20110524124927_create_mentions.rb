class CreateMentions < ActiveRecord::Migration
  def self.up
   create_table :mentions do |t|
      t.integer :activity_id,  :null => false
      t.integer :user_id, :null => false

      t.timestamps
   end

    add_index :mentions, [:user_id, :activity_id], :unique => true
    add_index :mentions, :activity_id

  end

  def self.down
    drop_table :mentions
  end
end
