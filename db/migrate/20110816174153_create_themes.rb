class CreateThemes < ActiveRecord::Migration
  def self.up
    create_table :themes do |t|
      t.text  :bg_color
      t.text  :fg_color

      t.integer  :author_id, :null => false
      t.integer  :summary_id, :null => false
      t.integer  :document_id

      t.integer  :theme_type, :null => false
      t.integer  :style

      t.timestamps
    end
    add_index :themes, [:author_id, :summary_id], :unique => true
    add_index :themes, :summary_id
    add_index :themes, :document_id
  end

  def self.down
    drop_table :themes
  end
end
