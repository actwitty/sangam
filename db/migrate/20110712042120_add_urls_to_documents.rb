class AddUrlsToDocuments < ActiveRecord::Migration
  def self.up
    add_column :documents, :thumb_url, :text
    add_column :documents, :url, :text
  end

  def self.down
    remove_column :documents, :url
    remove_column :documents, :thumb_url
  end
end
