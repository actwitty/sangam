class CreateActivityDicts < ActiveRecord::Migration
  def self.up
    create_table :activity_dicts do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :activity_dicts
  end
end
