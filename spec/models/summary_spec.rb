require 'spec_helper'

describe Summary do
  pending "add some examples to (or delete) #{__FILE__}"
end


# == Schema Information
#
# Table name: summaries
#
#  id               :integer         not null, primary key
#  user_id          :integer         not null
#  activity_word_id :integer         not null
#  activity_name    :string(255)     not null
#  activities_count :integer
#  documents_count  :integer
#  created_at       :datetime
#  updated_at       :datetime
#

