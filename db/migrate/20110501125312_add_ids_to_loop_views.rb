class AddIdsToLoopViews < ActiveRecord::Migration
  def self.up
    add_column :loop_views, :activity_id, :integer
    add_column :loop_views, :loop_id, :integer
    add_column :loop_views, :entity_id, :integer
    add_column :loop_views, :post_id, :integer
  end

  def self.down
    remove_column :loop_views, :post_id
    remove_column :loop_views, :entity_id
    remove_column :loop_views, :loop_id
    remove_column :loop_views, :activity_id
  end
end
