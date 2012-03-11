class CreateLocalActions < ActiveRecord::Migration
  def self.up
    create_table :local_actions do |t|
      t.integer :author_id
      t.integer :summary_id

      t.text :meta, :default => {}
      t.text :name

      t.timestamps
    end

    add_index :local_actions, :summary_id
    add_index :local_actions, :author_id

    add_index :local_actions, [:name, :summary_id, :author_id], :unique => true
  end

  def self.down
    drop_table :local_actions
  end
end
