class CreateAuthentications < ActiveRecord::Migration
  def self.up
    create_table :authentications do |t|
      t.integer :user_id
      t.string :provider
      t.string :uid
      t.string :salt
      t.string :token
      t.string :secret

      t.timestamps
    end
    add_index :authentications, [:user_id, :provider, :uid]
    add_index :authentications, [:provider, :uid]
  end

  def self.down
    drop_table :authentications
  end
end
