class CreateSummaries < ActiveRecord::Migration
  def self.up
    create_table :summaries do |t|

      t.integer :user_id, :null => false
      t.integer :activity_word_id, :null => false
      t.text  :activity_name, :null => false

      t.integer :activities_count, :default => 0

      t.text :category_id
      t.text :category_type

      t.text   :analytics_snapshot
      t.text   :enabled_services

      t.datetime :source_created_at, :default => Time.utc(1970, 1, 1, 0, 0).to_datetime

      t.timestamps

    end

    add_index :summaries, [:user_id, :activity_word_id], :unique => true
    add_index :summaries, :activity_word_id
    add_index :summaries, :activity_name
    add_index :summaries, :updated_at

    add_index :summaries, :category_id
    add_index :summaries, :category_type

    add_index :summaries, :source_created_at
  end

  def self.down

    drop_table :summaries
  end
end
