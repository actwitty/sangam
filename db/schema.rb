# encoding: UTF-8
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

ActiveRecord::Schema.define(:version => 20120507155331) do

  create_table "actgreens", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "location"
    t.string   "latitude"
    t.string   "longitude"
    t.string   "comment"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "activities", :force => true do |t|
    t.integer  "activity_word_id",                                      :null => false
    t.text     "activity_text"
    t.text     "activity_name",                                         :null => false
    t.integer  "author_id",                                             :null => false
    t.integer  "base_location_id"
    t.integer  "status",                                                :null => false
    t.integer  "summary_id"
    t.text     "source_object_id"
    t.integer  "status_at_source"
    t.text     "source_name",                                           :null => false
    t.text     "source_uid"
    t.text     "source_object_type", :default => "post"
    t.text     "category_type"
    t.text     "category_id"
    t.datetime "source_created_at",  :default => '1970-01-01 00:00:00'
    t.boolean  "if_json",            :default => false
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
  end

  add_index "activities", ["activity_name"], :name => "index_activities_on_activity_name"
  add_index "activities", ["activity_word_id"], :name => "index_activities_on_activity_word_id"
  add_index "activities", ["author_id"], :name => "index_activities_on_author_id"
  add_index "activities", ["base_location_id"], :name => "index_activities_on_base_location_id"
  add_index "activities", ["category_type"], :name => "index_activities_on_category_type"
  add_index "activities", ["source_created_at"], :name => "index_activities_on_source_created_at"
  add_index "activities", ["source_name"], :name => "index_activities_on_source_name"
  add_index "activities", ["source_object_id", "source_name", "author_id"], :name => "index_activities_msg_id_source_author", :unique => true
  add_index "activities", ["source_object_id"], :name => "index_activities_on_source_object_id"
  add_index "activities", ["source_object_type"], :name => "index_activities_on_source_object_type"
  add_index "activities", ["status"], :name => "index_activities_on_status"
  add_index "activities", ["status_at_source"], :name => "index_activities_on_status_at_source"
  add_index "activities", ["summary_id"], :name => "index_activities_on_summary_id"
  add_index "activities", ["updated_at"], :name => "index_activities_on_updated_at"

  create_table "activity_words", :force => true do |t|
    t.text     "word_name",  :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "activity_words", ["updated_at"], :name => "index_activity_words_on_updated_at"
  add_index "activity_words", ["word_name"], :name => "index_activity_words_on_word_name", :unique => true

  create_table "authentications", :force => true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.string   "salt"
    t.string   "token"
    t.string   "secret"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "authentications", ["provider", "uid"], :name => "index_authentications_on_provider_and_uid"
  add_index "authentications", ["user_id", "provider", "uid"], :name => "index_authentications_on_user_id_and_provider_and_uid"

  create_table "contacts", :force => true do |t|
    t.integer  "status"
    t.integer  "user_id"
    t.integer  "friend_id"
    t.integer  "loop_id"
    t.decimal  "strength",   :precision => 5, :scale => 2, :default => 100.0
    t.string   "relation",                                 :default => "Friend"
    t.datetime "created_at",                                                     :null => false
    t.datetime "updated_at",                                                     :null => false
  end

  add_index "contacts", ["friend_id"], :name => "index_contacts_on_friend_id"
  add_index "contacts", ["status"], :name => "index_contacts_on_status"
  add_index "contacts", ["user_id"], :name => "index_contacts_on_user_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",          :default => 0
    t.integer  "attempts",          :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
    t.string   "worker_class_name"
    t.datetime "started_at"
    t.datetime "finished_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "documents", :force => true do |t|
    t.integer  "owner_id",                                             :null => false
    t.integer  "activity_id"
    t.integer  "activity_word_id"
    t.integer  "summary_id"
    t.text     "url"
    t.integer  "status",                                               :null => false
    t.text     "source_name",                                          :null => false
    t.text     "source_object_id"
    t.text     "source_msg_id"
    t.integer  "status_at_source"
    t.boolean  "uploaded",                                             :null => false
    t.text     "category",                                             :null => false
    t.integer  "web_link_id"
    t.datetime "source_created_at", :default => '1970-01-01 00:00:00'
    t.text     "category_id"
    t.datetime "created_at",                                           :null => false
    t.datetime "updated_at",                                           :null => false
  end

  add_index "documents", ["activity_id"], :name => "index_documents_on_activity_id"
  add_index "documents", ["activity_word_id"], :name => "index_documents_on_activity_word_id"
  add_index "documents", ["category"], :name => "index_documents_on_category"
  add_index "documents", ["category_id"], :name => "index_documents_on_category_id"
  add_index "documents", ["owner_id"], :name => "index_documents_on_owner_id"
  add_index "documents", ["source_created_at"], :name => "index_documents_on_source_created_at"
  add_index "documents", ["source_name"], :name => "index_documents_on_source_name"
  add_index "documents", ["status"], :name => "index_documents_on_status"
  add_index "documents", ["summary_id"], :name => "index_documents_on_summary_id"
  add_index "documents", ["updated_at"], :name => "index_documents_on_updated_at"
  add_index "documents", ["web_link_id"], :name => "index_documents_on_web_link_id"

  create_table "entities", :force => true do |t|
    t.text     "entity_name",      :null => false
    t.text     "entity_guid",      :null => false
    t.text     "entity_type_id"
    t.text     "entity_type_name"
    t.text     "entity_svc"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  add_index "entities", ["entity_guid"], :name => "index_entities_on_entity_guid", :unique => true
  add_index "entities", ["entity_name"], :name => "index_entities_on_entity_name"
  add_index "entities", ["updated_at"], :name => "index_entities_on_updated_at"

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
    t.string   "dob"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
  end

  create_table "hubs", :force => true do |t|
    t.integer  "activity_id",                                          :null => false
    t.integer  "activity_word_id",                                     :null => false
    t.integer  "entity_id"
    t.integer  "user_id",                                              :null => false
    t.integer  "location_id"
    t.integer  "summary_id",                                           :null => false
    t.text     "source_name",                                          :null => false
    t.integer  "status",                                               :null => false
    t.text     "source_msg_id"
    t.integer  "status_at_source"
    t.text     "category_type"
    t.datetime "source_created_at", :default => '1970-01-01 00:00:00'
    t.datetime "created_at",                                           :null => false
    t.datetime "updated_at",                                           :null => false
  end

  add_index "hubs", ["activity_id"], :name => "index_hubs_on_activity_id"
  add_index "hubs", ["activity_word_id"], :name => "index_hubs_on_activity_word_id"
  add_index "hubs", ["category_type"], :name => "index_hubs_on_category_type"
  add_index "hubs", ["entity_id"], :name => "index_hubs_on_entity_id"
  add_index "hubs", ["location_id"], :name => "index_hubs_on_location_id"
  add_index "hubs", ["source_created_at"], :name => "index_hubs_on_source_created_at"
  add_index "hubs", ["source_msg_id"], :name => "index_hubs_on_source_msg_id"
  add_index "hubs", ["source_name"], :name => "index_hubs_on_source_name"
  add_index "hubs", ["status_at_source"], :name => "index_hubs_on_status_at_source"
  add_index "hubs", ["summary_id"], :name => "index_hubs_on_summary_id"
  add_index "hubs", ["updated_at"], :name => "index_hubs_on_updated_at"
  add_index "hubs", ["user_id"], :name => "index_hubs_on_user_id"

  create_table "invites", :force => true do |t|
    t.string   "identifier"
    t.string   "service"
    t.boolean  "accepted"
    t.boolean  "registered"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "local_actions", :force => true do |t|
    t.integer  "author_id"
    t.integer  "summary_id"
    t.text     "meta",       :default => "--- {}\n"
    t.text     "name"
    t.datetime "created_at",                         :null => false
    t.datetime "updated_at",                         :null => false
  end

  add_index "local_actions", ["author_id"], :name => "index_local_actions_on_author_id"
  add_index "local_actions", ["name", "summary_id", "author_id"], :name => "index_local_actions_on_name_and_summary_id_and_author_id", :unique => true
  add_index "local_actions", ["summary_id"], :name => "index_local_actions_on_summary_id"

  create_table "locations", :force => true do |t|
    t.text     "location_name",                                    :null => false
    t.decimal  "location_lat",     :precision => 18, :scale => 15
    t.decimal  "location_long",    :precision => 18, :scale => 15
    t.text     "location_city"
    t.text     "location_country"
    t.text     "location_region"
    t.text     "source_name"
    t.text     "source_object_id"
    t.datetime "created_at",                                       :null => false
    t.datetime "updated_at",                                       :null => false
  end

  add_index "locations", ["location_city"], :name => "index_locations_on_location_city"
  add_index "locations", ["location_country"], :name => "index_locations_on_location_country"
  add_index "locations", ["location_lat", "location_long", "source_name"], :name => "index_location_on_lat_long_source", :unique => true
  add_index "locations", ["location_long"], :name => "index_locations_on_location_long"
  add_index "locations", ["location_name"], :name => "index_locations_on_location_name"
  add_index "locations", ["location_region"], :name => "index_locations_on_location_region"
  add_index "locations", ["source_name"], :name => "index_locations_on_source_name"
  add_index "locations", ["updated_at"], :name => "index_locations_on_updated_at"

  create_table "mentions", :force => true do |t|
    t.integer  "author_id"
    t.integer  "summary_id"
    t.integer  "activity_id"
    t.text     "source_uid"
    t.text     "name"
    t.text     "source_name"
    t.text     "source_msg_id"
    t.integer  "status_at_source"
    t.integer  "status"
    t.datetime "source_created_at", :default => '1970-01-01 00:00:00'
    t.datetime "created_at",                                           :null => false
    t.datetime "updated_at",                                           :null => false
  end

  add_index "mentions", ["activity_id"], :name => "index_mentions_on_activity_id"
  add_index "mentions", ["author_id"], :name => "index_mentions_on_author_id"
  add_index "mentions", ["source_created_at"], :name => "index_mentions_on_source_created_at"
  add_index "mentions", ["summary_id"], :name => "index_mentions_on_summary_id"
  add_index "mentions", ["updated_at"], :name => "index_mentions_on_updated_at"

  create_table "profiles", :force => true do |t|
    t.boolean  "facebook_service_enabled"
    t.boolean  "twitter_service_enabled"
    t.boolean  "linked_in_service_enabled"
    t.boolean  "facebook_update_share"
    t.boolean  "twitter_update_share"
    t.integer  "user_id"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  create_table "short_web_links", :force => true do |t|
    t.integer  "web_link_id", :null => false
    t.text     "url",         :null => false
    t.text     "url_sha1",    :null => false
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "short_web_links", ["url_sha1"], :name => "index_short_web_links_on_url_sha1", :unique => true
  add_index "short_web_links", ["web_link_id"], :name => "index_short_web_links_on_web_link_id"

  create_table "social_aggregators", :force => true do |t|
    t.integer  "user_id",                                                    :null => false
    t.text     "provider",                                                   :null => false
    t.text     "uid",                                                        :null => false
    t.datetime "latest_msg_timestamp",    :default => '1970-01-01 00:00:00'
    t.text     "latest_msg_id",           :default => ""
    t.integer  "status",                  :default => 1
    t.datetime "next_update_timestamp",   :default => '1970-01-01 00:00:00'
    t.integer  "update_interval",         :default => 64800
    t.integer  "every_time_feed_storage", :default => 10
    t.integer  "first_time_feed_storage", :default => 10
    t.datetime "created_at",                                                 :null => false
    t.datetime "updated_at",                                                 :null => false
  end

  add_index "social_aggregators", ["next_update_timestamp"], :name => "index_social_aggregators_on_next_update_timestamp"
  add_index "social_aggregators", ["provider"], :name => "index_social_aggregators_on_provider"
  add_index "social_aggregators", ["status"], :name => "index_social_aggregators_on_status"
  add_index "social_aggregators", ["uid"], :name => "index_social_aggregators_on_uid"
  add_index "social_aggregators", ["update_interval"], :name => "index_social_aggregators_on_update_interval"
  add_index "social_aggregators", ["user_id", "provider", "uid"], :name => "index_social_aggregators_on_user_provider_uid", :unique => true

  create_table "source_actions", :force => true do |t|
    t.integer  "user_id"
    t.integer  "summary_id"
    t.integer  "activity_id"
    t.text     "source_name"
    t.text     "source_msg_id"
    t.text     "meta",              :default => "--- {}\n"
    t.text     "name"
    t.integer  "count"
    t.datetime "source_created_at", :default => '1970-01-01 00:00:00'
    t.datetime "created_at",                                           :null => false
    t.datetime "updated_at",                                           :null => false
  end

  add_index "source_actions", ["activity_id", "name"], :name => "index_source_actions_on_activity_id_and_name", :unique => true
  add_index "source_actions", ["count"], :name => "index_source_actions_on_count"
  add_index "source_actions", ["name"], :name => "index_source_actions_on_name"
  add_index "source_actions", ["source_created_at"], :name => "index_source_actions_on_source_created_at"
  add_index "source_actions", ["source_msg_id"], :name => "index_source_actions_on_source_msg_id"
  add_index "source_actions", ["source_name"], :name => "index_source_actions_on_source_name"
  add_index "source_actions", ["summary_id"], :name => "index_source_actions_on_summary_id"
  add_index "source_actions", ["user_id"], :name => "index_source_actions_on_user_id"

  create_table "summaries", :force => true do |t|
    t.integer  "user_id",                                               :null => false
    t.integer  "activity_word_id",                                      :null => false
    t.text     "activity_name",                                         :null => false
    t.integer  "activities_count",   :default => 0
    t.text     "category_id"
    t.text     "category_type"
    t.text     "analytics_snapshot"
    t.text     "enabled_services"
    t.datetime "source_created_at",  :default => '1970-01-01 00:00:00'
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
  end

  add_index "summaries", ["activity_name"], :name => "index_summaries_on_activity_name"
  add_index "summaries", ["activity_word_id"], :name => "index_summaries_on_activity_word_id"
  add_index "summaries", ["category_id"], :name => "index_summaries_on_category_id"
  add_index "summaries", ["category_type"], :name => "index_summaries_on_category_type"
  add_index "summaries", ["source_created_at"], :name => "index_summaries_on_source_created_at"
  add_index "summaries", ["updated_at"], :name => "index_summaries_on_updated_at"
  add_index "summaries", ["user_id", "activity_word_id"], :name => "index_summaries_on_user_id_and_activity_word_id", :unique => true

  create_table "summary_ranks", :force => true do |t|
    t.integer  "summary_id"
    t.integer  "user_id",       :null => false
    t.text     "activity_name"
    t.text     "category_id"
    t.text     "analytics"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "summary_ranks", ["summary_id"], :name => "index_summary_ranks_on_summary_id", :unique => true
  add_index "summary_ranks", ["user_id"], :name => "index_summary_ranks_on_user_id"

  create_table "tags", :force => true do |t|
    t.integer  "author_id",                                            :null => false
    t.integer  "activity_word_id",                                     :null => false
    t.integer  "summary_id"
    t.integer  "activity_id",                                          :null => false
    t.text     "name",                                                 :null => false
    t.text     "source_name",                                          :null => false
    t.text     "source_msg_id"
    t.integer  "status_at_source"
    t.integer  "status",                                               :null => false
    t.datetime "source_created_at", :default => '1970-01-01 00:00:00'
    t.datetime "created_at",                                           :null => false
    t.datetime "updated_at",                                           :null => false
  end

  add_index "tags", ["activity_id"], :name => "index_tags_on_activity_id"
  add_index "tags", ["activity_word_id"], :name => "index_tags_on_activity_word_id"
  add_index "tags", ["author_id"], :name => "index_tags_on_author_id"
  add_index "tags", ["source_created_at"], :name => "index_tags_on_source_created_at"
  add_index "tags", ["summary_id"], :name => "index_tags_on_summary_id"
  add_index "tags", ["updated_at"], :name => "index_tags_on_updated_at"

  create_table "user_meta_infos", :force => true do |t|
    t.integer  "user_id"
    t.text     "category",   :default => "stories"
    t.integer  "user_type",  :default => 0
    t.datetime "created_at",                        :null => false
    t.datetime "updated_at",                        :null => false
  end

  add_index "user_meta_infos", ["category"], :name => "index_user_meta_infos_on_category"
  add_index "user_meta_infos", ["user_id"], :name => "index_user_meta_infos_on_user_id"
  add_index "user_meta_infos", ["user_type"], :name => "index_user_meta_infos_on_user_type"

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
    t.integer  "failed_attempts",                     :default => 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "authentication_token"
    t.string   "username"
    t.boolean  "show_help"
    t.boolean  "disable_email"
    t.string   "full_name"
    t.string   "photo_small_url"
    t.string   "country_code"
    t.date     "dob"
    t.string   "gender"
    t.string   "current_location"
    t.decimal  "current_geo_lat"
    t.decimal  "current_geo_long"
    t.integer  "user_type",                           :default => 0
    t.datetime "created_at",                                          :null => false
    t.datetime "updated_at",                                          :null => false
    t.string   "invitation_token",     :limit => 60
    t.datetime "invitation_sent_at"
    t.integer  "invitation_limit"
    t.integer  "invited_by_id"
    t.string   "invited_by_type"
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["full_name"], :name => "index_users_on_full_name"
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token"
  add_index "users", ["invited_by_id"], :name => "index_users_on_invited_by_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true
  add_index "users", ["user_type"], :name => "index_users_on_user_type"
  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

  create_table "web_links", :force => true do |t|
    t.text     "url",                            :null => false
    t.text     "url_sha1",                       :null => false
    t.text     "mime",                           :null => false
    t.text     "provider",                       :null => false
    t.text     "title"
    t.text     "description"
    t.text     "image_url"
    t.integer  "image_width"
    t.integer  "image_height"
    t.integer  "documents_count", :default => 0
    t.text     "category_id"
    t.text     "category_type"
    t.integer  "cache_age"
    t.text     "element"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

  add_index "web_links", ["cache_age"], :name => "index_web_links_on_cache_age"
  add_index "web_links", ["category_type"], :name => "index_web_links_on_category_type"
  add_index "web_links", ["mime"], :name => "index_web_links_on_mime"
  add_index "web_links", ["provider"], :name => "index_web_links_on_provider"
  add_index "web_links", ["url_sha1"], :name => "index_web_links_on_url_sha1", :unique => true

end
