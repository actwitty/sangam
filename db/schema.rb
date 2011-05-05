# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110505045026) do

  create_table "activities", :force => true do |t|
    t.string   "activity_name"
    t.string   "activity_description"
    t.string   "activity_category"
    t.integer  "activity_abuse"
    t.string   "activity_quick_code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["activity_name"], :name => "index_activities_on_activity_name"

  create_table "comments", :force => true do |t|
    t.string   "comment_text"
    t.string   "attachment_url"
    t.string   "attachment_url_s"
    t.string   "attachment_name"
    t.string   "attachment_type"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "author_id"
  end

  add_index "comments", ["author_id"], :name => "index_comments_on_author_id"
  add_index "comments", ["created_at"], :name => "index_comments_on_created_at"
  add_index "comments", ["post_id"], :name => "index_comments_on_post_id"

  create_table "contacts", :force => true do |t|
    t.string   "status"
    t.boolean  "pending"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "friend_id"
  end

  add_index "contacts", ["user_id", "friend_id"], :name => "index_contacts_on_user_id_and_friend_id", :unique => true

  create_table "entities", :force => true do |t|
    t.string   "entity_name"
    t.string   "entity_type"
    t.string   "entity_url"
    t.decimal  "entity_location_lat",               :precision => 10, :scale => 0
    t.decimal  "entity_location_long",              :precision => 10, :scale => 0
    t.decimal  "entity_most_popular_location_lat",  :precision => 10, :scale => 0
    t.decimal  "entity_most_popular_location_long", :precision => 10, :scale => 0
    t.string   "entity_photo_l"
    t.string   "entity_photo_m"
    t.string   "entity_photo_s"
    t.string   "entity_desc"
    t.string   "entity_category"
    t.integer  "entity_vote_ups"
    t.integer  "entity_vote_downs"
    t.integer  "entity_deal_id"
    t.boolean  "entity_is_business_active"
    t.string   "entity_announcements"
    t.string   "entity_page_theme"
    t.boolean  "entity_active"
    t.integer  "entity_abuse"
    t.boolean  "entity_adult_check"
    t.string   "entity_creator_name"
    t.integer  "entity_creator_id"
    t.string   "entity_most_popular_name"
    t.integer  "entity_most_popular_name_id"
    t.string   "entity_closest_activity"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entities", ["entity_name"], :name => "index_entities_on_entity_name"
  add_index "entities", ["entity_type"], :name => "index_entities_on_entity_type"

  create_table "hubs", :force => true do |t|
    t.integer  "click_count"
    t.integer  "user_id"
    t.integer  "post_id"
    t.integer  "activity_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "entity_id"
  end

  add_index "hubs", ["activity_id"], :name => "index_hubs_on_activity_id"
  add_index "hubs", ["created_at"], :name => "index_hubs_on_created_at"
  add_index "hubs", ["entity_id", "post_id"], :name => "index_hubs_on_entity_id_and_post_id", :unique => true
  add_index "hubs", ["entity_id"], :name => "index_hubs_on_entity_id"
  add_index "hubs", ["post_id"], :name => "index_hubs_on_post_id"
  add_index "hubs", ["user_id"], :name => "index_hubs_on_user_id"

  create_table "likes", :force => true do |t|
    t.string   "like_positive"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "author_id"
  end

  add_index "likes", ["author_id"], :name => "index_likes_on_author_id"
  add_index "likes", ["created_at"], :name => "index_likes_on_created_at"
  add_index "likes", ["post_id"], :name => "index_likes_on_post_id"

  create_table "loop_memberships", :force => true do |t|
    t.integer  "loop_id"
    t.integer  "contact_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "loop_views", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "activity_id"
    t.integer  "loop_id"
    t.integer  "entity_id"
    t.integer  "post_id"
  end

  create_table "loops", :force => true do |t|
    t.string   "name"
    t.boolean  "public"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  add_index "loops", ["name"], :name => "index_loops_on_name"
  add_index "loops", ["user_id"], :name => "index_loops_on_user_id"

  create_table "post_visibilities", :force => true do |t|
    t.boolean  "hidden"
    t.integer  "post_id"
    t.integer  "contact_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "post_visibilities", ["post_id"], :name => "index_post_visibilities_on_post_id"

  create_table "posts", :force => true do |t|
    t.string   "activity_text"
    t.integer  "post_user_id"
    t.integer  "post_activity_id"
    t.text     "message_text"
    t.text     "optional_comment"
    t.boolean  "public"
    t.integer  "abuse_count"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "document_url"
    t.string   "document_type"
    t.string   "document_name"
    t.string   "document_image_url_s"
    t.string   "post_type"
    t.string   "post_source"
  end

  add_index "posts", ["created_at"], :name => "index_posts_on_created_at"

  create_table "profiles", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "nick_name"
    t.string   "short_status"
    t.string   "profile_photo_l"
    t.string   "profile_photo_m"
    t.string   "profile_photo_s"
    t.string   "home_location"
    t.decimal  "home_geo_lat",     :precision => 10, :scale => 0
    t.decimal  "home_geo_long",    :precision => 10, :scale => 0
    t.string   "current_location"
    t.decimal  "current_geo_lat",  :precision => 10, :scale => 0
    t.decimal  "current_geo_long", :precision => 10, :scale => 0
    t.integer  "age"
    t.string   "sex"
    t.string   "theme"
    t.date     "dob"
    t.string   "address"
    t.string   "company_name"
    t.string   "phone_number"
    t.string   "mobile_number"
    t.string   "favorite_pal"
    t.string   "work_area"
    t.string   "interest"
    t.string   "home_page"
    t.string   "twitter_id"
    t.string   "facebook_id"
    t.string   "google_id"
    t.string   "open_id"
    t.string   "tag_string"
    t.string   "email"
    t.string   "searchable"
    t.boolean  "verified_account"
    t.boolean  "is_celebrity"
    t.integer  "abuse_count"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "profiles", ["user_id"], :name => "index_profiles_on_user_id"

  create_table "userboard_post_caches", :force => true do |t|
    t.integer  "post_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "userboard_post_caches", ["user_id"], :name => "index_userboard_post_caches_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "encrypted_password",   :limit => 128, :default => ""
    t.string   "reset_password_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.integer  "failed_attempts",                     :default => 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "authentication_token"
    t.string   "username"
    t.boolean  "show_help"
    t.boolean  "disable_email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "invitation_token",     :limit => 60
    t.datetime "invitation_sent_at"
    t.integer  "invitation_limit"
    t.integer  "invited_by_id"
    t.string   "invited_by_type"
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["confirmation_token"], :name => "index_users_on_confirmation_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token"
  add_index "users", ["invited_by_id"], :name => "index_users_on_invited_by_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true
  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

end
