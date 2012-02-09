class CreateSocialAggregators < ActiveRecord::Migration
  def self.up
    create_table :social_aggregators do |t|
      t.integer :user_id, :null => false
      t.text  :provider, :null => false
      t.text  :uid, :null => false

      t.datetime :latest_msg_timestamp, :default => Time.utc(1970, 1, 1, 0, 0).to_datetime

      t.integer :status, :default => AppConstants.data_sync_new

      t.timestamps
    end
    add_index :social_aggregators, [:user_id, :provider, :uid], :name => "index_social_aggregators_on_user_provider_uid",
                                                                    :unique => true
    add_index :social_aggregators, :provider
    add_index :social_aggregators, :uid
    add_index :social_aggregators, :status
  end

  def self.down
    drop_table :social_aggregators
  end
end
