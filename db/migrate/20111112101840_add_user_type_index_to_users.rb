class AddUserTypeIndexToUsers < ActiveRecord::Migration
  def self.up
    add_index :users, :user_type
  end

  def self.down
    remove_index :users, :user_type
  end
end
