class RemoveAttachmentFromPosts < ActiveRecord::Migration
  def self.up
    remove_column :posts, :attachment_url
    remove_column :posts, :attachment_type
    remove_column :posts, :attachment_name
    remove_column :posts, :attachment_url_s
  end

  def self.down
    add_column :posts, :attachment_url_s, :string
    add_column :posts, :attachment_name, :string
    add_column :posts, :attachment_type, :string
    add_column :posts, :attachment_url, :string
  end
end
