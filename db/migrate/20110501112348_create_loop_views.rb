class CreateLoopViews < ActiveRecord::Migration
  def self.up
    create_table :loop_views do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :loop_views
  end
end
