#!/bin/bash
rails generate rspec:install

rails generate controller Users
rails generate model User username:string show_help:boolean disable_email:boolean email:string 

rails generate controller Profiles
rails generate model Profile first_name:string last_name:string nick_name:string short_status:string profile_photo_l:string profile_photo_m:string profile_photo_s:string home_location:string home_geo_lat:decimal home_geo_long:decimal current_location:string current_geo_lat:decimal current_geo_long:decimal age:integer sex:string theme:string dob:date address:string company_name:string phone_number:string mobile_number:string favorite_pal:string work_area:string interest:string home_page:string twitter_id:string facebook_id:string google_id:string open_id:string tag_string:string email:string searchable:string verified_account:boolean is_celebrity:boolean abuse_count:integer theme:string user_id:integer

rails generate controller Entities
rails generate model Entity entity_name:string entity_type:string entity_url:string entity_location_lat:decimal entity_location_long:decimal entity_most_popular_location_lat:decimal entity_most_popular_location_long:decimal entity_photo_l:string entity_photo_m:string entity_photo_s:string entity_desc:string entity_category:string entity_vote_ups:integer entity_vote_downs:integer entity_deal_id:integer entity_is_business_active:boolean entity_announcements:string entity_page_theme:string entity_active:boolean entity_abuse:integer entity_adult_check:boolean entity_creator_name:string entity_creator_id:integer entity_most_popular_name:string entity_most_popular_name_id:integer entity_most_popular_name_id:integer entity_most_popular_name_id:integer entity_most_popular_name_id:integer entity_closest_activity:string

rails generate controller Activities
rails generate model Activity activity_name:string activity_description:string activity_category:string activity_abuse:integer activity_quick_code:string

rails generate controller Contacts
rails generate model Contact status:string pending:boolean user_id:integer 

rails generate controller Loop_views
rails generate model Loop_view activity_id:integer loop_id:integer entity_id:integer post_id:integer

rails generate controller Loop_memberships
rails generate model Loop_membership loop_id:integer contact_id:integer

rails generate controller Loops
rails generate model Loop name:string public:boolean 

rails generate controller Posts
rails generate model Post activity_text:string post_user_id:integer post_activity_id:integer message_text:text optional_comment:text attachment_url:string attachment_url_s:string attachment_name:string attachment_type:string public:boolean abuse_count:integer

rails generate controller Post_visibilities
rails generate model Post_visibility hidden:boolean post_id:integer contact_id:integer

rails generate controller Comments
rails generate model Comment comment_text:string attachment_url:string attachment_url_s:string attachment_name:string attachment_type:string post_id:integer

rails generate controller Likes
rails generate model Like like_positive:string post_id:integer user_author_id:integer

rails generate controller Hubs
rails generate model Hub click_count:integer user_id:integer post_id:integer activity_id:integer



