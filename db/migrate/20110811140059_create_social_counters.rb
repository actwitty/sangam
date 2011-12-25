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

      t.text :description

      t.timestamps
    end
    add_index :social_counters, :source_name
    add_index :social_counters,:action

    add_index :social_counters, :summary_id
    add_index :social_counters, :activity_id

    add_index :social_counters, :author_id
    add_index :social_counters, :updated_at

    add_index :social_counters, :location_id
    add_index :social_counters, :entity_id

    add_index :social_counters, :document_id

  end

  def self.down
    drop_table :social_counters
  end
end
