class DeviseCreateUsers < ActiveRecord::Migration
  def self.up
    create_table(:users) do |t|
      t.database_authenticatable :null => false
      t.recoverable
      t.rememberable
      t.trackable

      # t.encryptable
      # t.confirmable
      t.lockable :lock_strategy => :failed_attempts, :unlock_strategy => :both
      t.token_authenticatable

      t.string :username
      t.boolean :show_help
      t.boolean :disable_email
      t.string :email
      t.string :full_name
      t.string :photo_small_url
      t.string :country_code
      t.date :dob
      t.string :gender
      t.string :current_location
      t.decimal :current_geo_lat
      t.decimal :current_geo_long
      t.integer :user_type, :default => AppConstants.user_type_regular

      t.timestamps
    end

    add_index :users, :email,                :unique => true
    add_index :users, :username,                :unique => true
    add_index :users, :reset_password_token, :unique => true
    # add_index :users, :confirmation_token,   :unique => true
    add_index :users, :unlock_token,         :unique => true
    add_index :users, :authentication_token, :unique => true
    add_index :users, :full_name
    add_index :users, :user_type

  end

  def self.down
    drop_table :users
  end
end
