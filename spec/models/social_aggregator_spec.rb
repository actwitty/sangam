require 'spec_helper'

describe SocialAggregator do
  pending "add some examples to (or delete) #{__FILE__}"
end





# == Schema Information
#
# Table name: social_aggregators
#
#  id                   :integer         not null, primary key
#  user_id              :integer
#  provider             :string(255)
#  uid                  :string(255)
#  latest_msg_timestamp :datetime        default(1978-12-15 09:10:00 UTC)
#  created_at           :datetime
#  updated_at           :datetime
#

