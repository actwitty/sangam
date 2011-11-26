require 'spec_helper'

describe SocialAggregator do
  pending "add some examples to (or delete) #{__FILE__}"
end



# == Schema Information
#
# Table name: social_aggregators
#
#  id                  :integer         not null, primary key
#  user_id             :integer         not null
#  activity_id         :integer         not null
#  summary_id          :integer         not null
#  provider_created_at :datetime        not null
#  source_name         :string(255)     not null
#  source_msg_id       :string(255)     not null
#  created_at          :datetime
#  updated_at          :datetime
#

