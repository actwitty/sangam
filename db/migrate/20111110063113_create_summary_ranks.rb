class CreateSummaryRanks < ActiveRecord::Migration
  def self.up
    create_table :summary_ranks do |t|
      t.integer :user_id
      t.integer :summary_id

      t.integer :location_id

      t.integer :entity_id

      t.text :posts
      t.text :likes
      t.text :shares
      t.text :subscribers
      t.text :comments
      t.text :demography
      t.text :documents
      t.text :channel_ranks
      t.text :views

      t.timestamps
    end
    add_index :summary_ranks, [:user_id, :summary_id], :unique => true
    add_index :summary_ranks, :summary_id, :unique => true
    add_index :summary_ranks, :location_id, :unique => true
    add_index :summary_ranks, :entity_id, :unique => true
  end

  def self.down
    remove_index :summary_ranks, [:user_id, :summary_id]
    remove_index :summary_ranks, :summary_id
    remove_index :summary_ranks, :location_id
    remove_index :summary_ranks, :entity_id

    drop_table :summary_ranks
  end
end
