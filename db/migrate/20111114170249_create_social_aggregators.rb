class CreateSocialAggregators < ActiveRecord::Migration
  def self.up
    create_table :social_aggregators do |t|

      t.integer :user_id, :null => false

      t.text    :provider, :null => false

      t.text    :uid, :null => false

      t.datetime :latest_msg_timestamp, :default => Time.utc(1970, 1, 1, 0, 0).to_datetime

      t.text  :latest_msg_id, :default => ""

      t.integer  :status, :default => AppConstants.data_sync_new

      t.datetime :next_update_timestamp, :default => Time.utc(1970, 1, 1, 0, 0).to_datetime

      t.integer  :update_interval, :default => AppConstants.maximum_time_diff_for_social_fetch #in seconds

      t.integer  :every_time_feed_storage, :default => AppConstants.every_time_feed_storage

      t.integer  :first_time_feed_storage, :default => AppConstants.first_time_feed_storage

      t.timestamps
    end

    add_index :social_aggregators, [:user_id, :provider, :uid], :name => "index_social_aggregators_on_user_provider_uid",
                                                                    :unique => true
    add_index :social_aggregators, :provider
    add_index :social_aggregators, :uid
    add_index :social_aggregators, :status
    add_index :social_aggregators, :next_update_timestamp
    add_index :social_aggregators, :update_interval

  end

  def self.down
    drop_table :social_aggregators
  end
end
