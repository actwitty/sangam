class CreateSummaryRanks < ActiveRecord::Migration
  def self.up
    create_table :summary_ranks do |t|

      t.integer :summary_id

      t.integer :location_id

      t.integer :entity_id

      t.text :posts
      t.text :likes
      t.text :actions
      t.text :subscribers
      t.text :comments
      t.text :demographics
      t.text :documents
      t.text :channel_ranks
      t.text :views
      t.text :analytics_summary

      t.timestamps
    end

    add_index :summary_ranks, :summary_id, :unique => true
    add_index :summary_ranks, :location_id, :unique => true
    add_index :summary_ranks, :entity_id, :unique => true
  end

  def self.down
    drop_table :summary_ranks
  end
end
