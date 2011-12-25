class CreateShortWebLinks < ActiveRecord::Migration
  def self.up
    create_table :short_web_links do |t|

      t.integer :web_link_id, :null => false
      t.text :url, :null => false
      t.text :url_sha1, :null => false

      t.timestamps
    end

    add_index :short_web_links, :web_link_id
    add_index :short_web_links, :url_sha1 , :unique => true
  end

  def self.down
    drop_table :short_web_links
  end
end
