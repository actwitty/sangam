class CreateSocialAggregators < ActiveRecord::Migration
  def self.up
    create_table :social_aggregators do |t|
      t.integer :user_id
      t.string  :provider
      t.string  :uid
      t.datetime :latest_msg_timestamp, :default => Time.utc(1978, 12, 15, 9, 10).to_datetime
      t.timestamps
    end
    add_index :social_aggregators, [:user_id, :provider, :uid], :name => "index_social_aggregators_on_user_provider_uid",
                                                                    :unique => true
    add_index :social_aggregators, :provider
    add_index :social_aggregators, :uid
  end

  def self.down
    drop_table :social_aggregators
  end
end
