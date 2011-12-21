class CreateWebLinks < ActiveRecord::Migration
  def self.up
    create_table :web_links do |t|
      t.text :url  , :null => false
      t.text :url_sha1, :null => false
      t.text :mime, :null => false
      t.text :provider, :null => false
      t.text :category
      t.text :name
      t.text :description

      t.text :image_url

      t.integer :image_width
      t.integer :image_height

      t.boolean :url_processed, :default => false

      t.integer :documents_count, :default => 0

      t.timestamps
    end
    add_index  :web_links, :url_sha1, :unique => true
    add_index  :web_links, :mime
    add_index  :web_links, :category
    add_index  :web_links, :provider
  end

  def self.down
    drop_table :web_links
  end
end
