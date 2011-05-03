class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|
      t.string :comment_text
      t.string :attachment_url
      t.string :attachment_url_s
      t.string :attachment_name
      t.string :attachment_type
      t.integer :post_id

      t.timestamps
    end
  end

  def self.down
    drop_table :comments
  end
end
