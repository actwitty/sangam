class CreateCampaigns < ActiveRecord::Migration
  def self.up
    create_table :campaigns do |t|

      t.integer :author_id, :null => false

      t.integer :activity_id
      t.integer :entity_id
      t.integer :location_id

      t.integer :father_id, :null => false

      t.string  :campaign_name, :null => false
      t.integer  :campaign_value,:null => false

      t.timestamps
    end

    add_index :campaigns, [:author_id, :activity_id, :campaign_name], :unique => true,
              :name => "index_campaign_on_author_activity_name"

    add_index :campaigns, [:author_id, :entity_id, :campaign_name], :unique => true,
              :name => "index_campaign_on_author_entity_name"

    add_index :campaigns, [:author_id, :activity_id, :campaign_name], :unique => true,
              :name => "index_campaign_on_author_location_name"
    #not needed below index as activity is always mapped to user - so same as above

    add_index :campaigns, [:activity_id,:campaign_name]
    add_index :campaigns, [:location_id,:campaign_name]
    add_index :campaigns, [:entity_id,:campaign_name]

    add_index :campaigns, :father_id, :unique => true

    add_index :campaigns, :campaign_name

    add_index :campaigns, [:author_id,:campaign_name, :campaign_value], :name => "index_campaign_on_author_name_value"

  end

  def self.down

    remove_index :campaigns, :name => "index_campaign_on_author_activity_name"
    remove_index :campaigns, :name => "index_campaign_on_author_entity_name"
    remove_index :campaigns, :name => "index_campaign_on_author_location_name"

    remove_index :campaigns, [:activity_id,:campaign_name]
    remove_index :campaigns, [:entity_id,:campaign_name]
    remove_index :campaigns, [:location_id,:campaign_name]

    remove_index :campaigns, :father_id

    remove_index :campaigns, :campaign_name

    remove_index :campaigns, :name => "index_campaign_on_author_name_value"

    drop_table :campaigns
  end
end
