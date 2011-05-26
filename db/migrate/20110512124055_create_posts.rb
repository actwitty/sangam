class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.integer :author_id
      t.integer :activity_id
      t.string :activity_name
      t.text :post_text

      t.timestamps
    end
  end

  def self.down
    drop_table :posts
  end
end
