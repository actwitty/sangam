class AddDataToSocialCounters < ActiveRecord::Migration
  def self.up
    add_column :social_counters, :desc, :text
  end

  def self.down
    remove_column :social_counters, :desc
  end
end
