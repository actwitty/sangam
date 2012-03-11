require 'spec_helper'

describe SocialAggregator do
  pending "add some examples to (or delete) #{__FILE__}"
end












# == Schema Information
#
# Table name: social_aggregators
#
#  id                      :integer         not null, primary key
#  user_id                 :integer         not null
#  provider                :text            not null
#  uid                     :text            not null
#  latest_msg_timestamp    :datetime        default(1970-01-01 00:00:00 UTC)
#  latest_msg_id           :text            default("")
#  status                  :integer         default(1)
#  next_update_timestamp   :datetime        default(1970-01-01 00:00:00 UTC)
#  update_interval         :integer         default(60)
#  every_time_feed_storage :integer         default(5)
#  first_time_feed_storage :integer         default(5)
#  created_at              :datetime        not null
#  updated_at              :datetime        not null
#

