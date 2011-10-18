require 'spec_helper'

describe Summary do
  pending "add some examples to (or delete) #{__FILE__}"
end






# == Schema Information
#
# Table name: summaries
#
#  id                    :integer         not null, primary key
#  user_id               :integer         not null
#  activity_word_id      :integer         not null
#  activity_name         :string(255)     not null
#  activities_count      :integer         default(0)
#  documents_count       :integer         default(0)
#  tags_count            :integer         default(0)
#  location_array        :text
#  entity_array          :text
#  activity_array        :text
#  document_array        :text
#  tag_array             :text
#  social_counters_array :text
#  theme_data            :text
#  created_at            :datetime
#  updated_at            :datetime
#

