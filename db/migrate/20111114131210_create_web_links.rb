class CreateWebLinks < ActiveRecord::Migration
  def self.up
    create_table :web_links do |t|
      t.text :url  , :null => false
      t.text :url_sha1, :null => false
      t.string :category,  :null => false
      t.text :title
      t.text :description
      t.text :image_url
      t.text :keywords
      t.timestamps
    end
    add_index  :web_links, :url_sha1, :unique => true
    add_index  :web_links, :category
  end

  def self.down
    remove_index  :web_links, :url_sha1
    remove_index  :web_links, :category

    drop_table :web_links
  end
end
