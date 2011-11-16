class CreateSocialAggregators < ActiveRecord::Migration
  def self.up
    create_table :social_aggregators do |t|
      t.integer :user_id ,  :null => false
      t.integer :activity_id,  :null => false
      t.integer :summary_id, :null => false
      t.datetime :provider_created_at, :null => false

      t.string  :source_name, :null => false
      t.string  :source_msg_id, :null => false

      t.timestamps
    end

    add_index :social_aggregators, [:user_id, :source_name, :source_msg_id], :unique => true,
                                   :name => "index_social_aggregator_on_user_source_msg_id"

    add_index :social_aggregators, [:source_name, :source_msg_id]
    add_index :social_aggregators, :source_msg_id

    add_index :social_aggregators, :activity_id
    add_index :social_aggregators, :summary_id
    add_index :social_aggregators, :provider_created_at

  end

  def self.down
    remove_index :social_aggregators, :name => "index_social_aggregator_on_user_source_msg_id"
    remove_index :social_aggregators, [:source_name, :source_msg_id]
    remove_index :social_aggregators, :source_msg_id

    remove_index :social_aggregators, :activity_id
    remove_index :social_aggregators, :summary_id
    remove_index :social_aggregators, :provider_created_at

    drop_table :social_aggregators
  end
end
