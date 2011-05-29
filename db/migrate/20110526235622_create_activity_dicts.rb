class CreateActivityDicts < ActiveRecord::Migration
  def self.up
    create_table :activity_dicts do |t|
      t.string :dict_name, :null => false
      t.timestamps
    end
    add_index :activity_dicts, :dict_name
  end

  def self.down
    remove_index :activity_dicts, :dict_name

    drop_table :activity_dicts
  end
end
