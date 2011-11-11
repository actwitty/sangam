class AddDataToSummaries < ActiveRecord::Migration
  def self.up
    add_column :summaries, :category_data, :text
  end

  def self.down
    remove_column :summaries, :category_data
  end
end
