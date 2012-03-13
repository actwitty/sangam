require 'spec_helper'

describe Tag do
  pending "add some examples to (or delete) #{__FILE__}"
end













# == Schema Information
#
# Table name: tags
#
#  id                :integer         not null, primary key
#  author_id         :integer         not null
#  activity_word_id  :integer         not null
#  summary_id        :integer
#  activity_id       :integer         not null
#  name              :text            not null
#  source_name       :text            not null
#  source_msg_id     :text
#  status_at_source  :integer
#  status            :integer         not null
#  source_created_at :datetime        default(1970-01-01 00:00:00 UTC)
#  created_at        :datetime        not null
#  updated_at        :datetime        not null
#

