class AddDefaultSharesToProfiles < ActiveRecord::Migration
  def self.up
    add_column :profiles, :fb_default_share, :boolean
    add_column :profiles, :twt_default_share, :boolean
  end

  def self.down
    remove_column :profiles, :twt_default_share
    remove_column :profiles, :fb_default_share
  end
end
