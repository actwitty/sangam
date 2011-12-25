class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      t.string :first_name
      t.string :last_name
      t.string :short_status
      t.string :profile_photo_l
      t.string :profile_photo_m
      t.string :profile_photo_s
      t.string :home_location
      t.decimal :home_geo_lat
      t.decimal :home_geo_long
      t.string :current_location
      t.decimal :current_geo_lat
      t.decimal :current_geo_long
      t.integer :age
      t.date :dob
      t.string :gender
      t.string :theme
      t.string :address
      t.string :company_name
      t.string :phone_number
      t.string :mobile_number
      t.string :work_area
      t.string :interest
      t.string :home_page
      t.string :tag_string
      t.string :email
      t.string :searchable
      t.boolean :verified_account
      t.boolean :is_celebrity
      t.integer :abuse_count
      t.string :theme
      t.boolean :is_terms_accepted
      t.boolean :is_privacy_accepted

      t.boolean :fb_default_share
      t.boolean :twt_default_share

      t.integer :user_id

      t.timestamps

    end

    add_index :profiles, [:first_name, :last_name]
    add_index :profiles, :last_name
    #add more later on

  end

  def self.down
    drop_table :profiles
  end
end

