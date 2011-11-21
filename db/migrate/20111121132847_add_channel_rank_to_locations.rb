class AddChannelRankToLocations < ActiveRecord::Migration
  def self.up
    add_column :locations, :analytics_summary, :text
  end

  def self.down
    remove_column :locations, :analytics_summary, :text
  end
end
