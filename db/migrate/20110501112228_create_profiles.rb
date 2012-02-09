class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      
      t.boolean :facebook_service_enabled
      t.boolean :twitter_service_enabled
      t.boolean :linked_in_service_enabled

      t.boolean :facebook_update_share
      t.boolean :twitter_update_share

      t.integer :user_id

      t.timestamps

    end

  end

  def self.down
    drop_table :profiles
  end
end

