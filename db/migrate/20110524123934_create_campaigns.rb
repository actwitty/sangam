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

      t.text  :name, :null => false

      t.integer  :value,:null => false

      t.integer :status, :null => false                 # 0 => saved, 1 => public share, 2 => private
                                        # 3 => shared to group of people or group.When this value is 3,
                                        # we need to see access_visibility table to see the access


      t.text    :source_name, :null => false            #"actwitty", "facebook", # "twitter",
                                        # "G+", "DropBox", "Mobile +919980906102","a@b.com

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

    add_index :campaigns, [:document_id, :author_id, :name], :unique => true,
              :name => "index_campaign_on_document_author_name"


    #not needed below index as activity is always mapped to user - so same as above

    add_index :campaigns, [:activity_id,:name]
#    add_index :campaigns, [:location_id,:name]
#    add_index :campaigns, [:entity_id,:name]
#    add_index :campaigns, [:comment_id,:name]
#    add_index :campaigns, [:document_id,:name]

#    add_index :campaigns, :father_id, :unique => true

    add_index :campaigns, :name

#    add_index :campaigns, [:author_id,:name, :value], :name => "index_campaign_on_author_name_value"
    add_index :campaigns, :source_name

    add_index :campaigns, :updated_at

#    add_index :campaigns, [:status, :author_id ]
#
#    add_index :campaigns, [:source_name, :author_id]
  end

  def self.down

    remove_index :campaigns, :name => "index_campaign_on_activity_author_name"
    remove_index :campaigns, :name => "index_campaign_on_entity_author_name"
    remove_index :campaigns, :name => "index_campaign_on_location_author_name"
    remove_index :campaigns, :name => "index_campaign_on_comment_author_name"
    remove_index :campaigns, :name => "index_campaign_on_document_author_name"

    remove_index :campaigns, [:activity_id,:name]
#    remove_index :campaigns, [:entity_id,:name]
#    remove_index :campaigns, [:location_id,:name]
#    remove_index :campaigns, [:comment_id,:name]
#    remove_index :campaigns, [:document_id,:name]

#    remove_index :campaigns, :father_id

    remove_index :campaigns, :name

#    remove_index :campaigns, :name => "index_campaign_on_author_name_value"
    remove_index :campaigns, :source_name

    remove_index :campaigns, :updated_at

#    remove_index :campaigns, [:status, :author_id ]
#
#    remove_index :campaigns, [:source_name, :author_id]

    drop_table :campaigns
  end
end
