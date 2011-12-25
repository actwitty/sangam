class CreateSummaryCategories < ActiveRecord::Migration
  def self.up
    create_table :summary_categories do |t|
      t.text :category_id, :null => false
      t.text :category_type, :null => false #
      t.text :activity_name, :null => false #

      t.integer :summary_id, :null => false
      t.integer :user_id, :null => false

      t.timestamps
    end

    add_index :summary_categories, :summary_id, :unique => true
    add_index :summary_categories, :category_id
    add_index :summary_categories, :activity_name
    add_index :summary_categories, :user_id
    add_index :summary_categories, :category_type

  end

  def self.down
    drop_table :summary_categories
  end
end
