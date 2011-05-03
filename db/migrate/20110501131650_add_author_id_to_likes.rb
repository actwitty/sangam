class AddAuthorIdToLikes < ActiveRecord::Migration
  def self.up
    add_column :likes, :author_id, :integer
  end

  def self.down
    remove_column :likes, :author_id
  end
end
