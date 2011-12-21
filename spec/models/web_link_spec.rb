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
#  category        :text
#  name            :text
#  description     :text
#  image_url       :text
#  documents_count :integer         default(0)
#  created_at      :datetime
#  updated_at      :datetime
#

