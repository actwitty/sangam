class AddAdminToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :user_type, :integer, :default => AppConstants.user_type_regular
  end

  def self.down
    remove_column :users, :user_type
  end
end
