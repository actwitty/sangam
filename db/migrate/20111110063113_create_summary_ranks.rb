class CreateSummaryRanks < ActiveRecord::Migration
  def self.up
    create_table :summary_ranks do |t|

      t.integer :summary_id
      t.integer :user_id, :null => false
      t.text :activity_name
      t.text :category_id

      t.text :analytics

      t.timestamps
    end

    add_index :summary_ranks, :summary_id, :unique => true
    add_index :summary_ranks, :user_id
  end

  def self.down
    drop_table :summary_ranks
  end
end
