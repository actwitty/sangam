class CreateSocialCounters < ActiveRecord::Migration
  def self.up
    create_table :social_counters do |t|
      t.text :source_name, :null => false
      t.text :action, :null => false

      t.integer :activity_id
      t.integer :document_id
      t.integer :summary_id

      t.integer :location_id

      t.integer :entity_id

      t.integer :author_id

      t.timestamps
    end
  end

  def self.down
    drop_table :social_counters
  end
end
