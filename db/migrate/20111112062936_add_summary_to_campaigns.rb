class AddSummaryToCampaigns < ActiveRecord::Migration
  def self.up
    add_column :campaigns, :summary_id, :integer
    add_index :campaigns, [:summary_id, :name]
  end

  def self.down

    remove_index :campaigns, [:summary_id, :name]
    remove_column :campaigns, :summary_id
  end
end
