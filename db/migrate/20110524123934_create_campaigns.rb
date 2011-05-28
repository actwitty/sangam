class CreateCampaigns < ActiveRecord::Migration
  def self.up
    create_table :campaigns do |t|

      t.integer :activity_id,  :null => false
      t.integer :author_id, :null => false

      t.string  :campaign_name, :null => false
      t.string  :campaign_value, :limit => 32, :null => false
      t.string  :campaign_comment

      t.timestamps
    end

    add_index :campaigns, [:author_id, :activity_id, :campaign_name], :unique => true,
              :name => "index_campaign_on_author_activity_name"
    #not needed below index as activity is always mapped to user - so same as above
    #add_index :campaigns, [:activity_id,:campaign_name]

    add_index :campaigns, [:author_id,:campaign_name, :campaign_value], :name => "index_campaign_on_author_name_value"
    add_index :campaigns, [:campaign_name, :campaign_value], :name => "index_campaign_on_name_value"

  end

  def self.down

    remove_index :campaigns, "index_campaign_on_author_activity_name"
    remove_index :campaigns, "index_campaign_on_author_name_value"
    remove_index :campaigns, "index_campaign_on_name_value"

    drop_table :campaigns
  end
end
