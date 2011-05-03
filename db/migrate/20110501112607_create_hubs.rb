class CreateHubs < ActiveRecord::Migration
  def self.up
    create_table :hubs do |t|
      t.integer :click_count
      t.integer :user_id
      t.integer :post_id
      t.integer :activity_id

      t.timestamps
    end
  end

  def self.down
    drop_table :hubs
  end
end
