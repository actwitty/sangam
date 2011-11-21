class AddChannelRankToSummaries < ActiveRecord::Migration
  def self.up
    add_column :summaries, :analytics_summary, :text
  end

  def self.down
    remove_column :summaries, :analytics_summary, :text
  end
end
