class AddDataToEntity < ActiveRecord::Migration
  def self.up
    add_column :entities, :analytics_summary, :text
    add_column :entities, :rank, :string

    add_index  :entities, :rank
  end

  def self.down
    remove_index  :entities, :rank

    remove_column :entities, :rank
    remove_column :entities, :analytics_summary
  end
end
