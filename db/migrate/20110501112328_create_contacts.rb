class CreateContacts < ActiveRecord::Migration
  def self.up
    create_table :contacts do |t|
      t.string :status
      t.boolean :pending

      t.timestamps
    end
  end

  def self.down
    drop_table :contacts
  end
end
