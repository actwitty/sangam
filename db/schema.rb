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

ActiveRecord::Schema.define(:version => 20110616040229) do

  create_table "activities", :force => true do |t|
    t.integer  "activity_word_id",                :null => false
    t.text     "activity_text",                   :null => false
    t.string   "activity_name",                   :null => false
    t.integer  "author_id",                       :null => false
    t.integer  "parent_id"
    t.string   "ancestry"
    t.integer  "ancestry_depth",   :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["activity_name", "author_id"], :name => "index_activities_on_activity_name_and_author_id"
  add_index "activities", ["activity_word_id", "author_id"], :name => "index_activities_on_activity_word_id_and_author_id"
  add_index "activities", ["ancestry"], :name => "index_activities_on_ancestry"
  add_index "activities", ["author_id", "activity_name", "activity_word_id"], :name => "index_activity_author_name_dict"
  add_index "activities", ["author_id"], :name => "index_activities_on_author_id"
  add_index "activities", ["parent_id"], :name => "index_activities_on_parent_id"

  create_table "activity_words", :force => true do |t|
    t.string   "word_name",  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activity_words", ["word_name"], :name => "index_activity_words_on_word_name", :unique => true

  create_table "authentications", :force => true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.string   "salt"
    t.string   "token"
    t.string   "secret"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "authentications", ["provider", "uid"], :name => "index_authentications_on_provider_and_uid"
  add_index "authentications", ["user_id", "provider", "uid"], :name => "index_authentications_on_user_id_and_provider_and_uid"

  create_table "campaigns", :force => true do |t|
    t.integer  "author_id",      :null => false
    t.integer  "activity_id"
    t.integer  "entity_id"
    t.integer  "location_id"
    t.integer  "father_id",      :null => false
    t.string   "campaign_name",  :null => false
    t.integer  "campaign_value", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "campaigns", ["activity_id", "campaign_name"], :name => "index_campaigns_on_activity_id_and_campaign_name"
  add_index "campaigns", ["author_id", "activity_id", "campaign_name"], :name => "index_campaign_on_author_activity_name", :unique => true
  add_index "campaigns", ["author_id", "activity_id", "campaign_name"], :name => "index_campaign_on_author_location_name", :unique => true
  add_index "campaigns", ["author_id", "campaign_name", "campaign_value"], :name => "index_campaign_on_author_name_value"
  add_index "campaigns", ["author_id", "entity_id", "campaign_name"], :name => "index_campaign_on_author_entity_name", :unique => true
  add_index "campaigns", ["campaign_name"], :name => "index_campaigns_on_campaign_name"
  add_index "campaigns", ["entity_id", "campaign_name"], :name => "index_campaigns_on_entity_id_and_campaign_name"
  add_index "campaigns", ["father_id"], :name => "index_campaigns_on_father_id", :unique => true
  add_index "campaigns", ["location_id", "campaign_name"], :name => "index_campaigns_on_location_id_and_campaign_name"

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

  add_index "contacts", ["friend_id", "status"], :name => "index_contacts_on_friend_id_and_status"
  add_index "contacts", ["status"], :name => "index_contacts_on_status"
  add_index "contacts", ["user_id", "friend_id", "status"], :name => "index_contacts_on_user_id_and_friend_id_and_status"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "documents", :force => true do |t|
    t.integer  "owner_id",      :null => false
    t.integer  "activity_id"
    t.string   "document_name", :null => false
    t.string   "document_type", :null => false
    t.string   "document_data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "documents", ["activity_id", "document_name", "document_type"], :name => "index_docs_on_activity_name_type"
  add_index "documents", ["document_name", "document_type"], :name => "index_docs_on_name_type"
  add_index "documents", ["document_type"], :name => "index_documents_on_document_type"
  add_index "documents", ["owner_id", "activity_id", "document_name", "document_type"], :name => "index_docs_on_owner_activity_name_type"

  create_table "entities", :force => true do |t|
    t.string   "entity_name", :null => false
    t.string   "entity_guid", :null => false
    t.text     "entity_doc",  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entities", ["entity_guid"], :name => "index_entities_on_entity_guid"
  add_index "entities", ["entity_name"], :name => "index_entities_on_entity_name"

  create_table "entity_documents", :force => true do |t|
    t.integer  "entity_id",              :null => false
    t.string   "entity_doc_name",        :null => false
    t.string   "entity_doc_mid",         :null => false
    t.text     "entity_doc_description"
    t.string   "entity_doc_photo_url"
    t.string   "entity_doc_wiki_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entity_documents", ["entity_doc_mid"], :name => "index_entity_documents_on_entity_doc_mid", :unique => true
  add_index "entity_documents", ["entity_doc_name"], :name => "index_entity_documents_on_entity_doc_name"
  add_index "entity_documents", ["entity_id"], :name => "index_entity_documents_on_entity_id", :unique => true

  create_table "entity_ownerships", :force => true do |t|
    t.integer  "owner_id"
    t.integer  "entity_id",  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entity_ownerships", ["entity_id", "owner_id"], :name => "index_entity_ownerships_on_entity_id_and_owner_id", :unique => true
  add_index "entity_ownerships", ["owner_id"], :name => "index_entity_ownerships_on_owner_id"

  create_table "entity_types", :force => true do |t|
    t.integer  "entity_id",        :null => false
    t.string   "entity_type_uri"
    t.string   "entity_type_name", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entity_types", ["entity_id", "entity_type_uri", "entity_type_name"], :name => "index_on_entity_type_entity_uri_name"
  add_index "entity_types", ["entity_type_name"], :name => "index_entity_types_on_entity_type_name"
  add_index "entity_types", ["entity_type_uri", "entity_type_name"], :name => "index_on_entity_type_uri_name"

  create_table "foreign_profiles", :force => true do |t|
    t.string   "name"
    t.string   "screen_name"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "image"
    t.string   "url"
    t.string   "gender"
    t.string   "email"
    t.string   "hometown"
    t.string   "location"
    t.float    "timezone"
    t.string   "locale"
    t.string   "foreign_updated_time"
    t.integer  "authentication_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "geo_locations", :force => true do |t|
    t.integer  "location_id"
    t.decimal  "geo_latitude",  :precision => 10, :scale => 7, :null => false
    t.decimal  "geo_longitude", :precision => 10, :scale => 7, :null => false
    t.text     "geo_name",                                     :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "geo_locations", ["geo_latitude", "geo_longitude"], :name => "index_geo_locations_on_geo_latitude_and_geo_longitude", :unique => true
  add_index "geo_locations", ["geo_longitude"], :name => "index_geo_locations_on_geo_longitude"
  add_index "geo_locations", ["geo_name"], :name => "index_geo_locations_on_geo_name"
  add_index "geo_locations", ["location_id"], :name => "index_geo_locations_on_location_id", :unique => true

  create_table "hubs", :force => true do |t|
    t.integer  "activity_id",      :null => false
    t.string   "activity_name",    :null => false
    t.integer  "activity_word_id", :null => false
    t.integer  "entity_id"
    t.string   "entity_name"
    t.integer  "user_id",          :null => false
    t.integer  "location_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hubs", ["activity_id"], :name => "index_hubs_on_activity_id"
  add_index "hubs", ["activity_name"], :name => "index_hubs_on_activity_name"
  add_index "hubs", ["activity_word_id", "entity_id"], :name => "index_hubs_on_activity_word_id_and_entity_id"
  add_index "hubs", ["activity_word_id", "user_id"], :name => "index_hubs_on_activity_word_id_and_user_id"
  add_index "hubs", ["entity_id", "activity_id"], :name => "index_hubs_on_entity_id_and_activity_id"
  add_index "hubs", ["entity_id", "user_id"], :name => "index_hubs_on_entity_id_and_user_id"
  add_index "hubs", ["entity_name"], :name => "index_hubs_on_entity_name"
  add_index "hubs", ["location_id", "user_id"], :name => "index_hubs_on_location_id_and_user_id"
  add_index "hubs", ["user_id", "activity_word_id", "entity_id"], :name => "index_hubs_on_user_activity_entity"

  create_table "location_hubs", :force => true do |t|
    t.integer  "web_join_id"
    t.integer  "geo_join_id"
    t.integer  "unresolved_join_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "location_hubs", ["geo_join_id", "unresolved_join_id"], :name => "index_location_hub_on_geo_unresolved"
  add_index "location_hubs", ["unresolved_join_id"], :name => "index_location_hubs_on_unresolved_join_id"
  add_index "location_hubs", ["web_join_id", "geo_join_id", "unresolved_join_id"], :name => "index_location_hub_on_web_geo_unresolved", :unique => true
  add_index "location_hubs", ["web_join_id", "unresolved_join_id"], :name => "index_location_hub_on_web_unresolved"

  create_table "locations", :force => true do |t|
    t.integer  "location_type", :null => false
    t.text     "location_name", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "locations", ["location_name"], :name => "index_locations_on_location_name"
  add_index "locations", ["location_type", "location_name"], :name => "index_locations_on_location_type_and_location_name"

  create_table "loops", :force => true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mentions", :force => true do |t|
    t.integer  "activity_id", :null => false
    t.integer  "user_id",     :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "mentions", ["activity_id"], :name => "index_mentions_on_activity_id"
  add_index "mentions", ["user_id", "activity_id"], :name => "index_mentions_on_user_id_and_activity_id", :unique => true

  create_table "profiles", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "short_status"
    t.string   "profile_photo_l"
    t.string   "profile_photo_m"
    t.string   "profile_photo_s"
    t.string   "home_location"
    t.decimal  "home_geo_lat"
    t.decimal  "home_geo_long"
    t.string   "current_location"
    t.decimal  "current_geo_lat"
    t.decimal  "current_geo_long"
    t.integer  "age"
    t.string   "sex"
    t.string   "theme"
    t.date     "dob"
    t.string   "address"
    t.string   "company_name"
    t.string   "phone_number"
    t.string   "mobile_number"
    t.string   "work_area"
    t.string   "interest"
    t.string   "home_page"
    t.string   "tag_string"
    t.string   "email"
    t.string   "searchable"
    t.boolean  "verified_account"
    t.boolean  "is_celebrity"
    t.integer  "abuse_count"
    t.boolean  "is_terms_accepted"
    t.boolean  "is_privacy_accepted"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "profiles", ["first_name", "last_name"], :name => "index_profiles_on_first_name_and_last_name"
  add_index "profiles", ["last_name"], :name => "index_profiles_on_last_name"

  create_table "unresolved_locations", :force => true do |t|
    t.integer  "location_id",              :null => false
    t.string   "unresolved_location_name", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "unresolved_locations", ["location_id"], :name => "index_unresolved_locations_on_location_id", :unique => true
  add_index "unresolved_locations", ["unresolved_location_name"], :name => "index_unresolved_locations_on_unresolved_location_name"

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
    t.string   "full_name"
    t.string   "photo_small_url"
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
  add_index "users", ["full_name"], :name => "index_users_on_full_name"
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token"
  add_index "users", ["invited_by_id"], :name => "index_users_on_invited_by_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true

  create_table "web_locations", :force => true do |t|
    t.integer  "location_id",        :null => false
    t.string   "web_location_url",   :null => false
    t.string   "web_location_title", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "web_locations", ["location_id"], :name => "index_web_locations_on_location_id", :unique => true
  add_index "web_locations", ["web_location_title"], :name => "index_web_locations_on_web_location_title"
  add_index "web_locations", ["web_location_url"], :name => "index_web_locations_on_web_location_url", :unique => true

  create_table "word_forms", :force => true do |t|
    t.integer  "activity_word_id", :null => false
    t.integer  "related_word_id",  :null => false
    t.string   "relation_type",    :null => false
    t.string   "word_form_name",   :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "word_forms", ["activity_word_id"], :name => "index_word_forms_on_activity_word_id"
  add_index "word_forms", ["related_word_id", "relation_type", "word_form_name"], :name => "index_on_word_forms_relation_type_name", :unique => true
  add_index "word_forms", ["relation_type", "word_form_name"], :name => "index_on_word_forms_type_name"
  add_index "word_forms", ["word_form_name"], :name => "index_word_forms_on_word_form_name"

end
