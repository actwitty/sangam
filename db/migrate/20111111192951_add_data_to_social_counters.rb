class AddDataToSocialCounters < ActiveRecord::Migration
  def self.up
    add_column :social_counters, :desc, :text
    add_index :social_counters, [:summary_id, :action]
  end

  def self.down
    remove_column :social_counters, :desc
    remove_index :social_counters, [:summary_id, :action]
  end
end
