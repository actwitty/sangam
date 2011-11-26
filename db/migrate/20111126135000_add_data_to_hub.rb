class AddDataToHub < ActiveRecord::Migration
  def self.up
    add_column :hubs, :category_type, :string
    add_index :hubs, :category_type
  end

  def self.down
    remove_index :hubs, :category_type
    remove_column :hubs, :category_type
  end
end
