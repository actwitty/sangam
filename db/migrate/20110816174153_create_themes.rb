class CreateThemes < ActiveRecord::Migration
  def self.up
    create_table :themes do |t|
      t.text  :bg_color
      t.text  :fg_color

      t.integer  :author_id, :null => false
      t.integer  :summary_id, :null => false

      t.text     :url

      t.timestamps
    end
  end

  def self.down
    drop_table :themes
  end
end
