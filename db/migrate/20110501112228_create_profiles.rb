class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      t.string :first_name
      t.string :last_name
      t.string :nick_name
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
      t.string :sex
      t.string :theme
      t.date :dob
      t.string :address
      t.string :company_name
      t.string :phone_number
      t.string :mobile_number
      t.string :favorite_pal
      t.string :work_area
      t.string :interest
      t.string :home_page
      t.string :twitter_id
      t.string :facebook_id
      t.string :google_id
      t.string :open_id
      t.string :tag_string
      t.string :email
      t.string :searchable
      t.boolean :verified_account
      t.boolean :is_celebrity
      t.integer :abuse_count
      t.string :theme
      t.integer :user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :profiles
  end
end
