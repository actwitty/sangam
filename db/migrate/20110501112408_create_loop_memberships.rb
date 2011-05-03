class CreateLoopMemberships < ActiveRecord::Migration
  def self.up
    create_table :loop_memberships do |t|
      t.integer :loop_id
      t.integer :contact_id

      t.timestamps
    end
  end

  def self.down
    drop_table :loop_memberships
  end
end
