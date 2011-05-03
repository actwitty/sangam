class AddDocumentToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :document_url, :string
    add_column :posts, :document_type, :string
    add_column :posts, :document_name, :string
    add_column :posts, :document_image_url_s, :string
  end

  def self.down
    remove_column :posts, :document_image_url_s
    remove_column :posts, :document_name
    remove_column :posts, :document_type
    remove_column :posts, :document_url
  end
end
