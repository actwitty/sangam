class CreateCampaigns < ActiveRecord::Migration
  def self.up
    create_table :campaigns do |t|

      t.integer :author_id, :null => false

      t.integer :activity_id
      t.integer :entity_id
      t.integer :location_id
      t.integer :comment_id
      t.integer :document_id

      t.integer :father_id, :null => false

      t.string  :name, :null => false
      t.integer  :value,:null => false

      t.timestamps
    end

    add_index :campaigns, [:author_id, :activity_id, :name], :unique => true,
              :name => "index_campaign_on_author_activity_name"

    add_index :campaigns, [:author_id, :entity_id, :name], :unique => true,
              :name => "index_campaign_on_author_entity_name"

    add_index :campaigns, [:author_id, :location_id, :name], :unique => true,
              :name => "index_campaign_on_author_location_name"

    add_index :campaigns, [:author_id, :comment_id, :name], :unique => true,
              :name => "index_campaign_on_author_comment_name"

    add_index :campaigns, [:author_id, :document_id, :name], :unique => true,
              :name => "index_campaign_on_author_document_name"


    #not needed below index as activity is always mapped to user - so same as above

    add_index :campaigns, [:activity_id,:name]
    add_index :campaigns, [:location_id,:name]
    add_index :campaigns, [:entity_id,:name]
    add_index :campaigns, [:comment_id,:name]
    add_index :campaigns, [:document_id,:name]

    add_index :campaigns, :father_id, :unique => true

    add_index :campaigns, :name

    add_index :campaigns, [:author_id,:name, :value], :name => "index_campaign_on_author_name_value"
    add_index :campaigns, :updated_at

  end

  def self.down

    remove_index :campaigns, :name => "index_campaign_on_author_activity_name"
    remove_index :campaigns, :name => "index_campaign_on_author_entity_name"
    remove_index :campaigns, :name => "index_campaign_on_author_location_name"
    remove_index :campaigns, :name => "index_campaign_on_author_comment_name"
    remove_index :campaigns, :name => "index_campaign_on_author_document_name"

    remove_index :campaigns, [:activity_id,:name]
    remove_index :campaigns, [:entity_id,:name]
    remove_index :campaigns, [:location_id,:name]
    remove_index :campaigns, [:comment_id,:name]
    remove_index :campaigns, [:document_id,:name]

    remove_index :campaigns, :father_id

    remove_index :campaigns, :name

    remove_index :campaigns, :name => "index_campaign_on_author_name_value"

    remove_index :campaigns, :updated_at

    drop_table :campaigns
  end
end
