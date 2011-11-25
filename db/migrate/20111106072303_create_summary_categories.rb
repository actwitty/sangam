class CreateSummaryCategories < ActiveRecord::Migration
  def self.up
    create_table :summary_categories do |t|
      t.string :category_id, :null => false
      t.string :category_type, :null => false #
      t.string :activity_name, :null => false #

      t.integer :summary_id, :null => false
      t.integer :user_id, :null => false

      t.timestamps
    end

    add_index :summary_categories, :summary_id, :unique => true
    add_index :summary_categories, [:category_id, :activity_name]
    add_index :summary_categories, :activity_name
    add_index :summary_categories, :user_id
    add_index :summary_categories, :category_type

  end

  def self.down


    remove_index :summary_categories, :summary_id
    remove_index :summary_categories, [:category_id, :activity_name]
    remove_index :summary_categories, :activity_name
    remove_index :summary_categories, :user_id
    remove_index :summary_categories, :category_type

    drop_table :summary_categories
  end
end
