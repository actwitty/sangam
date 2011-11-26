class AddDataToSummary < ActiveRecord::Migration
  def self.up
    add_column :summaries, :category_id, :string
    add_column :summaries, :category_type, :string
    add_column :summaries, :rank, :string
    add_column :summaries, :analytics_summary, :text

    add_index :summaries, :rank
    add_index :summaries, :category_id
    add_index :summaries, :category_type
  end

  def self.down

    remove_index :summaries, :rank
    remove_index :summaries, :category_id
    remove_index :summaries, :category_type

    remove_column :summaries, :category_id
    remove_column :summaries, :category_type
    remove_column :summaries, :rank
    remove_column :summaries, :analytics_summary
  end
end
