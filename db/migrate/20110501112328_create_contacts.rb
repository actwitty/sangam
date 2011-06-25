class CreateContacts < ActiveRecord::Migration
  def self.up
    create_table :contacts do |t|
      t.integer :status
      t.integer :user_id
      t.integer :friend_id
      t.integer :loop_id
      t.decimal :strength
      t.string :relation
      t.timestamps
    end


    add_index :contacts, [:user_id, :friend_id, :status]
    add_index :contacts, [:friend_id, :status]
    add_index :contacts, :status
  end

  def self.down
    drop_table :contacts
  end
end
