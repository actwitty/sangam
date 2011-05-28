class CreateEntityOwnerships < ActiveRecord::Migration
  def self.up
    create_table :entity_ownerships do |t|
      #user can become null if gets deleted but ideally user delete should not delete the user row
      t.integer :owner_id
      t.integer :entity_id, :null => false
      t.timestamps
    end

    add_index :entity_ownerships, [:entity_id,:owner_id], :unique => true
    add_index :entity_ownerships, :owner_id
  end

  def self.down

    remove_index :entity_ownerships, [:entity_id,:owner_id]
    remove_index :entity_ownerships, :owner_id

    drop_table :entity_ownerships
  end
end
