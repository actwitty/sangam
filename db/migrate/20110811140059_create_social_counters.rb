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
    add_index :social_counters, [:source_name, :action]
    add_index :social_counters, [:summary_id, :activity_id]
    add_index :social_counters, :activity_id

    add_index :social_counters, :author_id
    add_index :social_counters, :updated_at

    add_index :social_counters, :location_id
    add_index :social_counters, :entity_id

    add_index :social_counters, :document_id

  end

  def self.down

    remove_index :social_counters, [:source_name, :action]
    remove_index :social_counters, [:summary_id, :activity_id]

    remove_index :social_counters, :activity_id
    remove_index :social_counters, :author_id

    remove_index :social_counters, :updated_at

    remove_index :social_counters, :location_id
    remove_index :social_counters, :entity_id

    remove_index :social_counters, :document_id

    drop_table :social_counters
  end
end
