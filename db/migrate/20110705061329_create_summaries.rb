class CreateSummaries < ActiveRecord::Migration
  def self.up
    create_table :summaries do |t|

      t.integer :user_id, :null => false
      t.integer :activity_word_id, :null => false
      t.text  :activity_name, :null => false

      t.integer :activities_count, :default => 0
      t.integer :documents_count, :default => 0
      t.integer :tags_count, :default => 0

      t.text :location_array
      t.text :entity_array
      t.text :activity_array
      t.text :document_array
      t.text :tag_array
      t.text :social_counters_array
      t.text :theme_data

      t.text :category_id
      t.text :category_type
      t.text :rank
      t.text   :analytics_summary
      t.integer :campaigns_count, :default => 0

      t.timestamps

    end

    add_index :summaries, [:user_id, :activity_word_id], :unique => true
    add_index :summaries, :activity_word_id
    add_index :summaries, :activity_name
    add_index :summaries, :updated_at

    add_index :summaries, :rank
    add_index :summaries, :category_id
    add_index :summaries, :category_type
  end

  def self.down

    drop_table :summaries
  end
end
