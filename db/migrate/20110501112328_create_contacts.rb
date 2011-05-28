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
  end

  def self.down
    drop_table :contacts
  end
end
