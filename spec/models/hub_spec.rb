require 'spec_helper'

describe Hub do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: hubs
#
#  id               :integer         not null, primary key
#  activity_id      :integer         not null
#  activity_name    :string(255)     not null
#  activity_word_id :integer         not null
#  entity_id        :integer
#  user_id          :integer         not null
#  location_id      :integer
#  created_at       :datetime
#  updated_at       :datetime
#

