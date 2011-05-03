class CreateEntities < ActiveRecord::Migration
  def self.up
    create_table :entities do |t|
      t.string :entity_name
      t.string :entity_type
      t.string :entity_url
      t.decimal :entity_location_lat
      t.decimal :entity_location_long
      t.decimal :entity_most_popular_location_lat
      t.decimal :entity_most_popular_location_long
      t.string :entity_photo_l
      t.string :entity_photo_m
      t.string :entity_photo_s
      t.string :entity_desc
      t.string :entity_category
      t.integer :entity_vote_ups
      t.integer :entity_vote_downs
      t.integer :entity_deal_id
      t.boolean :entity_is_business_active
      t.string :entity_announcements
      t.string :entity_page_theme
      t.boolean :entity_active
      t.integer :entity_abuse
      t.boolean :entity_adult_check
      t.string :entity_creator_name
      t.integer :entity_creator_id
      t.string :entity_most_popular_name
      t.integer :entity_most_popular_name_id
      t.integer :entity_most_popular_name_id
      t.integer :entity_most_popular_name_id
      t.integer :entity_most_popular_name_id
      t.string :entity_closest_activity

      t.timestamps
    end
  end

  def self.down
    drop_table :entities
  end
end
