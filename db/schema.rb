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


ActiveRecord::Schema.define(:version => 20110517110406) do


  create_table "contacts", :force => true do |t|
    t.integer  "status"
    t.integer  "user_id"
    t.integer  "friend_id"
    t.integer  "loop_id"
    t.decimal  "strength",   :precision => 5, :scale => 2, :default => 100.0
    t.string   "relation",                                 :default => "Friend"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "loops", :force => true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", :force => true do |t|
    t.integer  "author_id"
    t.integer  "activity_id"
    t.string   "activity_name"
    t.text     "post_text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

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

end
