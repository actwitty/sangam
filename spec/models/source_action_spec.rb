require 'spec_helper'

describe SourceAction do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: source_actions
#
#  id                :integer         not null, primary key
#  user_id           :integer
#  summary_id        :integer
#  activity_id       :integer
#  source_name       :text
#  source_msg_id     :text
#  meta              :text            default("--- {}\n\n")
#  name              :text
#  count             :integer
#  source_created_at :datetime        default(1970-01-01 00:00:00 UTC)
#  created_at        :datetime        not null
#  updated_at        :datetime        not null
#

