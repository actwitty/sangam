require 'spec_helper'

describe Mention do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: mentions
#
#  id                :integer         not null, primary key
#  author_id         :integer
#  summary_id        :integer
#  activity_id       :integer
#  source_uid        :text
#  name              :text
#  source_name       :text
#  source_msg_id     :text
#  status_at_source  :integer
#  status            :integer
#  source_created_at :datetime        default(1970-01-01 00:00:00 UTC)
#  created_at        :datetime        not null
#  updated_at        :datetime        not null
#

