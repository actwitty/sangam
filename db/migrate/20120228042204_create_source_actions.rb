class CreateSourceActions < ActiveRecord::Migration
  def self.up
    create_table :source_actions do |t|
      t.integer :user_id
      t.integer :summary_id
      t.integer :activity_id

      t.text :source_name
      t.text :source_msg_id

      t.text :meta, :default => {}
      t.text :name
      t.integer :count

      t.datetime :source_created_at, :default => Time.now.utc

      t.timestamps
    end

    add_index :source_actions, [:activity_id, :name], :unique => true
    add_index :source_actions, :summary_id
    add_index :source_actions, :user_id

    add_index :source_actions, :name
    add_index :source_actions, :count

    add_index :source_actions, :source_name
    add_index :source_actions, :source_msg_id

    add_index :source_actions, :source_created_at
  end

  def self.down
    drop_table :source_actions
  end
end
