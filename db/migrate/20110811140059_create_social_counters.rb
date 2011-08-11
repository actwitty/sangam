class CreateSocialCounters < ActiveRecord::Migration
  def self.up
    create_table :social_counters do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :social_counters
  end
end
