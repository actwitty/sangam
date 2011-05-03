class AddUserIdToLoops < ActiveRecord::Migration
  def self.up
    add_column :loops, :user_id, :integer
  end

  def self.down
    remove_column :loops, :user_id
  end
end
