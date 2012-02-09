class CreateCampaigns < ActiveRecord::Migration
  def self.up
    create_table :campaigns do |t|

      t.integer :author_id, :null => false

      t.integer :activity_id

      t.integer :entity_id

      t.integer :location_id

      t.integer :comment_id

      t.integer :father_id, :null => false

      t.text  :name, :null => false

      t.integer  :value,:null => false

      t.integer :status, :null => false                 # 0 => saved, 1 => public share, 2 => private
                                        # 3 => shared to group of people or group.When this value is 3,
                                        # we need to see access_visibility table to see the access


      t.text    :source_name, :null => false            #"actwitty", "facebook", # "twitter",
                                        # "G+", "DropBox", "Mobile +919980906102","a@b.com
      t.integer :summary_id

      t.timestamps

    end

    add_index :campaigns, [:activity_id, :author_id,  :name], :unique => true,
              :name => "index_campaign_on_activity_author_name"

    add_index :campaigns, [:entity_id,  :author_id,  :name], :unique => true,
              :name => "index_campaign_on_entity_author_name"

    add_index :campaigns, [:location_id, :author_id,  :name], :unique => true,
              :name => "index_campaign_on_location_author_name"

    add_index :campaigns, [:comment_id, :author_id,  :name], :unique => true,
              :name => "index_campaign_on_comment_author_name"


    add_index :campaigns, :name

    add_index :campaigns, :source_name

    add_index :campaigns, :updated_at

    add_index :campaigns,  :author_id

    add_index :campaigns, :summary_id
  end

  def self.down

    drop_table :campaigns
  end
end
