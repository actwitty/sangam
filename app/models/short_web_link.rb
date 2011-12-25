class ShortWebLink < ActiveRecord::Base
  belongs_to :web_link

  validates_presence_of :web_link_id, :url_sha1, :url
  validates_uniqueness_of :url_sha1

end

# == Schema Information
#
# Table name: short_web_links
#
#  id          :integer         not null, primary key
#  web_link_id :integer         not null
#  url         :text            not null
#  url_sha1    :text            not null
#  created_at  :datetime
#  updated_at  :datetime
#

