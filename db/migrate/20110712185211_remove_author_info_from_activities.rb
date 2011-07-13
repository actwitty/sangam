class RemoveAuthorInfoFromActivities < ActiveRecord::Migration
  def self.up
    remove_column :activities, :author_full_name
    remove_column :activities, :author_profile_photo
  end

  def self.down
  end
end
