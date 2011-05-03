class CreateLoops < ActiveRecord::Migration
  def self.up
    create_table :loops do |t|
      t.string :name
      t.boolean :public

      t.timestamps
    end
  end

  def self.down
    drop_table :loops
  end
end
