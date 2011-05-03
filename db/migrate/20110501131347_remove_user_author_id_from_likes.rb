class RemoveUserAuthorIdFromLikes < ActiveRecord::Migration
  def self.up
    remove_column :likes, :user_author_id
  end

  def self.down
    add_column :likes, :user_author_id, :integer
  end
end
