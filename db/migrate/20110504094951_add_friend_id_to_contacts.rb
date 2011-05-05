class AddFriendIdToContacts < ActiveRecord::Migration
  def self.up
    add_column :contacts, :friend_id, :integer
  end

  def self.down
    remove_column :contacts, :friend_id
  end
end
