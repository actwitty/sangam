require 'spec_helper'

describe SocialAggregator do
  pending "add some examples to (or delete) #{__FILE__}"
end









# == Schema Information
#
# Table name: social_aggregators
#
#  id                   :integer         not null, primary key
#  user_id              :integer         not null
#  provider             :text            not null
#  uid                  :text            not null
#  latest_msg_timestamp :datetime        default(1970-01-01 00:00:00 UTC)
#  status               :integer         default(1)
#  created_at           :datetime
#  updated_at           :datetime
#

