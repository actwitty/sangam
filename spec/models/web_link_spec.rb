require 'spec_helper'

describe WebLink do
  pending "add some examples to (or delete) #{__FILE__}"
end






# == Schema Information
#
# Table name: web_links
#
#  id              :integer         not null, primary key
#  url             :text            not null
#  url_sha1        :text            not null
#  mime            :text            not null
#  provider        :text            not null
#  title           :text
#  description     :text
#  image_url       :text
#  image_width     :integer
#  image_height    :integer
#  documents_count :integer         default(0)
#  category_id     :text
#  category_type   :text
#  cache_age       :integer
#  created_at      :datetime
#  updated_at      :datetime
#

