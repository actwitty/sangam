require 'spec_helper'

describe SummarySubscribe do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: summary_subscribes
#
#  id            :integer         not null, primary key
#  summary_id    :integer         not null
#  subscriber_id :integer         not null
#  owner_id      :integer         not null
#  summary_name  :text            not null
#  created_at    :datetime
#  updated_at    :datetime
#

