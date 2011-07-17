class CreateSummaries < ActiveRecord::Migration
  def self.up
    create_table :summaries do |t|

      t.integer :user_id, :null => false
      t.integer :activity_word_id, :null => false
      t.string  :activity_name, :null => false

      t.integer :activities_count
      t.integer :documents_count

      t.text :location_array
      t.text :entity_array
      t.text :activity_array
      t.text :document_array
      t.timestamps

    end

    add_index :summaries, [:user_id, :activity_word_id], :unique => true
    add_index :summaries, :activity_word_id
    add_index :summaries, :activity_name
    add_index :summaries, :updated_at
  end

  def self.down
    remove_index :summaries, [:user_id, :activity_word_id]
    remove_index :summaries, :activity_word_id
    remove_index :summaries, :activity_name
    remove_index :summaries, :updated_at

    drop_table :summaries
  end
end
