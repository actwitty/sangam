class CreateForeignProfiles < ActiveRecord::Migration
  def self.up
    create_table :foreign_profiles do |t|
      t.string :name
      t.string :screen_name
      t.string :first_name
      t.string :last_name
      t.string :image
      t.string :url
      t.string :gender
      t.string :email
      t.string :hometown
      t.string :location
      t.float :timezone
      t.string :locale
      t.string :foreign_updated_time
      t.integer :authentication_id
      t.string :dob
      t.timestamps
    end
  end

  def self.down
    drop_table :foreign_profiles
  end
end
