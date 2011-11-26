require 'spec_helper'

describe SummaryCategory do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: summary_categories
#
#  id            :integer         not null, primary key
#  category_id   :string(255)     not null
#  category_type :string(255)     not null
#  activity_name :string(255)     not null
#  summary_id    :integer         not null
#  user_id       :integer         not null
#  created_at    :datetime
#  updated_at    :datetime
#

