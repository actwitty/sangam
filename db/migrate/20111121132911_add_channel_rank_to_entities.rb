class AddChannelRankToEntities < ActiveRecord::Migration
  def self.up
    add_column :entities, :analytics_summary, :text
  end

  def self.down
    remove_column :entities, :analytics_summary, :text
  end
end
