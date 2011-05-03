class CreateActivities < ActiveRecord::Migration
  def self.up
    create_table :activities do |t|
      t.string :activity_name
      t.string :activity_description
      t.string :activity_category
      t.integer :activity_abuse
      t.string :activity_quick_code

      t.timestamps
    end
  end

  def self.down
    drop_table :activities
  end
end
