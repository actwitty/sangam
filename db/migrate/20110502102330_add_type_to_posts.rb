class AddTypeToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :post_type, :string
    add_column :posts, :post_source, :string
  end

  def self.down
    remove_column :posts, :post_source
    remove_column :posts, :post_type
  end
end
