class CreateWebLinks < ActiveRecord::Migration
  def self.up
    create_table :web_links do |t|
      t.text :url  , :null => false
      t.text :url_sha1, :null => false
      t.text :mime, :null => false
      t.text :provider, :null => false

      t.text :title
      t.text :description

      t.text :image_url

      t.integer :image_width
      t.integer :image_height

      t.integer :documents_count, :default => 0

      t.text :category_id
      t.text :category_type
      t.integer :cache_age

      t.timestamps
    end
    add_index  :web_links, :url_sha1, :unique => true
    add_index  :web_links, :mime

    add_index  :web_links, :provider
    add_index  :web_links, :category_type
    add_index  :web_links, :cache_age
  end

  def self.down
    drop_table :web_links
  end
end
