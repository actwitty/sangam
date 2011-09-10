class CreateSummarySubscribes < ActiveRecord::Migration
  def self.up
    create_table :summary_subscribes do |t|

      t.integer :summary_id, :null => false
      t.integer :subscriber_id,  :null => false
      t.integer :owner_id, :null => false       #channel owner
      t.text    :summary_name,  :null => false

      t.timestamps
    end

    add_index :summary_subscribes, [:summary_id, :subscriber_id], :unique => true
    add_index :summary_subscribes, [:subscriber_id, :owner_id]
    add_index :summary_subscribes, :subscriber_id
  end

  def self.down

    remove_index :summary_subscribes, [:summary_id, :subscriber_id]
    remove_index :summary_subscribes, [:subscriber_id, :owner_id]
    remove_index :summary_subscribes, :subscriber_id

    drop_table :summary_subscribes
  end
end
