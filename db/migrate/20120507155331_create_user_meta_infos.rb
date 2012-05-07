class CreateUserMetaInfos < ActiveRecord::Migration
  def self.up
    create_table :user_meta_infos do |t|
      t.integer :user_id
      t.text :category, :default => AppConstants.default_category
      t.integer :user_type, :default => AppConstants.user_type_regular

      t.timestamps
    end
    add_index :user_meta_infos, :user_id
    add_index :user_meta_infos, :category
    add_index :user_meta_infos, :user_type
  end
  def self.down
    drop_table :user_meta_infos
  end
end
