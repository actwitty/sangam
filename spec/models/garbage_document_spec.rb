require 'spec_helper'

describe GarbageDocument do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: garbage_documents
#
#  id         :integer         not null, primary key
#  table_name :text            not null
#  url        :text            not null
#  thumb_url  :text
#  action     :integer         not null
#  created_at :datetime
#  updated_at :datetime
#

