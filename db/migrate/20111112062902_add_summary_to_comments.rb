class AddSummaryToComments < ActiveRecord::Migration
  def self.up
    add_column :comments, :summary_id, :integer
    add_index :comments, :summary_id
  end

  def self.down

    remove_index :comments, :summary_id
    remove_column :comments, :summary_id
  end
end
