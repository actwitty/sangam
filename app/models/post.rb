# == Schema Information
# Schema version: 20110502102330
#
# Table name: posts
#
#  id                   :integer(4)      not null, primary key
#  activity_text        :string(255)
#  post_user_id         :integer(4)
#  post_activity_id     :integer(4)
#  message_text         :text
#  optional_comment     :text
#  public               :boolean(1)
#  abuse_count          :integer(4)
#  created_at           :datetime
#  updated_at           :datetime
#  document_url         :string(255)
#  document_type        :string(255)
#  document_name        :string(255)
#  document_image_url_s :string(255)
#  post_type            :string(255)
#  post_source          :string(255)
#

class Post < ActiveRecord::Base
  
  has_many :hubs
  has_many :activities, :through => :hubs
  has_many :entities, :through => :hubs
  has_many :users, :through => :hubs

  has_many :loop_views
  has_many :loops, :through => :loop_views
  has_many :comments
  has_many :likes

  has_many :post_visibilities
  has_many :contacts, :through => :post_visibilities

end
