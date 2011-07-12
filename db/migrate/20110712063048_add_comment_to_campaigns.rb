class AddCommentToCampaigns < ActiveRecord::Migration
  def self.up
    add_column :campaigns, :comment_id, :integer

    #Bug in original campaign migration as its activity_id is added twice
    remove_index  :campaigns, :name => "index_campaign_on_author_location_name"
    add_index :campaigns, [:author_id, :location_id, :campaign_name], :unique => true,
              :name => "index_campaign_on_author_location_name"


    add_index :campaigns, [:author_id, :comment_id, :campaign_name], :unique => true,
              :name => "index_campaign_on_author_comment_name"

    add_index :campaigns, [:comment_id,:campaign_name]
  end

  def self.down

    remove_index :campaigns,:name => "index_campaign_on_author_comment_name"
    remove_index :campaigns, [:comment_id,:campaign_name]

    remove_column :campaigns, :comment_id
  end
end
