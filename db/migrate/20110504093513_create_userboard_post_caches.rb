class CreateUserboardPostCaches < ActiveRecord::Migration
  def self.up
    create_table :userboard_post_caches do |t|
      t.integer :post_id
      t.integer :user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :userboard_post_caches
  end
end
