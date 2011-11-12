class RemoveUrlFromThemes < ActiveRecord::Migration
  def self.up
    remove_column :themes, :url
  end

  def self.down
    add_column :themes, :url, :text
  end
end
