class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.string :activity_text
      t.integer :post_user_id
      t.integer :post_activity_id
      t.text :message_text
      t.text :optional_comment
      t.string :attachment_url
      t.string :attachment_url_s
      t.string :attachment_name
      t.string :attachment_type
      t.boolean :public
      t.integer :abuse_count

      t.timestamps
    end
  end

  def self.down
    drop_table :posts
  end
end
